import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Initialize 8K Vertical Canvas (4320 x 7680 pixels at 300 DPI)
fig_width = 14.4
fig_height = 25.6
dpi = 300

fig, ax = plt.subplots(figsize=(fig_width, fig_height), dpi=dpi)
fig.patch.set_facecolor('#070d1e')
ax.set_facecolor('#070d1e')
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

def draw_rounded_box(ax, x, y, w, h, bg_color, border_color, border_width=2.5, radius=1.2):
    rect = patches.FancyBboxPatch(
        (x, y), w, h,
        boxstyle=f"round,pad={radius},rounding_size={radius}",
        linewidth=border_width,
        edgecolor=border_color,
        facecolor=bg_color,
        zorder=3
    )
    ax.add_patch(rect)

def draw_arrow(ax, x1, y1, x2, y2, color="#00f2fe", width=2.5):
    ax.annotate(
        "", xy=(x2, y2), xytext=(x1, y1),
        arrowprops=dict(
            arrowstyle="-|>",
            color=color,
            lw=width,
            mutation_scale=18,
            shrinkA=0, shrinkB=0
        ),
        zorder=4
    )

# --- HEADER SECTION ---
ax.text(50, 97.5, "CIVICTWIN AI", fontsize=28, fontweight='bold', color='#00f2fe', ha='center', va='center', family='sans-serif')
ax.text(50, 96.0, "AI-Powered Disaster Intelligence & Autonomous Response Platform", fontsize=14, color='#ffffff', ha='center', va='center', family='sans-serif')
ax.text(50, 94.8, "Smart India Hackathon 2026 • End-to-End Vertical Pipeline Architecture", fontsize=11, color='#8da9c4', ha='center', va='center', family='sans-serif')
ax.plot([10, 90], [93.8, 93.8], color='#00b4d8', lw=1.5, zorder=2)

# =========================================================================
# STAGE 1: MULTI-MODAL DATA INGESTION
# =========================================================================
draw_rounded_box(ax, 5, 78, 90, 14, '#0d1b3a', '#00b4d8', border_width=2.5)
ax.text(8, 90.5, "STAGE 1: MULTI-MODAL DATA INGESTION & SPATIAL INPUTS", fontsize=13, fontweight='bold', color='#00f2fe', va='center')

