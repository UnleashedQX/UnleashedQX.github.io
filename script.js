// DOM prvky

const kraje = document.querySelectorAll("path");

const krajNazovSpan = document.getElementById("kraj-nazov");
const druhSpan = document.getElementById("druh");
const zisteneSpan = document.getElementById("zistene");
const objasneneSpan = document.getElementById("objasnene");
const percentoSpan = document.getElementById("percento");
const skodaSpan = document.getElementById("skoda");
const alkoholSpan = document.getElementById("alkohol");
const drogySpan = document.getElementById("drogy");
const obyvateliaSpan = document.getElementById("obyvatelia");
const indexKriminalitySpan = document.getElementById("index-kriminality");

const legend1 = document.getElementById("legend1");
const legend2 = document.getElementById("legend2");
const legend3 = document.getElementById("legend3");
const legend4 = document.getElementById("legend4");
const legend5 = document.getElementById("legend5");

const rokSelect = document.getElementById("rok-select");

const crimeButtons = document.querySelectorAll(".crime-btn");

const crimeArrows = document.querySelectorAll(".crime-arrow");
const crimeDropdownButtons = document.querySelectorAll(".crime-dropdown button");

const resetVyberBtn = document.getElementById("reset-vyber");
const mapColorToggle = document.getElementById("map-color-toggle");

// Nastavenia a mapovania

const grafNazov = document.getElementById("graf-nazov");
const grafRokOdSelect = document.getElementById("graf-rok-od");
const grafRokDoSelect = document.getElementById("graf-rok-do");
const grafUkazovatelSelect = document.getElementById("graf-ukazovatel");
const grafCanvas = document.getElementById("grafVyvoja");
const stiahnutGrafBtn = document.getElementById("stiahnut-graf");
const grafKomentar = document.getElementById("graf-komentar");

const mapTooltip = document.getElementById("map-tooltip");

const mappingKrajov = {
  SKBL: "Bratislavský kraj",
  SKTA: "Trnavský kraj",
  SKTC: "Trenčiansky kraj",
  SKNI: "Nitriansky kraj",
  SKZI: "Žilinský kraj",
  SKBC: "Banskobystrický kraj",
  SKPV: "Prešovský kraj",
  SKKI: "Košický kraj"
};

// Mapovanie názvov
const nazvyKriminality = {
  "CELKOVÁ KRIMINALITA": "Celková kriminalita",
  "NÁSILNÁ KRIMINALITA": "Násilná kriminalita",
  "MRAVNOSTNÁ KRIMINALITA": "Mravnostná kriminalita",
  "MAJETKOVÁ KRIMINALITA": "Majetková kriminalita",
  "OSTATNÁ KRIMINALITA": "Ostatná kriminalita",
  "ZOSTÁVAJÚCA KRIMINALITA": "Zostávajúca kriminalita",
  "EKONOMICKÁ KRIMINALITA": "Ekonomická kriminalita",

  "vraždy": "Vraždy",
  "lúpeže": "Lúpeže",
  "násilie na verej.činit.": "Násilie na verejnom činiteľovi",
  "úmyslené ublíženie na zdraví": "Úmyselné ublíženie na zdraví",
  "s rasovým mot.,extrémizmus": "Trestné činy s rasovým motívom a extrémizmus",
  "organizovaný zločin": "Organizovaný zločin",

  "znásilnenie": "Znásilnenie",
  "pohlavné zneužívanie": "Pohlavné zneužívanie",
  "obchodovanie s ľuďmi": "Obchodovanie s ľuďmi",

  "krádeže vlámaním": "Krádeže vlámaním",
  "krádeže ostatné": "Ostatné krádeže",
  "ostatné majetkové": "Ostatné majetkové trestné činy",

  "výtržníctvo": "Výtržníctvo",
  "požiare a výbuchy": "Požiare a výbuchy",
  "drogy": "Drogová kriminalita",
  "nedovolené ozbrojovanie": "Nedovolené ozbrojovanie",

  "dopravné nehody cestné": "Cestné dopravné nehody",
  "ohroz. pod vplyvom návyk.látok": "Ohrozenie pod vplyvom návykovej látky",
  "t.č. vojenské a proti republ.": "Vojenské trestné činy a trestné činy proti republike",

  "skrátenie dane": "Skrátenie dane",
  "krádež": "Krádež",
  "ochrana meny": "Ochrana meny",
  "ohroz.devízového hospod.": "Ohrozenie devízového hospodárstva",
  "korupcia": "Korupcia",
  "sprenevera": "Sprenevera",
  "podvod": "Podvod",
  "poruš.autorských práv": "Porušovanie autorských práv"
};

