(() => {
  "use strict";
  const data = window.DECK;
  if (!data || !Array.isArray(data.slides) || !data.graph) return;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const source = id => data.sources[id];
  const refs = ids => (ids || []).map(id => source(id)).filter(Boolean);
  function wikiHref(item) {
    if (location.hostname.endsWith(".github.io") && item.wiki.startsWith("../wiki/")) {
      const owner = location.hostname.split(".")[0];
      const repo = location.pathname.split("/")[1];
      return `https://github.com/${owner}/${repo}/blob/main/wiki/${item.wiki.slice("../wiki/".length)}`;
    }
    return item.wiki;
  }

  function slideTop(slide, index) {
    return `<div class="slide-top"><p class="eyebrow">${esc(slide.kicker || data.topic)}</p><span class="slide-no">${String(index + 1).padStart(2, "0")} / ${String(data.slides.length).padStart(2, "0")}</span></div>`;
  }
  function facts(items) {
    return `<ul class="fact-list">${(items || []).map(item => `<li><strong>${esc(item.label)}</strong><p>${esc(item.text)}</p></li>`).join("")}</ul>`;
  }
  function foot(slide) {
    const links = refs(slide.refs).map(item => `<a href="${esc(item.url)}" target="_blank" rel="noopener">${esc(item.short)} 原文 ↗</a><a href="${esc(wikiHref(item))}" target="_blank" rel="noopener">Wiki 筆記 ↗</a>`).join("");
    return `${slide.note ? `<p class="caveat">${esc(slide.note)}</p>` : ""}<footer class="source-foot"><span>來源與核對</span>${links || "<span>本頁為跨來源整理；詳見文獻頁。</span>"}</footer>`;
  }
  function heading(slide) {
    return `<h2>${esc(slide.title)}</h2>${slide.lead ? `<p class="lead">${esc(slide.lead)}</p>` : ""}`;
  }
  function graph(slide, index) {
    const nodes = data.graph.nodes;
    const edges = data.graph.edges;
    const focus = new Set(slide.focus || []);
    const hasFocus = focus.size > 0;
    const byId = Object.fromEntries(nodes.map(node => [node.id, node]));
    const nodeWidth = 146, nodeHeight = 60;
    const edgeParts = edges.map(edge => {
      const a = byId[edge.from], b = byId[edge.to];
      if (!a || !b) return "";
      const dx = b.x - a.x, dy = b.y - a.y;
      let x1 = a.x, y1 = a.y, x2 = b.x, y2 = b.y;
      if (Math.abs(dx) >= Math.abs(dy)) {
        x1 += Math.sign(dx) * (nodeWidth / 2 + 2);
        x2 -= Math.sign(dx) * (nodeWidth / 2 + 13);
      } else {
        y1 += Math.sign(dy) * (nodeHeight / 2 + 2);
        y2 -= Math.sign(dy) * (nodeHeight / 2 + 13);
      }
      const active = !hasFocus || (focus.has(edge.from) && focus.has(edge.to));
      const marker = active ? `url(#arrow-${index})` : "none";
      const line = `<path class="graph-edge${active ? "" : " is-muted"}" data-kind="${esc(edge.type)}" d="M ${x1} ${y1} L ${x2} ${y2}" marker-end="${marker}"><title>${esc(edge.label)}；${esc(source(edge.ref)?.short || "跨來源整理")}</title></path>`;
      if (!hasFocus || !active || !edge.label) return line;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 10;
      const labelWidth = Math.max(48, Array.from(edge.label).length * 14 + 18);
      return line + `<g class="edge-label" transform="translate(${mx} ${my})"><rect x="${-labelWidth / 2}" y="-13" width="${labelWidth}" height="26" rx="11"/><text y="1">${esc(edge.label)}</text></g>`;
    }).join("");
    const nodeParts = nodes.map(node => {
      const muted = hasFocus && !focus.has(node.id);
      const lines = Array.isArray(node.label) ? node.label : [node.label];
      const lineText = lines.map((line, i) => `<tspan x="0" dy="${i ? 18 : 0}">${esc(line)}</tspan>`).join("");
      const y = lines.length > 1 ? -9 : 1;
      return `<g class="graph-node${muted ? " is-muted" : ""}" data-kind="${esc(node.kind)}" transform="translate(${node.x} ${node.y})"><title>${esc(lines.join(""))}</title><rect x="-${nodeWidth / 2}" y="-${nodeHeight / 2}" width="${nodeWidth}" height="${nodeHeight}" rx="18"/><text y="${y}">${lineText}</text></g>`;
    }).join("");
    return `<div class="graph-wrap"><svg role="img" aria-label="${esc(slide.graphLabel || "研究關係圖；各連線的證據來源列於本頁下方")}" viewBox="0 0 720 465" preserveAspectRatio="xMidYMid meet"><defs><marker id="arrow-${index}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="strokeWidth"><path d="M 1 1 L 8 4.5 L 1 8 Z" fill="#433248"/></marker></defs>${edgeParts}${nodeParts}</svg></div>`;
  }
  function legend() {
    const labels = {estimate:"事件估計", association:"統計相關", sequence:"觀察順序", comparison:"同任務比較", proposal:"建議或推論", structure:"資料或架構", boundary:"解讀邊界"};
    const kinds = [...new Set(data.graph.edges.map(edge => edge.type))];
    return `<div class="legend" aria-label="關係圖圖例">${kinds.map(kind => `<span class="${esc(kind)}"><i></i>${labels[kind] || esc(kind)}</span>`).join("")}</div>`;
  }
  function renderCover(slide, index) {
    return `${slideTop(slide, index)}<div class="cover-grid"><div class="cover-copy"><h1>${esc(slide.title)}</h1><p class="lead">${esc(slide.lead)}</p><div class="cover-chip-row">${(slide.chips || []).map(chip => `<span class="cover-chip">${esc(chip)}</span>`).join("")}</div></div><div class="cover-visual" aria-hidden="true"><div class="orbit"></div><img src="${esc(slide.icon || data.icon)}" alt=""></div></div>${foot(slide)}`;
  }
  function renderMap(slide, index) {
    return `${slideTop(slide, index)}${heading(slide)}<div class="section-grid wide-graph map-layout"><div class="copy-column">${facts(slide.facts)}${legend()}</div>${graph(slide, index)}</div>${foot(slide)}`;
  }
  function renderFocus(slide, index) {
    return `${slideTop(slide, index)}${heading(slide)}<div class="section-grid"><div class="copy-column">${facts(slide.facts)}</div>${graph(slide, index)}</div>${foot(slide)}`;
  }
  function renderChart(slide, index) {
    const chart = slide.chart;
    const groups = chart.groups.map(group => `<div class="bar-group"><div class="bar-group-label">${esc(group.label)}</div>${group.rows.map(row => {
      const percent = Math.max(0, Math.min(100, row.value / chart.max * 100));
      return `<div class="bar-row"><span class="bar-row-label">${esc(row.label)}</span><span class="bar-track" role="img" aria-label="${esc(group.label)}：${esc(row.label)}，${esc(row.display)}"><span class="bar-fill" style="--bar-width:${percent.toFixed(2)}%"></span></span><span class="bar-value">${esc(row.display)}</span></div>`;
    }).join("")}</div>`).join("");
    const path = (slide.path || []).map((item, i) => `${i ? "<b>→</b>" : ""}<span>${esc(item)}</span>`).join("");
    const compact = chart.groups.length > 2;
    const axis = compact ? `<div class="chart-axis chart-axis-compact">每組橫條範圍：${esc(chart.axis[0])} 至 ${esc(chart.axis[1])}</div>` : `<div class="chart-axis"><span>${esc(chart.axis[0])}</span><span>${esc(chart.axis[1])}</span></div>`;
    return `${slideTop(slide, index)}${heading(slide)}${path ? `<div class="path-chips" aria-label="本頁聚焦的圖譜路徑">${path}</div>` : ""}<div class="chart-layout"><div class="chart-card${compact ? " chart-compact" : ""}"><div class="chart-title">${esc(chart.title)}</div><p class="chart-subtitle">${esc(chart.subtitle)}</p><div class="bar-groups">${groups}</div>${axis}</div><div class="chart-side">${facts(slide.facts)}</div></div>${foot(slide)}`;
  }
  function renderMatrix(slide, index) {
    const matrix = slide.matrix;
    return `${slideTop(slide, index)}${heading(slide)}<div class="matrix-wrap"><table><thead><tr>${matrix.columns.map(column => `<th scope="col">${esc(column)}</th>`).join("")}</tr></thead><tbody>${matrix.rows.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${foot(slide)}`;
  }
  function renderSummary(slide, index) {
    return `${slideTop(slide, index)}${heading(slide)}<div class="takeaway-grid">${(slide.cards || []).map((card, i) => `<article class="takeaway-card"><span class="number">${String(i + 1).padStart(2, "0")}</span><h3>${esc(card.title)}</h3><p>${esc(card.text)}</p></article>`).join("")}</div>${foot(slide)}`;
  }
  function renderSources(slide, index) {
    const cards = Object.values(data.sources).map(item => `<article class="source-card"><h3>${esc(item.name)}</h3><p>${esc(item.detail)}</p><div class="links"><a href="${esc(item.url)}" target="_blank" rel="noopener">原始來源 ↗</a><a href="${esc(wikiHref(item))}" target="_blank" rel="noopener">Wiki 筆記 ↗</a></div></article>`).join("");
    return `${slideTop(slide, index)}${heading(slide)}<div class="source-grid">${cards}</div>${slide.note ? `<p class="caveat">${esc(slide.note)}</p>` : ""}`;
  }
  const renderers = {cover:renderCover, map:renderMap, focus:renderFocus, chart:renderChart, matrix:renderMatrix, summary:renderSummary, sources:renderSources};
  const root = document.getElementById("deck");
  if (!root) return;
  document.documentElement.dataset.theme = data.theme || "stock";
  root.setAttribute("aria-label", `${data.topic}簡報`);
  root.innerHTML = data.slides.map((slide, index) => `<section class="slide" aria-label="${esc(slide.title)}" aria-hidden="true">${(renderers[slide.type] || renderFocus)(slide, index)}</section>`).join("");

  const slides = [...root.querySelectorAll(".slide")];
  const counter = document.getElementById("counter");
  const progress = document.getElementById("progress-fill");
  let current = 0;
  function show(index) {
    current = Math.min(slides.length - 1, Math.max(0, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      slide.setAttribute("aria-hidden", String(i !== current));
      if (i === current) slide.scrollTop = 0;
    });
    counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    progress.style.width = `${(current + 1) / slides.length * 100}%`;
    document.title = `${data.slides[current].title}｜${data.topic}`;
    history.replaceState(null, "", `#slide-${current + 1}`);
  }
  document.getElementById("prev").addEventListener("click", () => show(current - 1));
  document.getElementById("next").addEventListener("click", () => show(current + 1));
  document.getElementById("fullscreen").addEventListener("click", async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await root.requestFullscreen(); } catch (_) { /* 瀏覽器可能不允許全螢幕。 */ }
  });
  document.addEventListener("keydown", event => {
    if (["ArrowRight", "PageDown"].includes(event.key) || (event.key === " " && !["BUTTON", "A"].includes(document.activeElement?.tagName))) { event.preventDefault(); show(current + 1); }
    else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); show(current - 1); }
    else if (event.key === "Home") show(0);
    else if (event.key === "End") show(slides.length - 1);
    else if (event.key.toLowerCase() === "f") document.getElementById("fullscreen").click();
  });
  let touchStart = null;
  root.addEventListener("touchstart", event => { touchStart = event.changedTouches[0].clientX; }, {passive:true});
  root.addEventListener("touchend", event => {
    if (touchStart === null) return;
    const delta = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 65) show(current + (delta < 0 ? 1 : -1));
    touchStart = null;
  }, {passive:true});
  const requested = Number.parseInt(location.hash.match(/^#slide-(\d+)$/)?.[1] || "1", 10);
  show(requested - 1);
  window.addEventListener("hashchange", () => {
    const index = Number.parseInt(location.hash.match(/^#slide-(\d+)$/)?.[1] || "1", 10);
    show(index - 1);
  });
})();
