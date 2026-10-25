import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const js = readFileSync(resolve(root, 'script.js'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate IDs break anchors and dialog labels');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'One primary page heading');
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(anchor), `Missing anchor ${anchor}`);
for (const [, asset] of html.matchAll(/(?:src|href)="([^"#:]+\.(?:png|jpg|svg|css|js)(?:\?[^" ]*)?)"/g)) {
  if (!asset.startsWith('http')) assert(existsSync(resolve(root, asset.split('?')[0])), `Missing asset ${asset}`);
}
const services = [...html.matchAll(/data-service="([^"]+)"/g)].map(match => match[1]);
assert.equal(services.length, 5);
for (const service of services) assert(js.includes(`'${service}': {`), `No details for ${service}`);
for (const [, image] of js.matchAll(/image: '([^']+)'/g)) assert(existsSync(resolve(root, image)), `Missing service image ${image}`);
const quotes = [...html.matchAll(/href="(https:\/\/codecraftmanagement[^\"]+)"/g)];
assert(quotes.length >= 4, 'Keep quote actions available throughout the page');
for (const [, url] of quotes) assert.equal(url, 'https://codecraftmanagement.vercel.app/inquiry?source=CC-10');
console.log('PASS: unique IDs, heading, section anchors, local assets, 5 service mappings, quote destinations');
