/* ============================================================
   HJEMMESIDENS DATA — nyhedsstream, nyheder og personale
   ============================================================

   DENNE FIL GENERERES AUTOMATISK. Ret normalt IKKE her.

   Indholdet redigeres nemmest ét af to steder:
   1) I laegeplan-programmet under "🌐 Hjemmeside" (formular —
      ingen kode), eller
   2) direkte i assets/content.json her på GitHub (ren tekst).
   Begge dele opdaterer denne fil automatisk.

   Retter du alligevel her i hånden: hold filen i sync med
   assets/content.json, ellers overskrives din ændring næste
   gang der publiceres fra laegeplan.

   HUSK OGSÅ (rettes i index.html — eller bed Claude om det):
   - Tallene på forsiden ("8 faste speciallæger", "4 konsultations-
     sygeplejersker") følger IKKE denne fil automatisk
   ============================================================ */

const SITE_DATA = {
  "ticker": [
    "<strong>Bemærk:</strong> Klinikken er lukket for tilgang af nye patienter (pr. 14.01.2025).",
    "<strong>Husk:</strong> Scan dit sundhedskort ved ankomst — også ved quicktider."
  ],
  "nyheder": [
    {
      "badge": "14",
      "under": "Jan 2025",
      "titel": "Lukket for tilgang af nye patienter",
      "tekst": "Klinikken er pr. 14.01.2025 lukket for tilgang af nye patienter. Vi åbner igen for tilgang, så snart kapaciteten tillader det — følg med her på siden."
    },
    {
      "badge": "✓",
      "under": "Info",
      "titel": "Brug Min Læge-appen",
      "tekst": "Med appen <strong>Min Læge</strong> kan du bestille tid, forny recepter og skrive e-konsultationer — når det passer dig. Hent den i App Store eller Google Play og log på med MitID."
    },
    {
      "badge": "!",
      "under": "Husk",
      "titel": "Husk sundhedskortet",
      "tekst": "Scan dit sundhedskort (eller kort i app) ved ankomst, så vi kan se, at du er kommet. Det gælder også ved quicktider, hvor du tjekker ind hos sekretæren kl. 8.45–9.30."
    },
    {
      "badge": "!",
      "under": "Bemærk",
      "titel": "Ny læge",
      "tekst": "Ida er vores nye læge."
    }
  ],
  "laeger": [
    {
      "navn": "Tine Friis Andersen",
      "rolle": "Speciallæge i almen medicin",
      "info": "Uddannet læge i 1991 · i klinikken siden 2002."
    },
    {
      "navn": "Troels Arent Olesen",
      "rolle": "Speciallæge i almen medicin",
      "info": "Uddannet læge i 2001 · i klinikken siden 2007."
    },
    {
      "navn": "Norman Visby",
      "rolle": "Speciallæge i almen medicin",
      "info": "Uddannet læge i 1999 · i klinikken siden 2009."
    },
    {
      "navn": "Jette Mikkelsen",
      "rolle": "Speciallæge i almen medicin",
      "info": "Uddannet læge i 2002 · i klinikken siden 2011."
    },
    {
      "navn": "Anne Silkjær Møller",
      "rolle": "Speciallæge i almen medicin",
      "info": "Uddannet læge i 2003 · i klinikken siden 2012."
    },
    {
      "navn": "Alena Litskalava Jensen",
      "rolle": "Speciallæge i almen medicin",
      "info": "Uddannet læge i 2006 · i klinikken siden 2013."
    },
    {
      "navn": "Maiken Møller Aasted",
      "rolle": "Speciallæge i almen medicin",
      "info": "Uddannet læge i 2006 · i klinikken siden 2013."
    },
    {
      "navn": "Charlotte Paaskesen",
      "rolle": "Speciallæge i almen medicin",
      "info": "Uddannet læge i 2006 · i klinikken siden 2018."
    },
    {
      "navn": "Ida Bech Rødgaard",
      "rolle": "Vikarierende læge",
      "info": "Uddannet læge i 2015 · vikar i klinikken."
    }
  ],
  "uddannelseslaeger": [
    {
      "navn": "Mikkel Suurballe Lunen",
      "rolle": "Uddannelseslæge",
      "info": "Returdag 1 x i måneden."
    },
    {
      "navn": "Elin Næs Beck",
      "rolle": "Uddannelseslæge",
      "info": "I klinikken pr. 01.06.2026."
    }
  ],
  "sygeplejersker": [
    {
      "navn": "Dorte Ligaard",
      "rolle": "Konsultationssygeplejerske"
    },
    {
      "navn": "Lone Rothausen",
      "rolle": "Konsultationssygeplejerske"
    },
    {
      "navn": "Susanne Harrild Møller",
      "rolle": "Konsultationssygeplejerske"
    },
    {
      "navn": "Mette Sommerfeldt",
      "rolle": "Konsultationssygeplejerske"
    }
  ],
  "bioanalytikere": [
    {
      "navn": "Anna Petersen",
      "rolle": "Bioanalytiker"
    },
    {
      "navn": "Susanne Westland",
      "rolle": "Bioanalytiker"
    }
  ]
};
