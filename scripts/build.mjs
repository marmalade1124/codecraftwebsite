import {cpSync, existsSync, mkdirSync, readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist=resolve(root,'dist');
mkdirSync(dist,{recursive:true});
const files=['index.html','styles.css','script.js','motion.mjs','project.mjs','logo.png','3d-design.jpg','digital-design.jpg','logic-circuit.jpg','prototype-promo.jpg','programming.jpg'];
for(const file of files)cpSync(resolve(root,file),resolve(dist,file));
cpSync(resolve(root,'assets'),resolve(dist,'assets'),{recursive:true});
const html=readFileSync(resolve(dist,'index.html'),'utf8');
for(const [,asset] of html.matchAll(/(?:src|href)="([^"#:]+\.(?:png|jpg|svg|css|js|mjs)(?:\?[^" ]*)?)"/g)){
  if(!asset.startsWith('http'))assert(existsSync(resolve(dist,asset.split('?')[0])),`Missing production asset ${asset}`);
}
for(const file of ['project.mjs','motion.mjs','assets/hero-sphere.avif','assets/fonts/OverusedGrotesk-Book.woff2','assets/vendor/gsap.min.js','assets/vendor/ScrollTrigger.min.js'])assert(existsSync(resolve(dist,file)),`Missing runtime file ${file}`);
console.log('Production build ready in dist/; runtime assets verified.');
