/**
 * Génère une séquence 24 fps puis encode pillars-sequence.mp4.
 * Usage: node scripts/generate-jemcee-sequence.js
 * Requiert: sharp + ffmpeg-static (dev)
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'jemcee');
const OUT = path.join(SRC, 'sequence');
const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 24;
const FRAME_COUNT = FPS * 4;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

async function loadKey(name) {
  return sharp(path.join(SRC, name))
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

function blendRaw(a, b, t) {
  const out = Buffer.alloc(a.length);
  for (let i = 0; i < a.length; i += 1) {
    out[i] = Math.round(lerp(a[i], b[i], t));
  }
  return out;
}

async function framedKey(rawMeta, zoom, panX, panY) {
  const { data, info } = rawMeta;
  const img = sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  });
  const z = Math.max(1, zoom);
  const cropW = Math.round(info.width / z);
  const cropH = Math.round(info.height / z);
  const maxLeft = info.width - cropW;
  const maxTop = info.height - cropH;
  const left = Math.round(Math.min(maxLeft, Math.max(0, maxLeft * panX)));
  const top = Math.round(Math.min(maxTop, Math.max(0, maxTop * panY)));
  return img
    .extract({ left, top, width: cropW, height: cropH })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

async function encodeMp4() {
  let ffmpeg;
  try {
    ffmpeg = require('ffmpeg-static');
  } catch {
    console.warn('ffmpeg-static absent — MP4 non généré.');
    return;
  }
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
      '22',
      '-movflags',
      '+faststart',
      '-an',
      out,
    ],
    { stdio: 'inherit' }
  );
  if (r.status === 0) console.log('MP4 →', out);
  else console.error('ffmpeg exit', r.status);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('Loading keyframes…');
  const engine = await loadKey('engine-bay.jpg');
  const cage = await loadKey('safety-cage.jpg');
  const copilot = await loadKey('copilot.jpg');

  for (let i = 0; i < FRAME_COUNT; i += 1) {
    let buffer;
    let info = { width: WIDTH, height: HEIGHT, channels: 4 };

    if (i < 32) {
      const local = i / 31;
      const framed = await framedKey(
        engine,
        lerp(1.0, 1.18, easeInOut(local)),
        lerp(0.35, 0.55, local),
        lerp(0.4, 0.3, local)
      );
      buffer = framed.data;
      info = framed.info;
    } else if (i < 40) {
      const local = easeInOut((i - 32) / 7);
      const a = await framedKey(engine, 1.18, 0.55, 0.3);
      const b = await framedKey(cage, 1.05, 0.45, 0.4);
      buffer = blendRaw(a.data, b.data, local);
      info = a.info;
    } else if (i < 64) {
      const local = (i - 40) / 23;
      const framed = await framedKey(
        cage,
        lerp(1.05, 1.2, easeInOut(local)),
        lerp(0.45, 0.35, local),
        lerp(0.4, 0.5, local)
      );
      buffer = framed.data;
      info = framed.info;
    } else if (i < 72) {
      const local = easeInOut((i - 64) / 7);
      const a = await framedKey(cage, 1.2, 0.35, 0.5);
      const b = await framedKey(copilot, 1.08, 0.5, 0.45);
      buffer = blendRaw(a.data, b.data, local);
      info = a.info;
    } else {
      const local = (i - 72) / Math.max(FRAME_COUNT - 73, 1);
      const framed = await framedKey(
        copilot,
        lerp(1.08, 1.22, easeInOut(local)),
        lerp(0.5, 0.42, local),
        lerp(0.45, 0.38, local)
      );
      buffer = framed.data;
      info = framed.info;
    }

    await sharp(buffer, {
      raw: { width: info.width, height: info.height, channels: info.channels },
    })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(path.join(OUT, `frame-${String(i + 1).padStart(4, '0')}.jpg`));

    if (i % 12 === 0 || i === FRAME_COUNT - 1) console.log(`frame ${i + 1}/${FRAME_COUNT}`);
  }

  await encodeMp4();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
