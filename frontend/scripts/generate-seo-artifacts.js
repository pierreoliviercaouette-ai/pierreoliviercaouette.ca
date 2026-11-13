const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');

const outfile = path.join(__dirname, '.seo-bundle.cjs');

async function loadEmitter() {
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'seo-emit.js')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile,
    logLevel: 'silent',
    plugins: [
      {
        name: 'lucide-stub',
        setup(build) {
          build.onResolve({ filter: /^lucide-react$/ }, (args) => ({
            path: args.path,
            namespace: 'lucide-stub',
          }));
          build.onLoad({ filter: /.*/, namespace: 'lucide-stub' }, () => ({
            loader: 'js',
            contents: [
              'const Icon = () => null;',
              'export const Shield = Icon;',
              'export const Heart = Icon;',
              'export const Umbrella = Icon;',
              'export const PiggyBank = Icon;',
              'export const FileText = Icon;',
              'export const Users = Icon;',
              'export const Landmark = Icon;',
              'export const Scale = Icon;',
              'export const Building2 = Icon;',
              'export default {};',
            ].join('\n'),
          }));
        },
      },
    ],
  });
  delete require.cache[outfile];
  return require(outfile);
}

function generateSeoArtifacts(options = {}) {
  return loadEmitter().then((emitter) => emitter.generate(options));
}

if (require.main === module) {
  const buildIndex = path.join(__dirname, '../build/index.html');
  const shell = fs.existsSync(buildIndex) ? fs.readFileSync(buildIndex, 'utf8') : null;
  generateSeoArtifacts({ shell }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { generateSeoArtifacts };
