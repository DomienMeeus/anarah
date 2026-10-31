import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';

// Only ship public website files, never the client's brief or original imports.
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const entry of ['index.html', 'html', 'css', 'js']) {
    await cp(path.join(root, entry), path.join(output, entry), { recursive: true });
}
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const assets = new Set([...html.matchAll(/(?:src="|https:\/\/anarah\.ruby-owl-6560\.chatgpt\.site\/)(images\/[^"?]+)/g)].map(match => match[1]));
await mkdir(path.join(output, 'images'), { recursive: true });
for (const asset of assets) await cp(path.join(root, asset), path.join(output, asset));
console.log(`Built static website with ${assets.size} image assets.`);
