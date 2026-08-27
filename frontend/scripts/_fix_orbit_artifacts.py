"""Corrige la partie orbite : src → frame sans masque carrosserie."""
import cv2
import numpy as np
from pathlib import Path

SEQ = Path(__file__).resolve().parents[1] / "public" / "jemcee" / "sequence"
W, H = 1280, 720
ENGINE_START = 53


def remove_sparkle(img):
    """Retire le sparkle UI coin bas-droit sans toucher la carrosserie."""
    out = img.copy()
    # ROI coin bas-droit uniquement
    x0, y0 = W - 160, H - 140
    roi = out[y0:H, x0:W].copy()
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    # Points très lumineux (étoile UI)
    bright = cv2.inRange(gray, 200, 255)
    bright = cv2.dilate(bright, np.ones((7, 7), np.uint8), iterations=2)
    if cv2.countNonZero(bright) > 0:
        roi_clean = cv2.inpaint(roi, bright, 3, cv2.INPAINT_TELEA)
        out[y0:H, x0:W] = roi_clean
    return out


n = 0
for i in range(1, ENGINE_START):
    src = SEQ / f"src-{i:04d}.jpg"
    if not src.exists():
        continue
    img = cv2.imread(str(src))
    if img is None:
        continue
    if img.shape[1] != W or img.shape[0] != H:
        img = cv2.resize(img, (W, H))

    out = remove_sparkle(img)

    cv2.imwrite(str(SEQ / f"frame-{i:04d}.jpg"), out, [int(cv2.IMWRITE_JPEG_QUALITY), 93])
    n += 1

print(f"orbit fixed: {n} frames")
