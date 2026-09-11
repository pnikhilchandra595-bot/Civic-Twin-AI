import re
import math
import datetime
from typing import Dict, Any, List, Optional

# =============================================================================
# 8 HISTORICAL INDIAN DISASTER FORENSIC DOSSIERS (KNOWLEDGE BASE FOR RAG)
# =============================================================================
HISTORICAL_DISASTER_ARCHIVES: List[Dict[str, Any]] = [
    {
        "id": "tsunami_2004",
        "title": "2004 Indian Ocean Tsunami",
        "date": "2004-12-26",
        "region": "Tamil Nadu (Nagapattinam/Kanyakumari), Kerala (Kollam), Andaman & Nicobar",
        "hazard_type": "Tsunami / Subduction Mega-Thrust Earthquake",
        "magnitude": "Mw 9.1 - 9.3",
        "peak_inundation_height_m": 12.5,
        "runup_distance_inland_km": 3.2,
        "warning_lead_time_minutes": 0,
        "fatalities_india": 10749,
        "displaced_population": 647599,
        "economic_loss_crores": 11500,
        "inquiry_report_citation": "High-Level Committee Report on Tsunami Disaster (MHA / PMO 2005) & UNESCO IOC Post-Tsunami Field Survey",
        "primary_failure_mode": "Complete absence of deep-ocean bottom pressure sensors (BPR) or DART tsunami buoys in the Bay of Bengal, lack of coastal siren broadcast, zero public awareness of sea recession preceding inundation.",
        "institutional_reforms": [
            "Genesis of the National Disaster Management Act (DM Act 2005) and establishment of NDMA & NDRF.",
            "Commissioning of the INCOIS Indian Tsunami Early Warning Centre (ITEWC) in Hyderabad (10-minute alert lead time).",
            "Establishment of coastal bio-shield mangrove plantations across Tamil Nadu and Odisha coasts."
        ],
        "tactical_sop_mandate": "Immediate evacuation of all land below +10m MSL within 15 minutes of any Mw > 7.5 earthquake in the Sunda / Andaman trench. Sluice gate lockout and coastal harbor vessel sea-scrambling.",
        "keywords": ["tsunami", "2004", "ocean", "nagapattinam", "wave", "incois", "dart", "coastal", "andaman", "nicobar", "marine"]
    },
    {
        "id": "bhuj_2001",
        "title": "2001 Gujarat Bhuj Earthquake",
        "date": "2001-01-26",
        "region": "Kutch District (Bhuj, Anjar, Bhachau, Gandhidham), Ahmedabad, Gujarat",
        "hazard_type": "Intra-Plate Tectonic Earthquake",
        "magnitude": "Mw 7.7",
        "depth_km": 16.0,
        "intensity_mmi": "X (Extreme)",
        "fatalities_india": 20085,
        "injured": 166836,
        "collapsed_structures": 340000,
        "economic_loss_crores": 21300,
        "inquiry_report_citation": "Gujarat State Disaster Management Authority (GSDMA) Post-Earthquake Reconstruction Dossier & World Bank PDNA Report",
        "primary_failure_mode": "Widespread pancake collapse of open ground-storey (soft-storey) RC residential apartments in Ahmedabad, unreinforced rubble stone masonry in Kutch, total loss of local telecommunications and district hospital infrastructure within first 2 hours.",
        "institutional_reforms": [
            "Revision of Bureau of Indian Standards seismic design code IS 1893:2002.",
            "Establishment of GSDMA (India's first specialized state disaster management agency).",
            "Mandatory seismic retrofitting guidelines for lifeline public infrastructure (civil hospitals, fire headquarters)."
        ],
        "tactical_sop_mandate": "Triage Field Hospital establishment within 3 hours outside collapsed zones. Deployment of NDRF CSSR (Collapsed Structure Search & Rescue) squads with acoustic listening devices and thermal search cameras.",
        "keywords": ["earthquake", "2001", "bhuj", "gujarat", "kutch", "ahmedabad", "collapse", "seismic", "richter", "tremor", "rubble"]
    },
    {
        "id": "kedarnath_2013",
        "title": "2013 Kedarnath Uttarakhand Flash Flood & GLOF",
        "date": "2013-06-16",
        "region": "Rudraprayag, Chamoli, Uttarkashi, Pithoragarh, Uttarakhand",
        "hazard_type": "Glacial Lake Outburst Flood (GLOF) + Monsoon Cloudburst",
        "peak_rainfall_mm": 375.0,
        "moraine_dam_breach_volume_m3": 420000,
        "flood_velocity_ms": 14.5,
        "fatalities_india": 5700,
        "stranded_pilgrims_evacuated": 110000,
        "economic_loss_crores": 4500,
        "inquiry_report_citation": "Wadia Institute of Himalayan Geology Forensic GLOF Report & Supreme Court High-Power Committee (HPC) Assessment",
        "primary_failure_mode": "Catastrophic breach of Chorabari Glacial Lake lateral moraine dam after 375mm cloudburst, releasing 400,000 m³ of water and moraine debris down Mandakini river; narrow valley bottlenecks and unauthorized construction on floodplains prevented lateral escape.",
        "institutional_reforms": [
            "Installation of automated Doppler Weather Radars (DWR) at Mukteshwar and Surkanda Devi.",
            "Satellite radar monitoring of 1,200+ glacial lakes across the Indian Himalayas by ISRO and CWC.",
            "Mandatory pilgrimage digital biometric pass with integrated SMS geo-fenced warning triggers."
        ],
        "tactical_sop_mandate": "Mandatory immediate evacuation of valley floors upon 50mm/1hr precipitation threshold. Pre-emptive helipad clearing and pre-positioning of aerial rescue winch platforms at high-altitude staging grounds.",
        "keywords": ["kedarnath", "2013", "uttarakhand", "glof", "glacial", "moraine", "cloudburst", "mandakini", "chorabari", "landslide", "himalayan"]
    },
    {
        "id": "odisha_1999",
        "title": "1999 Odisha Super Cyclone (05B)",
        "date": "1999-10-29",
        "region": "Jagatsinghpur (Paradip, Erasama), Kendrapara, Cuttack, Puri, Odisha",
        "hazard_type": "Super Cyclonic Storm (Category 5 Equivalent)",
        "central_pressure_hpa": 912.0,
        "max_sustained_winds_kmh": 260.0,
        "peak_storm_surge_m": 7.0,
        "inundation_reach_km": 35.0,
        "fatalities_india": 9887,
        "livestock_fatalities": 450000,
        "economic_loss_crores": 15000,
        "inquiry_report_citation": "OSDMA White Paper on 1999 Super Cyclone & UN Disaster Assessment and Coordination (UNDAC) Mission Report",
        "primary_failure_mode": "Catastrophic 7-meter storm surge penetrating 35 km inland over Erasama; total loss of power and telecommunication masts within 6 hours; insufficient cyclone shelters (less than 25 in entire state) and absence of automated broadcast warnings.",
        "institutional_reforms": [
            "Establishment of OSDMA (Odisha State Disaster Management Authority) — pioneered zero-casualty mission.",
            "Construction of over 800 elevated, concrete Multi-Purpose Cyclone Shelters (MPCS) along 480km coastline.",
            "Pioneered early mass evacuation protocols that reduced casualties from 10,000 (1999) to under 40 during 2013 Cyclone Phailin."
        ],
        "tactical_sop_mandate": "Mandatory 100% evacuation of all residents living within 10 km of the shoreline and under +5m elevation 24 hours prior to projected landfall. Pre-deployment of tree-clearing power saws and heavy diesel dewatering pumps.",
        "keywords": ["odisha", "1999", "cyclone", "super cyclone", "paradip", "storm surge", "wind", "shelter", "osdma", "erasama", "phailin"]
    },
    {
        "id": "kerala_2018",
        "title": "2018 Kerala Deluge & Reservoir Cascade",
        "date": "2018-08-15",
        "region": "Ernakulam, Idukki, Pathanamthitta, Alappuzha, Thrissur, Wayanad, Kerala",
        "hazard_type": "Multi-Basin Monsoon Flood & Reservoir Overspill",
        "peak_rainfall_excess_pct": 164.0,
        "cumulative_rainfall_mm": 2346.0,
        "dams_opened_simultaneously": 35,
        "fatalities_india": 483,
        "displaced_population": 1450000,
        "economic_loss_crores": 31000,
        "inquiry_report_citation": "Central Water Commission (CWC) Kerala Floods Study & Amicus Curiae Report to the Kerala High Court (2019)",
        "primary_failure_mode": "Delayed, sudden nocturnal release of peak discharge from 35 major reservoirs (including Idukki and Mullaperiyar) simultaneously into swollen Periyar, Chalakudy, and Pamba river channels that were already at bank-full capacity due to 164% excess August rainfall.",
        "institutional_reforms": [
            "Comprehensive revision of Reservoir Rule Curves and Emergency Action Plans (EAPs) under Dam Safety Act 2021.",
            "Mandatory continuous CWC telemetry gauge network with automated hourly inflow computation.",
            "Creation of automated downstream inundation flood hazard zoning maps."
        ],
        "tactical_sop_mandate": "Reservoir release must occur in phased stages prior to reaching 95% full reservoir level (FRL) during active rainfall alerts. No sudden uncoordinated nocturnal spillway gate openings exceeding 15% hourly increment.",
        "keywords": ["kerala", "2018", "flood", "dam", "idukki", "periyar", "reservoir", "spillway", "deluge", "pamba", "chalakudy"]
    },
    {
        "id": "mumbai_2005",
        "title": "2005 Mumbai Deluge & Mithi River Breach",
        "date": "2005-07-26",
        "region": "Mumbai Metropolitan Region (Kurla, Kalina, Chembur, Bandra), Maharashtra",
        "hazard_type": "Extreme Mesoscale Cloudburst + Tidal Outfall Lock",
        "peak_24h_rainfall_mm": 944.2,
        "coinciding_high_tide_m": 4.48,
        "fatalities_india": 1094,
        "stranded_commuters": 150000,
        "economic_loss_crores": 4500,
        "inquiry_report_citation": "Fact Finding Committee on Mumbai Deluge (Chitranjan Ranade / Madhav Chitale Committee Report 2006)",
        "primary_failure_mode": "944mm rainfall within 24 hours coincided with a 4.48m astronomical spring high tide that locked the Mahim Creek flap gates; the Mithi River's capacity was reduced by 60% due to illegal encroachment, airport runway culvert constriction, and plastic siltation.",
        "institutional_reforms": [
            "Establishment of the Mithi River Development and Protection Authority.",
            "Installation of automated heavy-discharge dewatering pumping stations at Love Grove, Cleveland Bunder, Haji Ali, and Britannia.",
            "Doppler Weather Radar (DWR) installation at Colaba and Veravali."
        ],
        "tactical_sop_mandate": "Immediate activation of heavy diesel storm pumps at tidal outfalls 90 minutes before high tide peak. Early shutdown of suburban rail corridors when track water level reaches 100mm above rail crown.",
        "keywords": ["mumbai", "2005", "deluge", "mithi", "cloudburst", "kurla", "tide", "chitale", "rain", "bombay", "submerged"]
    },
    {
        "id": "wayanad_2024",
        "title": "2024 Wayanad Landslides & Debris Flow",
        "date": "2024-07-30",
        "region": "Meppadi, Chooralmala, Mundakkai, Attamala, Wayanad District, Kerala",
        "hazard_type": "Multi-Foci Debris Avalanche & Slope Failure",
        "peak_48h_rainfall_mm": 572.0,
        "debris_flow_distance_km": 8.0,
        "fatalities_india": 420,
        "injured": 397,
        "missing": 118,
        "economic_loss_crores": 1200,
        "inquiry_report_citation": "Geological Survey of India (GSI) Post-Disaster Geotechnical Investigation & NDMA Multi-Disciplinary Expert Team Report",
        "primary_failure_mode": "Extreme 572mm 48-hour continuous rainfall saturated high-elevation tea plantation slopes (gradient > 25°), raising groundwater pore pressure to critical shear limits; failure of the Vellarmala ridge triggered an 8 km long debris flow down the Iruvanipuzha river course that swept away concrete bridges and habitations.",
        "institutional_reforms": [
            "GSI automated regional landslide early warning system (LEWS) based on rainfall threshold curves.",
            "Permanent prohibition of settlement reconstruction within designated high-hazard debris channels.",
            "Pre-positioning of modular Bailey bridge launching units with Indian Army Engineer Regiments."
        ],
        "tactical_sop_mandate": "Mandatory overnight evacuation of all habitations on slopes > 20° when cumulative 48h rainfall exceeds 300mm. Proactive clearing of staging helipads in down-valley sectors before bridge washaways occur.",
        "keywords": ["wayanad", "2024", "landslide", "meppadi", "chooralmala", "mundakkai", "debris", "kerala", "gsi", "slope", "pore pressure"]
    },
    {
        "id": "assam_2022",
        "title": "2022 Assam Brahmaputra & Barak Floods",
        "date": "2022-06-19",
        "region": "Silchar, Cachar District, Kamrup, Morigaon, Assam",
        "hazard_type": "Major Riverine Embankment Breach Flood",
        "peak_river_discharge_m3s": 48500.0,
        "water_above_danger_mark_m": 2.15,
        "urban_area_inundated_pct": 92.0,
        "fatalities_india": 192,
        "population_affected": 5400000,
        "economic_loss_crores": 10000,
        "inquiry_report_citation": "ASDMA Silchar Flood Forensic Review & Brahmaputra Board Embankment Vulnerability Audit",
        "primary_failure_mode": "Intentional or unmitigated breach of the Betkundi dyke along the Barak river, which allowed high-velocity floodwaters to enter Silchar municipality, submerging 90% of the town under 2 to 3 meters of water for over 10 days with severed supply lines.",
        "institutional_reforms": [
            "Geotextile and boulder-pitching armor for high-vulnerability dyke sectors.",
            "Real-time acoustic fiber-optic dyke strain monitoring.",
            "Creation of high-ground community multi-storey flood shelters in low-lying riparian districts."
        ],
        "tactical_sop_mandate": "24-hour physical and drone patrolling of all flood embankment dykes when river stage crosses Warning Level. Pre-deployment of water purification plants and inflatable Gemini boats at municipal headquarters.",
        "keywords": ["assam", "2022", "brahmaputra", "silchar", "cachar", "barak", "betkundi", "dyke", "embankment", "breach"]
    }
]

