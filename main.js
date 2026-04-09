/* 古画 · 卷轴字解码库
 *
 * 形态：卷轴 + 竖排 + 单例面板 + 字位浮层
 *   卷轴 = #yfj 是 vertical-rl 的横向滚动容器，每句一列
 *   面板 = #yfj-panel 是卷轴下方的浮层，点字 → 填充 → 显示
 *
 * 配置来自 window.YFJ_CONFIG（在本脚本之前由各作品的 data 文件设置）：
 *   sentences: [{ p?, t, tr?, note? }, ...]  // p = 篇章 optional
 *   title: 引首竖排标题（例 "褚遂良　阴符经"）
 *   seal:  朱砂方印内容（例 "褚"）
 *   leafDir: 真迹图目录绝对路径（末尾带 /）
 *   leafCount: 图总数（用来算 sentence→leaf 线性映射）
 *   leafLabelPrefix / leafLabelSuffix: 面板里真迹标签前后缀
 *   tailText: 卷尾拖尾（可省）
 *   workName: 用于 img alt
 *
 * 数据结构原则：
 *   - 句子是单位，字只是位置
 *   - 标点全角化（vertical-rl 下半角标点排版会崩）
 *   - 没有特殊情况：标点 vs 汉字统一用同一渲染路径
 */

