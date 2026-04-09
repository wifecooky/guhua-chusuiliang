# 古画 · 褚遂良

一个关于初唐书家褚遂良（596–658）的小站。

- **根 `/`** — 褚遂良总览 · 生平 · 传世 17 件作品年表
- **`/yinfujing/`** — 《大字阴符经》字解码 · 461 字可点卷轴字帖
- **`/works/<slug>/`** — 其他 16 件作品页

纯静态：无构建，无框架，无 router。所有页面共享 `style.css` / `main.js` / `lightbox.js`。

## 结构

```
guhua/
├── index.html                   # 褚遂良总览 + 17 件作品年表
├── yinfujing/
│   └── index.html               # 大字阴符经 字解码 交互卷轴（深度页）
├── works/                       # 16 件其他作品的作品页
│   ├── yanta/index.html         # 雁塔圣教序（653）· 卷轴
│   ├── kushufu/index.html       # 枯树赋（630）· 卷轴
│   ├── nikuanzan/index.html     # 倪宽赞（传）· reader
│   ├── yique/index.html         # 伊阙佛龛碑（641）· gallery
│   ├── mengfashi/index.html     # 孟法师碑（642）· gallery
│   ├── fangxuanling/index.html  # 房玄龄碑(652) · gallery
│   ├── xiaoyfj/index.html       # 小字阴符经 · reader
│   ├── feiniao/index.html       # 临王献之飞鸟帖 · reader
│   ├── peiyi/index.html         # 裴艺碑(649) · gallery
│   ├── wenhuang/index.html      # 文皇哀册 · reader
│   ├── tanfu/index.html         # 潭府帖 · reader
│   ├── tongzhou/index.html      # 同洲圣教序 · reader
│   ├── moulanting/index.html    # 摹王羲之兰亭序 · reader
│   ├── linlanting/index.html    # 临兰亭序 黄绢本 · reader
│   ├── lingbao/index.html       # 小楷灵宝经 · reader
│   └── changfeng/index.html     # 临王羲之长风帖 · reader
├── data/
│   ├── yinfujing-data.js        # 阴符经卷轴数据（40 句）
│   ├── kushufu-data.js          # 枯树赋卷轴数据（39 句）
│   └── yanta-data.js            # 雁塔圣教序卷轴数据（41 句）
├── main.js                      # 卷轴渲染 + 交互库（config-driven）
├── lightbox.js                  # 全站图片预览浮层
├── style.css                    # 共享样式
├── favicon.svg                  # 朱砂印"褚"
├── robots.txt
├── sitemap.xml
├── 404.html
├── README.md
└── assets/
    ├── yfj-leaves/              # 阴符经 24 开真迹彩版
    │   └── 01.jpg ... 24.jpg
    └── works/                   # 16 件作品的图片
        ├── yanta/               7 张
        ├── kushufu/             8 张
        ├── nikuanzan/           8 张
        ├── yique/               6 张
        ├── mengfashi/           3 张
        ├── fangxuanling/        9 张
        ├── xiaoyfj/             3 张
        ├── feiniao/             6 张
        ├── peiyi/               1 张
        ├── wenhuang/            8 张
        ├── tanfu/               3 张
        ├── tongzhou/            4 张
        ├── lingbao/             6 张
        ├── linlanting/          7 张
        ├── moulanting/          1 张
        └── changfeng/           4 张（~16MB，含 9388px 全卷）
```

合计约 100 张真迹图 ~45MB，全部本地化。

## 数据与图片归属（重要）

**原则**：所有站内容是自包含的。用户在页面上不会看到任何 9610 外链——
不是因为 9610 不重要，而是反过来：9610 几乎是所有真迹图片和历史资料的来源，
重要到必须在这里统一记录，而不是散落在每个页面的页脚。

### 一、真迹图版归属（最核心）

