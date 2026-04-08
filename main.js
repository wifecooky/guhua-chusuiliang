/* 古画 · 字解码 · 褚遂良《阴符经》
 *
 * 形态：A1 + B2
 *   A1 = 字帖：461 字按句分组渲染为可点击的楷书层
 *   B2 = 句级释义：点字 → 该句下方 inline 展开释文
 *   hanzi-writer 笔顺动画作为可选项，藏在面板里
 *
 * 数据来源：
 *   原文 = 黄帝阴符经，公有领域
 *   字渲染 = Noto Serif SC + 标准楷书形态
 *   笔顺   = MakeMeAHanzi via hanzi-writer
 *
 * 设计原则（Linus 式）：
 *   - 数据结构先：句子是单位，字只是句子里的位置
 *   - 没有特殊情况：标点 = 非汉字，统一处理
 *   - 三层缩进以内：渲染 / 点击 / 释文，各一函数
 */

(function () {
  "use strict";

  /* ---------- 数据 ---------- */
  /* 句子是阅读单位。tr 是释文，null = 还没填。
     tr 填了 5 句真内容，剩下 35 句留 TODO，UI 优雅降级。 */
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
    { p: "中", t: "三盗既宜,三才既安。" },
    { p: "中", t: "故曰：食其时,百骸理；动其机,万化安。" },
    { p: "中", t: "人知其神而神,不知其不神之所以神也。" },
    { p: "中", t: "日月有数,大小有定,圣功生焉,神明出焉。" },
    { p: "中", t: "其盗机也,天下莫能见,莫能知也。" },
    { p: "中", t: "君子得之固躬,小人得之轻命。" },

    { p: "下", t: "瞽者善听,聋者善视。" },
    { p: "下", t: "绝利一源,用师十倍。" },
    { p: "下", t: "三返昼夜,用师万倍。" },
    { p: "下", t: "心生于物,死于物,机在于目。" },
    { p: "下", t: "天之无恩而大恩生。" },
    { p: "下", t: "迅雷烈风,莫不蠢然。" },
    { p: "下", t: "至乐性余,至静性廉。" },
    { p: "下", t: "天之至私,用之至公。" },
    { p: "下", t: "禽之制在炁。" },
    { p: "下", t: "生者死之根,死者生之根。" },
    { p: "下", t: "恩生于害,害生于恩。" },
    { p: "下", t: "愚人以天地文理圣,我以时物文理哲。" },
    { p: "下", t: "人以愚虞圣,我以不愚虞圣；人以奇期圣,我以不奇期圣。" },
    { p: "下", t: "故曰：沉水入火,自取灭亡。" },
    { p: "下", t: "自然之道静,故天地万物生。" },
    { p: "下", t: "天地之道浸,故阴阳胜。" },
    { p: "下", t: "阴阳相推,而变化顺矣。" },
    { p: "下", t: "是故圣人知自然之道不可违,因而制之至静之道。" },
    { p: "下", t: "律历所不能契。" },
    { p: "下", t: "爰有奇器,是生万象,八卦甲子,神机鬼藏。" },
    { p: "下", t: "阴阳相胜之术,昭昭乎进于象矣。" },
  ];

  /* ---------- 渲染：字帖 ---------- */
  const HAN = /[\u4e00-\u9fff]/;
  const root = document.getElementById("yfj");
  if (!root) return;

  let lastPart = null;
  SENTENCES.forEach((s, i) => {
    /* 篇章分隔（上 / 中 / 下） */
    if (s.p !== lastPart) {
      const div = document.createElement("div");
      div.className = "yfj-part";
      div.textContent = `· ${s.p}篇 ·`;
      root.appendChild(div);
      lastPart = s.p;
    }

    const sent = document.createElement("section");
    sent.className = "yfj-sent";
    sent.dataset.idx = String(i);

    const line = document.createElement("div");
    line.className = "yfj-line";

    /* 把句子拆成字符 span：汉字可点，标点不可点 */
    [...s.t].forEach((ch, j) => {
      const span = document.createElement("span");
      span.textContent = ch;
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
      line.appendChild(span);
    });

    sent.appendChild(line);
    root.appendChild(sent);
  });

  /* ---------- 交互：点击展开/收起 ---------- */
  let openSent = null;   // 当前展开的 yfj-sent 元素
  let openChar = null;   // 当前高亮的 yfj-ch 元素

  function closePanel() {
    if (!openSent) return;
    const panel = openSent.querySelector(".yfj-panel");
    if (panel) panel.remove();
    openSent.classList.remove("yfj-sent--open");
    if (openChar) openChar.classList.remove("yfj-ch--active");
    openSent = null;
    openChar = null;
  }

  function openPanel(sent, ch, idx) {
    closePanel();
    const data = SENTENCES[idx];
    const panel = document.createElement("div");
    panel.className = "yfj-panel";

    if (data.tr) {
      const tr = document.createElement("p");
      tr.className = "yfj-tr";
      tr.textContent = data.tr;
      panel.appendChild(tr);
    } else {
      const todo = document.createElement("p");
      todo.className = "yfj-todo";
      todo.textContent = "（这一句的释文还在写）";
      panel.appendChild(todo);
    }

    if (data.note) {
      const note = document.createElement("p");
      note.className = "yfj-note";
      note.textContent = data.note;
      panel.appendChild(note);
    }

    /* 笔顺：可选。点击的字是哪个就演哪个。 */
    if (ch && typeof HanziWriter !== "undefined") {
      const stroke = document.createElement("div");
      stroke.className = "yfj-stroke";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "yfj-stroke__btn";
      btn.textContent = `演笔顺 · ${ch.dataset.ch}`;

      const stage = document.createElement("div");
      stage.className = "yfj-stroke__stage";
      stage.id = `stroke-${idx}-${ch.dataset.cidx}`;

      let writer = null;
      btn.addEventListener("click", () => {
        if (writer) {
          writer.animateCharacter();
          return;
        }
        try {
          writer = HanziWriter.create(stage.id, ch.dataset.ch, {
            width: 160,
            height: 160,
            padding: 6,
            showOutline: false,
            showCharacter: false,
            strokeAnimationSpeed: 1.1,
            delayBetweenStrokes: 220,
            strokeColor: "#1a1714",
          });
          writer.animateCharacter();
        } catch (e) {
          stage.textContent = "（此字无标准笔顺数据）";
        }
      });

      stroke.appendChild(btn);
      stroke.appendChild(stage);
      panel.appendChild(stroke);
    }

    sent.appendChild(panel);
    sent.classList.add("yfj-sent--open");
    ch.classList.add("yfj-ch--active");
    openSent = sent;
    openChar = ch;
  }

  root.addEventListener("click", (e) => {
    const ch = e.target.closest(".yfj-ch");
    if (!ch) return;
    const sent = ch.closest(".yfj-sent");
    const idx = Number(sent.dataset.idx);
    /* 同一句的同一字 → 收起；其余 → 切换到新字 */
    if (openChar === ch) {
      closePanel();
    } else {
      openPanel(sent, ch, idx);
    }
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const ch = e.target.closest(".yfj-ch");
    if (!ch) return;
    e.preventDefault();
    ch.click();
  });

  /* ESC 关面板 */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });
})();
