/**
 * Séquence conforme demandée :
 * 1) WRX 3D (orbite référence, sans cartes)
 * 2) Ouverture capot (référence + patch clean)
 * 3) Habitacle : cage, sièges, harnais, casque
 * 4) Regard copilote côté passager
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'jemcee');
const SEQ = path.join(SRC, 'sequence');
const ASSETS = path.join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'c-Users-pierr-OneDrive-Documents-pierreoliviercaouette-ca',
  'assets'
);
const REF_VIDEO = path.join(
  process.env.USERPROFILE || '',
  'Downloads',
  'Au_lieu_d_avoir_plusieurs_peti.mp4'
);

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 24;
const ENGINE_START = 53; // ~2.2s
const CABIN_START = 120; // ~5.0s
const COPILOT_START = 173; // ~7.2s

const ffmpeg = require('ffmpeg-static');

function run(args) {
  const r = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg exit ${r.status}`);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

async function loadRaw(file) {
  return sharp(file)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

function blendRaw(a, b, t) {
  const out = Buffer.alloc(a.length);
  const u = easeInOut(Math.min(1, Math.max(0, t)));
  for (let i = 0; i < a.length; i += 1) out[i] = Math.round(lerp(a[i], b[i], u));
  return out;
}

async function framedZoom(rawBuf, zoom, panX, panY) {
  const z = Math.max(1, zoom);
  const cropW = Math.round(WIDTH / z);
  const cropH = Math.round(HEIGHT / z);
  const maxLeft = WIDTH - cropW;
  const maxTop = HEIGHT - cropH;
  const left = Math.round(Math.min(maxLeft, Math.max(0, maxLeft * panX)));
  const top = Math.round(Math.min(maxTop, Math.max(0, maxTop * panY)));
  return sharp(rawBuf, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
    .extract({ left, top, width: cropW, height: cropH })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

async function writeFrame(index, rawData) {
  const outPath = path.join(SEQ, `frame-${String(index).padStart(4, '0')}.jpg`);
  const tmpPath = path.join(SEQ, `tmp-${String(index).padStart(4, '0')}.jpg`);
  await sharp(rawData, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(tmpPath);
  try {
    fs.unlinkSync(outPath);
  } catch {
    /* ignore */
  }
  fs.renameSync(tmpPath, outPath);
}

