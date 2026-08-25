import urllib.request
import re

req = urllib.request.Request('https://ndem.nrsc.gov.in/main.72a59f2a90e8f080.js', headers={'User-Agent': 'Mozilla/5.0'})
try:
    data = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
    print('Main JS bundle size:', len(data))
    
    urls = set(re.findall(r'https?://[a-zA-Z0-9.-]+/[a-zA-Z0-9._/-]+', data))
    print('\n--- URLs Referenced in NDEM App ---')
    for u in sorted(urls):
        if 'nrsc' in u or 'bhuvan' in u or 'isro' in u or 'ndem' in u:
            print('  ', u)
            
    endpoints = set(re.findall(r'["\'](/api/[a-zA-Z0-9._/-]+)["\']', data))
    print('\n--- API Routes Found ---')
    for ep in sorted(endpoints):
        print('  ', ep)
except Exception as e:
    print('Error:', e)
