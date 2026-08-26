const { spawnSync } = require('child_process');
const path = require('path');
const ffmpeg = require('ffmpeg-static');

const src = path.join(__dirname, '..', 'public', 'jemcee');
const jobs = [
  ['engine-bay.jpg', 'scene-performance.mp4'],
  ['safety-cage.jpg', 'scene-securite.mp4'],
  ['copilot.jpg', 'scene-copilote.mp4'],
];

const filter =
  "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0012,1.18)':d=96:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=24";

for (const [img, out] of jobs) {
  const r = spawnSync(
    ffmpeg,
    [
      '-y',
      '-loop',
      '1',
      '-i',
      path.join(src, img),
      '-vf',
      filter,
      '-t',
      '4',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '23',
      '-movflags',
      '+faststart',
      '-an',
      path.join(src, out),
    ],
    { stdio: 'inherit' }
  );
  console.log(out, 'exit', r.status);
}
