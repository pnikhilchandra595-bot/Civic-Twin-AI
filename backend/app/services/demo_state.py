class DemoState:
    """
    Global demo-mode switch.
    When ON, all services skip live network calls and immediately return
    their honest simulated/seeded response — used for reliable stage demos on unpredictable venue WiFi.
    """
    _demo_mode: bool = False

    @classmethod
    def is_on(cls) -> bool:
        return cls._demo_mode

    @classmethod
    def set(cls, value: bool):
        cls._demo_mode = value

demo_state = DemoState()
