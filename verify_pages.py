#!/usr/bin/env python3
"""Verify formula pages render correctly via local server."""
import urllib.request
import re

pages = [
    ('/', 'Medicalcul', 'Home'),
    ('/orl', 'ORL', 'Specialty'),
    ('/orl/hints', 'HINTS', 'HINTS'),
    ('/orl/house-brackmann', 'House', 'House & Brackmann'),
    ('/orl/centor', 'Centor', 'Centor'),
    ('/orl/westley', 'Westley', 'Westley'),
    ('/orl/feverpain', 'FeverPAIN', 'FeverPAIN'),
    ('/orl/stop-bang', 'STOP-BANG', 'STOP-BANG'),
    ('/orl/berlin', 'Berlin', 'Berlin'),
    ('/orl/paradise', 'Paradise', 'Paradise'),
    ('/orl/sudbury-vertigo', 'Sudbury', 'Sudbury'),
    ('/orl/le-fort', 'Le Fort', 'Le Fort'),
]

all_ok = True
for path, name, keyword in pages:
    url = f'http://localhost:3457{path}'
    try:
        resp = urllib.request.urlopen(url)
        html = resp.read().decode('utf-8')
        status = resp.status
        has_keyword = keyword.lower() in html.lower()
        size = len(html)
        status_icon = '✓' if (status == 200 and has_keyword) else '✗'
        if status != 200 or not has_keyword:
            all_ok = False
        print(f"  {status_icon} {name:25s} status={status} size={size:>7} keyword=\"{keyword}\": {'found' if has_keyword else 'MISSING'}")
    except Exception as e:
        all_ok = False
        print(f"  ✗ {name:25s} ERROR: {e}")

print(f"\n{'All OK' if all_ok else 'SOME FAILED'}")
