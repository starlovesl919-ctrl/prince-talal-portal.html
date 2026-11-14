import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_OUT = path.join(ROOT_DIR, 'public', 'prince-talal-portal.html');
const ROOT_OUT = path.join(ROOT_DIR, 'prince-talal-portal.html');

function toDataUri(filePath, mimeType) {
  const abs = path.join(ROOT_DIR, filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing asset for HTML export: ${abs}`);
  }
  const b64 = fs.readFileSync(abs).toString('base64');
  return `data:${mimeType};base64,${b64}`;
}

async function buildStandaloneHtml() {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error('dist/index.html not found. Run "vite build" first.');
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Remove manifest and modulepreload links (not needed / blocked under file://)
  html = html.replace(/<link[^>]*rel=["']manifest["'][^>]*>\s*/gi, '');
  html = html.replace(/<link[^>]*rel=["']modulepreload["'][^>]*>\s*/gi, '');

  // Inline all CSS stylesheets
  const cssMatches = [...html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)];
  for (const match of cssMatches) {
    const [fullTag, href] = match;
    const relPath = href.replace(/^\//, '');
    const cssPath = path.join(DIST_DIR, relPath);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      html = html.replace(fullTag, () => `<style>\n${cssContent}\n</style>`);
    }
  }

  // Find module script entry and bundle all JS chunks into one IIFE for universal file:// execution
  const scriptMatches = [...html.matchAll(/<script[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)];
  const bundledScripts = [];

  for (const match of scriptMatches) {
    const [fullTag, src] = match;
    const relPath = src.replace(/^\//, '');
    const jsEntryPath = path.join(DIST_DIR, relPath);
    if (!fs.existsSync(jsEntryPath)) {
      throw new Error(`Missing built JS entry: ${jsEntryPath}`);
    }

    const result = await esbuild.build({
      entryPoints: [jsEntryPath],
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: ['es2020'],
      minify: true,
      write: false,
      define: {
        'import.meta.url': '""',
      },
    });

    const jsCode = result.outputFiles[0].text;
    bundledScripts.push(jsCode);
    html = html.replace(fullTag, () => '');
  }

  // Inline all referenced static images and icons as base64 data URIs
  const assetDataUris = {
    '/assets/aistudio/images__2__b2b4cdf7.jpeg': toDataUri(
      'public/assets/aistudio/images__2__b2b4cdf7.jpeg',
      'image/jpeg'
    ),
    '/src/assets/images/bg_app_internal_1794589196338.jpg': toDataUri(
      'src/assets/images/bg_app_internal_1794589196338.jpg',
      'image/jpeg'
    ),
    '/src/assets/images/hero_humanitarian_global_1794589196128.jpg': toDataUri(
      'src/assets/images/hero_humanitarian_global_1794589196128.jpg',
      'image/jpeg'
    ),
    '/src/assets/images/program_medical_housing_1794589196647.jpg': toDataUri(
      'src/assets/images/program_medical_housing_1794589196647.jpg',
      'image/jpeg'
    ),
    '/app-icon.jpg': toDataUri('public/app-icon.jpg', 'image/jpeg'),
    '/favicon.svg': toDataUri('public/favicon.svg', 'image/svg+xml'),
  };

  const replaceAssetPaths = (input) => {
    let out = input;
    for (const [assetPath, dataUri] of Object.entries(assetDataUris)) {
      out = out.split(assetPath).join(dataUri);
    }
    return out;
  };

  html = replaceAssetPaths(html);
  const combinedJs = replaceAssetPaths(bundledScripts.join('\n')).replace(/<\/script>/gi, '<\\/script>');

  html = html.replace('</body>', () => `<script>\n${combinedJs}\n</script>\n</body>`);

  fs.writeFileSync(PUBLIC_OUT, html, 'utf-8');
  fs.writeFileSync(ROOT_OUT, html, 'utf-8');

  const sizeMb = (Buffer.byteLength(html, 'utf-8') / (1024 * 1024)).toFixed(2);
  console.log(`Standalone HTML generated: ${PUBLIC_OUT} & ${ROOT_OUT} (${sizeMb} MB)`);
}

buildStandaloneHtml().catch((err) => {
  console.error(err);
  process.exit(1);
});
