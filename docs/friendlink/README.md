# 友链图片

站点：<https://bhands6.github.io/Couple-s-Memorial/>

素材取自 `docs/screenshots/hero.png`（即部署站首屏），配色沿用站内玫瑰粉。

| 文件 | 尺寸 | 用途 |
| --- | --- | --- |
| `love-icon-300x300.png` | 300×300 | **友链后台的「图片地址」填这个**，56px 缩略下也认得出 |
| `love-240x60.png` | 240×60 | 常规横版友链位 |
| `love-88x31.png` | 88×31 | 复古小徽章 |
| `love-300x300.png` | 300×300 | 带站名/网址的方形卡片，适合放大展示 |

## 直接引用的公网地址

```
https://bhands6.github.io/Couple-s-Memorial/docs/friendlink/love-icon-300x300.png
https://bhands6.github.io/Couple-s-Memorial/docs/friendlink/love-240x60.png
https://bhands6.github.io/Couple-s-Memorial/docs/friendlink/love-88x31.png
https://bhands6.github.io/Couple-s-Memorial/docs/friendlink/love-300x300.png
```

## 重新生成

改了 `hero.png` 或想调文案，重跑：

```bash
py -3 docs/friendlink/make_cards.py
```

文案、配色、裁切区域都在脚本顶部常量里，`S = 4` 是超采样倍数。
