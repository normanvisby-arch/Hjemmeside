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
    "Mandage er ofte meget travle i Quick-tiden.. Overvej evt at komme en anden dag på ugen."
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
      "tid": "9.00–12.30",
      "tekst": "Lægesekretæren besvarer opkald, tager imod tidsbestillinger og øvrige henvendelser."
    },
    {
      "tid": "12.30–16.00",
      "tekst": "Kun ved <strong>akutte henvendelser</strong> — sekretæren træffes på 75 89 18 11."
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
      "svar": "Du kan se dine prøvesvar på sundhed.dk og i Min Læge-appen. Du er også velkommen til at ringe på hverdage kl. 9.00–12.30. Ved svar, der kræver handling, kontakter vi dig."
    },
    {
      "sp": "Kan jeg få taget blodprøver uden at komme til Hedensted?",
      "svar": "Ja — hvis lægen har bestilt prøverne, kan du få dem taget i blodprøveambulatoriet på Horsens eller Vejle Sygehus. Læs mere under <a href=\"laboratoriet.html\">Laboratoriet</a>."
    },
    {
      "sp": "Hvad gør jeg, hvis jeg bliver akut syg?",
      "svar": "På hverdage kl. 8.00–9.00 ringer du til os på 75 89 18 11 ved sygdom, der kræver lægekontakt samme dag. Kl. 12.30–16.00 træffes sekretæren på samme nummer — kun ved akutte henvendelser. Efter kl. 16.00 kontakter du lægevagten på 70 11 31 31 — og ved livsfare ringer du altid 112."
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
      "tekst": "<p>Priser på attester og erklæringer (alle priser er inkl. moms):</p>[[PRISER]]<p>*Kørekortsattesten er overgået til en digital løsning. Du bedes derfor udfylde Del A på forhånd. Del A skal være udfyldt senest dagen før din tid i klinikken.</p><p>Attester uden aftalte takster mellem lægeforeningen og rekvirent faktureres med honorar efter tidsforbrug med 500 kr. pr. påbegyndt 15 min. inkl. forberedelse. Administrationsgebyr ved udskrift af journalmateriale afregnes ligeledes efter tidsforbrug.</p>",
      "priser": "attester"
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
      "tekst": "<p>Vi tilbyder rådgivning og vaccinationer i forbindelse med udlandsrejser ved vores sygeplejersker. Bestil tid hos sekretæren på <a href=\"tel:75891811\">75 89 18 11</a>.</p><p>Det er vigtigt, at du bestiller tid i god tid, så sygeplejersken kan tilrettelægge et vaccinationsprogram tilpasset din rejse — de fleste vaccinationer skal gives med måneders interval.</p><p><strong>Vaccinationspriser</strong></p>[[PRISER]]<p>Vi anlægger ikke Mantoux i forbindelse med udlandsrejse; her henviser vi til Lungeambulatoriet, Aarhus Universitetshospital (hverdage 08.15–14.00, tlf. 78 46 20 89). Se desuden <a href=\"https://www.ssi.dk\" target=\"_blank\" rel=\"noopener\">Statens Serum Institut</a>.</p>",
      "priser": "vacciner"
    },
    {
      "titel": "Medicinsk cannabis",
      "tekst": "<p>De praktiserende lægers fagvidenskabelige selskab, Dansk Selskab for Almen Medicin (DSAM), har af hensyn til patienternes sikkerhed frarådet praktiserende læger at udskrive medicinsk cannabis.</p>"
    },
    {
      "titel": "Patientdataforordning",
      "tekst": "<p>Fra den 25. maj 2018 gælder databeskyttelsesforordningen (GDPR) for brug af personlige oplysninger. Du kan læse mere om dine patientrettigheder og behandlingen af persondata på <a href=\"https://www.sundhed.dk\" target=\"_blank\" rel=\"noopener\">sundhed.dk</a>.</p>"
    },
    {
      "titel": "Lokale samarbejdspartnere",
      "tekst": "<p>Her er en oversigt over speciallæger og behandlere, klinikken samarbejder med i lokalområdet.</p><p><strong>Børnelæge</strong></p><ul><li>Børnelægeklinikken Horsens, J. Chr. Juliussensvej 9, 1. tv., 8700 Horsens — 7626 9300</li></ul><p><strong>Fysioterapeuter</strong></p><ul><li>Fysio Danmark Vejle, Sjællandsgade 23 A, 7100 Vejle — 7583 2212</li><li>LS Fysioterapi, Kirkevej 10, 7160 Tørring — 2895 2421</li><li>Fit&amp;Sund Fysioterapi, Hældagervej 165, 7120 Vejle Ø — 5211 0146</li><li>Fit&amp;Sund Fysioterapi Vejle C, Gunhilds Plads 6, 1. th., 7100 Vejle — 7583 2212</li><li>Hornsyld Klinik for Fysioterapi, Bakkevej 21, 8783 Hornsyld — 7568 8899</li><li>Fit&amp;Sund Fysioterapi, Bytorvet 27 C, 1. sal, 8722 Hedensted — 7562 2919</li><li>FysioDanmark Horsens, Høegh Guldbergs Gade 36C, 8700 Horsens — 7564 0701</li><li>Tørring Fysioterapi og Træning, Torvegade 10, 7160 Tørring — 7580 1907</li><li>Fit&amp;Sund Fysioterapi Horsens, Grønlandsvej 1, 2. sal., 8700 Horsens — 7562 2919</li><li>Fit&amp;Sund Brædstrup, Søndergade 11, 8740 Brædstrup — 7575 3077</li></ul><p><strong>Fodterapeut</strong></p><ul><li>Klinik for Fodterapi v. Birthe Gade, Østerbrogade 19 C, 8722 Hedensted — 7589 1144</li></ul><p><strong>Gynækolog</strong></p><ul><li>Gitte Glavind, Borgvold 14 B, 7100 Vejle — 7584 0500</li><li>Helene Nortvig, Vitus Berings Plads 1, 3., 8700 Horsens — 7561 4808</li></ul><p><strong>Hudlæge</strong></p><ul><li>Henrik Thormann, Vedelsgade 1, kld. tv., 7100 Vejle — 7582 1240</li><li>Peter Andersen, Blegbanken 3, 3. sal., 7100 Vejle — 7584 0922</li><li>Sanne Buus, Blumersgade 8 A, 8700 Horsens — 7876 5500</li><li>Lone Hvid, Grønlandsvej 3, 3. sal, 8700 Horsens — 4422 5530</li></ul><p><strong>Kardiolog</strong></p><ul><li>Aarhus Hjerteklinik v/ Inger Sihm, Banegårdspladsen 20, 3. sal., 8000 Aarhus C — 8612 8440</li></ul><p><strong>Kiropraktor</strong></p><ul><li>Lars Andersen, Østerbrogade 3B, 8722 Hedensted — 7589 9088</li></ul><p><strong>Kirurg</strong></p><ul><li>Kirurgisk Klinik v. Tobias Boest, Nørregade 1, 1., 8700 Horsens — 7561 5777</li></ul><p><strong>Neurolog</strong></p><ul><li>Jacob Geday, Grønlandsvej 1, 1. sal, 8700 Horsens — 7562 3032</li><li>Linda Locht, Borgvold 14 B, 1. sal, 7100 Vejle — 7583 4224</li></ul><p><strong>Ortopædkirurg</strong></p><ul><li>Habib Horsager, Skovgade 23C, 7100 Vejle — 7572 2888</li></ul><p><strong>Psykiater</strong></p><ul><li>Malene Lange, Tobaksgården 9, 8700 Horsens — 6166 5902</li><li>Fischer-Psykiatrisk Klinik, Ørstedsgade 15, 7100 Vejle — 9111 1161</li></ul><p><strong>Psykolog</strong></p><ul><li>psykologeridanmark.dk</li><li>Sven-Erik May, Godthåbsvej 15, 8660 Skanderborg — 6167 8101</li><li>Kirsten Grunnet, Sandbjergvej 2, 7130 Juelsminde — 4230 9111</li></ul><p><strong>Reumatolog</strong></p><ul><li>ReumaKlinik Lillebælt, Enghavevej 9D, 1. sal, 7100 Vejle — 7640 0633</li></ul><p><strong>Lunge- og allergisygdomme</strong></p><ul><li>Lungemedicinsk og Allergologisk, Godsbanegade 3, 1. sal th, 8700 Horsens — 8621 5577</li></ul><p><strong>Øjenlæge</strong></p><ul><li>Øjenklinikken Havneparken, Havneparken 4, 3., 7100 Vejle — 7584 1199</li><li>Christopher Lisle, Nørregade 18, 1., 7100 Vejle — 7582 0625</li><li>Nørretorvets Øjenklinik, Nørretorv 13, 1. sal, 7100 Vejle — 7582 9362</li><li>Thomas Kaare Lundkvist, Jessensgade 1.2 th, 8700 Horsens — 7560 2650</li><li>Jeanet Lomholt, Borgergade 7, 1., 8700 Horsens — 7562 8280</li><li>Jørgen Jalk, Vitus Berings Plads 5 B, 8700 Horsens — 7562 1051</li></ul><p><strong>Ørelæge</strong></p><ul><li>Ann Momme, Rådhustorvet 4, 3. th., 7100 Vejle — 7583 2442</li><li>Øre-Næse-Hals Klinikken Horsens, Sønderbrogade 14, 8700 Horsens — 7562 1164</li><li>Pernille Hahn, Flegmade 9 A, 1. sal., 7100 Vejle — 7583 2774</li><li>Susanne Haug, Borgvold 14 A, 7100 Vejle — 7582 3260</li><li>Christian Banner Gindesgaard, Havnepladsen 3B, 1. sal, 7100 Vejle — 7583 5533</li></ul><p><strong>Diverse</strong></p><ul><li>Patientvejleder i Region Midt — telefontid mandag–torsdag kl. 10–13, fredag kl. 10–12.</li></ul>"
    },
    {
      "titel": "Privat sundhedsforsikring",
      "tekst": "<p>Har du en privat sundhedsforsikring og vil gøre brug af den, gælder følgende:</p><ul><li>Har din praktiserende læge vurderet, at der er behov for en henvisning til behandling/undersøgelse i offentligt regi, kan du få en kopi af henvisningen og selv sende den til forsikringsselskabet. Egen læge formidler <strong>ikke</strong> henvisningen til forsikringsselskabet.</li><li>Har din læge vurderet, at der ikke er grundlag for henvisning i offentligt regi — eller ønsker forsikringsselskabet yderligere dokumentation — bruges Sundhedsforsikringsattest <strong>FP 710</strong>. FP 710 kan kun anvendes på forsikringsselskabets anmodning, og honoraret betales af forsikringsselskabet.</li></ul>"
    },
    {
      "titel": "Vaccination mod influenza, covid-19 og pneumokok",
      "tekst": "<p>De praktiserende læger er ikke længere en del af sæsonvaccinationen, men vi bakker op om både influenza- og COVID-19-vaccination.</p><p>Region Midt hjemtager sæsonens vintervaccination. Det betyder, at de praktiserende læger ikke har nogen rolle i den vederlagsfri vaccination mod influenza og COVID-19 — i stedet kan du blive vaccineret på de regionale vaccinationscentre.</p><p>Der tilbydes ikke længere gratis vaccination mod pneumokoksygdom. Vaccination tilbydes dog fortsat efter de særlige tilskudsregler til en begrænset gruppe med øget risiko. De gældende tilskudsregler kan ses på <a href=\"https://www.sst.dk/da/viden/forebyggelse/vaccination/vaccination-af-voksne/tilskud-til-vacciner\" target=\"_blank\" rel=\"noopener\">sst.dk</a>.</p>"
    },
    {
      "titel": "Vejledninger og skemaer",
      "tekst": "<p>Klinikken har en række vejledninger og skemaer. De, der kan hentes som PDF, er markeret med link — resten kan du få udleveret eller tilsendt; spørg sekretæren.</p><ul><li><a href=\"assets/vejledninger/hjemmeblodtryk-skema.pdf\" target=\"_blank\" rel=\"noopener\">Hjemmeblodtryksskema (PDF)</a> — patienter i fast blodtryksbehandling anbefales at købe eget blodtryksapparat.</li><li>Øreskylning — se emnet «Øreskylning» ovenfor.</li><li><a href=\"assets/vejledninger/vorter-pjece.pdf\" target=\"_blank\" rel=\"noopener\">Vorter — pjece (PDF)</a></li><li>Fnatbehandling — se emnet «Fnatbehandling».</li><li><a href=\"assets/vejledninger/vaeskevandladningsskema.pdf\" target=\"_blank\" rel=\"noopener\">Væske- og vandladningsskema (PDF)</a></li><li><a href=\"assets/vejledninger/danpss-skema.pdf\" target=\"_blank\" rel=\"noopener\">DanPSS — Dansk Prostata Symptom Scoringsskema (PDF)</a></li><li><a href=\"https://psa-test.dk/\" target=\"_blank\" rel=\"noopener\">PSA — «Skal du lade dig teste?»</a> (beslutningsstøtte-værktøj)</li><li><a href=\"assets/vejledninger/iciq-skema.pdf\" target=\"_blank\" rel=\"noopener\">ICIQ — vandladningsskema for overaktiv blære (PDF)</a></li><li><a href=\"assets/vejledninger/laegeattest-rehabiliteringsteam.pdf\" target=\"_blank\" rel=\"noopener\">Spørgeskema til lægeattest — Rehabiliteringsteam / Generel Helbredsattest (PDF)</a></li></ul>"
    },
    {
      "titel": "Web Patient / e-service",
      "tekst": "<p>Det er muligt at oprette sig til e-service, hvor du kan bestille fast medicin og tider eller skrive korte beskeder til lægerne, sygeplejerskerne og sekretærerne.</p><p>Vi bestræber os på at besvare beskeder og forny recepter inden for få dage, så muligheden egner sig <strong>ikke</strong> til presserende henvendelser.</p><p>Vi anbefaler, at du bruger apps som <strong>Min Læge</strong> eller <strong>Medicinkortet</strong> — eller modulerne på forsiden her på hjemmesiden.</p><p>Bemærk: Vi kan kun sende påmindelser om nye svar, skemaer og lign., hvis du har oplyst din e-mail. Sørg derfor for, at dine oplysninger er opdaterede, hvis du får nyt mobilnummer eller ny e-mail.</p>"
    },
    {
      "titel": "Wegovy — medicinsk vægttabsbehandling",
      "tekst": "<p><strong>Medicinsk vægttabsbehandling med Wegovy.</strong> I Hedensted Lægehus kan du blive tilbudt behandling ud fra følgende kriterier:</p><ul><li>BMI over 30 og mindst én fedmerelateret sygdom/tilstand (hjertesygdom, sukkersyge, forhøjet blodtryk, forhøjet kolesterol eller søvnapnø).</li><li>BMI over 35 uden fedmerelaterede sygdomme efter lægefaglig vurdering.</li></ul><p>Pr. 30. april 2026 overgår vi til et struktureret forløb, der kombinerer:</p><p><strong>Gruppeforløb:</strong></p><ul><li>Informationsmøde</li><li>Oplæring i injektion og optitrering — kun efter deltagelse i forudgående informationsmøde</li></ul><p><strong>Individuelle kontroller:</strong></p><ul><li>Blodprøver og BMI før opstart</li><li>Videokontrol efter 4 uger</li><li>Individuel 3-måneders kontrol</li><li>Herefter årlige kontroller</li></ul><p>Behandlingen er et supplement til kostændringer og fysisk aktivitet og kan ikke stå alene. Der kræves mindst 5 % vægttab efter 3 måneders behandling for at fortsætte i klinikken. Afbryder du et forløb, vil det ikke være muligt at blive tilbudt et nyt forløb i vores klinik. Kontakt klinikken for nærmere information.</p>"
    },
    {
      "titel": "Øreskylning",
      "tekst": "<p>Du skal bestille tid til øreskylning ved vores sygeplejersker. Inden den aftalte tid er det vigtigt, at du har fulgt denne vejledning:</p><ul><li>Dryp øret med ganske almindelig tempereret madolie fra køkkenskabet — det er ikke nødvendigt med apotekets specialolie. Fyld evt. en lille sprøjte med madolien.</li><li>Løft op i øret og træk let bagud, så øregangen rettes ud. Sprøjt madolien ind — spar ikke på dråberne.</li><li>Sæt <strong>vandskyende vat</strong> i øret bagefter (fås på apoteket) — <strong>ikke</strong> almindeligt vat, da det suger olien, så den ikke kan opløse den hårde voks.</li><li>Gentag proceduren 4 gange dagligt — sidste gang lige før sengetid.</li><li>Start oliedrypningen, så der dryppes i 3–4 hele dage, inden din aftalte tid til øreskylning i lægehuset.</li></ul>"
    },
    {
      "titel": "Fasteregler for blodprøvetagning",
      "tekst": "<p>Det tværfaglige specialeråd i klinisk biokemi i Region Midtjylland har vedtaget en ensartet definition af faste forud for blodprøvetagning. Faste betyder, at du:</p><ul><li>ikke må spise 12 timer før blodprøvetagning — prøven bør tages om morgenen</li><li>gerne må drikke vand efter behov indtil en time før blodprøvetagning</li><li>ikke må indtage alkohol 24 timer før</li><li>ikke må ryge, drikke te eller kaffe eller dyrke hård fysisk motion om morgenen før prøven</li><li>bør sidde og hvile ca. 15 minutter før prøvetagning</li><li>skal tage eventuel medicin efter lægens anvisninger</li></ul>"
    },
    {
      "titel": "Måling af døgnblodtryk",
      "tekst": "<p>Døgnblodtryksmåling er en måling af blodtrykket med faste, forkodede intervaller gennem et døgn.</p><p><strong>Formål:</strong> at vurdere, om dit blodtryk kræver medicinsk behandling, eller om en allerede iværksat behandling virker.</p><p><strong>Forberedelse:</strong> Ingen særlig forberedelse. Du må spise, drikke og tage medicin som du plejer. Lev så normalt som muligt i det døgn, der måles — let til moderat motion (fx gåture) anbefales, mens overdreven aktivitet og hård træning frarådes.</p><p><strong>Sådan foregår det:</strong> Du bestiller tid i laboratoriet til montering af apparatet og vejledning og får samtidig en tid til afmontering dagen efter. Du får en blodtryksmanchet på armen og et lille apparat, der lagrer målingerne. Apparatet måler hvert 30. minut om dagen (kl. 07–22) og hvert 60. minut om natten (kl. 22–07). Det bipper forud for hver måling — hold armen i ro imens. Der skal ikke ændres på apparatet, og det må ikke komme i kontakt med vand.</p><p><strong>Efter undersøgelsen:</strong> Bioanalytikeren afmonterer apparatet og gemmer resultaterne i din journal. Bestil derefter tid ved egen læge til gennemgang og opfølgning.</p>"
    },
    {
      "titel": "Noteless — transskription af konsultationen",
      "tekst": "<p><strong>Kære patient.</strong> Vi bruger et transskriptionsværktøj for at forbedre dokumentationen af din sundhed. Samtalen mellem dig og din behandler optages af vores mikrofon, så behandleren kan fokusere fuldt ud på dig og dine behov. Lyden bearbejdes i realtid, og der findes derfor aldrig en komplet lydoptagelse af samtalen. Lydfilerne slettes med det samme, og al databehandling sker med respekt for dit privatliv. Sig til behandleren, hvis du ønsker at fravælge lydoptagelse.</p><p><strong>Hvad betyder det for dig?</strong></p><ul><li><strong>Samme gode behandling:</strong> Konsultationen foregår som normalt — intet ændrer sig for dig som patient.</li><li><strong>Mere tid til samtalen:</strong> Behandleren får bedre tid til at lytte og vejlede, da dokumentationen kræver mindre tid.</li><li><strong>Sikkerhed i første række:</strong> Dine helbredsoplysninger behandles fortroligt i overensstemmelse med gældende lovgivning.</li></ul><p>Har du spørgsmål til løsningen? Læs mere på <a href=\"https://noteless.com/dk/security\" target=\"_blank\" rel=\"noopener\">noteless.com/dk/security</a>.</p>"
    },
    {
      "titel": "Fnatbehandling",
      "tekst": "<p>Fnat behandles med enten <strong>Nix</strong> (creme) eller <strong>Scatol</strong> (tabletter på recept). Følg vejledningen nøje — behandlingen gentages efter 7 dage.</p><p><strong>Behandling med Nix</strong></p><p>Nix smøres omhyggeligt på ren og tør hud i et tyndt lag. Husk også mellem fingre og tæer, øre, neglebånd, under arme, i navle, på kønsorganerne og omkring endetarmen. Nix skal være på huden mellem 8 og 12 timer — smør bedst om aftenen og vask af næste morgen. Efter håndvask smøres hænderne igen med Nix i de 8–12 timer, behandlingen skal virke. Brug engangshandsker ved opvask og andet vådt arbejde, og smør hænderne igen med Nix, når handskerne tages af. Behandlingen gentages efter 7 dage.</p><p><strong>Behandling med Scatol</strong></p><p>Tabletterne er på recept, og antallet udregnes efter kropsvægt. Der behandles to gange med en uges mellemrum: tabletterne indtages på én gang, og samme antal tages igen på 7.-dagen. Det er vigtigt, at tabletterne tages med et glas vand på tom mave — mindst 2 timer før eller efter et måltid. Vi anbefaler indtag eftermiddag/aften, og at du dagen efter påbegynder vask og rengøring af hjemmet. Til børn kan tabletterne knuses inden indtagelse. Det anbefales, at tætte relationer (husstand, kæreste, værelseskammerater og lignende) behandles samtidigt.</p><p><strong>Forholdsregler — vask og rengøring</strong></p><ul><li>Tag et grundigt brusebad dagen efter behandling, skift til rent tøj og brug separate håndklæder og vaskeklude.</li><li>Skift sengelinned (tag handsker på). Møbler rengøres og støvsuges grundigt, og støvsugerposen udskiftes.</li><li>Tøj, sengetøj, puder, dyner, håndklæder, bamser, løse tæpper o.l. vaskes ved <strong>minimum 60 grader</strong>, hvis det har været brugt inden for de sidste 7 dage. Det, der ikke tåler 60 grader, lægges i en lukket plastpose i 4 døgn ved 20 grader (eller 7 døgn ved lavere temperatur/høj fugtighed).</li><li>Fnatmiden kan overleve i tøj og tekstiler i op til 4–7 døgn. Derfor må dagligt benyttede tekstilmøbler (fx stofsofa og seng inkl. madras) <strong>ikke</strong> benyttes i 7 døgn. Har du ikke en anden seng/madras/bilsæde, kan du afdække med plastik (fx male-afdækningsplast) i de 7 dage.</li><li>Bilsæder (inkl. autostole) støvsuges grundigt og dækkes eventuelt med plastik.</li></ul><p>Samme procedure gentages efter 7 dage i forbindelse med genbehandlingen, for at fjerne eventuelle nyudklækkede mider.</p><p><strong>Hvornår er man smittefri?</strong></p><p>Man er normalt smittefri 12 timer efter første behandling. Børn kan derfor komme i dagtilbud eller skole igen 12 timer efter påbegyndt behandling. Undgå tæt fysisk kontakt under hele behandlingen.</p><p><strong>Det klør stadig</strong></p><p>Det er normalt med kløe i nogle uger efter behandling. Smøring med binyrebarkhormon-creme 1 gang dagligt i 1–2 uger afhjælper kløen. Huden kan opleves tør — smør med en god fugtighedscreme. Kommer der pludselig kløe igen efter flere uger uden, skal man mistænke fornyet smitte. I starten af behandlingen kan kløen forværres, men det varer som regel ikke længe.</p><p><strong>Godt at vide</strong></p><p>Der kan gå 4–8 uger, fra man smittes, til man udvikler kløe første gang. Anden gang går der normalt kun 2–3 dage.</p>"
    }
  ],
  "attester": [
    {
      "ydelse": "Kørekortsattest*",
      "pris": "500,00 kr."
    },
    {
      "ydelse": "Ansøgning om enkelttilskud",
      "pris": "250,00 kr."
    },
    {
      "ydelse": "Mulighedserklæring",
      "pris": "750,00 kr."
    },
    {
      "ydelse": "Sygemelding betalt af arbejdsgiver",
      "pris": "1.070,00 kr."
    },
    {
      "ydelse": "Kort frihåndsattest betalt af patienten",
      "pris": "500,00 kr."
    },
    {
      "ydelse": "Bokserattest",
      "pris": "1.235,00 kr."
    }
  ],
  "vacciner": [
    {
      "navn": "Hepatitis A+B, Twinrix (x3) — 16 år og op",
      "pris": "900 kr./stk."
    },
    {
      "navn": "Hepatitis A+B, Twinrix (x3) — børn 0–15 år",
      "pris": "600 kr./stk."
    },
    {
      "navn": "Hepatitis A+B, Ambrix (x2) — børn 0–15 år",
      "pris": "700 kr./stk."
    },
    {
      "navn": "Havrix, Hepatitis A (x2) — 16 år og op",
      "pris": "725 kr./stk."
    },
    {
      "navn": "Havrix, Hepatitis A (x2) — børn 0–15 år",
      "pris": "615 kr./stk."
    },
    {
      "navn": "Engerix, Hepatitis B (x3) — 16 år og op",
      "pris": "660 kr./stk."
    },
    {
      "navn": "Engerix, Hepatitis B (x3) — børn 0–15 år",
      "pris": "575 kr./stk."
    },
    {
      "navn": "Japansk Encephalit (x2)",
      "pris": "1.350 kr./stk."
    },
    {
      "navn": "Typhim (tyfus)",
      "pris": "550 kr./stk."
    },
    {
      "navn": "Gul feber",
      "pris": "625 kr./stk."
    },
    {
      "navn": "Meningococ",
      "pris": "900 kr./stk."
    },
    {
      "navn": "Rabies (x2)",
      "pris": "975 kr./stk."
    },
    {
      "navn": "TBE (skovflåt, x3) — 16 år og op",
      "pris": "625 kr./stk."
    },
    {
      "navn": "TBE (x3) — børn 0–15 år",
      "pris": "585 kr./stk."
    },
    {
      "navn": "Di-Te (ved udlandsrejse)",
      "pris": "425 kr./stk."
    },
    {
      "navn": "Pneumovax",
      "pris": "600 kr./stk."
    },
    {
      "navn": "Polio",
      "pris": "400 kr./stk."
    },
    {
      "navn": "Varicella (skoldkopper)",
      "pris": "850 kr./stk."
    },
    {
      "navn": "Dukoral (kolera)",
      "pris": "900 kr. for 2 stk."
    },
    {
      "navn": "Recept på fx malaria (inkl. konsultation)",
      "pris": "400 kr."
    }
  ]
};
