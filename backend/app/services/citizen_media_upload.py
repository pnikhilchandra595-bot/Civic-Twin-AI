import os
import base64
import uuid
import datetime
from typing import Dict, Any, Optional

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")

class CitizenMediaUploadService:
    """
    Handles Citizen & Field Team Photo/Video Proof Uploads during Emergency SOS.
    Saves files locally / generates secure media URLs linked to the database incident.
    """

    def __init__(self, upload_dir: str = UPLOAD_DIR):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_base64_photo(self, base64_data: str, filename_prefix: str = "sos_damage") -> Dict[str, Any]:
        """
        Decodes base64 photo stream and saves to persistent storage.
        """
        media_id = f"IMG-{uuid.uuid4().hex[:10].upper()}"
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        # Strip metadata header if present
        clean_base64 = base64_data
        file_ext = "jpg"
        if "data:image/png;base64," in base64_data:
            clean_base64 = base64_data.replace("data:image/png;base64,", "")
            file_ext = "png"
        elif "data:image/jpeg;base64," in base64_data:
            clean_base64 = base64_data.replace("data:image/jpeg;base64,", "")
            file_ext = "jpg"
        elif "data:image/webp;base64," in base64_data:
            clean_base64 = base64_data.replace("data:image/webp;base64,", "")
            file_ext = "webp"

        filename = f"{filename_prefix}_{timestamp}_{media_id}.{file_ext}"
        filepath = os.path.join(self.upload_dir, filename)

        try:
            image_bytes = base64.b64decode(clean_base64)
            with open(filepath, "wb") as f:
                f.write(image_bytes)

            media_url = f"/api/media/{filename}"
            return {
                "status": "success",
                "media_id": media_id,
                "media_url": media_url,
                "file_size_bytes": len(image_bytes),
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "media_url": "/static/emergency_placeholder.png"
            }

citizen_media_service = CitizenMediaUploadService()