所有作品的高清彩版/拓本图片，来源于 [9610 书法空间 · 书法博物馆](http://www.9610.com/)
（下称 9610），一个由志愿者维护的中文书法非商业资源站。
原作为公有领域作品，扫描数字化的整理工作由 9610 及其贡献者完成。
本项目引用用于教育 / 非商业的字解码与阅读展示。

逐件真迹图版的原始路径：

| 作品 | 9610 原页 | 本地路径 | 张数 |
|---|---|---|---|
| 大字阴符经 | [csl/06.htm](http://www.9610.com/csl/06.htm) · `csyfj/1-24.jpg` | `assets/yfj-leaves/01-24.jpg` | 24 |
| 雁塔圣教序 | [csl/01.htm](http://www.9610.com/csl/01.htm) · `ytsjx_*.jpg` + `01a/*.jpg` | `assets/works/yanta/` | 7 |
| 枯树赋 | [csl/02.htm](http://www.9610.com/csl/02.htm) · `ksf1-8.jpg` | `assets/works/kushufu/` | 8 |
| 倪宽赞 | [csl/03.htm](http://www.9610.com/csl/03.htm) · `nikuanzan/*.jpg` | `assets/works/nikuanzan/` | 8 |
| 伊阙佛龛碑 | [csl/04.htm](http://www.9610.com/csl/04.htm) · `yique/*.jpg` | `assets/works/yique/` | 6 |
| 孟法师碑 | [csl/05.htm](http://www.9610.com/csl/05.htm) · `mfsb_*.jpg` | `assets/works/mengfashi/` | 3 |
| 房玄龄碑 | [csl/07.htm](http://www.9610.com/csl/07.htm) · `fang/*.jpg` | `assets/works/fangxuanling/` | 9 |
| 小字阴符经 | [csl/08.htm](http://www.9610.com/csl/08.htm) · `x8*x.jpg` | `assets/works/xiaoyfj/` | 3 |
| 临王献之飞鸟帖 | [csl/13.htm](http://www.9610.com/csl/13.htm) · `13*.jpg` | `assets/works/feiniao/` | 6 |
| 裴艺碑 | [csl/14.htm](http://www.9610.com/csl/14.htm) · `peiyi.jpg` | `assets/works/peiyi/` | 1 |
| 文皇哀册 | [csl/aice.htm](http://www.9610.com/csl/aice.htm) · `aice*.jpg` | `assets/works/wenhuang/` | 8 |
| 潭府帖 | [csl/tanfu.htm](http://www.9610.com/csl/tanfu.htm) · `tanfu*.jpg` | `assets/works/tanfu/` | 3 |
| 同洲圣教序 | [csl/tongzhou.htm](http://www.9610.com/csl/tongzhou.htm) · `tongzhou*.jpg` | `assets/works/tongzhou/` | 4 |
| 小楷灵宝经 | [csl/lingbao.htm](http://www.9610.com/csl/lingbao.htm) · `lingbao*.jpg` | `assets/works/lingbao/` | 6 |
| 临兰亭序 黄绢本 | [wangxizhi/huangjuanben.htm](http://www.9610.com/wangxizhi/huangjuanben.htm) · `huangjuanben/*.jpg` | `assets/works/linlanting/` | 7 |
| 摹王羲之兰亭序 八柱二 | [wangxizhi/zhu.htm](http://www.9610.com/wangxizhi/zhu.htm) · `csl.jpg` | `assets/works/moulanting/` | 1 |
| 临王羲之长风帖 | [wangxizhi/changfeng.htm](http://www.9610.com/wangxizhi/changfeng.htm) · `changfeng*.jpg` | `assets/works/changfeng/` | 4 |

### 二、文本资料归属

所有作品的历史语境、版本考证、真伪辨析，参考 9610 对应子页的内容，
以及（在 9610 未覆盖时）传世注家与古籍：

- 《黄帝阴符经》原文：公有领域
- 《大唐三藏圣教序》（雁塔 / 同洲二碑同文）：唐太宗李世民撰，公有领域
- 《枯树赋》：庾信，公有领域
- 《汉书·公孙弘卜式儿宽传》赞曰（倪宽赞底本）：班固，公有领域
- 《飞鸟帖》：传王献之，公有领域
- 9610 页面里引用的历代书评（包世臣、王世贞、刘熙载、梁巘、盛时泰、
  顾炎武、陈康、徐无闻、米芾题跋等），本项目在 9610 的基础上重新摘引 / 整合

褚遂良生平相关：除了常识性的唐史事实（《新唐书·褚遂良传》《旧唐书》
《资治通鉴》等），9610 的 [褚遂良专页](http://www.9610.com/csl/) 是本项目
整理生平与作品年表时的主要起点。

所有站内的释文与评注，除明确引用历代书家 / 注家的部分外，
均由项目自撰（Linus 风格的短评），不是从 9610 复制。

### 三、原作藏地（仅作出处）

- 《大字阴符经》：[Asian Art Museum, San Francisco](https://education.asianart.org/resources/scripture-of-the-hidden-talisman/)
- 《枯树赋》《孟法师碑》《小楷灵宝经》：日本三井纪念美术馆
- 《房玄龄碑》《伊阙佛龛碑》：国家图书馆
- 《雁塔圣教序》：日本东京国立博物馆
- 《同洲圣教序》：西安碑林博物馆
- 《文皇哀册》：日本高岛菊次郎
- 《倪宽赞》《临兰亭序黄绢本》《临王献之飞鸟帖》《临王羲之长风帖》：台北故宫博物院
- 《摹王羲之兰亭序 兰亭八柱第二》：北京故宫博物院
- 《裴艺碑》：陕西昭陵博物馆
- 《潭府帖》：原件失传，《淳化阁帖》收录

### 四、运行时依赖（仍由页面 CDN 加载）

| 类别 | 来源 | 许可 |
|---|---|---|
| 标准楷书字形 + 笔顺数据 | [MakeMeAHanzi](https://github.com/skishore/makemeahanzi) via [hanzi-writer](https://hanziwriter.org) | LGPL / Arphic Public License |
| 散文断词 | [BudouX](https://github.com/google/budoux) | Apache 2.0 |
| 字体 | [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC) | SIL Open Font License |

这三项是运行时的 JS / 字体依赖，在页面 colophon 里保留链接
（它们是 live 依赖，不是静态内容）。

### 真伪争议

学界对本项目收录的多件作品真伪历来有争议：
- 《大字阴符经》：叶恭绰 / 沈尹默 / 潘伯鹰认为是真；启功 / 徐无闻认为是伪托
- 《同洲圣教序》：顾炎武、徐无闻等认为是褚遂良身后五年的翻刻本，非亲笔
- 《文皇哀册》：后人疑为米芾临本（与《向太后挽词帖》相似）
- 《临王羲之长风帖》：9610 辨析意见认为是宋人钩摹米芾临仿王羲之，非褚遂良
- 《摹王羲之兰亭序 八柱二》：经印章纸质考证为北宋米芾前的临摹本，非褚亲笔
- 《倪宽赞》：元明两派聚讼，近代亦有学者持伪作说

本项目照旧使用这些作品的传统署名，
在对应作品页的正文里明确提及相关争议，不做学术裁决。

## 数据来源更新约定

**新引入任何数据源时，必须同时更新本节**。出处信息与代码同地管理，
不要散落到各页面的 colophon 里——那是 UX 割裂的开始。
站内页面 colophon 只保留运行时依赖的 live 链接。

## 运行

```bash
python3 -m http.server 8765
open http://localhost:8765/              # 总览
open http://localhost:8765/yinfujing/    # 阴符经字解码
open http://localhost:8765/works/yanta/  # 任意作品页
```

## 致谢

- **9610.com / 书法空间** —— 志愿者长期维护的中文书法资源站，
  本项目约 100 张真迹彩版、拓本、墨迹、历代书评资料都来源于此
- skishore / makemeahanzi —— 字符开放数据
- chanind / hanzi-writer —— 笔顺渲染
- google / budoux —— 中文断词
- 故宫博物院 · 台北故宫 · 国家图书馆 · Asian Art Museum · 日本三井纪念美术馆
  · 东京国立博物馆 · 昭陵博物馆 · 西安碑林博物馆 —— 原作收藏
