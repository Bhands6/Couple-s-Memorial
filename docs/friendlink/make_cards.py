# -*- coding: utf-8 -*-
"""生成友链图片（240x60 横版 / 88x31 按钮 / 300x300 方形）

素材取自 docs/screenshots/hero.png（即部署站首屏），保证视觉与站点一致。
用法： py -3 docs/friendlink/make_cards.py
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERO = os.path.join(BASE, "screenshots", "hero.png")
OUT = os.path.join(BASE, "friendlink")

S = 4  # 超采样倍数

NAME_CN = "小鹿 & 小兔"
SUB = "我们的纪念空间"
URL = "bhands6.github.io/Couple-s-Memorial"

F_HAND = "C:/Windows/Fonts/STXINGKA.TTF"   # 华文行楷
F_SANS = "C:/Windows/Fonts/msyh.ttc"       # 微软雅黑
F_SYM = "C:/Windows/Fonts/seguisym.ttf"    # ♥

ROSE = (255, 77, 125)
PINK = (255, 107, 157)
DEEP = (172, 44, 86)
MUTED = (166, 106, 128)
CREAM = (255, 247, 250)


def font(path, size):
    return ImageFont.truetype(path, int(size * S))


def bg_patch(size, box, veil_alpha=0.45):
    """从 hero 裁一块做背景，压亮后用作卡片底。坐标基于 1761x1082 原图。"""
    img = Image.open(HERO).convert("RGB")
    patch = img.crop(box).resize(size, Image.LANCZOS).filter(
        ImageFilter.GaussianBlur(1.6 * S))
    veil = Image.new("RGB", size, CREAM)
    return Image.blend(patch, veil, veil_alpha).convert("RGBA")


def gradient(size, c1, c2, radius):
    """圆角矩形渐变块。"""
    w, h = size
    g = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        g.putpixel((0, y), tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3)))
    g = g.resize((w, h))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(g, (0, 0), mask)
    return out


def heart(width, color=(255, 255, 255)):
    """矢量爱心（参数方程），width 为 1x 宽度。"""
    import math
    w = width * S
    pts = []
    for i in range(720):
        t = 2 * math.pi * i / 720
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t)
              - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((x, y))
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    span_x = max(xs) - min(xs)
    span_y = max(ys) - min(ys)
    k = w / span_x
    pad = int(4 * S)
    size = (int(span_x * k) + pad * 2, int(span_y * k) + pad * 2)
    img = Image.new("RGBA", size, (0, 0, 0, 0))
    poly = [((x - min(xs)) * k + pad, (y - min(ys)) * k + pad) for x, y in pts]
    ImageDraw.Draw(img).polygon(poly, fill=color + (255,))
    return img


def center_text(d, xy, text, f, fill, anchor="lm"):
    d.text((xy[0] * S, xy[1] * S), text, font=f, fill=fill, anchor=anchor)


def build_wide():
    W, H = 240, 60
    canvas = bg_patch((W * S, H * S), (20, 150, 480, 265), 0.40)

    # 左图标
    icon = gradient((44 * S, 44 * S), PINK, ROSE, 14 * S)
    h = heart(21)
    icon.alpha_composite(h, ((icon.width - h.width) // 2, (icon.height - h.height) // 2))
    canvas.paste(icon, (12 * S, 8 * S), icon)

    d = ImageDraw.Draw(canvas)
    center_text(d, (67, 26), NAME_CN, font(F_HAND, 21), DEEP)
    center_text(d, (68, 43), SUB, font(F_SANS, 10), MUTED)

    # 边框
    d.rounded_rectangle([0, 0, W * S - 1, H * S - 1], radius=12 * S,
                        outline=(255, 170, 198), width=max(1, int(1.5 * S)))
    return canvas.resize((W, H), Image.LANCZOS)


def build_button():
    W, H = 88, 31
    canvas = gradient((W * S, H * S), (255, 158, 186), (255, 92, 138), 5 * S)
    d = ImageDraw.Draw(canvas)
    h = heart(9, (255, 255, 255))
    canvas.alpha_composite(h, (4 * S, (H * S - h.height) // 2))
    center_text(d, (17, 16), "小鹿&小兔", font(F_HAND, 13), (255, 255, 255))
    return canvas.resize((W, H), Image.LANCZOS)


def build_square():
    W = H = 300
    canvas = bg_patch((W * S, H * S), (40, 560, 460, 980), 0.26)

    d = ImageDraw.Draw(canvas)
    # 顶部小爱心
    h = heart(26, ROSE)
    canvas.alpha_composite(h, ((W * S - h.width) // 2, 52 * S))

    center_text(d, (W // 2, 128), NAME_CN, font(F_HAND, 34), DEEP, anchor="mm")
    center_text(d, (W // 2, 170), "A L W A Y S   &   F O R E V E R",
                font(F_SANS, 9), MUTED, anchor="mm")

    # 分隔线
    d.line([100 * S, 192 * S, 200 * S, 192 * S], fill=(255, 175, 200), width=max(1, int(1.2 * S)))

    center_text(d, (W // 2, 214), SUB, font(F_SANS, 12), (140, 86, 108), anchor="mm")
    center_text(d, (W // 2, 244), URL, font(F_SANS, 9), (176, 128, 148), anchor="mm")

    d.rounded_rectangle([0, 0, W * S - 1, H * S - 1], radius=22 * S,
                        outline=(255, 170, 198), width=max(1, int(1.5 * S)))
    return canvas.resize((W, H), Image.LANCZOS)


def build_icon():
    """纯图标版：给友链后台当缩略图，56px 下也认得出。"""
    W = H = 300
    canvas = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))

    # 渐变圆角底
    grad = Image.new("RGB", (1, H * S))
    for y in range(H * S):
        t = y / (H * S - 1)
        grad.putpixel((0, y), tuple(int(a + (b - a) * t) for a, b in
                                    zip((255, 150, 182), (255, 66, 122))))
    grad = grad.resize((W * S, H * S))
    mask = Image.new("L", (W * S, H * S), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, W * S - 1, H * S - 1], radius=64 * S, fill=255)
    canvas.paste(grad, (0, 0), mask)

    # 白色大爱心
    h = heart(132)
    canvas.alpha_composite(h, ((W * S - h.width) // 2, int((H * S - h.height) / 2)))

    return canvas.resize((W, H), Image.LANCZOS)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    build_wide().save(os.path.join(OUT, "love-240x60.png"))
    build_button().save(os.path.join(OUT, "love-88x31.png"))
    build_square().save(os.path.join(OUT, "love-300x300.png"))
    build_icon().save(os.path.join(OUT, "love-icon-300x300.png"))
    print("done ->", OUT)
