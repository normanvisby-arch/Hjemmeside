/* ============================================================
   HJEMMESIDENS DATA — nyheder og personale
   ============================================================

   DENNE FIL ER LAVET TIL AT BLIVE RETTET AF ALLE — også uden
   teknisk erfaring. Sådan gør du:

   1. Åbn filen på github.com og klik på blyanten (Edit)
   2. Ret teksten mellem anførselstegnene "..."
   3. Klik på den grønne "Commit changes"-knap
   4. Ændringen er live på hjemmesiden ca. 1 minut senere

   REGLER:
   - Rør ikke ved anførselstegn, kommaer og klammer { } [ ]
   - En ny person/nyhed: kopiér en hel blok fra { til }, (inkl.
     kommaet) og ret indholdet
   - Slet en person/nyhed: slet hele blokken fra { til og med },
   - Fotos: personens foto vises automatisk, hvis der ligger en
     fil i assets/personale/ med navnet fra LÆSMIG.txt — ellers
     vises initialer

   HUSK OGSÅ (rettes i index.html — eller bed Claude om det):
   - Tallene på forsiden ("8 faste speciallæger", "4 konsultations-
     sygeplejersker") følger IKKE denne fil automatisk
   ============================================================ */

const SITE_DATA = {

  /* ---------- NYHEDER (vises på forsiden, nyeste øverst) ----------
     badge   = det store i den lille boks (fx en dato-dag eller ✓)
     under   = den lille tekst under badge (fx måned/år)          */
  nyheder: [
    {
      badge: "14",
      under: "Jan 2025",
      titel: "Lukket for tilgang af nye patienter",
      tekst: "Klinikken er pr. 14.01.2025 lukket for tilgang af nye patienter. Vi åbner igen for tilgang, så snart kapaciteten tillader det — følg med her på siden.",
    },
    {
      badge: "✓",
      under: "Info",
      titel: "Brug Min Læge-appen",
      tekst: "Med appen <strong>Min Læge</strong> kan du bestille tid, forny recepter og skrive e-konsultationer — når det passer dig. Hent den i App Store eller Google Play og log på med MitID.",
    },
    {
      badge: "!",
      under: "Husk",
      titel: "Husk sundhedskortet",
      tekst: "Scan dit sundhedskort (eller kort i app) ved ankomst, så vi kan se, at du er kommet. Det gælder også ved quicktider, hvor du tjekker ind hos sekretæren kl. 8.45–9.30.",
    },
  ],

  /* ---------- LÆGERNE ---------- */
  laeger: [
    { navn: "Tine Friis Andersen", rolle: "Speciallæge i almen medicin", info: "Uddannet læge i 1991 · i klinikken siden 2002." },
    { navn: "Troels Arent Olesen", rolle: "Speciallæge i almen medicin", info: "Uddannet læge i 2001 · i klinikken siden 2007." },
    { navn: "Norman Visby", rolle: "Speciallæge i almen medicin", info: "Uddannet læge i 1999 · i klinikken siden 2009." },
    { navn: "Jette Mikkelsen", rolle: "Speciallæge i almen medicin", info: "Uddannet læge i 2002 · i klinikken siden 2011." },
    { navn: "Anne Silkjær Møller", rolle: "Speciallæge i almen medicin", info: "Uddannet læge i 2003 · i klinikken siden 2012." },
    { navn: "Alena Litskalava Jensen", rolle: "Speciallæge i almen medicin", info: "Uddannet læge i 2006 · i klinikken siden 2013." },
    { navn: "Maiken Møller Aasted", rolle: "Speciallæge i almen medicin", info: "Uddannet læge i 2006 · i klinikken siden 2013." },
    { navn: "Charlotte Paaskesen", rolle: "Speciallæge i almen medicin", info: "Uddannet læge i 2006 · i klinikken siden 2018." },
    { navn: "Ida Bech Rødgaard", rolle: "Vikarierende læge", info: "Uddannet læge i 2015 · vikar i klinikken." },
  ],

  /* ---------- UDDANNELSESLÆGER ---------- */
  uddannelseslaeger: [
    { navn: "Mikkel Suurballe Lunen", rolle: "Uddannelseslæge", info: "Returdag 1 x i måneden." },
    { navn: "Elin Næs Beck", rolle: "Uddannelseslæge", info: "I klinikken pr. 01.06.2026." },
  ],

  /* ---------- KONSULTATIONSSYGEPLEJERSKER ---------- */
  sygeplejersker: [
    { navn: "Dorte Ligaard", rolle: "Konsultationssygeplejerske" },
    { navn: "Lone Rothausen", rolle: "Konsultationssygeplejerske" },
    { navn: "Susanne Harrild Møller", rolle: "Konsultationssygeplejerske" },
    { navn: "Mette Sommerfeldt", rolle: "Konsultationssygeplejerske" },
  ],

  /* ---------- BIOANALYTIKERE ---------- */
  bioanalytikere: [
    { navn: "Anna Petersen", rolle: "Bioanalytiker" },
    { navn: "Susanne Westland", rolle: "Bioanalytiker" },
  ],

};
