import os
import base64
import uuid
import datetime
import re
from typing import Dict, Any, Optional

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB cap

class CitizenMediaUploadService:
    """
    Handles Citizen & Field Team Photo/Video Proof Uploads during Emergency SOS.
    Saves files securely with MIME / magic-byte verification and path traversal guards.
    """

    def __init__(self, upload_dir: str = UPLOAD_DIR):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def _validate_image_magic_bytes(self, data: bytes) -> str:
        """
        Validates actual byte header to prevent malicious payload execution.
        Returns recognized image extension.
        """
        if len(data) < 12:
            raise ValueError("File too small to be a valid image")

        # JPEG magic bytes: FF D8 FF
        if data[:3] == b'\xff\xd8\xff':
            return "jpg"
        # PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
        if data[:8] == b'\x89PNG\r\n\x1a\n':
            return "png"
        # WebP magic bytes: RIFF....WEBP
        if data[:4] == b'RIFF' and data[8:12] == b'WEBP':
            return "webp"

        raise ValueError("Unsupported or invalid image format. Only JPG, PNG, and WebP are accepted.")

    def save_base64_photo(self, base64_data: str, filename_prefix: str = "sos_damage") -> Dict[str, Any]:
        """
        Decodes base64 photo stream, validates file integrity/size, and saves to storage.
        """
        # Sanitize filename prefix to prevent path traversal
        clean_prefix = re.sub(r'[^a-zA-Z0-9_-]', '', filename_prefix)[:32] or "sos_damage"
        media_id = f"IMG-{uuid.uuid4().hex[:10].upper()}"
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Strip metadata header if present
        clean_base64 = re.sub(r'^data:image\/[a-zA-Z0-9+]+;base64,', '', base64_data).strip()

        try:
            image_bytes = base64.b64decode(clean_base64)
            
            # File size validation
            if len(image_bytes) > MAX_FILE_SIZE_BYTES:
                return {
                    "status": "error",
                    "error": f"Payload exceeds maximum allowed size of 5 MB ({len(image_bytes)/(1024*1024):.1f} MB uploaded)",
                    "media_url": "/static/emergency_placeholder.png"
                }

            # Magic bytes validation
            file_ext = self._validate_image_magic_bytes(image_bytes)

            filename = f"{clean_prefix}_{timestamp}_{media_id}.{file_ext}"
            filepath = os.path.join(self.upload_dir, filename)

            # Ensure write path stays within upload_dir
            if not os.path.abspath(filepath).startswith(os.path.abspath(self.upload_dir)):
                raise ValueError("Path traversal attempt detected")

            with open(filepath, "wb") as f:
                f.write(image_bytes)

            media_url = f"/api/media/{filename}"
            return {
                "status": "success",
                "media_id": media_id,
                "media_url": media_url,
                "file_size_bytes": len(image_bytes),
                "file_format": file_ext.upper(),
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "media_url": "/static/emergency_placeholder.png"
            }

citizen_media_service = CitizenMediaUploadService()
