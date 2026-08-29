import datetime
import hashlib
from typing import Dict, Any, Optional
from app.services.auth_service import auth_service

class GovernmentSSOService:
    """
    MeriPehchaan (National Single Sign-On) & DigiLocker SSO Sandbox Simulator.
    
    DATA PROVENANCE & ARCHITECTURE NOTE:
    - Provides a simulated MeriPehchaan / DigiLocker verification testbed for officer evaluation.
    - Issues cryptographically signed HMAC-SHA256 JWT tokens for field disaster command role simulation.
    - Data Mode: 'simulated_sso_sandbox'.
    """

    def __init__(self):
        self.authorized_domains = ["gov.in", "nic.in", "ndma.gov.in", "ndrf.gov.in"]

    def verify_government_officer(
        self,
        officer_name: str,
        gov_email_or_id: str,
        department: str,
        state: str,
        aadhaar_virtual_token: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Simulates MeriPehchaan identity verification and mints a cryptographically signed HMAC-SHA256 JWT.
        """
        is_gov_domain = any(gov_email_or_id.lower().endswith(d) for d in self.authorized_domains) or "HQ" in gov_email_or_id or "SDMA" in gov_email_or_id or "DDMA" in gov_email_or_id

        clearance_level = 5 if "ndma" in department.lower() or "national" in department.lower() else 3 if "sdma" in department.lower() or "state" in department.lower() else 2
        role = "national_authority" if clearance_level >= 5 else "state_officer" if clearance_level >= 3 else "district_officer"

        token_claims = {
            "sub": gov_email_or_id,
            "officer_name": officer_name,
            "department": department,
            "state": state,
            "role": role,
            "clearance_level": clearance_level,
            "sso_provider": "MeriPehchaan_Sandbox_Simulator"
        }

        signed_jwt = auth_service.create_access_token(token_claims, expires_in_seconds=86400)

        return {
            "status": "verified_sandbox_session",
            "data_mode": "simulated_sso_sandbox",
            "data_note": "⚠️ Simulated MeriPehchaan government SSO verification pipeline for disaster exercise drill.",
            "access_token": signed_jwt,
            "token_type": "bearer",
            "officer_name": officer_name,
            "department": department,
            "state": state,
            "clearance_level": clearance_level,
            "verification_authority": "MeriPehchaan SSO Protocol Simulator",
            "verified_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        }

government_sso_service = GovernmentSSOService()
