import sqlite3
import json
import os
import datetime
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "civictwin.db")

class CivicTwinDatabase:
    """
    Persistent Relational Database & PostGIS-Compatible Geospatial Storage.
    Supports Dual Engines:
    - Neon Serverless PostgreSQL (when DATABASE_URL is configured)
    - SQLite WAL (fallback for local development/offline)
    """

    def __init__(self, db_path: str = DB_FILE):
        self.db_path = db_path
        self.database_url = os.getenv("DATABASE_URL")
        self.is_postgres = bool(self.database_url and ("postgres" in self.database_url))
        self._init_db()

    def get_connection(self):
        if self.is_postgres:
            try:
                import psycopg2
                import psycopg2.extras
                conn = psycopg2.connect(self.database_url)
                return conn
            except Exception as e:
                print(f"Neon PostgreSQL connection error, falling back to SQLite: {e}")
        
        conn = sqlite3.connect(self.db_path, timeout=10.0)
        conn.row_factory = sqlite3.Row
        # Enable Write-Ahead Logging (WAL) for high concurrency
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        conn.execute("PRAGMA busy_timeout=5000;")
        return conn

    def get_api_key(self, key_name: str) -> Optional[str]:
        """Retrieves stored API key from Neon PostgreSQL or environment variable."""
        env_val = os.getenv(key_name)
        if env_val:
            return env_val
            
        if self.is_postgres:
            try:
                with self.get_connection() as conn:
                    with conn.cursor() as cur:
                        cur.execute("SELECT key_value FROM system_api_keys WHERE key_name = %s AND is_active = TRUE;", (key_name,))
                        row = cur.fetchone()
                        if row:
                            return row[0]
            except Exception as e:
                print(f"Error reading API key from Neon: {e}")
        return None

    def get_all_stored_api_keys(self) -> Dict[str, Any]:
        """Returns metadata of all API keys configured in Neon PostgreSQL."""
        if self.is_postgres:
            try:
                with self.get_connection() as conn:
                    with conn.cursor() as cur:
                        cur.execute("SELECT key_name, service_name, description, is_active, updated_at FROM system_api_keys ORDER BY key_name;")
                        rows = cur.fetchall()
                        return {
                            r[0]: {
                                "service": r[1],
                                "description": r[2],
                                "is_active": r[3],
                                "updated_at": str(r[4])
                            }
                            for r in rows
                        }
            except Exception as e:
                print(f"Error fetching API keys metadata from Neon: {e}")
        return {}

    def _init_db(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        if self.is_postgres:
            return  # Already migrated schema directly to Neon PostgreSQL

        with self.get_connection() as conn:
            cursor = conn.cursor()

            # State Snapshots table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS state_snapshots (
                city_id TEXT PRIMARY KEY,
                city_name TEXT NOT NULL,
                state_json TEXT NOT NULL,
                saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)

            # 1. ZONES
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS zones (
                zone_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                district TEXT NOT NULL,
                state TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                population INTEGER DEFAULT 500000,
                boundary_geojson TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)

            # 2. RISK_ASSESSMENTS
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS risk_assessments (
                assessment_id TEXT PRIMARY KEY,
                zone_id TEXT NOT NULL,
                hazard_type TEXT NOT NULL,
                risk_score REAL NOT NULL,
                risk_level TEXT NOT NULL,
                confidence_pct REAL DEFAULT 85.0,
                data_sources JSON,
                predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                valid_until TIMESTAMP,
                FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
            );
            """)

            # 3. INFRASTRUCTURE_ASSETS
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS infrastructure_assets (
                asset_id TEXT PRIMARY KEY,
                zone_id TEXT NOT NULL,
                asset_type TEXT NOT NULL,
                name TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                flood_depth_m REAL DEFAULT 0.0,
                operational_status TEXT DEFAULT 'operational',
                vulnerability_score REAL DEFAULT 0.0,
                capacity_info JSON,
                FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
            );
            """)

            # 4. INCIDENTS
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS incidents (
                incident_id TEXT PRIMARY KEY,
                zone_id TEXT NOT NULL,
                incident_type TEXT NOT NULL,
                severity TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                reported_by TEXT NOT NULL,
                victim_count INTEGER DEFAULT 1,
                status TEXT DEFAULT 'reported',
                message TEXT,
                media_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resolved_at TIMESTAMP,
                FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
            );
            """)

            # 5. RESOURCES
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS resources (
                resource_id TEXT PRIMARY KEY,
                resource_type TEXT NOT NULL,
                callsign TEXT NOT NULL,
                agency TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                status TEXT DEFAULT 'available',
                assigned_incident_id TEXT,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (assigned_incident_id) REFERENCES incidents(incident_id)
            );
            """)

            # 6. INCIDENT_RESOURCES
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS incident_resources (
                incident_id TEXT NOT NULL,
                resource_id TEXT NOT NULL,
                dispatched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                arrived_at TIMESTAMP,
                eta_minutes INTEGER,
                PRIMARY KEY (incident_id, resource_id),
                FOREIGN KEY (incident_id) REFERENCES incidents(incident_id),
                FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
            );
            """)

            # 7. ALERTS
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS alerts (
                alert_id TEXT PRIMARY KEY,
                zone_id TEXT NOT NULL,
                source_type TEXT NOT NULL,
                message TEXT NOT NULL,
                message_hindi TEXT,
                severity TEXT NOT NULL,
                channel TEXT NOT NULL,
                sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
            );
            """)

            # 8. SHELTERS
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS shelters (
                shelter_id TEXT PRIMARY KEY,
                zone_id TEXT NOT NULL,
                name TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                total_capacity INTEGER NOT NULL,
                current_occupancy INTEGER DEFAULT 0,
                status TEXT DEFAULT 'open',
                resources_available JSON,
                FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
            );
            """)

            # 9. USERS
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                phone TEXT,
                name TEXT,
                role TEXT DEFAULT 'citizen',
                badge_id TEXT,
                assigned_state TEXT,
                assigned_district TEXT,
                clearance_level INTEGER DEFAULT 1,
                last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """)

            conn.commit()

        # Seed initial data if empty
        self._seed_baseline_data()

    def _seed_baseline_data(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) as count FROM zones;")
            row = cursor.fetchone()
            if row["count"] == 0:
                # Seed Zones
                cursor.execute("""
                INSERT INTO zones (zone_id, name, district, state, lat, lng, population) VALUES
                ('ZONE-MUM-01', 'Kurla Mithi Basin Ward L', 'Mumbai Suburban', 'Maharashtra', 19.076, 72.877, 650000),
                ('ZONE-DEL-02', 'Yamuna Floodplain Zone East', 'North East Delhi', 'Delhi NCR', 28.669, 77.262, 480000),
                ('ZONE-CHE-03', 'Adyar River Basin Ward 172', 'Chennai', 'Tamil Nadu', 13.082, 80.270, 520000);
                """)

                # Seed Shelters
                cursor.execute("""
                INSERT INTO shelters (shelter_id, zone_id, name, lat, lng, total_capacity, current_occupancy, status) VALUES
                ('SHL-MUM-01', 'ZONE-MUM-01', 'Bandra Kurla Sports Complex Stadium', 19.068, 72.868, 1500, 320, 'open'),
                ('SHL-MUM-02', 'ZONE-MUM-01', 'Municipal High Ground School No. 4', 19.082, 72.885, 800, 110, 'open');
                """)

                # Seed Resources
                cursor.execute("""
                INSERT INTO resources (resource_id, resource_type, callsign, agency, lat, lng, status) VALUES
                ('RES-NDRF-01', 'boat', 'NDRF-BOAT-01', 'NDRF 5th Battalion', 19.072, 72.871, 'available'),
                ('RES-EMS-01', 'ambulance', 'EMS-108-ALS-04', 'Maharashtra 108 EMS', 19.078, 72.880, 'available'),
                ('RES-PUMP-01', 'dewatering_pump', 'MCGM-PUMP-09', 'Municipal Corporation', 19.065, 72.860, 'available');
                """)

                conn.commit()

    # --- Query Methods ---
    def get_all_zones(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM zones;")
            return [dict(row) for row in cursor.fetchall()]

    def record_incident(self, incident: Dict[str, Any]) -> str:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO incidents (incident_id, zone_id, incident_type, severity, lat, lng, reported_by, victim_count, status, message, media_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                incident["incident_id"],
                incident.get("zone_id", "ZONE-MUM-01"),
                incident.get("incident_type", "flood"),
                incident.get("severity", "critical"),
                incident["lat"],
                incident["lng"],
                incident.get("reported_by", "citizen"),
                incident.get("victim_count", 1),
                incident.get("status", "reported"),
                incident.get("message", ""),
                incident.get("media_url", "")
            ))
            conn.commit()
            return incident["incident_id"]

    def get_all_incidents(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM incidents ORDER BY created_at DESC LIMIT 50;")
            return [dict(row) for row in cursor.fetchall()]

    def update_resource_gps(self, resource_id: str, lat: float, lng: float, status: Optional[str] = None):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if status:
                cursor.execute("""
                UPDATE resources SET lat = ?, lng = ?, status = ?, last_updated = CURRENT_TIMESTAMP WHERE resource_id = ?;
                """, (lat, lng, status, resource_id))
            else:
                cursor.execute("""
                UPDATE resources SET lat = ?, lng = ?, last_updated = CURRENT_TIMESTAMP WHERE resource_id = ?;
                """, (lat, lng, resource_id))
            conn.commit()

    def save_state_snapshot(self, city_id: str, city_name: str, state_dict: Dict[str, Any]):
        """Persists digital twin state snapshot to SQLite so it survives restarts."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO state_snapshots (city_id, city_name, state_json, saved_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(city_id) DO UPDATE SET
                    city_name = excluded.city_name,
                    state_json = excluded.state_json,
                    saved_at = CURRENT_TIMESTAMP;
                """, (city_id, city_name, json.dumps(state_dict)))
                conn.commit()
        except Exception as e:
            print(f"Error saving state snapshot: {e}")

    def get_state_snapshot(self, city_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves persisted state snapshot if available."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT state_json FROM state_snapshots WHERE city_id = ?;", (city_id,))
                row = cursor.fetchone()
                if row:
                    return json.loads(row["state_json"])
        except Exception as e:
            print(f"Error getting state snapshot: {e}")
        return None

civictwin_db = CivicTwinDatabase()
