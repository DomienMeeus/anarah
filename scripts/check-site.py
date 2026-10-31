"""Check the built static site's SEO and deployment integrity with the stdlib."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree

root = Path(__file__).resolve().parent.parent / 'dist'
origin = 'https://anarah.be/'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

home = (root / 'index.html').read_text()
page = Page(home)
ids = [a['id'] for _, a in page.tags if 'id' in a]
assert len(ids) == len(set(ids)), 'Duplicate homepage IDs'
assert sum(t == 'h1' for t, _ in page.tags) == 1, 'Exactly one H1 required'
assert any(t == 'meta' and a.get('name') == 'description' and a.get('content') for t, a in page.tags)

# JSON-LD must parse and describe real visible business details.
import re
schema = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', home, re.S)[1])
business = next(n for n in schema['@graph'] if n['@type'] == 'LocalBusiness')
assert business['url'] == origin
assert business['address']['streetAddress'] in home
assert business['email'] in home and business['telephone'] in home
assert 'aggregateRating' not in business

files = list(root.rglob('*.html'))
for path in files:
    parsed = Page(path.read_text())
    canonicals = [a['href'] for t, a in parsed.tags if t == 'link' and a.get('rel') == 'canonical']
    assert canonicals == [origin], (path, canonicals)
    for tag, attrs in parsed.tags:
        refs = [attrs[k] for k in ('src', 'href') if k in attrs]
        if 'srcset' in attrs:
            refs += [candidate.strip().split()[0] for candidate in attrs['srcset'].split(',')]
        if tag == 'img':
            assert attrs.get('alt') and int(attrs['width']) > 0 and int(attrs['height']) > 0
        for ref in refs:
            url = urlsplit(ref)
            if url.scheme and url.scheme not in ('http', 'https'):
                continue
            if url.netloc and url.netloc != 'anarah.be':
                continue
            target = root / unquote(url.path).lstrip('/') if url.path.startswith('/') or url.netloc else path.parent / unquote(url.path)
            if not url.path or url.path == '/':
                target = root / 'index.html' if url.path == '/' or url.netloc else path
            assert target.is_file(), (path, ref, 'Missing asset or page')
            if url.fragment:
                assert url.fragment in ids, (path, ref, 'Missing anchor')
    for tag, attrs in parsed.tags:
        if tag == 'meta' and attrs.get('http-equiv') == 'refresh':
            dest = attrs['content'].split('url=', 1)[1]
            assert dest.startswith('/#') and dest[2:] in ids, (path, 'Chained or broken redirect')

locs = ElementTree.parse(root / 'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
assert [node.text for node in locs] == [origin]
assert 'Sitemap: ' + origin + 'sitemap.xml' in (root / 'robots.txt').read_text()
assert not list(root.rglob('*.pdf')), 'Private reference PDF in build'
assert (root / 'reiki.html').is_file() and (root / 'investment.html').is_file()
print(f'Passed: {len(files)} HTML routes, canonical URLs, local links, responsive assets, JSON-LD, sitemap and robots.txt.')
