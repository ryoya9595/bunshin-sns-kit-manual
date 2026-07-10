const PROMPTS = {
  promptCheck: "この保管庫にあるノートを一覧して",
  promptSetup: "セットアップ.md の通りにセットアップして",
  promptFallback: "セットアップ.md を読んで、その手順どおりに実行して",
  promptFallbackMac: "キットのコピーは cp -R でやり直して",
  promptFallbackWin: "キットのコピーは PowerShell の Copy-Item -Recurse でやり直して",
  promptSelfIntro: "自己紹介して",
  promptAbeInsta: "ClaudeとCanvaの連携ネタで、お手本を1本お願いします",
  promptAbeYoutube: "AI副業の始め方で、お手本を1本お願いします",
  promptSkillMaker: "毎回やってる作業を楽にしたい。何をスキルにすればいいか相談したい",
};

// 各 <pre> に本文を流し込む
Object.entries(PROMPTS).forEach(([id, text]) => {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
});

async function copyText(text, target) {
  let ok = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      ok = true;
    }
  } catch {
    ok = false;
  }
  if (!ok && target) {
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    sel.removeAllRanges();
  }
  return ok;
}

// data-target を持つコピーボタンを汎用処理
document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const targetId = button.dataset.target;
    const target = document.getElementById(targetId);
    const text = PROMPTS[targetId] || (target ? target.textContent : "");
    const ok = await copyText(text, target);
    button.textContent = ok ? "コピーしました" : "手動でコピーしてください";
    button.classList.toggle("copied", ok);
    setTimeout(() => {
      button.textContent = "コピー";
      button.classList.remove("copied");
    }, 2000);
  });
});

// 画像が未配置のときは「準備中」プレースホルダーに差し替え（CSPでinline onerror不可のためJSで処理）
document.querySelectorAll("figure.shot img").forEach((img) => {
  img.addEventListener("error", () => {
    const figure = img.closest("figure.shot");
    if (!figure || figure.classList.contains("is-placeholder")) return;
    figure.classList.add("is-placeholder");
    const file = (img.getAttribute("src") || "").split("/").pop();
    const box = document.createElement("div");
    box.className = "shot-placeholder";
    box.textContent = "📸 スクリーンショット準備中（" + file + "）";
    img.replaceWith(box);
  });
});
