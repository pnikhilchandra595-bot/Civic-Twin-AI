import pytest
from app.services.hazard_models import multi_hazard_engine

def test_earthquake_zero_depth_no_crash():
    """Verify shallow surface earthquake with focal_depth_km=0 doesn't raise ZeroDivisionError."""
    res = multi_hazard_engine.calculate_earthquake_shakemap(
        epicenter_lat=28.6139,
        epicenter_lng=77.2090,
        magnitude_richter=7.2,
        focal_depth_km=0.0
    )
    assert res["peak_ground_acceleration_g"] > 0
    assert res["structural_collapse_risk"]["unreinforced_masonry_buildings_pct"] > 0
    assert res["structural_collapse_risk"]["underground_pipeline_ruptures_expected"] > 0

def test_earthquake_magnitude_scaling():
    """Verify severe earthquake causes strictly higher damage than a minor one."""
    m5 = multi_hazard_engine.calculate_earthquake_shakemap(28.61, 77.20, magnitude_richter=5.0, focal_depth_km=10.0)
    m8 = multi_hazard_engine.calculate_earthquake_shakemap(28.61, 77.20, magnitude_richter=8.0, focal_depth_km=10.0)

    assert m8["peak_ground_acceleration_g"] > m5["peak_ground_acceleration_g"]
    assert m8["structural_collapse_risk"]["unreinforced_masonry_buildings_pct"] > m5["structural_collapse_risk"]["unreinforced_masonry_buildings_pct"]
    assert m8["structural_collapse_risk"]["underground_pipeline_ruptures_expected"] > m5["structural_collapse_risk"]["underground_pipeline_ruptures_expected"]

def test_hazmat_release_rate_scaling():
    """Verify higher chemical release rate increases plume radius and casualties."""
    small = multi_hazard_engine.calculate_hazmat_gas_plume(28.61, 77.20, release_rate_kg_s=5.0)
    large = multi_hazard_engine.calculate_hazmat_gas_plume(28.61, 77.20, release_rate_kg_s=100.0)

    r_small = small["impact_zones"][0]["radius_km"]
    r_large = large["impact_zones"][0]["radius_km"]
    c_small = small["impact_zones"][0]["estimated_casualties_if_unprotected"]
    c_large = large["impact_zones"][0]["estimated_casualties_if_unprotected"]

    assert r_large > r_small
    assert c_large > c_small