function writePyClean() {
  const py = path.join(SEQ, '_clean_phases.py');
  const engineClean = path.join(ASSETS, 'p2-engine-clean.png').replace(/\\/g, '/');
  fs.writeFileSync(
    py,
    `
import cv2
import numpy as np
from pathlib import Path

seq = Path(r"""${SEQ.replace(/\\/g, '/')}""")
engine_clean_path = r"""${engineClean}"""
W, H = ${WIDTH}, ${HEIGHT}
ENGINE_START, CABIN_START, COPILOT_START = ${ENGINE_START}, ${CABIN_START}, ${COPILOT_START}

engine_clean = cv2.imread(engine_clean_path)
engine_clean = cv2.resize(engine_clean, (W, H), interpolation=cv2.INTER_AREA)

def feather_mask(x, y, rw, rh, feather=28):
    m = np.zeros((H, W), np.float32)
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W, x + rw), min(H, y + rh)
    m[y0:y1, x0:x1] = 1.0
    k = feather * 2 + 1
    return cv2.GaussianBlur(m, (k, k), feather * 0.45)

srcs = sorted(seq.glob("src-*.jpg"))
for fp in srcs:
    i = int(fp.stem.split("-")[1])
    img = cv2.imread(str(fp))
    if img is None:
        continue
    if img.shape[1] != W or img.shape[0] != H:
        img = cv2.resize(img, (W, H))

    out = img.copy()
    mask = np.zeros((H, W), np.float32)

    # Sparkle coin bas-droit (parties 2–4 seulement ; orbite gérée sans inpaint carrosserie)
    if i >= ENGINE_START:
        mask = np.maximum(mask, feather_mask(1180, 560, 80, 80, 8))

    if i < ENGINE_START:
        # Orbite : copie 1:1 depuis src, sparkle retiré dans ROI coin bas-droit
        roi_x0, roi_y0 = W - 160, H - 140
        roi = out[roi_y0:H, roi_x0:W]
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        bright = cv2.inRange(gray, 200, 255)
        bright = cv2.dilate(bright, np.ones((7, 7), np.uint8), iterations=2)
        if cv2.countNonZero(bright) > 0:
            out[roi_y0:H, roi_x0:W] = cv2.inpaint(roi, bright, 3, cv2.INPAINT_TELEA)

    elif i < CABIN_START:
        # Capot : patch plate clean sur zone carte + inpaint cyan
        card = feather_mask(0, 80, 430, 400, 32)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        cyan = cv2.inRange(hsv, (80, 90, 140), (110, 255, 255))
        cyan = cv2.dilate(cyan, np.ones((5, 5), np.uint8), 2).astype(np.float32) / 255.0
        card = np.maximum(card, cyan)
        card = np.maximum(card, feather_mask(480, 260, 140, 120, 20))
        for c in range(3):
            out[:, :, c] = (
                out[:, :, c] * (1 - card) + engine_clean[:, :, c] * card
            ).astype(np.uint8)
        # Nettoyage résidus
        m8 = (card * 255).astype(np.uint8)
        _, m8 = cv2.threshold(m8, 30, 255, cv2.THRESH_BINARY)
        m8 = cv2.dilate(m8, np.ones((3, 3), np.uint8), 1)
        # Léger inpaint seulement sur bord (différence forte)
        # skip heavy inpaint — patch suffit

    else:
        # Habitacle référence : cartes à supprimer (sera remplacé ensuite)
        card = feather_mask(0, 70, 440, 420, 28)
        card = np.maximum(card, feather_mask(620, 220, 420, 220, 24))
        card = np.maximum(card, feather_mask(980, 280, 280, 180, 18))
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        cyan = cv2.inRange(hsv, (80, 90, 140), (110, 255, 255))
        cyan = cv2.dilate(cyan, np.ones((5, 5), np.uint8), 2).astype(np.float32) / 255.0
        card = np.maximum(card, cyan)
        m8 = (card * 255).astype(np.uint8)
        _, m8 = cv2.threshold(m8, 35, 255, cv2.THRESH_BINARY)
        if cv2.countNonZero(m8):
            out = cv2.inpaint(out, m8, 4, cv2.INPAINT_TELEA)

    cv2.imwrite(str(seq / f"frame-{i:04d}.jpg"), out, [int(cv2.IMWRITE_JPEG_QUALITY), 93])

print(f"clean phases ok: {len(srcs)}")
`.trimStart()
  );
  return py;
}

