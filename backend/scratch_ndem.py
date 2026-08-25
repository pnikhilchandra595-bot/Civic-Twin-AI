import urllib.request
import re

req = urllib.request.Request('https://ndem.nrsc.gov.in/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req, timeout=10)
    html = resp.read().decode('utf-8', errors='ignore')
    titles = re.findall(r'<title>(.*?)</title>', html, re.I)
    print('NDEM Portal Title:', titles)
    
    scripts = re.findall(r'src=["\'](.*?)["\']', html)
    print('Scripts found in NDEM portal:', scripts[:8])
    
    forms = re.findall(r'<form[\s\S]*?</form>', html, re.I)
    print('Forms in NDEM:', len(forms))
    if forms:
        print('Sample Form HTML:', forms[0][:400])
except Exception as e:
    print('Error accessing NDEM:', e)
