/**
 * Upsert l'outil public « Comparateur de rendements » dans Supabase.
 *
 * Prérequis : migration 014 appliquée (colonne requires_auth).
 *
 * Usage :
 *   node --env-file=frontend/.env scripts/seed_comparateur_rendements.mjs
 *
 * Préférez SUPABASE_SERVICE_ROLE_KEY pour l'upsert admin.
 */
import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, unlinkSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const srcPath = join(root, 'frontend/src/data/comparateurRendementsTool.js');
const tmpPath = join(__dirname, '_comparateur_tmp.mjs');

// Convert CRA-style export file to a temporary ESM module
import { readFileSync } from 'fs';
const raw = readFileSync(srcPath, 'utf8');
writeFileSync(tmpPath, raw, 'utf8');

const mod = await import(pathToFileURL(tmpPath).href);
unlinkSync(tmpPath);

const {
  COMPARATEUR_RENDEMENTS_META: meta,
  COMPARATEUR_RENDEMENTS_HTML: html,
} = mod;

const url =
  process.env.SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL / key env vars');
  process.exit(1);
}

const supabase = createClient(url, key);
const payload = { ...meta, html_content: html };

const { data: existing } = await supabase
  .from('tools')
  .select('id')
  .eq('slug', meta.slug)
  .maybeSingle();

let result;
if (existing?.id) {
  result = await supabase
    .from('tools')
    .update(payload)
    .eq('id', existing.id)
    .select('id, slug, requires_auth, is_active')
    .maybeSingle();
} else {
  result = await supabase
    .from('tools')
    .insert(payload)
    .select('id, slug, requires_auth, is_active')
    .maybeSingle();
}

if (result.error) {
  console.error('Seed failed:', result.error);
  console.error(
    'Astuce: appliquez d’abord supabase/migrations/014_tools_requires_auth.sql, puis utilisez la service role key.'
  );
  process.exit(1);
}

console.log('OK', result.data);
