# SEO en publicatie voor ANARAH

De publieke voorkeurs-URL is **https://anarah.be/**. Canonical, sociale metadata,
JSON-LD, robots.txt en sitemap.xml gebruiken dit domein. De ChatGPT-Site blijft
een afgeschermde controleversie; publicatie daar werkt de aparte hosting van
anarah.be niet bij.

## Publicatie op anarah.be

1. Bouw met `node scripts/build.mjs` en controleer met `python3 scripts/check-site.py`.
2. Maak een back-up van de bestaande website op de hosting.
3. Plaats de **inhoud** van `dist/` in de documentroot van anarah.be, inclusief
   robots.txt, sitemap.xml, de map html en alle afbeeldingen. Overschrijf ook de
   oude HTML-bestanden aan de root: die bevatten nu directe doorverwijzingen.
4. Configureer waar mogelijk HTTP 301-doorverwijzingen op de webserver volgens
   onderstaande tabel. De meegeleverde HTML-bestanden bevatten al directe
   meta-refresh-fallbacks. Stel www.anarah.be en HTTP in op één HTTPS-domein:
   https://anarah.be, met behoud van pad en querystring.
5. Controleer dat de homepage, robots.txt, sitemap.xml en afbeeldingen zonder
   aanmelden HTTP 200 geven. Verwijder eventuele noindex-headers op de publieke
   hosting. Onbekende URL's horen HTTP 404 te geven.
6. Verifieer het domein in Google Search Console, dien
   https://anarah.be/sitemap.xml in en inspecteer de homepage. Controleer de
   LocalBusiness-gegevens met Google's Rich Results Test.

De 301-doelen zijn gelijk voor `/<naam>.html` en `/html/<naam>.html`:

| Oude paginanaam | Bestemming |
| --- | --- |
| about, wie, i-am, purpose, whats-in-a-name | /#over |
| reiki | /#reiki |
| somatic-dance | /#somatic-dance |
| sessions, investment | /#aanbod |
| events | /#events |
| experiences | /#stories |
| contact | /#contact |
| privacy | /#privacy |

## Onderhoud

- Werk prijzen, telefoonnummer en adres zowel in de zichtbare inhoud als in
  de JSON-LD bij wanneer ze veranderen. Voeg geen verzonnen openingstijden,
  reviewscores of toekomstige events toe.
- Pas de sitemapdatum alleen aan bij inhoudelijke wijzigingen aan de homepage.
- Bewaar de volledige originele afbeeldingen; de 480- en 800-pixelvarianten
  worden via srcset gekozen voor kleinere schermen.
- De onepager heeft één indexeerbare canonical URL; sectieankers zijn geen
  afzonderlijke pagina's in de sitemap.
- De build kopieert uitsluitend websitebestanden. De klant-PDF en oorspronkelijke
  IMG-importbestanden gaan niet mee naar de publieke hosting.

## Richtlijnen

- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/appearance/google-images
