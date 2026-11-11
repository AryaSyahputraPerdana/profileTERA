import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { units } from "./data/units.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const DAY_LABELS = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

const CODE39 = {
  "0": "nnnwwnwnn",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnwwnnnnn",
  "4": "nnnwwnnnw",
  "5": "wnnwwnnnn",
  "6": "nnwwwnnnn",
  "7": "nnnwnnwnw",
  "8": "wnnwnnwnn",
  "9": "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  ".": "wwnnnnwnn",
  " ": "nwwnnnwnn",
  $: "nwnwnwnnn",
  "/": "nwnwnnnwn",
  "+": "nwnnnwnwn",
  "%": "nnnwnwnwn",
  "*": "nwnnwnwnn",
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character];
  });
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function statusTag(status) {
  return `<span class="status status--${statusClass(status)}"><span class="status-dot" aria-hidden="true"></span>${escapeHtml(status)}</span>`;
}

/**
 * Real Code 39 barcode encoding the automation ID. 15 elements per
 * character, 5 bars and 4 spaces, three of the nine elements are wide.
 * Rendered as SVG so it stays sharp at any size.
 */
function barcodeSvg(value) {
  const text = `*${String(value).toUpperCase()}*`;
  const narrow = 1;
  const wide = 3;
  const quiet = 10;
  const height = 44;
  const barTop = 4;
  const barHeight = 36;
  const bars = [];
  let x = quiet;

  for (const character of text) {
    const pattern = CODE39[character];
    if (!pattern) {
      throw new Error(`Karakter "${character}" tidak didukung Code 39.`);
    }

    for (let index = 0; index < pattern.length; index += 1) {
      const width = pattern[index] === "w" ? wide : narrow;
      if (index % 2 === 0) {
        bars.push(
          `<rect x="${x}" y="${barTop}" width="${width}" height="${barHeight}"/>`,
        );
      }
      x += width;
    }
    x += narrow;
  }

  const totalWidth = x + quiet;

  return `<svg class="barcode" viewBox="0 0 ${totalWidth} ${height}" width="${totalWidth}" height="${height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" shape-rendering="crispEdges">${bars.join("")}</svg>`;
}

function weekStrip(days) {
  return `<ul class="week" aria-hidden="true">${DAY_LABELS.map(
    (label, index) => `<li class="${days[index] ? "is-on" : ""}">${label}</li>`,
  ).join("")}</ul>`;
}

function indexRow(unit, currentSlug) {
  const isCurrent = unit.slug === currentSlug;
  return `<li>
            <a class="index-row" href="./${unit.name}.html"${isCurrent ? ' aria-current="page"' : ""}>
              <span class="idx-no">${escapeHtml(unit.no)}</span>
              <span class="idx-name">${escapeHtml(unit.name)}</span>
              <span class="idx-feature">${escapeHtml(unit.feature)}</span>
              ${statusTag(unit.status)}
            </a>
          </li>`;
}

function registryRow(unit) {
  return `<li>
            <a class="registry-row" href="./${unit.name}.html" style="--row-accent: ${unit.accent};">
              <img class="registry-thumb" src="./assets/characters/thumbs/${unit.slug}.webp" width="240" height="320" alt="Potret karakter ${escapeHtml(unit.name)}." loading="lazy">
              <span class="registry-copy">
                <span class="registry-no">${escapeHtml(unit.no)}</span>
                <span class="registry-name">${escapeHtml(unit.name)}</span>
                <span class="registry-feature">${escapeHtml(unit.feature)}</span>
              </span>
              ${statusTag(unit.status)}
            </a>
          </li>`;
}

