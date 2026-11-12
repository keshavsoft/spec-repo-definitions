import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('[Test] Running build check ...');
build();

const distV7 = path.join(rootDir, 'dist', 'v7', 'definitions.json');
const distV6 = path.join(rootDir, 'dist', 'v6', 'definitions.json');
const distV5 = path.join(rootDir, 'dist', 'v5', 'definitions.json');
const distRoot = path.join(rootDir, 'dist', 'definitions.json');
const specRepoV6 = path.resolve(rootDir, '..', 'spec-repo', 'src', 'v6', 'definitions.json');

for (const p of [distV5, distV6, distV7, distRoot]) {
    if (!fs.existsSync(p)) {
        console.error(`FAIL: ${p} does not exist!`);
        process.exit(1);
    }
}

if (fs.existsSync(specRepoV6)) {
    const compiledContent = fs.readFileSync(distV6, 'utf8').trim();
    const originalContent = fs.readFileSync(specRepoV6, 'utf8').trim();

    const compiledObj = JSON.parse(compiledContent);
    const originalObj = JSON.parse(originalContent);
    if (JSON.stringify(compiledObj) === JSON.stringify(originalObj)) {
        console.log('PASS: Compiled v6 definitions.json is structurally 100% equivalent to spec-repo!');
    } else {
        console.error('FAIL: Mismatch detected between compiled v6 and original definitions.');
        process.exit(1);
    }
}

// Verify v7 matches root definitions.json
const v7Text = fs.readFileSync(distV7, 'utf8').trim();
const rootText = fs.readFileSync(distRoot, 'utf8').trim();
if (v7Text === rootText) {
    console.log('PASS: Root dist/definitions.json correctly points to latest v7!');
} else {
    console.error('FAIL: Root definitions.json does not match dist/v7/definitions.json');
    process.exit(1);
}

console.log('ALL TESTS PASSED.');