# Cards inside Stage 1
draw_rounded_box(ax, 7, 79.5, 27, 9.5, '#132854', '#48cae4', border_width=1.5)
ax.text(20.5, 87.2, "Earth Observation & Satellites", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(20.5, 84.5, "• ISRO INSAT & Sentinel SAR\n• Copernicus DEM Elevation\n• NASA FIRMS Thermal Scans", fontsize=9, color='#d8e2dc', ha='center', va='center')

draw_rounded_box(ax, 36.5, 79.5, 27, 9.5, '#132854', '#48cae4', border_width=1.5)
ax.text(50, 87.2, "IoT & Telemetry Streams", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(50, 84.5, "• River Gauges & IMD Rain Scrapers\n• Ground Physical IoT Sensors\n• CCTV Feeds & Drone Airspace", fontsize=9, color='#d8e2dc', ha='center', va='center')

draw_rounded_box(ax, 66, 79.5, 27, 9.5, '#132854', '#48cae4', border_width=1.5)
ax.text(79.5, 87.2, "Geo-Spatial & Citizen Signals", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(79.5, 84.5, "• Administrative Boundaries DB\n• OSM Road Vector Geocoding\n• Citizen SOS & Depth Fusion", fontsize=9, color='#d8e2dc', ha='center', va='center')

draw_arrow(ax, 50, 78, 50, 74.5)

# =========================================================================
# STAGE 2: DATA LAKE, FEATURE STORE & COGNITIVE AI
# =========================================================================
draw_rounded_box(ax, 5, 59.5, 90, 15, '#121a42', '#7209b7', border_width=2.5)
ax.text(8, 73.0, "STAGE 2: DATA LAKE, PROVENANCE & COGNITIVE AI CORE", fontsize=13, fontweight='bold', color='#b5179e', va='center')

draw_rounded_box(ax, 7, 61, 38, 10.5, '#1b1b50', '#9d4edd', border_width=1.5)
ax.text(26, 69.5, "Unified Data Lake & Feature Store", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(26, 66.5, "• Normalized Storage (database.py)\n• Online/Offline Feature Store\n• Data Freshness & Reliability Audit", fontsize=9, color='#e0aaff', ha='center', va='center')

draw_rounded_box(ax, 48, 61, 45, 10.5, '#1b1b50', '#9d4edd', border_width=1.5)
ax.text(70.5, 69.5, "Gemini & LLM Reasoning Core", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(70.5, 66.0, "• Gemini Multi-Modal Agent Logic\n• Contextual Copilot & Disaster RAG Manuals\n• Computer Vision Severity Classification", fontsize=9, color='#e0aaff', ha='center', va='center')

draw_arrow(ax, 50, 59.5, 50, 56.0)

# =========================================================================
# STAGE 3: HYDROLOGIC TWINS & CASCADE SIMULATION
# =========================================================================
draw_rounded_box(ax, 5, 41, 90, 15, '#0b2633', '#06d6a0', border_width=2.5)
ax.text(8, 54.5, "STAGE 3: HYDROLOGIC DIGITAL TWINS & CASCADE SIMULATION", fontsize=13, fontweight='bold', color='#06d6a0', va='center')

draw_rounded_box(ax, 7, 42.5, 42, 10.5, '#123945', '#2ec4b6', border_width=1.5)
ax.text(28, 51.0, "Inundation & Hydrologic Forecasting", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(28, 47.5, "• Dynamic Runoff & Inundation Flow\n• Dam Rule Curves & Reservoir Management\n• Predictive Future Depth Projections", fontsize=9, color='#cbf3f0', ha='center', va='center')

draw_rounded_box(ax, 51, 42.5, 42, 10.5, '#123945', '#2ec4b6', border_width=1.5)
ax.text(72, 51.0, "Cascade Modeling & Rescue Routing", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(72, 47.5, "• Multi-Infrastructure Cascade Failures\n• Power Grid & Telecom Blackout Analysis\n• Overland & Amphibious Vessel Routing", fontsize=9, color='#cbf3f0', ha='center', va='center')

draw_arrow(ax, 50, 41, 50, 37.5)

# =========================================================================
# STAGE 4: AUTONOMOUS WAR ROOM & TRIAGE
# =========================================================================
draw_rounded_box(ax, 5, 23, 90, 14.5, '#2e1220', '#f72585', border_width=2.5)
ax.text(8, 36.0, "STAGE 4: AUTONOMOUS WAR ROOM & RESOURCE ALLOCATION", fontsize=13, fontweight='bold', color='#f72585', va='center')

draw_rounded_box(ax, 7, 24.5, 27, 10, '#421a2e', '#ff4d6d', border_width=1.5)
ax.text(20.5, 32.5, "Incident Commander", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(20.5, 29.2, "• Autonomous War Room Engine\n• Actionable Response Playbooks\n• Real-Time Incident Orchestration", fontsize=9, color='#ffccd5', ha='center', va='center')

draw_rounded_box(ax, 36.5, 24.5, 27, 10, '#421a2e', '#ff4d6d', border_width=1.5)
ax.text(50, 32.5, "Triage & Prioritization", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(50, 29.2, "• Critical / High / Medium / Low\n• Impact & Population at Risk\n• Clustering Duplicate Incidents", fontsize=9, color='#ffccd5', ha='center', va='center')

draw_rounded_box(ax, 66, 24.5, 27, 10, '#421a2e', '#ff4d6d', border_width=1.5)
ax.text(79.5, 32.5, "Municipal Allocation", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(79.5, 29.2, "• Autonomous Field Unit Tasking\n• Hospital Bed & Triage Stocking\n• Equipment Deployment Tracking", fontsize=9, color='#ffccd5', ha='center', va='center')

draw_arrow(ax, 50, 23, 50, 19.5)

# =========================================================================
# STAGE 5: DISSEMINATION, FIELD RESPONSE & AUDIT
# =========================================================================
draw_rounded_box(ax, 5, 4.5, 90, 15, '#242013', '#ffb703', border_width=2.5)
ax.text(8, 18.0, "STAGE 5: MULTI-CHANNEL DISSEMINATION, FIELD DISPATCH & AUDIT", fontsize=13, fontweight='bold', color='#ffb703', va='center')

draw_rounded_box(ax, 7, 6, 27, 10.5, '#38321d', '#ffe6a7', border_width=1.5)
ax.text(20.5, 14.5, "Multi-Channel Alerts", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(20.5, 11.2, "• Geofenced Emergency SMS\n• Telegram SOS Bot Updates\n• LoRaWAN Mesh Off-Grid Relays", fontsize=9, color='#fefae0', ha='center', va='center')

draw_rounded_box(ax, 36.5, 6, 27, 10.5, '#38321d', '#ffe6a7', border_width=1.5)
ax.text(50, 14.5, "Field Action & Patrol", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(50, 11.2, "• Ground Rescue Workforce Patrols\n• Real-Time Incident Verification\n• Closed-Loop Operator Feedback", fontsize=9, color='#fefae0', ha='center', va='center')

draw_rounded_box(ax, 66, 6, 27, 10.5, '#38321d', '#ffe6a7', border_width=1.5)
ax.text(79.5, 14.5, "PDNA & System Audit", fontsize=10.5, fontweight='bold', color='#ffffff', ha='center')
ax.text(79.5, 11.2, "• Economic Loss (PDNA) Service\n• Continuous Model Accuracy Audit\n• SFT Fine-Tuning Data Export", fontsize=9, color='#fefae0', ha='center', va='center')

# Closed-loop return arrow
ax.annotate(
    "", xy=(94, 70), xytext=(94, 11),
    arrowprops=dict(
        arrowstyle="-|>",
        color='#ffb703',
        lw=2,
        mutation_scale=16,
        connectionstyle="arc3,rad=-0.1"
    ),
    zorder=4
)
ax.text(96.5, 41, "Closed-Loop Model Learning", fontsize=9, color='#ffb703', rotation=90, ha='center', va='center')

# Export high-res PNG
output_file = "CivicTwin_AI_Vertical_Architecture_8K.png"
plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
plt.savefig(output_file, dpi=dpi, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight', pad_inches=0.2)
plt.close()

print(f"Direct export complete: {output_file} (Canvas: 4320x7680 resolution)")
