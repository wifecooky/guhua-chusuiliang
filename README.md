# 古画 · 褚遂良

一个关于初唐书家褚遂良（596–658）的小站。

- **根 `/`** — 褚遂良总览 · 生平 · 传世 17 件作品年表
- **`/yinfujing/`** — 《大字阴符经》字解码 · 461 字可点卷轴字帖

纯静态：无构建，无框架，无 router。两个页面共享 `style.css` 与 `main.js`。

## 结构

```
guhua/
├── index.html                   # 褚遂良总览 + 17 件作品年表
├── yinfujing/
│   └── index.html               # 大字阴符经 字解码 交互卷轴（深度页）
├── works/                       # 9 件其他作品的作品页
│   ├── yanta/index.html         # 雁塔圣教序（653）
│   ├── kushufu/index.html       # 枯树赋（630）
│   ├── nikuanzan/index.html     # 倪宽赞（传）
│   ├── yique/index.html         # 伊阙佛龛碑（641）
│   ├── mengfashi/index.html     # 孟法师碑（642）
│   ├── fangxuanling/index.html  # 房玄龄碑（652）
│   ├── xiaoyfj/index.html       # 小字阴符经（越州石氏本）
│   ├── feiniao/index.html       # 临王献之飞鸟帖（传）
│   └── peiyi/index.html         # 裴艺碑（649）
├── main.js                      # 阴符经数据 + 渲染 + 交互（仅 /yinfujing/ 使用）
├── style.css                    # 共享样式
├── README.md
└── assets/
    ├── yfj-leaves/              # 阴符经 24 开真迹彩版
    │   └── 01.jpg ... 24.jpg
    └── works/                   # 9 作品 × ~3 张代表图 = 26 张
        ├── yanta/01.jpg ... 03.jpg
        ├── kushufu/01.jpg ... 03.jpg
        ├── nikuanzan/01.jpg ... 04.jpg
        └── ...
```

## 数据来源

| 数据 | 出处 | 说明 |
|---|---|---|
| 褚遂良生平与作品年表 | [9610 书法空间 · 褚遂良专页](http://www.9610.com/csl/) | 爬取整理 13 个子页（01-09、12-14），覆盖 11 件有内容的作品。生平 bio 由项目自撰整合 |
| 《阴符经》原文（461 字） | 黄帝《阴符经》 | 公有领域，写死在 `main.js` |
| **《大字阴符经》真迹 24 开** | [9610 书法空间 · 06](http://www.9610.com/csl/06.htm) `csyfj/1-24.jpg` | 已本地化到 `assets/yfj-leaves/01-24.jpg`，每张 ~500KB / 1467×1773 |
| 《大字阴符经》原作藏地 | [Asian Art Museum, San Francisco](https://education.asianart.org/resources/scripture-of-the-hidden-talisman/) | 仅出处链接 |
| 标准楷书字形 + 笔顺数据 | [MakeMeAHanzi](https://github.com/skishore/makemeahanzi) | 通过 [hanzi-writer](https://hanziwriter.org) CDN 按需加载 |
| 《阴符经》释文 + 注解 | 项目自撰 | 在 `main.js` 的 `SENTENCES` 数组里 |
| 正文字体 | [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC) | Google Fonts CDN |
| 散文断词 | [BudouX](https://github.com/google/budoux) | jsdelivr ESM |

**真迹图说明**：《大字阴符经》原作 24 开纸本墨书，21×394 cm，现藏旧金山亚洲艺术博物馆。
9610 书法空间于 2013 年发布的彩色版高清扫描被本项目本地化引用，用于教育/非商业的字解码展示。
原作为公有领域作品，扫描数字化后的归属遵循各平台标注。

**真伪争议**：学界对《大字阴符经》真伪历来有争议——
叶恭绰 / 沈尹默 / 潘伯鹰认为是真；启功 / 徐无闻认为是伪托或同时期高手仿褚。
本项目照旧署名褚遂良，并在书家侧写段落里明确提及，不做学术裁决。

**作品页**：17 件作品中，**10 件**已做本地页面：
- 阴符经做了字级交互深度页 `/yinfujing/`
- 其余 9 件在 `/works/<slug>/`，每页含短文 + 3-4 张 9610 彩版代表图 + 返回导航 + 9610 二次资料链接
- 另 **7 件** 9610 仅在索引提及、无专页的作品，以 "dim" 态标在时间线末尾不链接
- 所有作品页短文由项目自撰整合，引用 9610 页上的历代书评

## 数据来源更新约定

**新引入任何数据源时，必须同时更新这张表 + 所在页面的 colophon**。
出处信息与代码同地管理，不要散落。

## 运行

```bash
python3 -m http.server 8765
open http://localhost:8765/          # 总览
open http://localhost:8765/yinfujing/ # 阴符经字解码
```

## 致谢

- 9610.com 的整理与扫描（褚遂良作品年表 + 阴符经真迹彩版）
- skishore/makemeahanzi 的字符开放数据
- chanind/hanzi-writer 的笔顺渲染
- google/budoux 的中文断词