function registryPage() {
  const title = "RPA Unit Registry · Global Trade Digital Worker";
  const description =
    "13 digital worker RPA di Divisi Global Trade. Pilih unit untuk membuka profil, Automation ID, job desc, KPI, dan frekuensi.";
  const unitCount = String(units.length).padStart(2, "0");

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="id_ID">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <link rel="preload" href="./assets/fonts/overpass-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="./assets/registry.css">
</head>
<body class="index-page" style="--accent: #1e201b;">
  <a class="skip-link" href="#main">Lewati ke konten</a>

  <div class="registry" id="top">
    <div class="draft-strip" role="note">
      <span class="draft-label">DATA CONTOH</span>
      <span>Seluruh nilai pada profil unit belum final. Jangan dipakai untuk keputusan operasional.</span>
    </div>

    <header class="masthead">
      <a class="brand" href="#top">
        <span class="brand-mark">GT</span>
        <span class="brand-text">
          <span class="brand-line">GLOBAL TRADE</span>
          <span class="brand-sub">Digital Worker Registry</span>
        </span>
      </a>
      <p class="mast-meta"><span>RPA series</span><span>${unitCount} unit</span></p>
      <a class="index-link" href="./${units[0].name}.html">Buka unit 01</a>
    </header>
    <div class="accent-bar" aria-hidden="true"></div>

    <main id="main" tabindex="-1">
      <section class="registry-intro" aria-labelledby="registry-title">
        <p class="kicker"><span class="kicker-tag">RPA</span><span>Global Trade / Digital Worker Registry</span></p>
        <h1 id="registry-title">RPA unit registry</h1>
        <p>${units.length} digital worker RPA di Divisi Global Trade. Setiap unit punya profil sendiri, dengan Automation ID, job desc, KPI, dan frekuensi yang bisa dibuka langsung dari barcode.</p>
        <p class="registry-count"><span>${units.length} unit</span><span>${units.length} automation ID</span><span>1 seri</span></p>
      </section>

      <section class="registry-list" aria-labelledby="registry-list-title">
        <div class="registry-list-head">
          <h2 id="registry-list-title">Semua unit</h2>
          <p>Pilih unit untuk membuka profil lengkap.</p>
        </div>
        <ol class="registry-table">
          ${units.map(registryRow).join("\n          ")}
        </ol>
      </section>
    </main>

    <footer class="footer">
      <p>GLOBAL TRADE / DIGITAL WORKER REGISTRY<br>RPA series · ${units.length} unit · Rev. 2026.11</p>
      <p>Data contoh untuk uji tata letak. Sumber data final: Divisi Global Trade.</p>
      <a href="#top">Kembali ke atas</a>
    </footer>
  </div>
</body>
</html>
`;
}

function page(unit) {
  const title = `${unit.name} · ${unit.feature} · RPA Global Trade`;
  const description = `${unit.name}, digital worker RPA Global Trade untuk ${unit.feature}. Automation ID ${unit.automationId}. Profil unit, job desc, KPI, frekuensi, dan PIC. Halaman data contoh.`;
  const unitCount = String(units.length).padStart(2, "0");

  const kpiRows = unit.kpiRows
    .map(
      (row) => `<div><dt>${escapeHtml(row.label)}</dt><dd>${escapeHtml(row.value)}</dd></div>`,
    )
    .join("\n              ");

  const inputs = unit.inputs
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const outputs = unit.outputs
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="id_ID">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <link rel="preload" href="./assets/fonts/overpass-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="./assets/characters/${unit.slug}.webp" as="image" type="image/webp" fetchpriority="high">
  <link rel="stylesheet" href="./assets/registry.css">
</head>
<body style="--accent: ${unit.accent};">
  <a class="skip-link" href="#main">Lewati ke konten</a>

  <div class="registry" id="top">
    <div class="draft-strip" role="note">
      <span class="draft-label">DATA CONTOH</span>
      <span>Seluruh nilai di halaman ini belum final. Jangan dipakai untuk keputusan operasional.</span>
    </div>

    <header class="masthead">
      <a class="brand" href="#top">
        <span class="brand-mark">GT</span>
        <span class="brand-text">
          <span class="brand-line">GLOBAL TRADE</span>
          <span class="brand-sub">Digital Worker Registry</span>
        </span>
      </a>
      <p class="mast-meta"><span>RPA series</span><span>Unit ${escapeHtml(unit.no)} / ${unitCount}</span></p>
      <a class="index-link" href="./">Indeks unit</a>
    </header>
    <div class="accent-bar" aria-hidden="true"></div>

    <main id="main" tabindex="-1">
      <section class="hero" aria-labelledby="unit-name">
        <div class="hero-copy">
          <p class="kicker"><span class="kicker-tag">RPA</span><span>${escapeHtml(unit.functionClass)}</span></p>
          <h1 id="unit-name">${escapeHtml(unit.name)}</h1>
          <p class="feature">${escapeHtml(unit.feature)}</p>
          <p class="hero-note">${escapeHtml(unit.summary)}</p>
          <div class="hero-foot">
            <p class="hero-state"><span class="sr-only">Status unit: </span>${statusTag(unit.status)}</p>
            <span class="hero-id">${escapeHtml(unit.automationId)}</span>
          </div>
        </div>

        <figure class="portrait">
          <div class="portrait-inner">
            <div class="portrait-frame">
              <img src="./assets/characters/${unit.slug}.webp" width="864" height="1152" alt="Potret karakter ${escapeHtml(unit.name)}, digital worker RPA Global Trade." fetchpriority="high">
              <span class="unit-stamp" aria-hidden="true"><span class="stamp-no">${escapeHtml(unit.no)}</span><span class="stamp-label">UNIT</span></span>
            </div>
            <figcaption class="portrait-caption">
              <div class="barcode-block">
                <span class="barcode-label">AUTOMATION ID</span>
                ${barcodeSvg(unit.automationId)}
              </div>
              <span class="barcode-id">${escapeHtml(unit.automationId)}</span>
            </figcaption>
          </div>
        </figure>
      </section>

      <section class="spec" aria-labelledby="spec-title">
        <div class="spec-head">
          <h2 id="spec-title">Unit specification</h2>
          <span>Data contoh · Rev. 2026.11</span>
        </div>
        <dl class="spec-grid">
          <div class="spec-item">
            <dt>Automation ID</dt>
            <dd class="mono">${escapeHtml(unit.automationId)}</dd>
          </div>
          <div class="spec-item spec-feature">
            <dt>Feature Name</dt>
            <dd>${escapeHtml(unit.feature)}</dd>
          </div>
          <div class="spec-item">
            <dt>Status</dt>
            <dd>${statusTag(unit.status)}</dd>
          </div>
          <div class="spec-item">
            <dt>Implementation Date</dt>
            <dd class="mono"><time datetime="${escapeHtml(unit.implementationDate)}">${escapeHtml(unit.implementationDate)}</time></dd>
          </div>
          <div class="spec-item">
            <dt>User Group</dt>
            <dd class="mono">${escapeHtml(unit.userGroup)}</dd>
          </div>
          <div class="spec-item">
            <dt>PIC</dt>
            <dd>${escapeHtml(unit.pic)}</dd>
          </div>
          <div class="spec-item">
            <dt>Frequency</dt>
            <dd>${escapeHtml(unit.frequency.short)}</dd>
          </div>
        </dl>
      </section>

      <section class="record" aria-labelledby="record-title">
        <div class="record-main">
          <p class="section-no">01 / Job desc</p>
          <h2 id="record-title">Apa yang dikerjakan unit ini</h2>
          <div class="prose">
            ${unit.jobDesc.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n            ")}
          </div>
          <div class="handover">
            <div>
              <h3>INPUT</h3>
              <ul>${inputs}</ul>
            </div>
            <div class="handover-arrow" aria-hidden="true">→</div>
            <div>
              <h3>OUTPUT</h3>
              <ul>${outputs}</ul>
            </div>
          </div>
        </div>

        <aside class="record-side">
          <section class="kpi-block" aria-labelledby="kpi-title">
            <h2 class="section-no" id="kpi-title">02 / KPI</h2>
            <div class="kpi-primary">
              <span class="kpi-value">${escapeHtml(unit.kpi.value)}<span class="kpi-unit">${escapeHtml(unit.kpi.unit)}</span></span>
              <span class="kpi-label">${escapeHtml(unit.kpi.label)}</span>
              <span class="kpi-target">${escapeHtml(unit.kpi.target)}</span>
            </div>
            <dl class="kpi-list">
              ${kpiRows}
            </dl>
          </section>

          <section class="freq-block" aria-labelledby="freq-title">
            <h2 class="section-no" id="freq-title">03 / Frequency</h2>
            <p class="freq-time">${escapeHtml(unit.frequency.detail)}</p>
            <p class="freq-days">${escapeHtml(unit.frequency.daysLabel)}</p>
            ${weekStrip(unit.frequency.days)}
          </section>
        </aside>
      </section>

      <section class="unit-index" id="unit-index" aria-labelledby="index-title">
        <div class="index-head">
          <div>
            <p class="section-no">04 / Registry</p>
            <h2 id="index-title">Indeks unit RPA</h2>
          </div>
          <p>${units.length} unit dalam seri ini. Pilih unit untuk membuka profilnya.</p>
        </div>
        <ol class="index-list">
          ${units.map((item) => indexRow(item, unit.slug)).join("\n          ")}
        </ol>
      </section>
    </main>

    <footer class="footer">
      <p>GLOBAL TRADE / DIGITAL WORKER REGISTRY<br>RPA series · ${units.length} unit · Rev. 2026.11</p>
      <p>Data contoh untuk uji tata letak. Sumber data final: Divisi Global Trade.</p>
      <a href="#top">Kembali ke atas</a>
    </footer>
  </div>
</body>
</html>
`;
}

async function build() {
  const slugs = new Set();

  for (const unit of units) {
    if (slugs.has(unit.slug)) {
      throw new Error(`Slug duplikat: ${unit.slug}`);
    }
    slugs.add(unit.slug);

    const filename = `${unit.name}.html`;
    await writeFile(path.join(root, filename), page(unit), "utf8");
    console.log(`rpa/${filename}`);
  }

  await writeFile(path.join(root, "index.html"), registryPage(), "utf8");
  console.log("rpa/index.html");
  console.log(`\n${units.length} profil dan 1 registry dibangun.`);
}

await build();
