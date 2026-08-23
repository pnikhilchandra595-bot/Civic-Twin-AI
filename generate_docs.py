import os
import re

def convert_md_to_doc(md_path: str, doc_path: str, doc_title: str):
    if not os.path.exists(md_path):
        print(f"File not found: {md_path}")
        return

    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()

    css_style = """
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.6; padding: 24px; background-color: #ffffff; }
    h1 { font-size: 20pt; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; }
    h2 { font-size: 14pt; color: #0369a1; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; margin-bottom: 10px; }
    h3 { font-size: 12pt; color: #334155; margin-top: 14px; margin-bottom: 8px; }
    h4 { font-size: 11pt; color: #475569; margin-top: 12px; margin-bottom: 6px; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 10pt; }
    th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    td { border: 1px solid #e2e8f0; padding: 7px 10px; }
    tr:nth-child(even) { background-color: #f8fafc; }
    code { font-family: 'Consolas', 'Courier New', monospace; background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; color: #0f766e; }
    pre { background-color: #0f172a; color: #f8fafc; padding: 14px; border-radius: 6px; font-family: 'Consolas', monospace; font-size: 9.5pt; overflow-x: auto; }
    blockquote { border-left: 4px solid #0284c7; padding-left: 12px; color: #475569; font-style: italic; margin: 12px 0; background-color: #f0f9ff; padding: 8px 12px; }
    hr { border: 0; height: 1px; background: #e2e8f0; margin: 20px 0; }
    p { margin-bottom: 10px; }
    ul, ol { margin-left: 20px; margin-bottom: 10px; }
    li { margin-bottom: 4px; }
    """

    html_parts = [
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>",
        f"<head><meta charset='utf-8'><title>{doc_title}</title><style>{css_style}</style></head>",
        "<body>"
    ]

    in_pre = False
    in_table = False
    table_header_done = False

    for line in content.split("\n"):
        if line.startswith("```"):
            if in_pre:
                html_parts.append("</pre>")
                in_pre = False
            else:
                html_parts.append("<pre>")
                in_pre = True
            continue

        if in_pre:
            html_parts.append(line)
            continue

        if line.startswith("# "):
            html_parts.append(f"<h1>{line[2:]}</h1>")
        elif line.startswith("## "):
            html_parts.append(f"<h2>{line[3:]}</h2>")
        elif line.startswith("### "):
            html_parts.append(f"<h3>{line[4:]}</h3>")
        elif line.startswith("#### "):
            html_parts.append(f"<h4>{line[5:]}</h4>")
        elif line.startswith("> "):
            html_parts.append(f"<blockquote>{line[2:]}</blockquote>")
        elif line.strip() == "---":
            html_parts.append("<hr/>")
        elif line.startswith("|"):
            if "---" in line:
                table_header_done = True
                continue
            if not in_table:
                html_parts.append("<table>")
                in_table = True
                table_header_done = False
            cols = [c.strip() for c in line.split("|")[1:-1]]
            tag = "td" if table_header_done else "th"
            row_html = "".join(f"<{tag}>{c}</{tag}>" for c in cols)
            html_parts.append(f"<tr>{row_html}</tr>")
        else:
            if in_table:
                html_parts.append("</table>")
                in_table = False
                table_header_done = False
            if line.strip():
                # Convert bold and code snippets
                formatted = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
                formatted = re.sub(r'`(.*?)`', r'<code>\1</code>', formatted)
                if formatted.startswith("- "):
                    html_parts.append(f"<ul><li>{formatted[2:]}</li></ul>")
                elif re.match(r'^\d+\.\s', formatted):
                    html_parts.append(f"<ol><li>{re.sub(r'^\d+\.\s', '', formatted)}</li></ol>")
                else:
                    html_parts.append(f"<p>{formatted}</p>")

    if in_table:
        html_parts.append("</table>")
    if in_pre:
        html_parts.append("</pre>")

    html_parts.append("</body></html>")

    with open(doc_path, "w", encoding="utf-8") as f:
        f.write("\n".join(html_parts))

    print(f"Generated DOC: {doc_path}")

if __name__ == "__main__":
    docs_dir = os.path.join(os.path.dirname(__file__), "docs")
    os.makedirs(docs_dir, exist_ok=True)
    convert_md_to_doc(os.path.join(docs_dir, "PROJECT_OVERVIEW.md"), os.path.join(docs_dir, "CIVICTWIN_PROJECT_OVERVIEW.doc"), "CivicTwin AI - Project Overview")
    convert_md_to_doc(os.path.join(docs_dir, "SYSTEM_DESIGN_DOCUMENT.md"), os.path.join(docs_dir, "CIVICTWIN_SYSTEM_DESIGN_DOCUMENT.doc"), "CivicTwin AI - System Design Document")
    convert_md_to_doc(os.path.join(docs_dir, "REQUIREMENTS_SPECIFICATION.md"), os.path.join(docs_dir, "CIVICTWIN_REQUIREMENTS_SPECIFICATION.doc"), "CivicTwin AI - Requirements Specification")
