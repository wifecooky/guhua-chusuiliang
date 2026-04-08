/* 古画 · 字解码 · 褚遂良《阴符经》
 *
 * 形态：卷轴 + 竖排 + 单例面板
 *   卷轴 = #yfj 是 vertical-rl 的横向滚动容器，每句一列
 *   面板 = #yfj-panel 是卷轴下方的单例，点字 → 填充 → 显示
 *
 * 数据结构原则：
 *   - 句子是单位，字只是位置
 *   - 标点全角化（vertical-rl 下半角标点排版会崩）
 *   - 没有特殊情况：标点 vs 汉字统一用同一渲染路径
 */

(function () {
  "use strict";

  /* ---------- 数据 ---------- */
  const SENTENCES = [
    { p: "上", t: "观天之道，执天之行，尽矣。",
      tr: "观察天的法则，遵循天的运行规律——这就够了。",
      note: "全篇开宗明义。'尽矣'二字是先秦诸子里少见的——一句话讲完就够，不再展开。" },
    { p: "上", t: "故天有五贼，见之者昌。",
      tr: "天地之间有五种潜藏的力量，能看见它们的人就会昌盛。",
      note: "'贼'非贬义，指能窃取天机者，对应五行。" },
    { p: "上", t: "五贼在乎心，施行于天。",
      tr: "这五种力量根植于人心，又施行于天地之间。",
      note: "把'天'和'心'打通——道家把宇宙论拉回身心的标志动作。" },
    { p: "上", t: "宇宙在乎手，万化生乎身。",
      tr: "宇宙就在你的手中，万物的变化都从你身上生发。",
      note: "极端主体化的宣言。后世内丹术的理论根。" },
    { p: "上", t: "天性，人也；人心，机也。",
      tr: "天的本性就是人，人的内心就是机关。",
      note: "天 = 人 = 机，三段论压缩到 8 个字。" },

    { p: "上", t: "立天之道，以定人也。" },
    { p: "上", t: "天发杀机，移星易宿；地发杀机，龙蛇起陆；人发杀机，天地反覆；天人合发，万变定基。" },
    { p: "上", t: "性有巧拙，可以伏藏。" },
    { p: "上", t: "九窍之邪，在乎三要，可以动静。" },
    { p: "上", t: "火生于木，祸发必克；奸生于国，时动必溃。" },
    { p: "上", t: "知之修炼，谓之圣人。" },

    { p: "中", t: "天生天杀，道之理也。" },
    { p: "中", t: "天地，万物之盗；万物，人之盗；人，万物之盗。" },
    { p: "中", t: "三盗既宜，三才既安。" },
    { p: "中", t: "故曰：食其时，百骸理；动其机，万化安。" },
    { p: "中", t: "人知其神而神，不知其不神之所以神也。" },
    { p: "中", t: "日月有数，大小有定，圣功生焉，神明出焉。" },
    { p: "中", t: "其盗机也，天下莫能见，莫能知也。" },
    { p: "中", t: "君子得之固躬，小人得之轻命。" },

    { p: "下", t: "瞽者善听，聋者善视。" },
    { p: "下", t: "绝利一源，用师十倍。" },
    { p: "下", t: "三返昼夜，用师万倍。" },
    { p: "下", t: "心生于物，死于物，机在于目。" },
    { p: "下", t: "天之无恩而大恩生。" },
    { p: "下", t: "迅雷烈风，莫不蠢然。" },
    { p: "下", t: "至乐性余，至静性廉。" },
    { p: "下", t: "天之至私，用之至公。" },
    { p: "下", t: "禽之制在炁。" },
    { p: "下", t: "生者死之根，死者生之根。" },
    { p: "下", t: "恩生于害，害生于恩。" },
    { p: "下", t: "愚人以天地文理圣，我以时物文理哲。" },
    { p: "下", t: "人以愚虞圣，我以不愚虞圣；人以奇期圣，我以不奇期圣。" },
    { p: "下", t: "故曰：沉水入火，自取灭亡。" },
    { p: "下", t: "自然之道静，故天地万物生。" },
    { p: "下", t: "天地之道浸，故阴阳胜。" },
    { p: "下", t: "阴阳相推，而变化顺矣。" },
    { p: "下", t: "是故圣人知自然之道不可违，因而制之至静之道。" },
    { p: "下", t: "律历所不能契。" },
    { p: "下", t: "爰有奇器，是生万象，八卦甲子，神机鬼藏。" },
    { p: "下", t: "阴阳相胜之术，昭昭乎进于象矣。" },
  ];

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
  heading.appendChild(el("div", "yfj-heading__title", "褚遂良　阴符经"));
  const seal = el("div", "yfj-heading__seal", "褚");
  seal.setAttribute("aria-hidden", "true");
  heading.appendChild(seal);
  root.appendChild(heading);

  let lastPart = null;
  SENTENCES.forEach((s, i) => {
    if (s.p !== lastPart) {
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

  root.appendChild(el("div", "yfj-tail", "公有领域"));

  /* ---------- 交互：单例面板 ---------- */
  let activeChar = null;
  let activeWriter = null;

  function clearActive() {
    if (activeChar) activeChar.classList.remove("yfj-ch--active");
    activeChar = null;
    activeWriter = null;
  }

  function closePanel() {
    clearActive();
    panelRoot.classList.remove("yfj-panel--open");
    empty(panelRoot);
  }

  function fillPanel(ch, idx) {
    clearActive();
    const data = SENTENCES[idx];
    empty(panelRoot);

    const head = el("div", "yfj-panel__head");
    head.appendChild(el("span", "yfj-panel__char", ch.dataset.ch));
    head.appendChild(el("span", "yfj-panel__src", `${data.p}篇 · 第 ${idx + 1} 句`));
    const closeBtn = el("button", "yfj-panel__close", "×");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "关闭");
    head.appendChild(closeBtn);
    panelRoot.appendChild(head);

    panelRoot.appendChild(el("p", "yfj-panel__orig", norm(data.t)));

    if (data.tr) {
      panelRoot.appendChild(el("p", "yfj-panel__tr", data.tr));
    } else {
      panelRoot.appendChild(el("p", "yfj-panel__todo", "（这一句的释文还在写）"));
    }

    if (data.note) {
      panelRoot.appendChild(el("p", "yfj-panel__note", data.note));
    }

    /* 笔顺：可选 */
    if (typeof HanziWriter !== "undefined") {
      const stroke = el("div", "yfj-stroke");
      const btn = el("button", "yfj-stroke__btn", `演笔顺 · ${ch.dataset.ch}`);
      btn.type = "button";
      const stage = el("div", "yfj-stroke__stage");
      const stageId = `stroke-${idx}-${ch.dataset.cidx}`;
      stage.id = stageId;

      btn.addEventListener("click", () => {
        if (activeWriter) { activeWriter.animateCharacter(); return; }
        try {
          activeWriter = HanziWriter.create(stageId, ch.dataset.ch, {
            width: 160,
            height: 160,
            padding: 6,
            showOutline: false,
            showCharacter: false,
            strokeAnimationSpeed: 1.1,
            delayBetweenStrokes: 220,
            strokeColor: "#1a1714",
          });
          activeWriter.animateCharacter();
        } catch (e) {
          stage.textContent = "（此字无标准笔顺数据）";
        }
      });

      stroke.appendChild(btn);
      stroke.appendChild(stage);
      panelRoot.appendChild(stroke);
    }

    ch.classList.add("yfj-ch--active");
    activeChar = ch;
    panelRoot.classList.add("yfj-panel--open");
    panelRoot.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
