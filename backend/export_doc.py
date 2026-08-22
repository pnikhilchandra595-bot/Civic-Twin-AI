import re

def markdown_to_html_doc(md_path, doc_path):
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    # Simple HTML doc template with clean styles
    html_content = f"""<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>CivicTwin AI - Live Urban Digital Twin Real-Time Dataset Report</title>
<style>
    body {{ font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.6; padding: 20px; }}
    h1 {{ font-size: 20pt; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 6px; margin-top: 24px; }}
    h2 {{ font-size: 14pt; color: #0369a1; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; }}
    h3 {{ font-size: 12pt; color: #334155; margin-top: 14px; }}
    table {{ border-collapse: collapse; width: 100%; margin: 14px 0; font-size: 10pt; }}
    th {{ background-color: #f1f5f9; color: #0f172a; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }}
    td {{ border: 1px solid #e2e8f0; padding: 7px 10px; }}
    tr:nth-child(even) {{ background-color: #f8fafc; }}
    code {{ font-family: 'Consolas', 'Courier New', monospace; background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; color: #0f766e; }}
    pre {{ background-color: #0f172a; color: #f8fafc; padding: 12px; border-radius: 6px; font-family: 'Consolas', monospace; font-size: 9.5pt; }}
    blockquote {{ border-left: 4px solid #0284c7; padding-left: 12px; color: #475569; font-style: italic; margin: 12px 0; }}
</style>
</head>
<body>
"""

    lines = md_text.split("\n")
    in_table = False
    in_pre = False
    
    for line in lines:
        if line.startswith("```"):
            if in_pre:
                html_content += "</pre>\n"
                in_pre = False
            else:
                html_content += "<pre>"
                in_pre = True
            continue
        if in_pre:
            html_content += line + "\n"
            continue

        if line.startswith("# "):
            html_content += f"<h1>{line[2:]}</h1>\n"
        elif line.startswith("## "):
            html_content += f"<h2>{line[3:]}</h2>\n"
        elif line.startswith("### "):
            html_content += f"<h3>{line[4:]}</h3>\n"
        elif line.startswith("#### "):
            html_content += f"<h4>{line[5:]}</h4>\n"
        elif line.startswith("> "):
            html_content += f"<blockquote>{line[2:]}</blockquote>\n"
        elif line.startswith("|"):
            if "---" in line:
                continue
            if not in_table:
                html_content += "<table>\n"
                in_table = True
                cols = [c.strip() for c in line.split("|")[1:-1]]
                html_content += "<tr>" + "".join([f"<th>{c}</th>" for c in cols]) + "</tr>\n"
            else:
                cols = [c.strip() for c in line.split("|")[1:-1]]
                html_content += "<tr>" + "".join([f"<td>{c}</td>" for c in cols]) + "</tr>\n"
        else:
            if in_table:
                html_content += "</table>\n"
                in_table = False
            if line.strip():
                # Format bold and code
                fmt_line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
                fmt_line = re.sub(r'`(.*?)`', r'<code>\1</code>', fmt_line)
                html_content += f"<p>{fmt_line}</p>\n"

    if in_table:
        html_content += "</table>\n"
    if in_pre:
        html_content += "</pre>\n"

    html_content += "</body></html>"

    with open(doc_path, "w", encoding="utf-8") as f:
        f.write(html_content)

markdown_to_html_doc(
    "c:/Users/Nikhil Chandra/OneDrive/Desktop/CIVIC_TWIN_AI_1/CIVICTWIN_REALTIME_DATASET_REPORT.md",
    "c:/Users/Nikhil Chandra/OneDrive/Desktop/CIVIC_TWIN_AI_1/CIVICTWIN_REALTIME_DATASET_REPORT.doc"
)
print("CIVICTWIN_REALTIME_DATASET_REPORT.doc generated successfully!")
