const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const base = __dirname;
const files = ["stock-analysis.html", "financial-ai.html", "digital-banking.html", "ai-governance.html"];
let failures = 0;

function fail(file, message) {
  failures += 1;
  console.error(`錯誤 ${file}：${message}`);
}
function localExists(file, link) {
  return fs.existsSync(path.resolve(base, link));
}

for (const file of files) {
  const html = fs.readFileSync(path.join(base, file), "utf8");
  const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
  if (!script) { fail(file, "找不到簡報資料"); continue; }
  const sandbox = {window: {}};
  try { vm.runInNewContext(script, sandbox, {filename:file, timeout:3000}); }
  catch (error) { fail(file, `資料語法錯誤：${error.message}`); continue; }
  const deck = sandbox.window.DECK;
  if (!deck || !Array.isArray(deck.slides) || deck.slides.length < 6) { fail(file, "投影片數或結構不完整"); continue; }
  if (!localExists(file, deck.icon)) fail(file, `主題圖示不存在：${deck.icon}`);
  const sourceIds = new Set(Object.keys(deck.sources || {}));
  const nodeIds = new Set((deck.graph?.nodes || []).map(node => node.id));
  if (nodeIds.size !== deck.graph.nodes.length) fail(file, "圖譜節點 ID 重複");
  for (const [id, source] of Object.entries(deck.sources || {})) {
    if (!source.url?.startsWith("https://")) fail(file, `來源 ${id} 缺少安全的原文網址`);
    if (!localExists(file, source.wiki)) fail(file, `來源 ${id} 的 Wiki 筆記不存在`);
  }
  for (const edge of deck.graph.edges || []) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) fail(file, `連線節點不存在：${edge.from} → ${edge.to}`);
    if (!sourceIds.has(edge.ref)) fail(file, `連線缺少來源：${edge.from} → ${edge.to}`);
  }
  for (const [index, slide] of deck.slides.entries()) {
    if (!slide.title || !slide.kicker) fail(file, `第 ${index + 1} 頁缺少標題`);
    for (const id of slide.refs || []) if (!sourceIds.has(id)) fail(file, `第 ${index + 1} 頁引用不存在的來源 ${id}`);
    for (const id of slide.focus || []) if (!nodeIds.has(id)) fail(file, `第 ${index + 1} 頁聚焦不存在的節點 ${id}`);
    if (slide.icon && !localExists(file, slide.icon)) fail(file, `第 ${index + 1} 頁圖示不存在`);
    if (slide.type === "chart") {
      if (!(slide.chart.max > 0) || !slide.chart.groups?.length) fail(file, `第 ${index + 1} 頁圖表設定不完整`);
      for (const group of slide.chart.groups || []) for (const row of group.rows || []) {
        if (!Number.isFinite(row.value) || row.value < 0 || row.value > slide.chart.max) fail(file, `第 ${index + 1} 頁數值超出圖軸：${row.label}`);
      }
    }
    if (slide.type === "matrix" && slide.matrix.rows.some(row => row.length !== slide.matrix.columns.length)) fail(file, `第 ${index + 1} 頁矩陣欄數不一致`);
  }
  console.log(`${file}：${deck.slides.length} 頁、${sourceIds.size} 篇來源、${deck.graph.nodes.length} 節點、${deck.graph.edges.length} 連線、${deck.slides.filter(slide => slide.type === "chart").length} 張數據圖`);
}

if (!fs.existsSync(path.join(base, "graph-deck.css")) || !fs.existsSync(path.join(base, "graph-deck.js"))) fail("共用檔案", "樣式或操作腳本缺失");
if (failures) process.exit(1);
console.log("結構、來源連結、圖譜與數值範圍檢查通過。");
