/**
 * Assemble pillars-sequence.mp4 from the user's reference video
 * + a short co-pilot ending (no UI cards).
 *
 * Usage: node scripts/assemble-jemcee-from-reference.js
 */
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'jemcee');
const OUT_SEQ = path.join(SRC, 'sequence');
const REF_VIDEO = path.join(
  process.env.USERPROFILE || '',
  'Downloads',
  'Au_lieu_d_avoir_plusieurs_peti.mp4'
);
const COPILOT_ASSETS = path.join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'c-Users-pierr-OneDrive-Documents-pierreoliviercaouette-ca',
  'assets'
);

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 24;
const COPILOT_SECONDS = 2.5;
const COPILOT_FRAMES = Math.round(FPS * COPILOT_SECONDS);

const ffmpeg = require('ffmpeg-static');

function run(args) {
  const r = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}`);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

async function framedZoom(inputPath, zoom, panX, panY, outPath) {
  const img = sharp(inputPath).resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' });
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const z = Math.max(1, zoom);
  const cropW = Math.round(info.width / z);
  const cropH = Math.round(info.height / z);
  const maxLeft = info.width - cropW;
  const maxTop = info.height - cropH;
  const left = Math.round(Math.min(maxLeft, Math.max(0, maxLeft * panX)));
  const top = Math.round(Math.min(maxTop, Math.max(0, maxTop * panY)));
  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .extract({ left, top, width: cropW, height: cropH })
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);
}

async function main() {
  if (!fs.existsSync(REF_VIDEO)) {
    throw new Error(`Vidéo de référence introuvable: ${REF_VIDEO}`);
  }

  fs.mkdirSync(OUT_SEQ, { recursive: true });
  for (const f of fs.readdirSync(OUT_SEQ)) {
    if (f.startsWith('frame-') || f.startsWith('copilot-')) {
      fs.unlinkSync(path.join(OUT_SEQ, f));
    }
  }

  // 1) Frames de la vidéo utilisateur (orbite + scènes)
  console.log('Extraction frames référence…');
  run([
    '-y',
    '-i',
    REF_VIDEO,
    '-vf',
    `fps=${FPS},scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT}`,
    path.join(OUT_SEQ, 'frame-%04d.jpg'),
  ]);

  const baseFrames = fs
    .readdirSync(OUT_SEQ)
    .filter((f) => /^frame-\d+\.jpg$/.test(f))
    .sort();
  console.log(`  ${baseFrames.length} frames base`);

  // 2) Fin copilote (images clean sans cartes)
  const copilots = [
    path.join(COPILOT_ASSETS, 'copilot-cabin.png'),
    path.join(COPILOT_ASSETS, 'copilot-clean.png'),
  ].filter((p) => fs.existsSync(p));

  if (copilots.length < 2) {
    throw new Error('Images copilote manquantes (copilot-cabin.png / copilot-clean.png)');
  }

  // Copie aussi dans storyboard pour versioning
  const story = path.join(SRC, 'storyboard');
  fs.mkdirSync(story, { recursive: true });
  fs.copyFileSync(copilots[0], path.join(story, 'kf-copilot-cabin.png'));
  fs.copyFileSync(copilots[1], path.join(story, 'kf-copilot-close.png'));

  console.log(`Rendu ${COPILOT_FRAMES} frames copilote…`);
  const startIndex = baseFrames.length;
  for (let i = 0; i < COPILOT_FRAMES; i += 1) {
    const t = easeInOut(i / Math.max(COPILOT_FRAMES - 1, 1));
    // Crossfade cabin → close-up via zoom path on each, pick source by half
    const useClose = t > 0.45;
    const local = useClose ? (t - 0.45) / 0.55 : t / 0.45;
    const src = useClose ? copilots[1] : copilots[0];
    const zoom = useClose ? 1.05 + local * 0.14 : 1.02 + local * 0.1;
    const panX = useClose ? 0.52 - local * 0.04 : 0.48 + local * 0.04;
    const panY = useClose ? 0.42 : 0.45;
    const out = path.join(
      OUT_SEQ,
      `frame-${String(startIndex + i + 1).padStart(4, '0')}.jpg`
    );
    await framedZoom(src, zoom, panX, panY, out);
  }

  const totalFrames = baseFrames.length + COPILOT_FRAMES;
  console.log(`Total frames: ${totalFrames}`);

  // 3) Encode all-I pour scrub
  const mp4 = path.join(SRC, 'pillars-sequence.mp4');
  console.log('Encodage MP4…');
  run([
    '-y',
    '-framerate',
    String(FPS),
    '-i',
    path.join(OUT_SEQ, 'frame-%04d.jpg'),
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
    mp4,
  ]);

  // Posters depuis la référence + copilote
  await sharp(path.join(OUT_SEQ, 'frame-0001.jpg'))
    .resize(1920, 1080, { fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(SRC, 'engine-bay.jpg'));
  // safety: milieu de séquence base
  const mid = baseFrames[Math.floor(baseFrames.length * 0.55)];
  await sharp(path.join(OUT_SEQ, mid))
    .resize(1920, 1080, { fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(SRC, 'safety-cage.jpg'));
  await sharp(copilots[1])
    .resize(1920, 1080, { fit: 'cover' })
    .jpeg({ quality: 88 })
    .toFile(path.join(SRC, 'copilot.jpg'));

  const durationSec = totalFrames / FPS;
  fs.writeFileSync(
    path.join(OUT_SEQ, 'manifest.json'),
    JSON.stringify(
      {
        fps: FPS,
        frameCount: totalFrames,
        width: WIDTH,
        height: HEIGHT,
        durationSec,
        source: 'user-reference + copilot-ending',
        chapters: [
          { id: 'orbit', start: 0, end: 0.22 },
          { id: 'performance', start: 0.22, end: 0.45 },
          { id: 'securite', start: 0.45, end: 0.72 },
          { id: 'accompagnement', start: 0.72, end: 1 },
        ],
      },
      null,
      2
    )
  );

  const mb = (fs.statSync(mp4).size / 1e6).toFixed(2);
  console.log(`OK → ${mp4} (${mb} MB, ${durationSec.toFixed(2)}s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
