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
    "<strong>Husk:</strong> Scan dit sundhedskort ved ankomst — også ved quicktider.",
    "Dette er en test. Vi kan redigere hjemmesiden"
  ],
  "nyheder": [
    {
      "badge": "1",
      "under": "Sep 2026",
      "titel": "Ny læge og kompagnon",
      "tekst": "Ida bliver vores nye kompagnon."
    },
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
  ],
  "kontakt": {
    "adresse": "Årupvej 6",
    "postnr_by": "8722 Hedensted",
    "telefon": "75 89 18 11",
    "laegevagt": "70 11 31 31",
    "cvr": "19144011"
  },
  "aabningstekst": "Man–fre kl. 8.00–15.00",
  "telefontider": [
    {
      "tid": "8.00–9.00",
      "tekst": "Kun henvendelser om <strong>sygdom, der kræver lægekontakt samme dag</strong>, samt anmodning om sygebesøg."
    },
    {
      "tid": "9.00–14.00",
      "tekst": "Lægesekretæren besvarer opkald, tager imod tidsbestillinger og øvrige henvendelser."
    },
    {
      "tid": "14.00–16.00",
      "tekst": "Ved <strong>akutte henvendelser</strong> træffes sekretæren på 75 89 18 11."
    },
    {
      "tid": "Efter 16.00",
      "tekst": "Kontakt Lægevagten i Region Midtjylland på <strong>70 11 31 31</strong>. Ved livsfare: ring 112."
    }
  ],
  "faq": [
    {
      "sp": "Hvornår skal jeg bruge en quicktid?",
      "svar": "Quicktiden er til én kort og ukompliceret problemstilling. Tjek ind hos sekretæren mellem kl. 8.45 og 9.30 — så bliver du set af en læge eller sygeplejerske. Quicktider kan ikke bruges til attester, kontroller eller psykiske problemstillinger."
    },
    {
      "sp": "Hvordan fornyer jeg min recept?",
      "svar": "Fast medicin fornyes nemmest i Min Læge-appen eller via patientportalen. Medicin, der udleveres via en sygehusafdeling, skal fornyes gennem sygehuset."
    },
    {
      "sp": "Hvad kan jeg bruge e-konsultationen til?",
      "svar": "Korte, konkrete beskeder, der ikke haster — fx afbud eller spørgsmål om receptfornyelse. E-konsultationen kan ikke bruges til tidsbestilling eller akutte henvendelser."
    },
    {
      "sp": "Hvordan får jeg svar på mine prøver?",
      "svar": "Du kan se dine prøvesvar på sundhed.dk og i Min Læge-appen. Du er også velkommen til at ringe på hverdage kl. 9.00–14.00. Ved svar, der kræver handling, kontakter vi dig."
    },
    {
      "sp": "Kan jeg få taget blodprøver uden at komme til Hedensted?",
      "svar": "Ja — hvis lægen har bestilt prøverne, kan du få dem taget i blodprøveambulatoriet på Horsens eller Vejle Sygehus. Læs mere under <a href=\"laboratoriet.html\">Laboratoriet</a>."
    },
    {
      "sp": "Hvad gør jeg, hvis jeg bliver akut syg?",
      "svar": "På hverdage kl. 8.00–9.00 ringer du til os på 75 89 18 11 ved sygdom, der kræver lægekontakt samme dag. Kl. 14.00–16.00 træffes sekretæren på samme nummer ved akutte henvendelser. Efter kl. 16.00 kontakter du lægevagten på 70 11 31 31 — og ved livsfare ringer du altid 112."
    }
  ],
  "tekster": {
    "forside_hero_lede": "Vi er et lægehus med otte faste læger, erfarne sygeplejersker og eget laboratorium. Vores vision er at drive en moderne lægepraksis med et højt sundhedsfagligt niveau — og med tid til dig.",
    "forside_om_1": "Hedensted Lægehus har eksisteret siden 1967 og er i dag et af områdets store lægehuse med <strong>otte faste læger</strong>, konsultationssygeplejersker, bioanalytikere, lægesekretærer, fysioterapeut og praksismanager — i alt over 20 medarbejdere.",
    "forside_om_2": "Vi lægger vægt på kontinuitet, faglighed og et trygt forløb: du møder så vidt muligt din egen læge, og vi arbejder tæt sammen på tværs af faggrupper.",
    "konsultation_hero_lede": "Vælg den konsultationsform, der passer til dit behov — fysisk fremmøde, quicktid, telefon, video eller en skriftlig besked.",
    "laboratoriet_hero_lede": "Vores eget laboratorium tager blodprøver og EKG med faste tider, så du hurtigt kan komme videre med din dag.",
    "personale_hero_lede": "Otte faste læger, konsultationssygeplejersker, bioanalytikere, lægesekretærer, fysioterapeut og praksismanager — vi arbejder tæt sammen om din behandling.",
    "praktisk_hero_lede": "Alt det praktiske — fra lægevagt og lægevalg til sundhedskort og nyttige links.",
    "kontakt_hero_lede": "Vi holder til på Årupvej 6 i Hedensted — tæt på byen og med gode transportmuligheder.",
    "patientinfo_hero_lede": "Priser, regler og praktiske oplysninger — fra attester og vaccinationer til recepter, prøver og meget mere."
  },
  "links": {
    "selvbetjening": "https://patientportal.egclinea.com/?id=671",
    "minlaege": "https://minlaegeapp.dk"
  },
  "patientinfo": [
    {
      "titel": "Afhængighedsskabende lægemidler",
      "tekst": "<p>(Beroligende medicin og stærkt smertestillende.) I Hedensted Lægehus henholder vi os til Sundhedsstyrelsens retningslinjer. Derfor er det kun muligt at få fornyet recepter på potentielt afhængighedsskabende medicin ved fremmøde i klinikken.</p><p>Der skal desuden afholdes en eller to kontroller årligt, hvor den fremtidige behandling drøftes. Bestil gerne tid til dette via <strong>Min Læge</strong>-appen eller Tidsbestilling på forsiden.</p><p>I Sundhedsstyrelsens retningslinjer inden for området er følgende anført:</p><p><em>«Ordination og fornyelse af recepter på afhængighedsskabende lægemidler skal, medmindre særlige omstændigheder taler herfor, ske ved personlig konsultation, således at læge og patient har mulighed for at drøfte behandlingen og risikoen for afhængighed af midlerne. Konsultationen må ikke finde sted over internettet eller per telefon.»</em></p>"
    },
    {
      "titel": "Attester og erklæringer — priser",
      "tekst": "<p>Priser på attester og erklæringer (alle priser er inkl. moms):</p><ul><li>Kørekortsattest* — 500,00 kr.</li><li>Ansøgning om enkelttilskud — 250,00 kr.</li><li>Mulighedserklæring — 750,00 kr.</li><li>Sygemelding betalt af arbejdsgiver — 1.070,00 kr.</li><li>Kort frihåndsattest betalt af patienten — 500,00 kr.</li><li>Bokserattest — 1.235,00 kr.</li></ul><p>*Kørekortsattesten er overgået til en digital løsning. Du bedes derfor udfylde Del A på forhånd. Del A skal være udfyldt senest dagen før din tid i klinikken.</p><p>Attester uden aftalte takster mellem lægeforeningen og rekvirent faktureres med honorar efter tidsforbrug med 500 kr. pr. påbegyndt 15 min. inkl. forberedelse. Administrationsgebyr ved udskrift af journalmateriale afregnes ligeledes efter tidsforbrug.</p>"
    },
    {
      "titel": "Blodprøver på Horsens og Vejle Sygehus",
      "tekst": "<p>Følg nedenstående links for tidsbestilling på sygehuslaboratorierne. Vær opmærksom på, at lægen eller den rekvirerende sygehusafdeling skal have lagt blodprøverne ud på serveren, før du kan booke en tid.</p><ul><li><a href=\"https://www.regionshospitalet-horsens.dk/afdelinger/blodprover-og-biokemi/\" target=\"_blank\" rel=\"noopener\">Horsens Sygehus — book blodprøve</a></li><li><a href=\"https://booking.rsyd.dk/mineaftaler\" target=\"_blank\" rel=\"noopener\">Vejle Sygehus — book blodprøve</a></li></ul><p><strong>OBS:</strong> Region Midt vedtog pr. 01.07.2016 besparelser på laboratorieområdet i lægepraksis. Det betyder, at det ikke længere er muligt at komme i Laboratoriet i Hedensted Lægehus, hvis du skal have taget blodprøver og/eller EKG, der er bestilt til en sygehusafdeling. Der kan fortsat bestilles tid til blodprøver mv. til speciallæger.</p><p>Ønsker du at klage over ordningen eller har spørgsmål, kan du skrive til <a href=\"mailto:naere.sundhedstilbud@rm.dk\">naere.sundhedstilbud@rm.dk</a>.</p>"
    },
    {
      "titel": "Brug af tolk",
      "tekst": "<p>En lovændring pr. 1. juli 2018 betyder, at borgere, som har boet mere end 3 år i Danmark, skal betale for brug af tolk i sundhedsvæsenet. Tolkningen er gratis, hvis du har boet i Danmark i mindre end 3 år.</p><p>Skal du betale for tolkningen, får du tilsendt en regning fra din bopælsregion — i din e-Boks eller med almindelig brevpost.</p><p>Læs mere på <a href=\"https://www.sundhed.dk/borger/patientrettigheder/tilskud-stoettemuligheder/tolkebistand/\" target=\"_blank\" rel=\"noopener\">sundhed.dk om tolkebistand</a>.</p>"
    },
    {
      "titel": "Børnevaccination",
      "tekst": "<p>Der skal bestilles en fast konsultationstid til børnevaccination — se nedenfor, om det skal være ved læge eller sygeplejerske.</p><p><strong>Børnevaccinationsprogrammet</strong></p><ul><li>3 måneder: Di-Te-Ki-Pol-Hib + Pneumokok — bestil tid ved sygeplejerske</li><li>5 måneder: Di-Te-Ki-Pol-Hib + Pneumokok — bestil tid ved læge</li><li>12 måneder: Di-Te-Ki-Pol-Hib + Pneumokok — bestil tid ved læge</li><li>15 måneder: MFR 1 — bestil tid ved sygeplejerske</li><li>4 år: MFR 2 — bestil tid ved sygeplejerske</li><li>5 år: Di-Te-Ki-Pol revaccination — bestil tid ved læge</li></ul><p><strong>HPV-vaccination</strong> (mod livmoderhalskræft, analkræft og kønsvorter):</p><ul><li>Piger og drenge fra 12 til og med 14 år: to vaccinationer med mindst 5 måneders interval.</li><li>Piger og drenge fra 15 til og med 17 år: tre vaccinationer — 2. vaccine efter 2 måneder og 3. vaccine efter 6 måneder.</li></ul><p>Vi henviser desuden til <a href=\"https://www.sst.dk\" target=\"_blank\" rel=\"noopener\">Sundhedsstyrelsens hjemmeside</a> og deres pjece om Børnevaccinationsprogrammet.</p>"
    },
    {
      "titel": "Graviditet",
      "tekst": "<p>Sundhedsstyrelsen anbefaler 3 graviditetsundersøgelser hos egen læge:</p><ul><li>Uge 8–10</li><li>Uge 25</li><li>Uge 32</li></ul><p>Husk at bestille tid til disse undersøgelser — gerne i god tid.</p><p>Sundhedsstyrelsen har udviklet appen <strong>«Gravid»</strong>, som du kan bruge som vejledning og inspiration. Se desuden pjecen «Sunde vaner før, under og efter graviditet» (findes på flere sprog) på <a href=\"https://www.sst.dk\" target=\"_blank\" rel=\"noopener\">sst.dk</a>.</p>"
    },
    {
      "titel": "Husk sundhedskortet / app'en",
      "tekst": "<p>Sundhedskortet (tidligere sygesikringsbeviset) er dit personlige «adgangskort» til den offentlige sygesikrings ydelser. Det er et vigtigt dokument, der skal medbringes ved alle henvendelser i klinikken.</p><p>Ved ankomst registrerer du dig med dit sundhedskort i ankomststanderen. Er kortet defekt, skal du bestille et nyt via Borgerservice inden næste konsultation.</p><p><strong>App'en Sundhedskortet:</strong> Siden 1. juni 2021 findes appen «Sundhedskortet». Du kan med fordel oprette dig selv og dine børn på den og altid have kortene med dig. Find den i din app-store og læs mere på <a href=\"https://www.borger.dk\" target=\"_blank\" rel=\"noopener\">borger.dk</a>.</p>"
    },
    {
      "titel": "Lungefunktionsundersøgelse",
      "tekst": "<p>Vigtig information forud for undersøgelsen.</p><p><strong>Lungefunktionsundersøgelse:</strong> Formålet er at vurdere lungernes størrelse og funktion. Undersøgelsen varer cirka 15 minutter.</p><p><strong>Lungefunktionsundersøgelse med medicintest:</strong> Formålet er at vurdere lungernes funktion og størrelse samt effekten af luftvejsudvidende medicin. Undersøgelsen varer cirka 45 minutter.</p>"
    },
    {
      "titel": "Cookiepolitik",
      "tekst": "<p>Denne hjemmeside er en enkel, statisk side og bruger <strong>ingen cookies</strong> til statistik, markedsføring eller sporing. Der placeres ingen cookies, der kræver dit samtykke, og siden indsamler ikke personoplysninger om dig.</p>"
    },
    {
      "titel": "Min Læge-app",
      "tekst": "<p>Vi anbefaler, at du downloader <strong>Min Læge</strong>-appen. Ud over videokonsultation kan du bruge appen til e-konsultation, receptfornyelse og tidsbestilling.</p><p><strong>E-konsultation</strong> er egnet til korte, præcise spørgsmål, der ikke kræver længere udredning — fx svar på prøver eller undersøgelser. Har du brug for et mere uddybende svar, så bestil en fast tid i klinikken. E-konsultation må <strong>ikke</strong> bruges til akutte henvendelser (der kan være nogle dages svartid) eller til medicin- og tidsbestilling, som har egne moduler. Er din læge på kursus eller ferie, lukkes der for e-konsultationen; den åbnes igen, når lægen er tilbage.</p><p><strong>Receptfornyelse:</strong> Undgå telefonkøen ved at forny din faste medicin i dette modul. Der kan være et par dages ekspeditionstid, så bestil i god tid — men ikke for tidligt, da anmodninger kan blive afvist. Hold øje med, at du får en bekræftelse. Er dine faste ordinationer ikke tilgængelige, så kontakt sekretæren. Vanedannende medicin skal fornyes ved fremmøde (husk årlig kontrol ved din faste læge). Er medicinen ordineret på en sygehusafdeling, skal du kontakte afdelingen.</p><p><strong>Tidsbestilling:</strong> Bestil tid ved læge, sygeplejerske eller bioanalytiker, og beskriv kort, hvad det drejer sig om. Brug ikke dit eget cpr-nr. til at bestille tid til dine børn — kontakt sekretæren for at oprette børnene til e-service. De fleste årskontroller ved egen læge skal forudgås af en tid hos sygeplejersken (book gerne mindst 1 uge før lægetiden). Ved kørekortsattest: mød 10 minutter før din tid, så du kan nå at udfylde spørgeskema og betale. Bestil <strong>ikke</strong> lægeerklæringer, attester eller akutte konsultationer via tidsbestillingsmodulet — ring i stedet i telefontiden på <a href=\"tel:75891811\">75 89 18 11</a>.</p>"
    },
    {
      "titel": "Rejsevaccination",
      "tekst": "<p>Vi tilbyder rådgivning og vaccinationer i forbindelse med udlandsrejser ved vores sygeplejersker. Bestil tid hos sekretæren på <a href=\"tel:75891811\">75 89 18 11</a>.</p><p>Det er vigtigt, at du bestiller tid i god tid, så sygeplejersken kan tilrettelægge et vaccinationsprogram tilpasset din rejse — de fleste vaccinationer skal gives med måneders interval.</p><p><strong>Vaccinationspriser</strong></p><ul><li>Hepatitis A+B, Twinrix (x3) — 16 år og op: 900 kr./stk.</li><li>Hepatitis A+B, Twinrix (x3) — børn 0–15 år: 600 kr./stk.</li><li>Hepatitis A+B, Ambrix (x2) — børn 0–15 år: 700 kr./stk.</li><li>Havrix, Hepatitis A (x2) — 16 år og op: 725 kr./stk.</li><li>Havrix, Hepatitis A (x2) — børn 0–15 år: 615 kr./stk.</li><li>Engerix, Hepatitis B (x3) — 16 år og op: 660 kr./stk.</li><li>Engerix, Hepatitis B (x3) — børn 0–15 år: 575 kr./stk.</li><li>Japansk Encephalit (x2): 1.350 kr./stk.</li><li>Typhim (tyfus): 550 kr./stk.</li><li>Gul feber: 625 kr./stk.</li><li>Meningococ: 900 kr./stk.</li><li>Rabies (x2): 975 kr./stk.</li><li>TBE (skovflåt, x3) — 16 år og op: 625 kr./stk.</li><li>TBE (x3) — børn 0–15 år: 585 kr./stk.</li><li>Di-Te (ved udlandsrejse): 425 kr./stk.</li><li>Pneumovax: 600 kr./stk.</li><li>Polio: 400 kr./stk.</li><li>Varicella (skoldkopper): 850 kr./stk.</li><li>Dukoral (kolera): 900 kr. for 2 stk.</li><li>Recept på fx malaria (inkl. konsultation): 400 kr.</li></ul><p>Vi anlægger ikke Mantoux i forbindelse med udlandsrejse; her henviser vi til Lungeambulatoriet, Aarhus Universitetshospital (hverdage 08.15–14.00, tlf. 78 46 20 89). Se desuden <a href=\"https://www.ssi.dk\" target=\"_blank\" rel=\"noopener\">Statens Serum Institut</a>.</p>"
    },
    {
      "titel": "Medicinsk cannabis",
      "tekst": "<p>De praktiserende lægers fagvidenskabelige selskab, Dansk Selskab for Almen Medicin (DSAM), har af hensyn til patienternes sikkerhed frarådet praktiserende læger at udskrive medicinsk cannabis.</p>"
    },
    {
      "titel": "Patientdataforordning",
      "tekst": "<p>Fra den 25. maj 2018 gælder databeskyttelsesforordningen (GDPR) for brug af personlige oplysninger. Du kan læse mere om dine patientrettigheder og behandlingen af persondata på <a href=\"https://www.sundhed.dk\" target=\"_blank\" rel=\"noopener\">sundhed.dk</a>.</p>"
    }
  ]
};
