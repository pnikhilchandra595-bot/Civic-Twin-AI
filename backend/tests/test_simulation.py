import pytest
from app.simulation.hydrology import HydrologySimulationEngine
from app.simulation.cascade import CascadeFailureEngine
from app.simulation.routing import DynamicEvacuationRouter
from app.data.scenarios import generate_metropolis_bay_scenario
from app.models.schemas import NodeStatus, RoadStatus, SimulationControlCommand
from app.simulation.state_manager import DigitalTwinStateManager

def test_hydrology_flood_propagation():
    engine = HydrologySimulationEngine()
    state = generate_metropolis_bay_scenario()

    # Apply heavy rain
    nodes, roads, sensors = engine.calculate_flood_depths(
        timeline_hour=3.0,
        rain_intensity_mmhr=80.0,
        storm_surge_m=1.0,
        levee_breached=False,
        nodes=state.nodes,
        roads=state.roads,
        sensors=state.sensors
    )

    # Lowland node should have significant flood depth
    lowland_node = next(n for n in nodes if n.id == "node-res-1")
    assert lowland_node.flood_depth_m > 0.15
    assert lowland_node.status in [NodeStatus.WARNING, NodeStatus.CRITICAL, NodeStatus.SUBMERGED]

    # Water sensor should register rising level
    water_sensor = next(s for s in sensors if s.sensor_id == "sensor-water-1")
    assert water_sensor.current_value > 15.0

def test_cascade_failure_propagation():
    cascade_engine = CascadeFailureEngine()
    state = generate_metropolis_bay_scenario()

    # Trigger substation failure
    nodes, cascade_links, metrics = cascade_engine.evaluate_cascade_effects(
        nodes=state.nodes,
        roads=state.roads,
        substation_tripped=True,
        levee_breached=False,
        timeline_hour=2.0
    )

    assert len(cascade_links) > 0
    # Hospital or assets connected to substation Alpha should be on backup generator
    bay_hosp = next(n for n in nodes if n.id == "node-hosp-2")
    assert bay_hosp.backup_power_active is True

def test_dynamic_evacuation_routing():
    router = DynamicEvacuationRouter()
    state = generate_metropolis_bay_scenario()

    routes = router.calculate_evacuation_routes(state.nodes, state.roads)
    assert len(routes) > 0
    for r in routes:
        assert len(r.coordinates) >= 2
        assert r.safety_score > 0.0

def test_state_manager_control_commands():
    mgr = DigitalTwinStateManager()
    cmd = SimulationControlCommand(
        rain_intensity_mmhr=60.0,
        storm_surge_m=1.5,
        timeline_hour=4.0
    )
    new_state = mgr.apply_control_command(cmd)
    assert new_state.rain_intensity_mmhr == 60.0
    assert new_state.timeline_hour == 4.0
    assert len(new_state.cascade_links) > 0
    assert new_state.iap.overall_threat_level in ["CRITICAL", "CATASTROPHIC"]
