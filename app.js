// DOM要素の参照をまとめて取得
const checkButton = document.getElementById("checkClipboard");
const overlay = document.getElementById("overlay");
const modalBody = document.getElementById("modalBody");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");
const status = document.getElementById("status");

// 長いテキストをモーダル内で見やすくするためにカット
const truncate = (text, max = 120) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

const openModal = () => overlay.classList.add("active");
const hideModal = () => overlay.classList.remove("active");

// ステータスメッセージと色を一括更新
const updateStatus = (message, tone = "default") => {
  status.textContent = message;
  status.style.color =
    tone === "warn" ? "#f0c067" : tone === "error" ? "#ff857a" : "#aebdc6";
};

// クリップボードの中身に応じてモーダル文言を生成
const buildMessage = (clipboardText) => {
  const cleaned = clipboardText.trim();
  if (!cleaned) {
    modalTitle.textContent = "クリップボードは空かもしれません";
    modalBody.textContent =
      "値が空でした。空白や改行だけでも読み取れますが、今回は何もコピーされていないようです。";
    return;
  }

  modalTitle.textContent = `あなたのパスワードは…${truncate(cleaned)}ですか？`;
  modalBody.textContent = `「${truncate(cleaned)}」という文字列を読み取りました。貼り付け操作だけで、こんなふうに中身が見えてしまいます。`;
};

// 貼り付けイベントでクリップボードの文字列を取得し、結果を表示
const handlePaste = (event) => {
  const text = event.clipboardData?.getData("text") || "";
  buildMessage(text);
  updateStatus("貼り付けから読み取りました。上のポップアップを確認してください。");
  openModal();
};

// ボタンで「貼り付けてください」と案内、実際の読み取りは paste イベントで行う
checkButton?.addEventListener("click", () => {
  updateStatus("このページ上で Ctrl+V / Cmd+V を押すと読み取ります。");
});

document.addEventListener("paste", handlePaste);
closeModal?.addEventListener("click", hideModal);
overlay?.addEventListener("click", (event) => {
  if (event.target === overlay) hideModal();
});
