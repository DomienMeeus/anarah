import { cp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

// Only ship public website files, never the client's brief or original imports.
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of ['index.html', 'html', 'css', 'js', 'robots.txt', 'sitemap.xml']) {
    await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
// The old public website used root-level URLs; retain those as direct fallbacks.
for (const entry of await readdir(path.join(root, 'html'))) {
    if (entry.endsWith('.html')) await cp(path.join(root, 'html', entry), path.join(output, entry));
}
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const css = await readFile(path.join(root, 'css/style.css'), 'utf8');
// Include srcset candidates, CSS masks and absolute social/schema image URLs.
const assets = new Set([...`${html}\n${css}`.matchAll(/\bimages\/[\w.-]+\.(?:png|jpe?g|webp|svg|avif)/g)].map(match => match[0]));
await mkdir(path.join(output, 'images'), { recursive: true });
for (const asset of assets) await cp(path.join(root, asset), path.join(output, asset));
console.log(`Built static website with ${assets.size} image assets and SEO files.`);
