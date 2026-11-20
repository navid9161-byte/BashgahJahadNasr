"""Animated reel for the 18th Iranian Regional Music Festival poster.

Builds a 1080x1920, 30 fps, 15 s video: the kamancheh player enters from the
left and the ney player from the right, dancing to the beat, then play in place.
Extra touches: title reveal + shine, pulsing rings, waving flags.

Usage: python3 render.py   (expects work/plate.png, work/kamancheh.png,
work/ney.png, work/music.mp3 produced by the prep step; writes out/*.mp4)
"""
import math
import subprocess
import numpy as np
from PIL import Image, ImageFilter

W, H, FPS, DUR = 1080, 1920, 30, 20.0
MUSIC = 'work/music2.mp3'          # v2: happier track, 21 s
RAW = 'work/music2.raw'
S = 1.5                      # 720 -> 1080 scale
BG = np.array([252, 215, 127], float)

# ---------------------------------------------------------------- beat grid
x = np.fromfile(RAW, dtype=np.int16).astype(float) / 32768
sr, hop = 22050, 512
env = np.array([np.sqrt((x[i*hop:(i+1)*hop]**2).mean()) for i in range(len(x)//hop)])
onset = np.maximum(np.diff(env), 0)
ofps = sr / hop
_on = onset - onset.mean()
_ac = np.correlate(_on, _on, 'full')[len(_on) - 1:]
BPM = float(max(range(70, 181), key=lambda b: np.interp(ofps * 60 / b, np.arange(len(_ac)), _ac)))
period = 60.0 / BPM
best = max(np.linspace(0, period, 40, endpoint=False),
           key=lambda ph: sum(np.interp((ph + k*period) * ofps, np.arange(len(onset)), onset)
                              for k in range(int(DUR / period))))
PHASE = best


def beat(t):
    """Beat position (float, integer = on a beat)."""
    return (t - PHASE) / period


def ease_out(u):
    u = min(max(u, 0.0), 1.0)
    return 1 - (1 - u) ** 3


# ---------------------------------------------------------------- base layers
src = np.asarray(Image.open('src/poster.jpg').convert('RGB')).astype(float)
plate720 = np.asarray(Image.open('work/plate.png').convert('RGB')).astype(float)
plate720[825:, :] = BG                     # everything under the banner is plain background
plate = Image.fromarray(plate720.astype(np.uint8)).resize((W, H), Image.LANCZOS)
plate_np = np.asarray(plate).astype(float)

# title text mask (yellow letters inside the maroon disc) and ring mask, row by row
yy, xx = np.mgrid[0:1280, 0:720]
maroon = (src[..., 0] < 130) & (src[..., 1] < 70) & (src[..., 2] < 70)
yellow = (src[..., 0] > 190) & (src[..., 1] > 150) & (src[..., 2] < 150)
notbg = np.abs(src - BG).sum(2) > 60
title_mask = np.zeros(src.shape[:2], bool)
ring_mask = np.zeros(src.shape[:2], bool)
my, mx = np.where(maroon[:470])
cy, cx = my.mean(), mx.mean()
r_disc = np.percentile(np.hypot(my - cy, mx - cx), 99)
for y in range(40, 520):
    xs = np.where(maroon[y])[0]
    if len(xs) < 20:
        continue
    x0, x1 = xs.min(), xs.max()
    if y < 440:
        title_mask[y, x0 + 3:x1 - 3] = yellow[y, x0 + 3:x1 - 3]
    for a, b in ((max(0, x0 - 36), x0), (x1 + 1, min(720, x1 + 37))):
        ring_mask[y, a:b] = notbg[y, a:b] & ~yellow[y, a:b]
# rows above the disc top: ring arcs only
top = my.min()
for y in range(max(0, top - 36), top):
    ring_mask[y, int(cx - r_disc - 40):int(cx + r_disc + 40)] = notbg[y, int(cx - r_disc - 40):int(cx + r_disc + 40)]


def up(mask, blur=1.2):
    im = Image.fromarray((mask * 255).astype(np.uint8)).resize((W, H), Image.LANCZOS)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(blur))).astype(float)[..., None] / 255


TITLE = up(title_mask)
RING = up(ring_mask, 1.5)
MAROON = np.array([88, 12, 18], float)
no_title = plate_np * (1 - TITLE) + MAROON * TITLE
CYv, CXv, RDv = cy * S, cx * S, r_disc * S
gy, gx = np.mgrid[0:H, 0:W]

# flags inside the banner
FLAGS = [(int(50*S), int(112*S)), (int(606*S), int(664*S))]
FY0, FY1 = int(783*S), int(825*S)

# musicians
L = Image.open('work/kamancheh.png'); R = Image.open('work/ney.png')
for im in (L, R):
    a = np.asarray(im).copy(); a[:2, :, 3] = 0; a[-2:, :, 3] = 0
    im.paste(Image.fromarray(a))
L = L.resize((int(L.width*S), int(L.height*S)), Image.LANCZOS)
R = R.resize((int(R.width*S), int(R.height*S)), Image.LANCZOS)
DROP = 34                                   # px lower than the poster, so hops clear the banner
LX, LY = 178*S, 825*S + DROP
RX, RY = 364*S, 825*S + DROP
ENTER0, ENTER1 = 0.5, 4.0


def place(frame, img, final_x, final_y, start_x, t, side):
    u = ease_out((t - ENTER0) / (ENTER1 - ENTER0))
    xpos = start_x + (final_x - start_x) * u
    b = beat(t)
    moving = ENTER0 < t < ENTER1 + 0.2
    hop_amp = 14 if moving else 6           # px
    lift = -abs(math.sin(math.pi * b)) * hop_amp
    sway = math.sin(math.pi * b / 2 + (0 if side == 'L' else math.pi)) * (6 if moving else 3.5)
    if t < ENTER0:
        return
    im = img
    if side == 'R':                          # skirt swirl: breathe horizontally
        sx = 1 + 0.035 * math.sin(math.pi * b)
        im = im.resize((max(1, int(im.width * sx)), im.height), Image.BICUBIC)
    rot = im.rotate(sway, resample=Image.BICUBIC, expand=True,
                    center=(im.width / 2, im.height))
    # keep feet anchored: bottom-centre of the original at the same spot
    cxp = xpos + img.width / 2
    fx = int(cxp - rot.width / 2)
    fy = int(final_y + img.height - rot.height + lift)
    frame.alpha_composite(rot, (fx, fy))


def frame_at(t, musicians=True):
    # title reveal 0.1-1.5 s
    k = ease_out((t - 0.1) / 1.4)
    base = no_title * (1 - k) + plate_np * k
    # shine sweep across the title 1.6-2.6 s
    s = (t - 1.6) / 1.0
    if 0 <= s <= 1:
        pos = -300 + s * (W + 600)
        band = np.exp(-((gx + (gy - CYv) * 0.5 - pos) / 60.0) ** 2)[..., None]
        base = base + TITLE * band * 90
    # ring pulse on every beat
    pulse = max(0.0, math.cos(math.pi * beat(t))) ** 6
    base = base * (1 + RING * 0.22 * pulse)
    base = np.clip(base, 0, 255)
    # waving flags
    for x0, x1 in FLAGS:
        reg = base[FY0:FY1, x0:x1].copy()
        for c in range(x1 - x0):
            dy = 2.2 * math.sin(2 * math.pi * (c / 45.0) - t * 5.5) * (c / (x1 - x0) * 0.6 + 0.4)
            reg[:, c] = np.roll(base[FY0:FY1, x0 + c], int(round(dy)), axis=0)
        base[FY0:FY1, x0:x1] = reg
    frame = Image.fromarray(base.astype(np.uint8)).convert('RGBA')
    if musicians:
        place(frame, L, LX, LY, -L.width - 30, t, 'L')
        place(frame, R, RX, RY, W + 30, t, 'R')
    return frame.convert('RGB')


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:                    # preview stills: python3 render.py 0.3 2 3.5 8
        for t in map(float, sys.argv[1:]):
            frame_at(t).save(f'work/still_{t:05.2f}.png')
        sys.exit()
    n = int(DUR * FPS)
    ff = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
         '-r', str(FPS), '-i', '-', '-i', MUSIC,
         '-af', f'afade=t=in:st=0:d=0.3,afade=t=out:st={DUR-1.2}:d=1.2', '-t', str(DUR),
         '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium',
         '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', 'out/navahi-reel-20s.mp4'],
        stdin=subprocess.PIPE)
    for i in range(n):
        ff.stdin.write(frame_at(i / FPS).tobytes())
    ff.stdin.close(); ff.wait()
    print('bpm', BPM, 'beat phase', round(PHASE, 3), 'done')
