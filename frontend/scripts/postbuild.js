const { spawnSync } = require('node:child_process');

const shouldSkip = process.env.VERCEL === '1' || process.env.CI === 'true';

if (shouldSkip) {
  console.log('Skipping react-snap on CI/Vercel environment.');
  process.exit(0);
}

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['react-snap'],
  { stdio: 'inherit' }
);

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