const podkategoriePodlaHlavnej = {
  "NÁSILNÁ KRIMINALITA": [
    "vraždy",
    "lúpeže",
    "násilie na verej.činit.",
    "úmyslené ublíženie na zdraví",
    "s rasovým mot.,extrémizmus",
    "organizovaný zločin"
  ],

  "MRAVNOSTNÁ KRIMINALITA": [
    "znásilnenie",
    "pohlavné zneužívanie",
    "obchodovanie s ľuďmi"
  ],

  "MAJETKOVÁ KRIMINALITA": [
    "krádeže vlámaním",
    "krádeže ostatné",
    "ostatné majetkové"
  ],

  "OSTATNÁ KRIMINALITA": [
    "výtržníctvo",
    "požiare a výbuchy",
    "drogy",
    "nedovolené ozbrojovanie"
  ],

  "ZOSTÁVAJÚCA KRIMINALITA": [
    "dopravné nehody cestné",
    "ohroz. pod vplyvom návyk.látok",
    "t.č. vojenské a proti republ."
  ],

  "EKONOMICKÁ KRIMINALITA": [
    "skrátenie dane",
    "krádež",
    "ochrana meny",
    "ohroz.devízového hospod.",
    "korupcia",
    "sprenevera",
    "podvod",
    "poruš.autorských práv"
  ]
};

// Stav aplikácie

let data = [];
let populaciaData = [];
let aktivnyKraj = null;
let aktivneDruhy = [];
let rezimFarbeniaMapy = "zistene";
let grafVyvoja = null;

// Pomocné funkcie pre výber kriminality

function najdiHlavnuKategoriuPrePodkategoriu(podkategoria) {
  for (const hlavna in podkategoriePodlaHlavnej) {
    if (podkategoriePodlaHlavnej[hlavna].includes(podkategoria)) {
      return hlavna;
    }
  }

  return null;
}

function zobrazNazovKriminality(nazov) {
  return nazvyKriminality[nazov] || nazov;
}

// Ak nie je vybraný žiadny druh, používa sa celková kriminalita.
function getVybraneDruhy() {
  if (aktivneDruhy.length === 0) {
    return ["CELKOVÁ KRIMINALITA"];
  }

  return aktivneDruhy;
}

// Pomocné funkcie pre formátovanie a výpočty

function nastavPrazdnuLegendu() {
  legend1.textContent = "-";
  legend2.textContent = "-";
  legend3.textContent = "-";
  legend4.textContent = "-";
  legend5.textContent = "-";
}

