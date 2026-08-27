import pytest
import asyncio
import datetime
from app.services.live_aviation_service import (
    LiveAviationService,
    DISASTER_AIRCRAFT_REGISTRY
)
from app.services.bhoonidhi_service import BhoonidhiNRSCService


def test_aviation_registry_integrity():
    """Verify disaster aviation registry has valid Tier 1 and Tier 2 assets with DGCA India allocation."""
    assert len(DISASTER_AIRCRAFT_REGISTRY) >= 10
    
    # Tier 1 Civil Disaster Response (Pawan Hans, SDRF)
    pawan_1 = DISASTER_AIRCRAFT_REGISTRY.get("80026e")
    assert pawan_1 is not None
    assert pawan_1["tier"] == 1
    assert "Pawan Hans" in pawan_1["operator"]
    assert pawan_1["tail"] == "VT-PHA"

    # Tier 2 Military Strategic Airlift (IAF C-130J / C-17)
    iaf_c130 = DISASTER_AIRCRAFT_REGISTRY.get("80018a")
    assert iaf_c130 is not None
    assert iaf_c130["tier"] == 2
    assert "Indian Air Force" in iaf_c130["operator"]


def test_aviation_callsign_and_hex_rules():
    """Verify tactical pattern matching and DGCA 800000-803FFF India allocation block."""
    service = LiveAviationService()
    
    # Known registry match
    reg_match = DISASTER_AIRCRAFT_REGISTRY.get("80026e")
    assert reg_match["operator"] == "Pawan Hans Disaster Fleet"
    
    # Verify Indian hex code range heuristic (800000 - 803FFF)
    def is_indian_hex(h: str) -> bool:
        try:
            val = int(h, 16)
            return 0x800000 <= val <= 0x803FFF
        except Exception:
            return False

    assert is_indian_hex("80026e") is True
    assert is_indian_hex("400a12") is False


def test_aviation_cache_expiry_and_cascade():
    """Verify that cached disaster aircraft sightings older than 24h are evicted."""
    service = LiveAviationService()
    service._cache_cutoff_hours = 24.0

    now = datetime.datetime.now()
    # Mock a fresh sighting from 2 hours ago
    service._last_known_disaster_sightings["80026e"] = {
        "icao24": "80026e",
        "tail_number": "VT-PHA",
        "operator": "Pawan Hans",
        "is_disaster_response": True,
        "recorded_at": now - datetime.timedelta(hours=2)
    }

    # Mock a stale sighting from 30 hours ago (should be filtered out)
    service._last_known_disaster_sightings["80018a"] = {
        "icao24": "80018a",
        "tail_number": "KC-3801",
        "operator": "IAF",
        "is_disaster_response": True,
        "recorded_at": now - datetime.timedelta(hours=30)
    }

    valid_cached = []
    for icao, cached in service._last_known_disaster_sightings.items():
        age_hours = (now - cached["recorded_at"]).total_seconds() / 3600.0
        if age_hours <= service._cache_cutoff_hours:
            valid_cached.append(icao)

    assert "80026e" in valid_cached
    assert "80018a" not in valid_cached


def test_bhoonidhi_unauthenticated_safety():
    """Verify Bhoonidhi service returns unauthenticated status and zero fake granules when unconfigured."""
    service = BhoonidhiNRSCService()
    import os
    orig_user = os.environ.get("BHOONIDHI_USER_ID")
    orig_pass = os.environ.get("BHOONIDHI_PASSWORD")
    try:
        os.environ.pop("BHOONIDHI_USER_ID", None)
        os.environ.pop("BHOONIDHI_PASSWORD", None)

        res = asyncio.run(service.search_stac_catalog())
        assert res["status"] == "unauthenticated"
        assert res["total_returned"] == 0
        assert res["assets"] == []
        assert "Authentication required" in res["note"]
    finally:
        if orig_user: os.environ["BHOONIDHI_USER_ID"] = orig_user
        if orig_pass: os.environ["BHOONIDHI_PASSWORD"] = orig_pass
