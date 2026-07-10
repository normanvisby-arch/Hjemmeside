# Hedensted Lægehus — hjemmeside

Moderne, statisk hjemmeside for Hedensted Lægehus med interaktivt 3D/WebGL-element
(DNA-helix bygget med Three.js) i hero-sektionen på forsiden.

## Indhold

| Fil | Side |
|---|---|
| `index.html` | Forside med 3D-hero, genveje, telefontider og nyheder |
| `konsultation.html` | Tidsbestilling, telefon-, quick-, video- og e-konsultation |
| `laboratoriet.html` | Blodprøver og EKG — i huset og på Horsens/Vejle Sygehus |
| `personale.html` | Læger, sygeplejersker, sekretærer og øvrigt personale |
| `praktisk.html` | Lægevagt, lægevalg, sundhedskort, FAQ og links |
| `kontakt.html` | Kontaktoplysninger, telefontider, kort og transport |
| `css/style.css` | Alt design (farver, typografi, komponenter) |
| `js/hero.js` | 3D/WebGL-scenen på forsiden |
| `js/main.js` | Menu, aktiv navigation og scroll-animationer |
| `js/vendor/three.module.min.js` | Three.js (lokalt — ingen CDN-afhængighed) |

## Upload til leverandør (fx Clinea)

Siden er 100 % statisk — der kræves ingen database, PHP eller build-trin:

1. Upload **alle filer og mapper** (bevar mappestrukturen) til webhotellets rod
   (typisk `public_html/`, `www/` eller `httpdocs/`) via FTP/SFTP eller
   leverandørens filhåndtering.
2. Sørg for, at `index.html` ligger i roden — så virker forsiden med det samme.
3. Færdig. Ingen yderligere opsætning.

> **Bemærk:** 3D-elementet falder automatisk tilbage til en flot gradient,
> hvis browseren ikke understøtter WebGL, og respekterer »reducér bevægelse«
> i brugerens systemindstillinger.

## Redigering af indhold

- **Telefontider/åbningstider:** ret i `index.html` (sektionen `#aabningstider`),
  `konsultation.html` og `kontakt.html`.
- **Nyheder:** tilføj/ret `<article class="news-item">`-blokke i `index.html`.
- **Personale:** ret kortene i `personale.html`.
- **Banner øverst** (fx »lukket for tilgang«): ret `<div class="alert-bar">`
  øverst i hver side — eller slet den helt.
- **Farver:** justér CSS-variablerne øverst i `css/style.css`.

## Personalefotos

Personalesiden er forberedt til fotos: Læg portrætter i `assets/personale/`
med de filnavne, der står i `assets/personale/LÆSMIG.txt` (fx
`norman-visby.jpg`) — så vises de automatisk. Mangler et foto, vises
personens initialer i stedet. Kvadratiske billeder på mindst 400 × 400 px
anbefales; de beskæres automatisk til cirkler.

## Inden lancering — tjekliste

- [ ] Verificér telefontider, åbningstider og personale­liste mod klinikkens aktuelle oplysninger.
- [ ] Læg personalefotos i `assets/personale/` (se ovenfor).
- [ ] Bekræft, at »lukket for tilgang af nye patienter« stadig er gældende.
- [ ] Peg selvbetjeningsknappen på jeres foretrukne patientportal, hvis den er en anden end Min Læge (`minlaege.dk`).
