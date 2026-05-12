"""One-off: make soulin-nav-logo.png background transparent (near-black -> alpha)."""
from pathlib import Path

from PIL import Image

def main() -> None:
    root = Path(__file__).resolve().parents[1]
    path = root / "public" / "soulin-nav-logo.png"
    img = Image.open(path).convert("RGBA")
    px = img.load()
    w, h = img.size
    # Pixels darker than this go fully transparent (typical #000–#222 bg)
    hard = 42
    # Soft edge to reduce jaggies on anti-aliased black
    soft = 72
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3.0
            if lum <= hard:
                px[x, y] = (r, g, b, 0)
            elif lum < soft:
                t = (lum - hard) / (soft - hard)
                new_a = int(round(a * t))
                px[x, y] = (r, g, b, new_a)
    img.save(path, optimize=True)
    print(f"Wrote transparent PNG: {path}")


if __name__ == "__main__":
    main()