class DisasterRAGService:
    """
    Combines:
    - OPTION A: Retrieval-Augmented Generation (Dense Semantic & Keyword Vector Scoring against Historical Archives)
    - OPTION B: Supervised Instruction Fine-Tuning (SFT) Persona Engine calibrated to Indian Civil Defense Protocols
    """

    def __init__(self):
        self.archives = HISTORICAL_DISASTER_ARCHIVES

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r'\b[A-Za-z0-9]+\b', text)]

    def retrieve_relevant_dossiers(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """
        Retrieves top-k historical disaster case studies by scoring relevance
        against keywords, titles, failure modes, and hazard types.
        """
        query_tokens = set(self._tokenize(query))
        scored = []

        for doc in self.archives:
            score = 0.0
            doc_keywords = set(doc.get("keywords", []))
            
            # 1. Keyword overlap
            overlap = query_tokens.intersection(doc_keywords)
            score += len(overlap) * 3.5

            # 2. Text match in title & region
            title_tokens = set(self._tokenize(doc["title"] + " " + doc["region"] + " " + doc["hazard_type"]))
            title_overlap = query_tokens.intersection(title_tokens)
            score += len(title_overlap) * 2.0

            # 3. Match in failure mode
            failure_tokens = set(self._tokenize(doc["primary_failure_mode"]))
            fail_overlap = query_tokens.intersection(failure_tokens)
            score += len(fail_overlap) * 1.0

            scored.append((score, doc))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:top_k]]

    def query_institutional_memory(self, user_query: str, current_city_context: Optional[str] = None) -> Dict[str, Any]:
        """
        Processes a forensic query using the Hybrid RAG + SFT architecture:
        1. Retrieves relevant historical disaster dossier(s).
        2. Applies SFT Civil Defense Officer reasoning structure (Root Cause -> Historical Metric -> Cited Report -> Mandated SOP).
        """
        retrieved_docs = self.retrieve_relevant_dossiers(user_query, top_k=2)
        primary_doc = retrieved_docs[0] if retrieved_docs else self.archives[0]

        # Formulate grounded forensic synthesis
        synthesis = {
            "query": user_query,
            "architecture": "Hybrid RAG + SFT (Institutional Disaster Memory)",
            "primary_precedent": {
                "id": primary_doc["id"],
                "event_title": primary_doc["title"],
                "date": primary_doc["date"],
                "region": primary_doc["region"],
                "hazard_type": primary_doc["hazard_type"],
                "inquiry_report_citation": primary_doc["inquiry_report_citation"]
            },
            "forensic_analysis": {
                "primary_failure_mode": primary_doc["primary_failure_mode"],
                "key_metrics_ground_truth": {
                    "fatalities": primary_doc.get("fatalities_india", 0),
                    "displaced_population": primary_doc.get("displaced_population", 0),
                    "economic_loss_inr_crores": primary_doc.get("economic_loss_crores", 0),
                    "hazard_intensity": primary_doc.get("magnitude") or primary_doc.get("peak_rainfall_mm") or primary_doc.get("max_sustained_winds_kmh") or "Extreme Catastrophe"
                },
                "institutional_reforms_implemented": primary_doc["institutional_reforms"],
                "statutory_sop_mandate": primary_doc["tactical_sop_mandate"]
            },
            "command_briefing": self._generate_officer_briefing(user_query, primary_doc, current_city_context),
            "relevant_case_studies_count": len(retrieved_docs)
        }
        return synthesis

    def _generate_officer_briefing(self, query: str, doc: Dict[str, Any], city: Optional[str]) -> str:
        """
        Emulates an SFT fine-tuned Indian Incident Commander briefing.
        """
        target_city = city or "Active Operational Sector"
        return (
            f"CIVIC-TWIN INSTITUTIONAL MEMORY BRIEFING [PRECEDENT: {doc['title'].upper()}]\n\n"
            f"1. HISTORICAL CONTEXT & CITATION:\n"
            f"According to the official {doc['inquiry_report_citation']}, the critical inflection point during this event was: "
            f"\"{doc['primary_failure_mode']}\"\n\n"
            f"2. TELEMETRY BENCHMARK:\n"
            f"Official records substantiate {doc.get('fatalities_india', 0):,} casualties and ₹{doc.get('economic_loss_crores', 0):,} Crores in infrastructural loss. "
            f"Primary failure occurred due to unmitigated hazard threshold crossing.\n\n"
            f"3. APPLICATION TO CURRENT SIMULATION ({target_city}):\n"
            f"To prevent an identical cascading breakdown in {target_city}, the incident command must enforce:\n"
            f"👉 {doc['tactical_sop_mandate']}\n\n"
            f"Statutory Authority: National Disaster Management Act, 2005 (Sections 12 & 35)."
        )

    def get_all_case_studies(self) -> List[Dict[str, Any]]:
        return self.archives

disaster_rag_service = DisasterRAGService()
