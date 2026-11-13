const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { generateSeoArtifacts } = require('./generate-seo-artifacts');

const buildIndex = path.join(__dirname, '../build/index.html');
const shell = fs.existsSync(buildIndex) ? fs.readFileSync(buildIndex, 'utf8') : null;

const shouldSkip = process.env.VERCEL === '1' || process.env.CI === 'true';

if (!shouldSkip) {
  const result = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['react-snap'],
    { stdio: 'inherit' }
  );
  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }
} else {
  console.log('Skipping react-snap on CI/Vercel environment.');
}

generateSeoArtifacts({ shell }).catch((error) => {
  console.error(error);
  process.exit(1);
});
