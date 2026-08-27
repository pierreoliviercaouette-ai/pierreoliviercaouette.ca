/** Reprend seulement la fin copilote + encode (frames inpaint déjà présentes). */
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

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 24;
const CABIN_START = 120;
const COPILOT_START = 173;
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
async function framedZoom(raw, zoom, panX, panY) {
  const z = Math.max(1, zoom);
  const cropW = Math.round(WIDTH / z);
  const cropH = Math.round(HEIGHT / z);
  const maxLeft = WIDTH - cropW;
  const maxTop = HEIGHT - cropH;
  const left = Math.round(Math.min(maxLeft, Math.max(0, maxLeft * panX)));
  const top = Math.round(Math.min(maxTop, Math.max(0, maxTop * panY)));
  return sharp(raw.data, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
    .extract({ left, top, width: cropW, height: cropH })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

async function main() {
  const frames = fs
    .readdirSync(SEQ)
    .filter((f) => /^frame-\d+\.jpg$/.test(f))
    .sort();
  const total = frames.length;
  if (total < 200) throw new Error(`frames insuffisantes: ${total}`);
  console.log(`${total} frames`);

  const p3Files = ['p3-02.png', 'p3-05.png']
    .map((f) => path.join(ASSETS, f))
    .filter((p) => fs.existsSync(p));
  if (p3Files.length < 2) throw new Error('plates copilote manquantes');
  const plates = [];
  for (const f of p3Files) plates.push(await loadRaw(f));

  const n = total - (COPILOT_START - 1);
  const fadeLen = Math.max(1, Math.round(FPS * 0.4));
  const crossLen = Math.max(1, Math.round(FPS * 0.55));
  const holdA = Math.max(1, Math.floor((n - crossLen) * 0.55));
  const baseRaws = [];
  for (let j = 0; j < Math.min(n, fadeLen); j += 1) {
    baseRaws.push(
      await loadRaw(path.join(SEQ, `frame-${String(COPILOT_START + j).padStart(4, '0')}.jpg`))
    );
  }

  console.log(`Copilote frames ${COPILOT_START}–${total}…`);
  for (let j = 0; j < n; j += 1) {
    const frameIndex = COPILOT_START + j;
    const t = n <= 1 ? 0 : j / (n - 1);
    const e = easeInOut(t);
    let plateT = 0;
    if (j > holdA) plateT = Math.min(1, (j - holdA) / crossLen);
    let blended = { data: blendRaw(plates[0].data, plates[1].data, easeInOut(plateT)) };
    blended = await framedZoom(blended, 1.03 + e * 0.12, 0.38 + e * 0.18, 0.44 + e * 0.04);
    const fade = Math.min(1, j / fadeLen);
    if (fade < 1 && baseRaws[j]) {
      blended = { data: blendRaw(baseRaws[j].data, blended.data, fade) };
    }
    const outPath = path.join(SEQ, `frame-${String(frameIndex).padStart(4, '0')}.jpg`);
    const tmpPath = path.join(SEQ, `tmp-${String(frameIndex).padStart(4, '0')}.jpg`);
    await sharp(blended.data, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(tmpPath);
    try {
      fs.unlinkSync(outPath);
    } catch {
      /* ignore */
    }
    fs.renameSync(tmpPath, outPath);
  }

  const mp4 = path.join(SRC, 'pillars-sequence.mp4');
  console.log('Encodage…');
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

  console.log(`OK ${mp4} (${(fs.statSync(mp4).size / 1e6).toFixed(2)} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
