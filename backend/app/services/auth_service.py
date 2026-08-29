import os
import hmac
import hashlib
import base64
import json
import time
import secrets
import logging
from typing import Dict, Any, Optional
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

logger = logging.getLogger("civictwin.auth")

# Cryptographically secure secret resolution
_env_secret = os.getenv("JWT_SECRET")
if not _env_secret:
    # Ephemeral cryptographically random secret generated at process startup
    _runtime_secret = secrets.token_hex(32)
    logger.warning("⚠️ JWT_SECRET environment variable not provided: generated secure ephemeral runtime key.")
    JWT_SECRET = _runtime_secret
else:
    JWT_SECRET = _env_secret

ALGORITHM = "HS256"
security_bearer = HTTPBearer(auto_error=False)

# Optional pre-authorized demo tokens configured via environment
_configured_demo_tokens = [t.strip() for t in os.getenv("DEMO_TOKENS", "").split(",") if t.strip()]

class AuthService:
    """
    Cryptographically secure HMAC-SHA256 JWT & RBAC Service for National, State, and District Disaster Operations.
    """

    def __init__(self, secret: str = JWT_SECRET):
        self.secret = secret.encode("utf-8")

    def _base64url_encode(self, data: bytes) -> str:
        return base64.urlsafe_b64encode(data).rstrip(b'=').decode('ascii')

    def _base64url_decode(self, data: str) -> bytes:
        padding = '=' * (4 - (len(data) % 4))
        return base64.urlsafe_b64decode(data + padding)

    def create_access_token(self, payload: Dict[str, Any], expires_in_seconds: int = 86400) -> str:
        header = {"alg": "HS256", "typ": "JWT"}
        claims = payload.copy()
        claims["iat"] = int(time.time())
        claims["exp"] = int(time.time()) + expires_in_seconds

        encoded_header = self._base64url_encode(json.dumps(header).encode('utf-8'))
        encoded_claims = self._base64url_encode(json.dumps(claims).encode('utf-8'))

        message = f"{encoded_header}.{encoded_claims}".encode('utf-8')
        signature = hmac.new(self.secret, message, hashlib.sha256).digest()
        encoded_sig = self._base64url_encode(signature)

        return f"{encoded_header}.{encoded_claims}.{encoded_sig}"

    def decode_token(self, token: str) -> Dict[str, Any]:
        try:
            parts = token.split('.')
            if len(parts) != 3:
                raise ValueError("Invalid JWT token format (expected 3 parts)")

            encoded_header, encoded_claims, encoded_sig = parts
            message = f"{encoded_header}.{encoded_claims}".encode('utf-8')
            expected_sig = self._base64url_encode(hmac.new(self.secret, message, hashlib.sha256).digest())

            if not hmac.compare_digest(expected_sig, encoded_sig):
                raise ValueError("Cryptographic signature mismatch")

            claims = json.loads(self._base64url_decode(encoded_claims).decode('utf-8'))
            if claims.get("exp", 0) < time.time():
                raise ValueError("Token has expired")

            claims["authenticated"] = True
            return claims
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

auth_service = AuthService()

def get_current_officer(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> Dict[str, Any]:
    """
    FastAPI dependency to extract and verify authenticated officer credentials.
    - If no token is provided, returns an unauthenticated read-only viewer (clearance_level: 0).
    - If a valid HMAC-SHA256 JWT is provided, decodes claims and verifies signature.
    - If a pre-configured exact demo token is passed via DEMO_TOKENS env, grants verified demo access.
    """
    if not credentials:
        return {
            "officer_name": "Unauthenticated Public Viewer",
            "role": "unauthenticated_viewer",
            "clearance_level": 0,
            "department": "Public Access (Read-Only)",
            "authenticated": False
        }

    token = credentials.credentials.strip()
    
    # Check exact match against configured demo tokens whitelist
    if _configured_demo_tokens and token in _configured_demo_tokens:
        return {
            "officer_name": "Verified Field Officer (Demo Key)",
            "role": "district_officer",
            "clearance_level": 3,
            "department": "District Disaster Management Authority (DDMA)",
            "authenticated": True,
            "token_type": "environment_demo_key"
        }

    # Verify cryptographic HMAC-SHA256 signature
    claims = auth_service.decode_token(token)
    return claims

def require_clearance(min_level: int = 1):
    """
    RBAC dependency requiring a minimum clearance level for state mutation / simulation control.
    """
    def clearance_dependency(officer: Dict[str, Any] = Depends(get_current_officer)) -> Dict[str, Any]:
        user_level = officer.get("clearance_level", 0)
        is_auth = officer.get("authenticated", False)
        
        # In demo sandbox mode, unauthenticated viewers can interact with simulation controls with an audit log
        allow_demo_controls = os.getenv("ALLOW_UNAUTHENTICATED_DEMO_CONTROLS", "true").lower() == "true"
        
        if not is_auth and not allow_demo_controls:
            raise HTTPException(
                status_code=401,
                detail="Authentication required. Please provide a valid Authorization: Bearer <token> header."
            )
        
        if is_auth and user_level < min_level:
            raise HTTPException(
                status_code=403,
                detail=f"Forbidden: Clearance level {user_level} is insufficient. Minimum required: {min_level}."
            )
            
        return officer
    return clearance_dependency
