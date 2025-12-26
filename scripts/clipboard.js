// クリップボード読み取りとモーダル制御
const state = {};

const truncate = (text, max = 120) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

const selectDom = () => {
  state.checkButton = document.getElementById("checkClipboard");
  state.readButton = document.getElementById("readClipboard");
  state.overlay = document.getElementById("overlay");
  state.modalBody = document.getElementById("modalBody");
  state.modalTitle = document.getElementById("modalTitle");
  state.closeModal = document.getElementById("closeModal");
  state.status = document.getElementById("status");
};

const openModal = () => state.overlay?.classList.add("active");
const hideModal = () => state.overlay?.classList.remove("active");

const updateStatus = (message, tone = "default") => {
  if (!state.status) return;
  state.status.textContent = message;
  state.status.style.color =
    tone === "warn" ? "#f0c067" : tone === "error" ? "#ff857a" : "#aebdc6";
};

const buildMessage = (clipboardText) => {
  const cleaned = clipboardText.trim();
  if (!cleaned) {
    state.modalTitle.textContent = "クリップボードは空かもしれません";
    state.modalBody.textContent =
      "値が空でした。空白や改行だけでも読み取れますが、今回は何もコピーされていないようです。";
    return;
  }

  state.modalTitle.textContent = `あなたのパスワードは…${truncate(cleaned)}ですか？`;
  state.modalBody.textContent = `「${truncate(cleaned)}」という文字列を読み取りました。貼り付け操作だけで、こんなふうに中身が見えてしまいます。このサイトでは取得した内容をどこかに送信するコードは無いので安心してください。`;
};

const handlePaste = (event) => {
  const text = event.clipboardData?.getData("text") || "";
  buildMessage(text);
  updateStatus("貼り付けから読み取りました。上のポップアップを確認してください。");
  openModal();
};

const handleClipboardRead = async () => {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    updateStatus("このブラウザは Clipboard API をサポートしていません。", "error");
    return;
  }

  updateStatus("読み取り中…（ブラウザの許可が求められる場合があります）", "warn");

  try {
    const text = await navigator.clipboard.readText();
    buildMessage(text);
    updateStatus("クリップボードから直接読み取りました。上のポップアップを確認してください。");
    openModal();
  } catch (error) {
    if (error.name === "NotAllowedError") {
      updateStatus("読み取りが拒否されました。サイトにクリップボードの許可を与えてください。", "error");
    } else {
      updateStatus("読み取りに失敗しました。もう一度お試しください。", "error");
      console.error("Clipboard read failed", error);
    }
  }
};

const bindEvents = () => {
  state.checkButton?.addEventListener("click", () => {
    updateStatus("このページ上で Ctrl+V / Cmd+V を押すと読み取ります。");
  });

  state.readButton?.addEventListener("click", handleClipboardRead);
  document.addEventListener("paste", handlePaste);
  state.closeModal?.addEventListener("click", hideModal);
  state.overlay?.addEventListener("click", (event) => {
    if (event.target === state.overlay) hideModal();
  });
};

export const initClipboardHandlers = () => {
  selectDom();
  if (!state.overlay || !state.modalTitle || !state.modalBody) {
    console.warn("Modal elements not found; clipboard handlers not attached.");
    return;
  }
  bindEvents();
};
