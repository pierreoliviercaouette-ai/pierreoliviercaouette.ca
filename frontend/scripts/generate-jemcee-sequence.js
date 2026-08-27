/**
 * Séquence continue WRX 2010 TEST Racing :
 * avant → capot/engine → côté conducteur/habitacle → outils copilote.
 * Usage: node scripts/generate-jemcee-sequence.js
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'jemcee');
const STORY = path.join(SRC, 'storyboard');
const OUT = path.join(SRC, 'sequence');
const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 24;
/** 10 s — scrub Apple */
const FRAME_COUNT = FPS * 10;

const KEYFRAMES = [
  // Partie 1 — avant + ouverture capot
  { file: 'kf-01-showroom-wide.png', zoom: [1.0, 1.1], panX: [0.5, 0.5], panY: [0.48, 0.52] },
  { file: 'kf-02-orbit-side.png', zoom: [1.05, 1.18], panX: [0.5, 0.5], panY: [0.5, 0.55] },
  { file: 'kf-03-approach-front.png', zoom: [1.02, 1.14], panX: [0.5, 0.5], panY: [0.42, 0.48] },
  { file: 'kf-04-hood-open.png', zoom: [1.08, 1.22], panX: [0.5, 0.5], panY: [0.45, 0.5] },
  // Partie 2 — côté conducteur → habitacle
  { file: 'kf-05-engine-detail.png', zoom: [1.02, 1.12], panX: [0.48, 0.52], panY: [0.45, 0.48] },
  { file: 'kf-06-enter-cabin.png', zoom: [1.04, 1.14], panX: [0.48, 0.5], panY: [0.45, 0.48] },
  { file: 'kf-07-seat-harness.png', zoom: [1.06, 1.16], panX: [0.48, 0.52], panY: [0.42, 0.45] },
  // Partie 3 — outils copilote passager
  { file: 'kf-08-copilot.png', zoom: [1.04, 1.14], panX: [0.5, 0.55], panY: [0.45, 0.48] },
  { file: 'kf-09-copilot-detail.png', zoom: [1.08, 1.2], panX: [0.5, 0.48], panY: [0.45, 0.5] },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function smoothstep(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

async function loadKey(file) {
  return sharp(path.join(STORY, file))
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

function blendRaw(a, b, t) {
  const out = Buffer.alloc(a.length);
  const u = smoothstep(t);
  for (let i = 0; i < a.length; i += 1) {
    out[i] = Math.round(lerp(a[i], b[i], u));
  }
  return out;
}

async function framedKey(rawMeta, zoom, panX, panY) {
  const { data, info } = rawMeta;
  const z = Math.max(1, zoom);
  const cropW = Math.round(info.width / z);
  const cropH = Math.round(info.height / z);
  const maxLeft = info.width - cropW;
  const maxTop = info.height - cropH;
  const left = Math.round(Math.min(maxLeft, Math.max(0, maxLeft * panX)));
  const top = Math.round(Math.min(maxTop, Math.max(0, maxTop * panY)));
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .extract({ left, top, width: cropW, height: cropH })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

async function encodeMp4() {
  const ffmpeg = require('ffmpeg-static');
  const out = path.join(SRC, 'pillars-sequence.mp4');
  const r = spawnSync(
    ffmpeg,
    [
      '-y',
      '-framerate',
      String(FPS),
      '-i',
      path.join(OUT, 'frame-%04d.jpg'),
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '20',
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
      out,
    ],
    { stdio: 'inherit' }
  );
  if (r.status === 0) {
    const mb = (fs.statSync(out).size / 1e6).toFixed(2);
    console.log(`MP4 → ${out} (${mb} MB)`);
  } else {
    throw new Error(`ffmpeg exit ${r.status}`);
  }
}

async function updatePosters() {
  const map = [
    ['kf-04-hood-open.png', 'engine-bay.jpg'],
    ['kf-07-seat-harness.png', 'safety-cage.jpg'],
    ['kf-09-copilot-detail.png', 'copilot.jpg'],
  ];
  for (const [from, to] of map) {
    await sharp(path.join(STORY, from))
      .resize(1920, 1080, { fit: 'cover' })
      .jpeg({ quality: 88 })
      .toFile(path.join(SRC, to));
  }
  console.log('Posters mis à jour');
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('Chargement keyframes…');
  const loaded = [];
  for (const kf of KEYFRAMES) {
    loaded.push({ ...kf, raw: await loadKey(kf.file) });
    console.log('  ', kf.file);
  }

  const n = loaded.length;
  // Segments égaux ; chevauchement de morph ~18 % pour fluidité 3D
  const segmentLen = 1 / (n - 1);

  console.log(`Rendu ${FRAME_COUNT} frames @ ${FPS} fps…`);
  for (let i = 0; i < FRAME_COUNT; i += 1) {
    const t = i / (FRAME_COUNT - 1);
    const pos = t / segmentLen;
    const idx = Math.min(n - 2, Math.floor(pos));
    const local = easeInOut(pos - idx);

    const a = loaded[idx];
    const b = loaded[idx + 1];

    const zoomA = lerp(a.zoom[0], a.zoom[1], local);
    const zoomB = lerp(b.zoom[0], b.zoom[1], local);
    const panXA = lerp(a.panX[0], a.panX[1], local);
    const panXB = lerp(b.panX[0], b.panX[1], local);
    const panYA = lerp(a.panY[0], a.panY[1], local);
    const panYB = lerp(b.panY[0], b.panY[1], local);

    const frameA = await framedKey(a.raw, zoomA, panXA, panYA);
    const frameB = await framedKey(b.raw, zoomB, panXB, panYB);
    const blended = blendRaw(frameA.data, frameB.data, local);

    const outPath = path.join(OUT, `frame-${String(i + 1).padStart(4, '0')}.jpg`);
    await sharp(blended, {
      raw: { width: WIDTH, height: HEIGHT, channels: 4 },
    })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outPath);

    if (i % 24 === 0 || i === FRAME_COUNT - 1) {
      console.log(`  frame ${i + 1}/${FRAME_COUNT}`);
    }
  }

  await encodeMp4();
  await updatePosters();

  fs.writeFileSync(
    path.join(OUT, 'manifest.json'),
    JSON.stringify(
      {
        fps: FPS,
        frameCount: FRAME_COUNT,
        width: WIDTH,
        height: HEIGHT,
        source: 'wrx-2010-test-racing continuous camera',
        chapters: [
          { id: 'orbit', start: 0, end: 0.12 },
          { id: 'performance', start: 0.12, end: 0.42 },
          { id: 'securite', start: 0.42, end: 0.72 },
          { id: 'accompagnement', start: 0.72, end: 1 },
        ],
      },
      null,
      2
    )
  );
  console.log('Terminé.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