function formatHodnotuLegendy(hodnota, rezim) {
  if (rezim === "index") {
    return hodnota.toLocaleString("sk-SK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  return Math.round(hodnota).toLocaleString("sk-SK");
}

function skodaVEurach(item) {
  const skoda = item.skoda || 0;

  if (item.rok >= 1997 && item.rok <= 2008) {
    return (skoda * 1000) / 30.1260;
  }

  return skoda * 1000;
}

function spocitajZaznamy(zaznamy) {
  return zaznamy.reduce((acc, item) => {
    acc.zistene += item.zistene || 0;
    acc.objasnene += item.objasnene || 0;
    acc.skoda += skodaVEurach(item);
    acc.alkohol += item.vplyv_alkoholu || 0;
    acc.drogy += item.vplyv_drog || 0;
    return acc;
  }, {
    zistene: 0,
    objasnene: 0,
    skoda: 0,
    alkohol: 0,
    drogy: 0
  });
}

function formatCeleCislo(hodnota) {
  return hodnota.toLocaleString("sk-SK");
}

function formatDesatinneCislo(hodnota) {
  return hodnota.toLocaleString("sk-SK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Farbenie mapy

function zafarbiKraje() {
  const vybranyRok = Number(rokSelect.value);
  const vybraneDruhy = getVybraneDruhy();
  const rezimFarbenia = rezimFarbeniaMapy;

  const hodnotyKrajov = [];

  kraje.forEach(kraj => {
    const nazov = mappingKrajov[kraj.id];

    const zaznamy = data.filter(item =>
      item.kraj === nazov &&
      item.rok === vybranyRok &&
      vybraneDruhy.includes(item.druh_kriminality)
    );

    const sucet = spocitajZaznamy(zaznamy);

    if (zaznamy.length === 0) {
      kraj.style.fill = "#ccc";
      return;
    }

    let hodnota = sucet.zistene;

    if (rezimFarbenia === "index") {
      const zaznamPop = populaciaData.find(item =>
        item.kraj === nazov &&
        item.rok === vybranyRok
      );

      if (!zaznamPop || !zaznamPop.obyvatelia) {
        kraj.style.fill = "#ccc";
        return;
      }

      hodnota = (sucet.zistene / zaznamPop.obyvatelia) * 1000;
    }

    hodnotyKrajov.push({
      krajElement: kraj,
      hodnota: hodnota
    });
  });

  if (hodnotyKrajov.length === 0) {
    nastavPrazdnuLegendu();
    return;
  }

  const hodnoty = hodnotyKrajov.map(item => item.hodnota);
  const min = Math.min(...hodnoty);
  const max = Math.max(...hodnoty);

  if (min === max) {
    legend1.textContent = formatHodnotuLegendy(min, rezimFarbenia);
    legend2.textContent = "-";
    legend3.textContent = "-";
    legend4.textContent = "-";
    legend5.textContent = "-";

    hodnotyKrajov.forEach(item => {
      item.krajElement.style.fill = "#FC4E2A";
    });

    return;
  }

  const range = max - min;
  const step = range / 5;

  const hranica1 = min + step;
  const hranica2 = min + step * 2;
  const hranica3 = min + step * 3;
  const hranica4 = min + step * 4;

  legend1.textContent = `${formatHodnotuLegendy(min, rezimFarbenia)} – ${formatHodnotuLegendy(hranica1, rezimFarbenia)}`;
  legend2.textContent = `${formatHodnotuLegendy(hranica1, rezimFarbenia)} – ${formatHodnotuLegendy(hranica2, rezimFarbenia)}`;
  legend3.textContent = `${formatHodnotuLegendy(hranica2, rezimFarbenia)} – ${formatHodnotuLegendy(hranica3, rezimFarbenia)}`;
  legend4.textContent = `${formatHodnotuLegendy(hranica3, rezimFarbenia)} – ${formatHodnotuLegendy(hranica4, rezimFarbenia)}`;
  legend5.textContent = `${formatHodnotuLegendy(hranica4, rezimFarbenia)} – ${formatHodnotuLegendy(max, rezimFarbenia)}`;

  hodnotyKrajov.forEach(item => {
    const value = item.hodnota;
    const norm = (value - min) / (max - min);

    if (norm > 0.8) item.krajElement.style.fill = "#800026";
    else if (norm > 0.6) item.krajElement.style.fill = "#BD0026";
    else if (norm > 0.4) item.krajElement.style.fill = "#E31A1C";
    else if (norm > 0.2) item.krajElement.style.fill = "#FC4E2A";
    else item.krajElement.style.fill = "#FD8D3C";
  });
}

// Zobrazenie detailov

function zobrazSlovensko() {
  const vybranyRok = Number(rokSelect.value);
  const vybraneDruhy = getVybraneDruhy();

  const zaznamy = data.filter(item =>
    item.rok === vybranyRok &&
    vybraneDruhy.includes(item.druh_kriminality)
  );

  const sucet = spocitajZaznamy(zaznamy);

  const zaznamyPop = populaciaData.filter(item => item.rok === vybranyRok);
  const populaciaSpolu = zaznamyPop.reduce((sum, item) => sum + (item.obyvatelia || 0), 0);

  const percento = sucet.zistene > 0
    ? (sucet.objasnene / sucet.zistene) * 100
    : 0;

  const index = (sucet.zistene > 0 && populaciaSpolu > 0)
    ? (sucet.zistene / populaciaSpolu) * 1000
    : 0;

  krajNazovSpan.textContent = "Slovenská republika";
  druhSpan.textContent = zobrazTextVyberu(vybraneDruhy);
  zisteneSpan.textContent = sucet.zistene.toLocaleString("sk-SK");
  objasneneSpan.textContent = sucet.objasnene.toLocaleString("sk-SK");
  percentoSpan.textContent = percento.toLocaleString("sk-SK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + "%";
  skodaSpan.textContent = Math.round(sucet.skoda).toLocaleString("sk-SK") + "€";
  alkoholSpan.textContent = sucet.alkohol.toLocaleString("sk-SK");
  drogySpan.textContent = sucet.drogy.toLocaleString("sk-SK");
  obyvateliaSpan.textContent = populaciaSpolu > 0 ? populaciaSpolu.toLocaleString("sk-SK") : "-";

  indexKriminalitySpan.textContent = populaciaSpolu > 0
    ? index.toLocaleString("sk-SK", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      })
    : "-";
}

function zobrazKraj(krajElement) {
  const nazov = mappingKrajov[krajElement.id];
  const vybranyRok = Number(rokSelect.value);
  const vybraneDruhy = getVybraneDruhy();

  const zaznamy = data.filter(item =>
    item.kraj === nazov &&
    item.rok === vybranyRok &&
    vybraneDruhy.includes(item.druh_kriminality)
  );

  const zaznamPop = populaciaData.find(item =>
    item.kraj === nazov &&
    item.rok === vybranyRok
  );

  if (zaznamy.length > 0) {
    const sucet = spocitajZaznamy(zaznamy);

    const percento = sucet.zistene > 0
      ? (sucet.objasnene / sucet.zistene) * 100
      : 0;

    krajNazovSpan.textContent = nazov;
    druhSpan.textContent = zobrazTextVyberu(vybraneDruhy);
    zisteneSpan.textContent = sucet.zistene.toLocaleString("sk-SK");
    objasneneSpan.textContent = sucet.objasnene.toLocaleString("sk-SK");
    percentoSpan.textContent = percento.toLocaleString("sk-SK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + "%";
    skodaSpan.textContent = Math.round(sucet.skoda).toLocaleString("sk-SK") + "€";
    alkoholSpan.textContent = sucet.alkohol.toLocaleString("sk-SK");
    drogySpan.textContent = sucet.drogy.toLocaleString("sk-SK");

    if (zaznamPop && zaznamPop.obyvatelia > 0) {
      const index = (sucet.zistene / zaznamPop.obyvatelia) * 1000;
      obyvateliaSpan.textContent = zaznamPop.obyvatelia.toLocaleString("sk-SK");
      indexKriminalitySpan.textContent = index.toLocaleString("sk-SK", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
      });
    } else {
      obyvateliaSpan.textContent = "-";
      indexKriminalitySpan.textContent = "-";
    }
  } else {
    krajNazovSpan.textContent = nazov;
    druhSpan.textContent = zobrazTextVyberu(vybraneDruhy);
    zisteneSpan.textContent = "Nenašlo sa";
    objasneneSpan.textContent = "-";
    percentoSpan.textContent = "-";
    skodaSpan.textContent = "-";
    alkoholSpan.textContent = "-";
    drogySpan.textContent = "-";
    obyvateliaSpan.textContent = zaznamPop?.obyvatelia
      ? zaznamPop.obyvatelia.toLocaleString("sk-SK")
      : "-";
    indexKriminalitySpan.textContent = "-";
  }
}

// Tooltip mapy

function vytvorObsahTooltipu(krajElement) {
  const nazov = mappingKrajov[krajElement.id];
  const vybranyRok = Number(rokSelect.value);
  const vybraneDruhy = getVybraneDruhy();

  const zaznamy = data.filter(item =>
    item.kraj === nazov &&
    item.rok === vybranyRok &&
    vybraneDruhy.includes(item.druh_kriminality)
  );

  const zaznamPop = populaciaData.find(item =>
    item.kraj === nazov &&
    item.rok === vybranyRok
  );

  if (zaznamy.length === 0) {
    return `
      <div class="tooltip-title">${nazov}</div>
      <div class="tooltip-row">
        <span class="tooltip-label">Rok:</span>
        <span class="tooltip-value">${vybranyRok}</span>
      </div>
      <div class="tooltip-row">
        <span class="tooltip-label">Údaje:</span>
        <span class="tooltip-value">Nenašlo sa</span>
      </div>
    `;
  }

  const sucet = spocitajZaznamy(zaznamy);

  const index = zaznamPop && zaznamPop.obyvatelia > 0
    ? (sucet.zistene / zaznamPop.obyvatelia) * 1000
    : null;

  return `
    <div class="tooltip-title">${nazov}</div>

    <div class="tooltip-row">
      <span class="tooltip-label">Rok:</span>
      <span class="tooltip-value">${vybranyRok}</span>
    </div>

    <div class="tooltip-row">
      <span class="tooltip-label">Druh:</span>
      <span class="tooltip-value">${zobrazTextVyberu(vybraneDruhy)}</span>
    </div>

    <div class="tooltip-row">
      <span class="tooltip-label">Zistené:</span>
      <span class="tooltip-value">${formatCeleCislo(sucet.zistene)}</span>
    </div>

    <div class="tooltip-row">
      <span class="tooltip-label">Index:</span>
      <span class="tooltip-value">${index !== null ? formatDesatinneCislo(index) : "-"}</span>
    </div>
  `;
}

function posunTooltip(event) {
  const offset = 14;

  mapTooltip.style.left = event.clientX + offset + "px";
  mapTooltip.style.top = event.clientY + offset + "px";

  const tooltipRect = mapTooltip.getBoundingClientRect();

  if (tooltipRect.right > window.innerWidth) {
    mapTooltip.style.left = event.clientX - tooltipRect.width - offset + "px";
  }

  if (tooltipRect.bottom > window.innerHeight) {
    mapTooltip.style.top = event.clientY - tooltipRect.height - offset + "px";
  }
}

// Text výberu

function zobrazTextVyberu(druhy) {
  if (aktivneDruhy.length === 0) {
    return "Celková kriminalita";
  }

  return druhy.map(druh => zobrazNazovKriminality(druh)).join(", ");
}

// Nastavenie rokov grafu

function naplnRokyGrafu(roky) {
  grafRokOdSelect.innerHTML = "";
  grafRokDoSelect.innerHTML = "";

  roky.forEach(rok => {
    const optOd = document.createElement("option");
    optOd.value = rok;
    optOd.textContent = rok;
    grafRokOdSelect.appendChild(optOd);

    const optDo = document.createElement("option");
    optDo.value = rok;
    optDo.textContent = rok;
    grafRokDoSelect.appendChild(optDo);
  });

  if (roky.length > 0) {
    grafRokOdSelect.value = roky[0];
    grafRokDoSelect.value = roky[roky.length - 1];
  }
}

// Výpočty a popisy grafu

function vypocitajHodnotuGrafu(sucet, populacia, ukazovatel) {
  if (ukazovatel === "zistene") {
    return sucet.zistene;
  }

  if (ukazovatel === "objasnene") {
    return sucet.objasnene;
  }

  if (ukazovatel === "percento") {
    return sucet.zistene > 0
      ? (sucet.objasnene / sucet.zistene) * 100
      : 0;
  }

  if (ukazovatel === "skoda") {
    return sucet.skoda;
  }

  if (ukazovatel === "alkohol") {
    return sucet.alkohol;
  }

  if (ukazovatel === "drogy") {
    return sucet.drogy;
  }

  if (ukazovatel === "index") {
    return populacia > 0
      ? (sucet.zistene / populacia) * 1000
      : 0;
  }

  return 0;
}

function nazovUkazovatelaPreGraf(ukazovatel) {
  if (ukazovatel === "zistene") return "zistenej kriminality";
  if (ukazovatel === "objasnene") return "objasnenej kriminality";
  if (ukazovatel === "percento") return "percenta objasnenosti";
  if (ukazovatel === "skoda") return "škody spôsobenej kriminalitou";
  if (ukazovatel === "alkohol") return "kriminality pod vplyvom alkoholu";
  if (ukazovatel === "drogy") return "kriminality pod vplyvom drog";
  if (ukazovatel === "index") return "indexu kriminality";

  return "kriminality";
}

function nazovOblastiPreNadpis(nazovOblasti) {
  const tvary = {
    "Slovenská republika": "Slovenskej republike",
    "Bratislavský kraj": "Bratislavskom kraji",
    "Trnavský kraj": "Trnavskom kraji",
    "Trenčiansky kraj": "Trenčianskom kraji",
    "Nitriansky kraj": "Nitrianskom kraji",
    "Žilinský kraj": "Žilinskom kraji",
    "Banskobystrický kraj": "Banskobystrickom kraji",
    "Prešovský kraj": "Prešovskom kraji",
    "Košický kraj": "Košickom kraji"
  };

  return tvary[nazovOblasti] || nazovOblasti;
}

function vypocitajTrendovuSpojnicu(roky, hodnoty) {
  if (roky.length < 2 || hodnoty.length < 2) {
    return hodnoty;
  }

  const n = roky.length;

  const sumaX = roky.reduce((sum, x) => sum + x, 0);
  const sumaY = hodnoty.reduce((sum, y) => sum + y, 0);

  const sumaXY = roky.reduce((sum, x, i) => sum + x * hodnoty[i], 0);
  const sumaXX = roky.reduce((sum, x) => sum + x * x, 0);

  const sklon = (n * sumaXY - sumaX * sumaY) / (n * sumaXX - sumaX * sumaX);
  const posun = (sumaY - sklon * sumaX) / n;

  return roky.map(rok => sklon * rok + posun);
}

function vytvorKomentarTrendu(trendoveHodnoty) {
  if (!trendoveHodnoty || trendoveHodnoty.length < 2) {
    return "Na vyhodnotenie trendu nie je dostupný dostatočný počet rokov.";
  }

  const prvaHodnota = trendoveHodnoty[0];
  const poslednaHodnota = trendoveHodnoty[trendoveHodnoty.length - 1];

  const rozdiel = poslednaHodnota - prvaHodnota;

  const zaklad = Math.abs(prvaHodnota) > 0
    ? Math.abs(prvaHodnota)
    : Math.max(...trendoveHodnoty.map(hodnota => Math.abs(hodnota)));

  const percentoZmeny = zaklad > 0
    ? (rozdiel / zaklad) * 100
    : 0;

  if (Math.abs(percentoZmeny) < 1) {
    return "Vo vybranom období je ukazovateľ približne stabilný.";
  }

  if (percentoZmeny > 0) {
    return "Vo vybranom období má ukazovateľ rastúci trend.";
  }

  return "Vo vybranom období má ukazovateľ klesajúci trend.";
}

function aktualizujGraf() {
  if (!grafCanvas || data.length === 0 || populaciaData.length === 0) {
    return;
  }

  let rokOd = Number(grafRokOdSelect.value);
  let rokDo = Number(grafRokDoSelect.value);

  if (rokOd > rokDo) {
    const temp = rokOd;
    rokOd = rokDo;
    rokDo = temp;
  }

  const ukazovatel = grafUkazovatelSelect.value;
  const vybraneDruhy = getVybraneDruhy();

  const jeVybranyKraj = aktivnyKraj !== null;
  const nazovKraja = jeVybranyKraj ? mappingKrajov[aktivnyKraj.id] : null;
  const nazovOblasti = jeVybranyKraj ? nazovKraja : "Slovenská republika";

  const obdobieGrafu = rokOd === rokDo
    ? `v roku ${rokOd}`
    : `v rokoch ${rokOd} – ${rokDo}`;

  const nazovUkazovatelaNadpis = nazovUkazovatelaPreGraf(ukazovatel);
  const nazovOblastiNadpis = nazovOblastiPreNadpis(nazovOblasti);

  if (grafNazov) {
    grafNazov.textContent = `Vývoj ${nazovUkazovatelaNadpis} v ${nazovOblastiNadpis} ${obdobieGrafu}`;
  }

  const roky = [];
  const hodnoty = [];

  for (let rok = rokOd; rok <= rokDo; rok++) {
    let zaznamy = data.filter(item =>
      item.rok === rok &&
      vybraneDruhy.includes(item.druh_kriminality)
    );

    if (jeVybranyKraj) {
      zaznamy = zaznamy.filter(item => item.kraj === nazovKraja);
    }

    const sucet = spocitajZaznamy(zaznamy);

    let populacia = 0;

    if (jeVybranyKraj) {
      const zaznamPop = populaciaData.find(item =>
        item.rok === rok &&
        item.kraj === nazovKraja
      );

      populacia = zaznamPop ? zaznamPop.obyvatelia : 0;
    } else {
      const zaznamyPop = populaciaData.filter(item => item.rok === rok);
      populacia = zaznamyPop.reduce((sum, item) => sum + (item.obyvatelia || 0), 0);
    }

    const hodnota = vypocitajHodnotuGrafu(sucet, populacia, ukazovatel);

    roky.push(rok);

    if (ukazovatel === "skoda") {
      hodnoty.push(Math.round(hodnota));
    } else {
      hodnoty.push(Number(hodnota.toFixed(2)));
    }
  }

  const nazovUkazovatelaLegenda = grafUkazovatelSelect.options[grafUkazovatelSelect.selectedIndex].text;
  const nazovVyberu = zobrazTextVyberu(vybraneDruhy);
  const trendoveHodnoty = vypocitajTrendovuSpojnicu(roky, hodnoty);

  if (grafKomentar) {
  grafKomentar.textContent = vytvorKomentarTrendu(trendoveHodnoty);
  }

  if (grafVyvoja) {
    grafVyvoja.destroy();
  }

  grafVyvoja = new Chart(grafCanvas, {
    type: "line",
    data: {
      labels: roky,
      datasets: [
        {
          label: `${nazovUkazovatelaLegenda} – ${nazovOblasti} – ${nazovVyberu}`,
          data: hodnoty,
          tension: 0.25,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: "Trendová spojnica",
          data: trendoveHodnoty,
          tension: 0,
          borderWidth: 2,
          borderDash: [6, 6],
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            title: function () {
              return "";
            },
            label: function (context) {
              const hodnota = context.raw;
              const ukazovatel = grafUkazovatelSelect.value;

              let jednotka = "";

              if (ukazovatel === "percento") {
                jednotka = " %";
              } else if (ukazovatel === "skoda") {
                jednotka = " €";
              }

              if (ukazovatel === "skoda") {
                return Math.round(hodnota).toLocaleString("sk-SK") + jednotka;
              }

              return hodnota.toLocaleString("sk-SK", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
              }) + jednotka;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            display: true,
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            padding: 10
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            maxTicksLimit: 6
          }
        }
      }
    }
  });
}

// Načítanie dát

Promise.all([
  fetch("data.json").then(res => res.json()),
  fetch("populacia.json").then(res => res.json())
])
  .then(([jsonData, popData]) => {
    data = jsonData;
    populaciaData = popData;

    const roky = [...new Set(data.map(i => i.rok))].sort((a, b) => a - b);
    naplnRokyGrafu(roky);

    roky.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      rokSelect.appendChild(opt);
    });

    if (roky.length > 0) {
      rokSelect.value = roky[roky.length - 1];
    }

    zafarbiKraje();
    zobrazSlovensko();
    aktualizujGraf();
  })
  .catch(error => {
    console.error("Chyba pri načítaní dát:", error);
  });

// Udalosti mapy a filtrov

kraje.forEach(kraj => {
  kraj.addEventListener("click", function () {
    if (aktivnyKraj === kraj) {
      kraj.style.stroke = "#333";
      kraj.style.strokeWidth = "1";
      aktivnyKraj = null;
      zobrazSlovensko();
      aktualizujGraf();
      return;
    }

    if (aktivnyKraj) {
      aktivnyKraj.style.stroke = "#333";
      aktivnyKraj.style.strokeWidth = "1";
    }

    kraj.style.stroke = "#2bff00";
    kraj.style.strokeWidth = "4";
    aktivnyKraj = kraj;
    kraj.parentNode.appendChild(kraj);

    zobrazKraj(kraj);
    aktualizujGraf();
  });
});

rokSelect.addEventListener("change", () => {
  zafarbiKraje();
  if (aktivnyKraj) {
    zobrazKraj(aktivnyKraj);
  } else {
    zobrazSlovensko();
  }

  aktualizujGraf();
});

// Tlačidlá filtrov
crimeButtons.forEach(button => {
  button.addEventListener("click", () => {
    const hlavnaKategoria = button.dataset.druh;
    const podkategorie = podkategoriePodlaHlavnej[hlavnaKategoria] || [];

    if (aktivneDruhy.includes(hlavnaKategoria)) {
      aktivneDruhy = aktivneDruhy.filter(item => item !== hlavnaKategoria);
      button.classList.remove("active");
    } else {
      // hlavná kategória sa vyberá, preto odstránime jej podkategórie
      aktivneDruhy = aktivneDruhy.filter(item => !podkategorie.includes(item));

      document.querySelectorAll(".crime-dropdown button").forEach(dropdownBtn => {
        if (podkategorie.includes(dropdownBtn.dataset.druh)) {
          dropdownBtn.classList.remove("active");
        }
      });

      aktivneDruhy.push(hlavnaKategoria);
      button.classList.add("active");
    }

    zafarbiKraje();

    if (aktivnyKraj) {
      zobrazKraj(aktivnyKraj);
    } else {
      zobrazSlovensko();
    }

    aktualizujGraf();
  });
});

// Dropdowny filtrov
crimeArrows.forEach(arrow => {
  arrow.addEventListener("click", (event) => {
    event.stopPropagation();

    const menuId = "menu-" + arrow.dataset.menu;
    const menu = document.getElementById(menuId);

    menu.classList.toggle("show");
  });
});

crimeDropdownButtons.forEach(button => {
  button.addEventListener("click", () => {
    const podkategoria = button.dataset.druh;
    const hlavnaKategoria = najdiHlavnuKategoriuPrePodkategoriu(podkategoria);

    if (aktivneDruhy.includes(podkategoria)) {
      aktivneDruhy = aktivneDruhy.filter(item => item !== podkategoria);
      button.classList.remove("active");
    } else {
      // podkategória sa vyberá, preto odstránime jej hlavnú kategóriu
      if (hlavnaKategoria) {
        aktivneDruhy = aktivneDruhy.filter(item => item !== hlavnaKategoria);

        document.querySelectorAll(".crime-btn").forEach(mainBtn => {
          if (mainBtn.dataset.druh === hlavnaKategoria) {
            mainBtn.classList.remove("active");
          }
        });
      }

      aktivneDruhy.push(podkategoria);
      button.classList.add("active");
    }

    // dropdown zámerne nezatvárame, aby sa dalo vybrať viac podkategórií

    zafarbiKraje();

    if (aktivnyKraj) {
      zobrazKraj(aktivnyKraj);
    } else {
      zobrazSlovensko();
    }

    aktualizujGraf();
  });
});

document.addEventListener("click", (event) => {
  const clickedInsideCrimeBar = event.target.closest(".crime-bar");

  if (!clickedInsideCrimeBar) {
    document.querySelectorAll(".crime-dropdown").forEach(dropdown => {
      dropdown.classList.remove("show");
    });
  }
});

// vymaže všetky vybrané druhy kriminality
resetVyberBtn.addEventListener("click", () => {
  aktivneDruhy = [];

  // odznačí hlavné tlačidlá
  crimeButtons.forEach(button => {
    button.classList.remove("active");
  });

  // odznačí podkategórie
  crimeDropdownButtons.forEach(button => {
    button.classList.remove("active");
  });

  // zavrie všetky dropdowny
  document.querySelectorAll(".crime-dropdown").forEach(dropdown => {
    dropdown.classList.remove("show");
  });

  // prekreslí mapu
  zafarbiKraje();

  // ak je vybraný kraj, zobrazí ten kraj s celkovou kriminalitou
  // ak nie je vybraný kraj, zobrazí Slovensko s celkovou kriminalitou
  if (aktivnyKraj) {
    zobrazKraj(aktivnyKraj);
  } else {
    zobrazSlovensko();
  }

  aktualizujGraf();
});

// Udalosti grafu

stiahnutGrafBtn.addEventListener("click", () => {
  if (!grafCanvas) {
    return;
  }

  const nazovGrafu = grafNazov ? grafNazov.textContent : "Vývoj kriminality";
  const paddingTop = 60;
  const paddingBottom = 20;

  const tempCanvas = document.createElement("canvas");
  const tempContext = tempCanvas.getContext("2d");

  tempCanvas.width = grafCanvas.width;
  tempCanvas.height = grafCanvas.height + paddingTop + paddingBottom;

  // biele pozadie
  tempContext.fillStyle = "white";
  tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // nadpis
  tempContext.fillStyle = "#111827";
  tempContext.font = "600 24px Public Sans, Arial, sans-serif";
  tempContext.textAlign = "center";
  tempContext.textBaseline = "middle";
  tempContext.fillText(nazovGrafu, tempCanvas.width / 2, 30);

  // graf pod nadpis
  tempContext.drawImage(grafCanvas, 0, paddingTop);

  const link = document.createElement("a");
  link.download = "graf-vyvoja-kriminality.png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
});

grafRokOdSelect.addEventListener("change", aktualizujGraf);
grafRokDoSelect.addEventListener("change", aktualizujGraf);
grafUkazovatelSelect.addEventListener("change", aktualizujGraf);

// Tooltip udalosti

kraje.forEach(kraj => {
  kraj.addEventListener("mouseenter", (event) => {
    mapTooltip.innerHTML = vytvorObsahTooltipu(kraj);
    mapTooltip.style.display = "block";
    posunTooltip(event);
  });

  kraj.addEventListener("mousemove", (event) => {
    mapTooltip.style.display = "block";
    posunTooltip(event);
  });

  kraj.addEventListener("mouseleave", () => {
    mapTooltip.style.display = "none";
  });
});

// Prepínač farbenia mapy

if (mapColorToggle) {
  mapColorToggle.addEventListener("click", () => {
    if (rezimFarbeniaMapy === "zistene") {
      rezimFarbeniaMapy = "index";
      mapColorToggle.dataset.mode = "index";
      mapColorToggle.textContent = "Farbenie mapy: Index kriminality";
    } else {
      rezimFarbeniaMapy = "zistene";
      mapColorToggle.dataset.mode = "zistene";
      mapColorToggle.textContent = "Farbenie mapy: Zistené trestné činy";
    }

    zafarbiKraje();
  });
}
