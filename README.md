# 古画 · 字解码 · 褚遂良《阴符经》

一个一次性的 web 作品，把褚遂良《大字阴符经》全卷 461 字做成可点击的卷轴字帖。
点任一字 → 该句释文从画心底部浮起，同时该字位置叠加笔顺动画。

纯静态：`index.html` + `main.js` + `style.css`，无构建步骤。

## 数据来源

| 数据 | 出处 | 说明 |
|---|---|---|
| 原文（《阴符经》461 字） | 黄帝《阴符经》 | 公有领域，写死在 `main.js` |
| **真迹整页图（24 开）** | [9610 书法空间 · 褚遂良](http://www.9610.com/csl/06.htm) `csyfj/1-24.jpg` | 已本地化到 `assets/yfj-leaves/01-24.jpg`，每张 ~500KB / 1467×1773 |
| 原作藏地 | [Asian Art Museum, San Francisco](https://education.asianart.org/resources/scripture-of-the-hidden-talisman/) | 仅出处链接，不引用其图（他们公开的只有 1200×824） |
| 标准楷书字形 + 笔顺数据 | [MakeMeAHanzi](https://github.com/skishore/makemeahanzi) | 通过 [hanzi-writer](https://hanziwriter.org) CDN 按需加载，LGPL / Arphic Public License |
| 释文 + 注释 | 项目自撰 | 在 `main.js` 的 `SENTENCES` 数组里 |
| 正文字体 | [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC) | Google Fonts CDN，SIL Open Font License |
| 散文断词 | [BudouX](https://github.com/google/budoux) | jsdelivr ESM |

**真迹图说明**：褚遂良《大字阴符经》原作 24 开纸本墨书，21×394 cm，
现藏旧金山亚洲艺术博物馆。9610 书法空间于 2013 年发布的彩色版高清扫描
被本项目本地化引用，用于教育/非商业的字解码展示。原作为公有领域作品，
扫描数字化后的归属遵循各平台标注。

**句→开映射**：句子序号到 24 开的映射是**线性近似**（`leafForIdx`），
每句对应一开真迹，但不是逐字精切。被点击的字一定在该开内，可看到上下文笔势。

## 运行

```bash
python3 -m http.server 8765
open http://localhost:8765/
```

## 结构

```
guhua/
├── index.html               # 单页：masthead + 散文 + 卷轴 + colophon
├── main.js                  # 数据 + 渲染 + 交互
├── style.css                # 卷轴 / 竖排 / 浮层 / mobile fallback
└── assets/
    ├── dao-authentic.svg    # 早期单字 demo 残留（暂留，未引用）
    └── yfj-leaves/          # 24 开真迹彩色版
        ├── 01.jpg ... 24.jpg
```

## 致谢

- 9610.com 的整理与扫描
- skishore/makemeahanzi 的字符开放数据
- chanind/hanzi-writer 的笔顺渲染
- google/budoux 的中文断词
