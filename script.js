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

const grafRokOdSelect = document.getElementById("graf-rok-od");
const grafRokDoSelect = document.getElementById("graf-rok-do");
const grafUkazovatelSelect = document.getElementById("graf-ukazovatel");
const grafCanvas = document.getElementById("grafVyvoja");

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

//mapovanie nazvov
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

//nie je vybrany ziadny druh vybera sa celkova
function getVybraneDruhy() {
  if (aktivneDruhy.length === 0) {
    return ["CELKOVÁ KRIMINALITA"];
  }

  return aktivneDruhy;
}


let data = [];
let populaciaData = [];
let aktivnyKraj = null;
let aktivneDruhy = [];
let grafVyvoja = null; 

function nastavPrazdnuLegendu() {
  legend1.textContent = "-";
  legend2.textContent = "-";
  legend3.textContent = "-";
  legend4.textContent = "-";
  legend5.textContent = "-";
}

function zafarbiKraje() {
  const vybranyRok = Number(rokSelect.value);
  const vybraneDruhy = getVybraneDruhy();

  const hodnotyKrajov = [];

  kraje.forEach(kraj => {
    const nazov = mappingKrajov[kraj.id];

    const zaznamy = data.filter(item =>
      item.kraj === nazov &&
      item.rok === vybranyRok &&
      vybraneDruhy.includes(item.druh_kriminality)
    );

    const sucet = spocitajZaznamy(zaznamy);

    if (zaznamy.length > 0) {
      hodnotyKrajov.push({
        krajElement: kraj,
        hodnota: sucet.zistene
      });
    } else {
      kraj.style.fill = "#ccc";
    }
  });

  if (hodnotyKrajov.length === 0) {
    nastavPrazdnuLegendu();
    return;
  }

  const hodnoty = hodnotyKrajov.map(item => item.hodnota);
  const min = Math.min(...hodnoty);
  const max = Math.max(...hodnoty);

  if (min === max) {
    legend1.textContent = `${min}`;
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

  legend1.textContent = `${Math.round(min)} – ${Math.round(hranica1)}`;
  legend2.textContent = `${Math.round(hranica1)} – ${Math.round(hranica2)}`;
  legend3.textContent = `${Math.round(hranica2)} – ${Math.round(hranica3)}`;
  legend4.textContent = `${Math.round(hranica3)} – ${Math.round(hranica4)}`;
  legend5.textContent = `${Math.round(hranica4)} – ${Math.round(max)}`;

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
  maximumFractionDigits: 2 }) + " %";
  skodaSpan.textContent = sucet.skoda.toLocaleString("sk-SK") + "€";
  alkoholSpan.textContent = sucet.alkohol.toLocaleString("sk-SK");
  drogySpan.textContent = sucet.drogy.toLocaleString("sk-SK");
  obyvateliaSpan.textContent = populaciaSpolu > 0 ? populaciaSpolu.toLocaleString("sk-SK") : "-";

  indexKriminalitySpan.textContent = populaciaSpolu > 0
    ? index.toLocaleString("sk-SK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
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
    maximumFractionDigits: 2}) + " %";
    skodaSpan.textContent = sucet.skoda.toLocaleString("sk-SK") + "€";
    alkoholSpan.textContent = sucet.alkohol.toLocaleString("sk-SK");
    drogySpan.textContent = sucet.drogy.toLocaleString("sk-SK");

    if (zaznamPop && zaznamPop.obyvatelia > 0) {
      const index = (sucet.zistene / zaznamPop.obyvatelia) * 1000;
      obyvateliaSpan.textContent = zaznamPop.obyvatelia.toLocaleString("sk-SK");
      indexKriminalitySpan.textContent = index.toLocaleString("sk-SK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
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


//tlačidlá
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

//dropdown
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


//sucet
function spocitajZaznamy(zaznamy) {
  return zaznamy.reduce((acc, item) => {
    acc.zistene += item.zistene || 0;
    acc.objasnene += item.objasnene || 0;
    acc.skoda += item.skoda || 0;
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


function zobrazTextVyberu(druhy) {
  if (aktivneDruhy.length === 0) {
    return "Celková kriminalita";
  }

  return druhy.map(druh => zobrazNazovKriminality(druh)).join(", ");
}

document.addEventListener("click", (event) => {
  const clickedInsideCrimeBar = event.target.closest(".crime-bar");

  if (!clickedInsideCrimeBar) {
    document.querySelectorAll(".crime-dropdown").forEach(dropdown => {
      dropdown.classList.remove("show");
    });
  }
});

resetVyberBtn.addEventListener("click", () => {
  // vymaže všetky vybrané druhy kriminality
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
    hodnoty.push(Number(hodnota.toFixed(2)));
  }

  const nazovUkazovatela = grafUkazovatelSelect.options[grafUkazovatelSelect.selectedIndex].text;
  const nazovVyberu = zobrazTextVyberu(vybraneDruhy);

  if (grafVyvoja) {
    grafVyvoja.destroy();
  }

  grafVyvoja = new Chart(grafCanvas, {
    type: "line",
    data: {
      labels: roky,
      datasets: [{
        label: `${nazovUkazovatela} – ${nazovOblasti} – ${nazovVyberu}`,
        data: hodnoty,
        tension: 0.25,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6
}]
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

          return hodnota.toLocaleString("sk-SK", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          }) + jednotka;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
  });
}

grafRokOdSelect.addEventListener("change", aktualizujGraf);
grafRokDoSelect.addEventListener("change", aktualizujGraf);
grafUkazovatelSelect.addEventListener("change", aktualizujGraf);