async function main() {
  if (!fs.existsSync(REF_VIDEO)) throw new Error(`Référence manquante: ${REF_VIDEO}`);
  const cabinPlate = path.join(ASSETS, 'kf-07-seat-harness.png');
  const p3a = path.join(ASSETS, 'p3-02.png');
  const p3b = path.join(ASSETS, 'p3-05.png');
  for (const p of [cabinPlate, p3a, p3b, path.join(ASSETS, 'p2-engine-clean.png')]) {
    if (!fs.existsSync(p)) throw new Error(`Asset manquant: ${p}`);
  }

  fs.mkdirSync(SEQ, { recursive: true });
  for (const f of fs.readdirSync(SEQ)) {
    if (/^(frame-|src-|tmp-|_clean)/.test(f)) fs.unlinkSync(path.join(SEQ, f));
  }

  console.log('1/5 Extraction référence…');
  run([
    '-y',
    '-i',
    REF_VIDEO,
    '-vf',
    `fps=${FPS},scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT}`,
    '-q:v',
    '2',
    path.join(SEQ, 'src-%04d.jpg'),
  ]);
  const total = fs.readdirSync(SEQ).filter((f) => /^src-\d+\.jpg$/.test(f)).length;
  console.log(`   ${total} frames`);

  console.log('2/5 Nettoyage orbite + capot…');
  const py = writePyClean();
  const pr = spawnSync('python', [py], { stdio: 'inherit' });
  if (pr.status !== 0) throw new Error('python clean failed');

  console.log('3/5 Habitacle (cage / sièges / harnais / casque)…');
  const cabin = await loadRaw(cabinPlate);
  const cabinCount = COPILOT_START - CABIN_START;
  // Crossfade court depuis dernière frame capot/habitacle nettoyée
  const bridge = await loadRaw(
    path.join(SEQ, `frame-${String(CABIN_START).padStart(4, '0')}.jpg`)
  );
  for (let j = 0; j < cabinCount; j += 1) {
    const t = cabinCount <= 1 ? 0 : j / (cabinCount - 1);
    const e = easeInOut(t);
    const fadeIn = Math.min(1, j / Math.max(1, Math.round(FPS * 0.35)));
    let zoomed = await framedZoom(cabin.data, 1.02 + e * 0.1, 0.48 + e * 0.06, 0.42 + e * 0.08);
    if (fadeIn < 1) {
      zoomed = { data: blendRaw(bridge.data, zoomed.data, fadeIn) };
    }
    await writeFrame(CABIN_START + j, zoomed.data);
  }

  console.log('4/5 Regard copilote passager…');
  const plates = [await loadRaw(p3a), await loadRaw(p3b)];
  const n = total - (COPILOT_START - 1);
  const fadeLen = Math.max(1, Math.round(FPS * 0.4));
  const crossLen = Math.max(1, Math.round(FPS * 0.55));
  const holdA = Math.max(1, Math.floor((n - crossLen) * 0.5));
  const lastCabin = await loadRaw(
    path.join(SEQ, `frame-${String(COPILOT_START - 1).padStart(4, '0')}.jpg`)
  );

  for (let j = 0; j < n; j += 1) {
    const t = n <= 1 ? 0 : j / (n - 1);
    const e = easeInOut(t);
    let plateT = j > holdA ? Math.min(1, (j - holdA) / crossLen) : 0;
    let blended = blendRaw(plates[0].data, plates[1].data, easeInOut(plateT));
    let zoomed = await framedZoom(blended, 1.04 + e * 0.12, 0.36 + e * 0.2, 0.44 + e * 0.05);
    const fade = Math.min(1, j / fadeLen);
    if (fade < 1) {
      zoomed = { data: blendRaw(lastCabin.data, zoomed.data, fade) };
    }
    await writeFrame(COPILOT_START + j, zoomed.data);
  }

  console.log('5/5 Encodage…');
  const mp4 = path.join(SRC, 'pillars-sequence.mp4');
  run([
    '-y',
    '-framerate',
    String(FPS),
    '-i',
    path.join(SEQ, 'frame-%04d.jpg'),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '18',
    '-g',
    '1',
    '-keyint_min',
    '1',
    '-sc_threshold',
    '0',
    '-bf',
    '0',
    '-movflags',
    '+faststart',
    '-an',
    mp4,
  ]);

  await sharp(path.join(SEQ, 'frame-0001.jpg'))
    .resize(1920, 1080, { fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(SRC, 'engine-bay.jpg'));
  await sharp(path.join(SEQ, `frame-${String(CABIN_START).padStart(4, '0')}.jpg`))
    .resize(1920, 1080, { fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(SRC, 'safety-cage.jpg'));
  await sharp(path.join(SEQ, `frame-${String(total).padStart(4, '0')}.jpg`))
    .resize(1920, 1080, { fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(SRC, 'copilot.jpg'));

  fs.writeFileSync(
    path.join(SEQ, 'manifest.json'),
    JSON.stringify(
      {
        fps: FPS,
        frameCount: total,
        durationSec: total / FPS,
        narrative: ['orbit-wrx', 'hood-engine', 'cabin-cage-helmet', 'copilot-passenger'],
        engineStartFrame: ENGINE_START,
        cabinStartFrame: CABIN_START,
        copilotStartFrame: COPILOT_START,
      },
      null,
      2
    )
  );

  for (const f of fs.readdirSync(SEQ)) {
    if (/^(src-|tmp-|_clean)/.test(f)) fs.unlinkSync(path.join(SEQ, f));
  }

  console.log(`OK ${mp4} (${(fs.statSync(mp4).size / 1e6).toFixed(2)} MB, ${(total / FPS).toFixed(2)}s)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
