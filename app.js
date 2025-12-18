import { loadSections } from "./scripts/sections.js";
import { initClipboardHandlers } from "./scripts/clipboard.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadSections(); // 部品を読み込んでからイベントを付与
  initClipboardHandlers();
});