(function () {
  "use strict";

  const config = window.YFJ_CONFIG;
  if (!config || !Array.isArray(config.sentences)) {
    console.error("[yfj] window.YFJ_CONFIG 未设置或 sentences 缺失");
    return;
  }

  const SENTENCES = config.sentences;
  const LEAF_DIR = config.leafDir || "";
  const LEAF_COUNT = config.leafCount || 0;
  const LEAF_PREFIX = config.leafLabelPrefix || "真迹 · 第";
  const LEAF_SUFFIX = config.leafLabelSuffix || "开";
  const WORK_NAME = config.workName || "";

  /* 标点全角化兜底 */
  const norm = (s) => s
    .replace(/,/g, "，")
    .replace(/;/g, "；")
    .replace(/:/g, "：");

  /* 小工具：创建带类名/文本的元素 */
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  /* 清空一个元素的所有子节点（不用 innerHTML） */
  const empty = (node) => { while (node.firstChild) node.removeChild(node.firstChild); };

  /* ---------- 渲染：卷轴 ---------- */
  const HAN = /[\u4e00-\u9fff]/;
  const root = document.getElementById("yfj");
  const panelRoot = document.getElementById("yfj-panel");
  if (!root || !panelRoot) return;

  /* 引首：标题列 + 印章 */
  const heading = el("div", "yfj-heading");
  heading.appendChild(el("div", "yfj-heading__title", config.title || ""));
  if (config.seal) {
    const seal = el("div", "yfj-heading__seal", config.seal);
    seal.setAttribute("aria-hidden", "true");
    heading.appendChild(seal);
  }
  root.appendChild(heading);

  let lastPart = null;
  SENTENCES.forEach((s, i) => {
    /* 篇章分隔 —— 仅当 sentence 有 p 字段时 */
    if (s.p && s.p !== lastPart) {
      root.appendChild(el("div", "yfj-part", `${s.p}篇`));
      lastPart = s.p;
    }

    const col = el("section", "yfj-col");
    col.dataset.idx = String(i);

    [...norm(s.t)].forEach((ch, j) => {
      const span = el("span", null, ch);
      if (HAN.test(ch)) {
        span.className = "yfj-ch";
        span.dataset.ch = ch;
        span.dataset.cidx = String(j);
        span.tabIndex = 0;
        span.setAttribute("role", "button");
        span.setAttribute("aria-label", `字 ${ch}`);
      } else {
        span.className = "yfj-pun";
        span.setAttribute("aria-hidden", "true");
      }
      col.appendChild(span);
    });

    root.appendChild(col);
  });

  if (config.tailText) {
    root.appendChild(el("div", "yfj-tail", config.tailText));
  }

  /* ---------- 交互：单例面板 + 字位浮层 ---------- */
  let activeChar = null;
  let activeOverlay = null;

  function clearActive() {
    if (activeChar) activeChar.classList.remove("yfj-ch--active");
    activeChar = null;
    if (activeOverlay) {
      activeOverlay.remove();
      activeOverlay = null;
    }
  }

  function closePanel() {
    clearActive();
    panelRoot.classList.remove("yfj-panel--open");
    empty(panelRoot);
  }

  /* 在被点击的字位上挂一个放大的笔顺动画浮层。
     .yfj 是 position: relative，浮层 absolute 用 offsetLeft/Top 定位。 */
  function mountStrokeOverlay(ch) {
    if (typeof HanziWriter === "undefined") return;
    const charSize = Math.max(ch.offsetWidth, ch.offsetHeight);
    const size = Math.max(72, Math.min(140, charSize * 4));
    const overlay = el("div", "yfj-stroke-overlay");
    const oid = `stroke-overlay-${Date.now()}`;
    overlay.id = oid;
    overlay.style.left = (ch.offsetLeft + ch.offsetWidth / 2 - size / 2) + "px";
    overlay.style.top = (ch.offsetTop + ch.offsetHeight / 2 - size / 2) + "px";
    overlay.style.width = size + "px";
    overlay.style.height = size + "px";
    root.appendChild(overlay);
    activeOverlay = overlay;

    try {
      const writer = HanziWriter.create(oid, ch.dataset.ch, {
        width: size,
        height: size,
        padding: 8,
        showOutline: true,
        showCharacter: false,
        strokeAnimationSpeed: 1.0,
        delayBetweenStrokes: 220,
        strokeColor: "#8b1a1a",
        outlineColor: "rgba(139, 26, 26, 0.18)",
        radicalColor: "#8b1a1a",
      });
      writer.animateCharacter();
    } catch (e) {
      overlay.remove();
      activeOverlay = null;
    }
  }

  /* 句子序号 → 真迹图编号（线性映射） */
  function leafForIdx(idx) {
    if (!LEAF_COUNT) return 1;
    const leaf = Math.round((idx + 0.5) * LEAF_COUNT / SENTENCES.length);
    return Math.min(LEAF_COUNT, Math.max(1, leaf));
  }

  /* 在面板里挂一张真迹图 */
  function mountPanelLeaf(stage, idx) {
    if (!LEAF_DIR || !LEAF_COUNT) return;
    const leaf = leafForIdx(idx);
    const num = String(leaf).padStart(2, "0");
    const img = document.createElement("img");
    img.className = "yfj-panel__leaf-img";
    img.src = `${LEAF_DIR}${num}.jpg`;
    img.alt = `${WORK_NAME} 第 ${leaf} 开`;
    img.loading = "lazy";
    /* 点击由全局 lightbox.js 接管（在当前页浮现大图，不开新页面） */
    stage.appendChild(img);
  }

  function fillPanel(ch, idx) {
    clearActive();
    const data = SENTENCES[idx];
    empty(panelRoot);

    /* Header */
    const head = el("div", "yfj-panel__head");
    const partLabel = data.p ? `${data.p}篇 · ` : "";
    head.appendChild(el("span", "yfj-panel__src", `${partLabel}第 ${idx + 1} 句`));
    const closeBtn = el("button", "yfj-panel__close", "×");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "关闭");
    head.appendChild(closeBtn);
    panelRoot.appendChild(head);

    /* Body：左侧字形，右侧文本 */
    const body = el("div", "yfj-panel__body");

    const charBox = el("div", "yfj-panel__char-box");
    const stage = el("div", "yfj-panel__stage");
    stage.id = `panel-leaf-${idx}`;
    charBox.appendChild(stage);
    if (LEAF_COUNT) {
      charBox.appendChild(el("div", "yfj-panel__char-label",
        `${LEAF_PREFIX} ${leafForIdx(idx)} ${LEAF_SUFFIX}`));
    }
    body.appendChild(charBox);

    const text = el("div", "yfj-panel__text");
    /* 原文：把被点击的那个字（按 cidx 精确定位）包成高亮 span */
    const hitIdx = Number(ch.dataset.cidx);
    const orig = el("p", "yfj-panel__orig");
    [...norm(data.t)].forEach((c, j) => {
      const s = document.createElement("span");
      s.textContent = c;
      if (j === hitIdx) s.className = "yfj-panel__orig-hit";
      orig.appendChild(s);
    });
    text.appendChild(orig);
    if (data.tr) {
      text.appendChild(el("p", "yfj-panel__tr", data.tr));
    } else {
      text.appendChild(el("p", "yfj-panel__todo", "（这一句的释文还在写）"));
    }
    if (data.note) {
      text.appendChild(el("p", "yfj-panel__note", data.note));
    }
    body.appendChild(text);
    panelRoot.appendChild(body);

    ch.classList.add("yfj-ch--active");
    activeChar = ch;
    panelRoot.classList.add("yfj-panel--open");

    mountStrokeOverlay(ch);
    mountPanelLeaf(stage, idx);
  }

  root.addEventListener("click", (e) => {
    const ch = e.target.closest(".yfj-ch");
    if (!ch) return;
    if (activeChar === ch) { closePanel(); return; }
    const col = ch.closest(".yfj-col");
    fillPanel(ch, Number(col.dataset.idx));
  });

  panelRoot.addEventListener("click", (e) => {
    if (e.target.closest(".yfj-panel__close")) closePanel();
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const ch = e.target.closest(".yfj-ch");
    if (!ch) return;
    e.preventDefault();
    ch.click();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  /* 初始：滚到最右（卷轴的开头） */
  requestAnimationFrame(() => {
    root.scrollLeft = root.scrollWidth;
  });
})();
