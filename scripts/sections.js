export const loadSections = async () => {
  const targets = document.querySelectorAll("[data-include]");

  const loads = Array.from(targets).map(async (node) => {
    const url = node.getAttribute("data-include");
    if (!url) return;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      node.outerHTML = html;
    } catch (error) {
      console.error("Section load failed:", url, error);
      node.innerHTML = '<p class="note">このセクションを読み込めませんでした。</p>';
    }
  });

  await Promise.all(loads);
};
