"""Build site/assets/photos/og-card.jpg from the clean Normandie/Nagoya photograph.

Usage:
    python scripts/build_og_card.py

Output: site/assets/photos/og-card.jpg (1200x630, optimised JPEG, ~150KB target).
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "site" / "assets" / "photos" / "CANAL_AI_Normandie.png"
OUT = ROOT / "site" / "assets" / "photos" / "og-card.jpg"

OG_W, OG_H = 1200, 630

NAVY = (0, 85, 164)        # CANAL-AI blue (#0055A4)
RED = (188, 0, 45)         # CANAL-AI red (#BC002D)
NAVY_DEEP = (4, 18, 56)    # for bottom gradient
WHITE = (255, 255, 255)


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    """Pick a system font; fall back through a list until one loads."""
    candidates = {
        "black": ["seguisb.ttf", "segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"],
        "bold": ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"],
        "regular": ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"],
        "italic": ["segoeuii.ttf", "ariali.ttf", "DejaVuSans-Oblique.ttf"],
    }[name]
    for c in candidates:
        try:
            return ImageFont.truetype(c, size)
        except OSError:
            continue
    return ImageFont.load_default()


def crop_clean_photo(src: Image.Image) -> Image.Image:
    """Crop the source PNG to remove the baked-in 'CANAL-AI' text band at the top,
    then fit to OG dimensions (1200x630, 1.905:1)."""
    w, h = src.size  # 1344 x 768
    # Drop the top band where the existing text lives (the baked-in "CANAL-AI"
    # extends down to roughly y=215 on the 768-tall source).
    src = src.crop((0, 215, w, h))  # now 1344 x 553
    # The OG canvas is 1.905:1; current crop is 1344/618 = 2.175:1 (a touch wider).
    # Scale by height to match 630, then center-crop horizontally.
    scale = OG_H / src.height
    new_w = int(round(src.width * scale))
    src = src.resize((new_w, OG_H), Image.LANCZOS)
    if src.width > OG_W:
        x = (src.width - OG_W) // 2
        src = src.crop((x, 0, x + OG_W, OG_H))
    elif src.width < OG_W:
        canvas = Image.new("RGB", (OG_W, OG_H), NAVY_DEEP)
        canvas.paste(src, ((OG_W - src.width) // 2, 0))
        src = canvas
    return src


def add_bottom_gradient(im: Image.Image, height: int = 260) -> Image.Image:
    """Soft dark gradient on the bottom `height` pixels for legibility."""
    overlay = Image.new("RGBA", (OG_W, OG_H), (0, 0, 0, 0))
    grad = Image.new("L", (1, height), 0)
    for y in range(height):
        # Ease-in: transparent at top of band, ~80% opaque at bottom.
        t = y / max(1, height - 1)
        alpha = int(round(205 * (t ** 1.6)))
        grad.putpixel((0, y), alpha)
    grad = grad.resize((OG_W, height))
    band = Image.new("RGBA", (OG_W, height), NAVY_DEEP + (0,))
    band.putalpha(grad)
    overlay.paste(band, (0, OG_H - height), band)
    return Image.alpha_composite(im.convert("RGBA"), overlay).convert("RGB")


def draw_brand_dots(d: ImageDraw.ImageDraw, x: int, y: int, r: int = 18) -> int:
    """Two overlapping dots (blue + red) — same brand mark as the website topbar."""
    d.ellipse((x, y, x + 2 * r, y + 2 * r), fill=NAVY)
    d.ellipse((x + int(1.3 * r), y, x + int(1.3 * r) + 2 * r, y + 2 * r), fill=RED)
    return x + int(1.3 * r) + 2 * r  # right edge of the mark


def draw_text_block(im: Image.Image) -> Image.Image:
    d = ImageDraw.Draw(im)

    pad_x, pad_bottom = 70, 60

    # Brand dots
    dots_y = OG_H - pad_bottom - 220
    draw_brand_dots(d, pad_x, dots_y, r=16)

    # Headline "CANAL-AI"
    headline_font = font("black", 96)
    headline = "CANAL-AI"
    head_y = dots_y + 50
    # Subtle shadow for max legibility on busy backgrounds
    d.text((pad_x + 2, head_y + 2), headline, font=headline_font, fill=(0, 0, 0, 180))
    d.text((pad_x, head_y), headline, font=headline_font, fill=WHITE)

    # Subhead
    sub_font = font("regular", 32)
    sub = "Federated AI across frontiers"
    sub_y = head_y + 110
    d.text((pad_x + 1, sub_y + 1), sub, font=sub_font, fill=(0, 0, 0, 160))
    d.text((pad_x, sub_y), sub, font=sub_font, fill=(235, 240, 250))

    # Tagline (italic)
    tag_font = font("italic", 24)
    tag = "Patient data never crosses the border. Only the model does."
    tag_y = sub_y + 46
    d.text((pad_x, tag_y), tag, font=tag_font, fill=(200, 215, 235))

    # URL chip bottom-right
    url_font = font("bold", 22)
    url = "canal-ai.org"
    url_w = d.textlength(url, font=url_font)
    chip_pad_x, chip_pad_y = 16, 8
    chip_w = int(url_w + 2 * chip_pad_x)
    chip_h = 38
    chip_x = OG_W - pad_x - chip_w
    chip_y = OG_H - pad_bottom - chip_h - 8
    # Rounded chip
    d.rounded_rectangle(
        (chip_x, chip_y, chip_x + chip_w, chip_y + chip_h),
        radius=chip_h // 2,
        fill=(255, 255, 255, 230),
    )
    d.text(
        (chip_x + chip_pad_x, chip_y + chip_pad_y - 1),
        url,
        font=url_font,
        fill=NAVY,
    )

    return im


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    photo = crop_clean_photo(src)
    photo = add_bottom_gradient(photo, height=270)
    photo = draw_text_block(photo)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    photo.save(OUT, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"Wrote {OUT.relative_to(ROOT)}  ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
