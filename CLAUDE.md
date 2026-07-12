# Hedensted Lægehus — hjemmeside

Statisk hjemmeside for Hedensted Lægehus (Årupvej 6, 8722 Hedensted).
Ren HTML/CSS/JS — ingen database, build-trin eller frameworks.
Hostes via GitHub Pages fra `main`-branchen: hvert push til `main` er
live på ca. 1 minut.

## Vigtigste regler

- **Push til `main` = live på hjemmesiden.** Test altid ændringer, før
  der pushes (åbn siderne i en browser — de virker direkte fra disk).
- Sproget er **dansk** — også i commit-beskeder.
- Design-tokens (farver, typografi) ligger øverst i `css/style.css` —
  genbrug dem, opfind ikke nye farver.
- Respektér `prefers-reduced-motion` i alle animationer.
- Læg IKKE interne dokumenter i repoet — det er offentligt.

## Filstruktur

| Fil | Indhold |
|---|---|
| `index.html` | Forside: foto-hero (stetoskop), EKG-animation på ordet "Moderne", genveje, telefontider, nyheder, statistik (tal tæller op), EKG-skillelinjer |
| `konsultation.html` | Tidsbestilling, telefontider, quicktider, video, e-kons |
| `laboratoriet.html` | Blodprøver/EKG — har animeret EKG-kurve i hero (`js/hero-ekg.js`) |
| `personale.html` | Alle medarbejdere; portrætter vises automatisk fra `assets/personale/` (fallback: initialer) |
| `praktisk.html` | Lægevagt, lægevalg, FAQ, links |
| `kontakt.html` | Kontaktinfo, åbningstider, kort |
| `js/data.js` | **Nyhedsstream (topbjælke) + nyheder + hele personalelisten — det primære sted at rette indhold** |
| `css/style.css` | Alt design |
| `js/main.js` | Menu, scroll-effekter, tal-optælling, kort-tilt, tekst-reveal |
| `js/hero-ekg.js` | EKG-animationen på laboratoriesiden (Three.js) |
| `js/vendor/three.min.js` | Three.js, vendored lokalt |
| `assets/fotos/` | Situationsfotos (fotograf: Anders Brohus — krediteret i footer) |
| `assets/personale/LÆSMIG.txt` | Filnavne til personaleportrætter |

## Typiske opgaver

- **Nyheder og personale: RET ALTID i `js/data.js`** — én lille
  datafil med vejledning i toppen, skrevet så ikke-teknikere kan
  rette den. HTML-siderne renderer indholdet automatisk derfra
  (containere med `data-nyheder`/`data-staff`-attributter).
- **Ret åbningstider/telefontider**: findes i `index.html` (info-bar +
  hours-panel), `konsultation.html` (telefonsektion) og `kontakt.html`.
  Ret ALLE steder, så de stemmer overens.
- **Ved ændret personaleantal**: husk også statistikkortene på
  forsiden (`data-count`) og evt. "otte faste læger"-formuleringer —
  de følger IKKE data.js automatisk.
- **Nyhedsstream øverst** (den mørke bjælke, fx "lukket for tilgang"):
  rettes i `ticker`-listen i `js/data.js` — slår igennem på alle sider.
  Flere beskeder skifter automatisk hvert 6. sekund. Teksten, der står
  hardcodet i `<div class="alert-bar" data-ticker>` i HTML-filerne, er
  kun no-JS-fallback — hold den i sync med første ticker-punkt.
- **Personalefotos**: læg kvadratiske jpg-filer i `assets/personale/`
  med navnene fra LÆSMIG.txt — intet andet skal ændres.

## Fakta (pr. juli 2026 — verificér ved tvivl)

Tlf. 75 89 18 11 · CVR 19144011 · Åbent man–fre 8.00–15.00 (akutte
henvendelser på telefon til 16.00) · Lægevagt Region Midtjylland
70 11 31 31 · 8 faste læger, 4 konsultationssygeplejersker,
2 bioanalytikere, fysioterapeut, lægesekretærer og praksismanager.
