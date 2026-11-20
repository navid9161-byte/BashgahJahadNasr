"""Method B: AI-animated musicians (Kling clips) composited onto the animated poster.

Each clip shows one musician dancing/playing on the flat poster yellow; the
yellow is keyed out, the clip is scaled to the musician's poster size and slid
in from off-frame, then loops in place (start frame == end frame, so the loop is
seamless).  Background effects (title, rings, flags) come from render.py.

Usage: python3 render_b.py            -> out/navahi-reel-b.mp4
       python3 render_b.py 2 6        -> preview stills in work/
"""
import math
import subprocess
import sys
import numpy as np
from PIL import Image
import render as R0

W, H, FPS, DUR = R0.W, R0.H, R0.FPS, R0.DUR
BG = R0.BG
FIG_H = 209 * R0.S               # musician height on the reel (px)
START_FIG_H, START_SIZE, START_DY = 760, 1024, 20   # how figures sit in the start images


def load_clip(path):
    probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                            'stream=width,height,r_frame_rate', '-of', 'csv=p=0', path],
                           capture_output=True, text=True).stdout.strip().split(',')
    w, h = int(probe[0]), int(probe[1]); num, den = map(int, probe[2].split('/'))
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True).stdout
    frames = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3)
    return frames, num / den


def key_frames(frames, fig_w_start):
    """Key out the yellow background, unmix colours, scale to reel size."""
    n, h, w, _ = frames.shape
    k = FIG_H / (START_FIG_H / START_SIZE * h)          # clip px -> reel px
    out = []
    margin = int(0.03 * w)
    for f in frames:
        f = f.astype(float)
        border = np.concatenate([f[:margin].reshape(-1, 3), f[-margin:].reshape(-1, 3),
                                 f[:, :margin].reshape(-1, 3), f[:, -margin:].reshape(-1, 3)])
        bg = np.median(border, axis=0)
        d = np.abs(f - bg).sum(2)
        a = np.clip((d - 22) / 48.0, 0, 1)
        a[:margin] = 0; a[-margin:] = 0; a[:, :margin] = 0; a[:, -margin:] = 0
        F = np.clip((f - (1 - a[..., None]) * bg) / np.maximum(a[..., None], 1e-3), 0, 255)
        # pull colours toward the poster's own yellow so any tint shift disappears at the edges
        rgba = Image.fromarray(np.dstack([F, a * 255]).astype(np.uint8), 'RGBA')
        out.append(rgba.resize((int(w * k), int(h * k)), Image.LANCZOS))
    # where the figure's top-left lands inside the scaled clip
    fig_w = fig_w_start / START_SIZE * w * k
    ox = (w * k - fig_w) / 2
    oy = ((START_SIZE - START_FIG_H) / 2 + START_DY) / START_SIZE * h * k
    return out, ox, oy


def main():
    clipL, fpsL = load_clip('work/b/kamancheh.mp4')
    clipR, fpsR = load_clip('work/b/ney.mp4')
    Lw = Image.open('work/kamancheh.png').width / Image.open('work/kamancheh.png').height * START_FIG_H
    Rw = Image.open('work/ney.png').width / Image.open('work/ney.png').height * START_FIG_H
    kL, oxL, oyL = key_frames(clipL, Lw)
    kR, oxR, oyR = key_frames(clipR, Rw)

    def put(frame, frames, fps, ox, oy, fx, fy, start_x, t):
        if t < R0.ENTER0:
            return
        u = R0.ease_out((t - R0.ENTER0) / (R0.ENTER1 - R0.ENTER0))
        x = start_x + (fx - start_x) * u
        moving = t < R0.ENTER1 + 0.2
        lift = -abs(math.sin(math.pi * R0.beat(t))) * (8 if moving else 0)
        img = frames[int((t - R0.ENTER0) * fps) % len(frames)]
        frame.alpha_composite(img, (int(x - ox), int(fy - oy + lift)))

    def frame_b(t):
        fr = R0.frame_at(t, musicians=False).convert('RGBA')
        put(fr, kL, fpsL, oxL, oyL, R0.LX, R0.LY, -300, t)
        put(fr, kR, fpsR, oxR, oyR, R0.RX, R0.RY, W + 60, t)
        return fr.convert('RGB')

    if len(sys.argv) > 1:
        for t in map(float, sys.argv[1:]):
            frame_b(t).save(f'work/b/still_{t:05.2f}.png')
        return
    ff = subprocess.Popen(
        ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
         '-r', str(FPS), '-i', '-', '-i', 'work/music.mp3',
         '-af', f'afade=t=in:st=0:d=0.3,afade=t=out:st={DUR-1.2}:d=1.2', '-t', str(DUR),
         '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium',
         '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', 'out/navahi-reel-b.mp4'],
        stdin=subprocess.PIPE)
    for i in range(int(DUR * FPS)):
        ff.stdin.write(frame_b(i / FPS).tobytes())
    ff.stdin.close(); ff.wait()
    print('done')


if __name__ == '__main__':
    main()
