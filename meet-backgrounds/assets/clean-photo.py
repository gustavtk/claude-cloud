# Removes the three laptops (and the chair back) from the generated office photo by continuing the
# wall down to the desk and rebuilding the desk from a clear strip of it, then crops each step for review.
import sys
import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
H, W, _ = im.shape  # 1125 x 2000
res = im.copy()

WALL_TOP, DESK_TOP = 804, 1012   # wall to be rebuilt, then desk surface
X0 = 106                          # keep the small plant pot at the far left

# Wall: per column, the average of a clean band just above. Right of the shelf's left end the band
# hits books and the lamp, so those columns reuse the last clean column's colour.
band = im[752:796].mean(axis=0)            # (W, 3)
SHELF_X = 1318
band[SHELF_X:] = band[SHELF_X - 20:SHELF_X].mean(axis=0)
# The wall darkens slightly toward the desk; follow the gradient seen higher up.
for y in range(WALL_TOP, DESK_TOP):
    t = (y - WALL_TOP) / (DESK_TOP - WALL_TOP)
    res[y, X0:] = band[X0:] * (1 - 0.06 * t)
# The shelf board itself (y 780-812, x 1325-1990) stays; nothing under it but wall now.

# Desk: wood grain runs left to right, so each row of the desk is rebuilt as that row's average
# colour over a clear strip of desk, with a little row-to-row variation kept from the strip itself.
strip = im[DESK_TOP:H, 1222:1316]
rows = strip.mean(axis=1)                  # (rows, 3)
# A gentle left-to-right light falloff, matching the window on the left.
xs = np.linspace(0, 1, W - X0)[:, None]
fall = 1.03 - 0.06 * xs                    # (cols, 1)
for i, y in enumerate(range(DESK_TOP, H)):
    res[y, X0:] = rows[i][None, :] * fall
# A soft desk edge line where wall meets desk, taken from the same clear strip.
edge = im[DESK_TOP - 4:DESK_TOP + 4, 1222:1316].mean(axis=(1))
for x in range(X0, W):
    res[DESK_TOP - 4:DESK_TOP + 4, x] = edge

# Feather the rebuilt area into the original so no hard seam is left before the final blur.
mask = np.zeros((H, W), np.float32)
mask[WALL_TOP - 2:, X0:] = 1
mask[780:812, 1325:1990] = 0
m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
m = np.asarray(m).astype(np.float32)[..., None] / 255
final = im * (1 - m) + res * m
Image.fromarray(final.clip(0, 255).astype(np.uint8)).save(out)
