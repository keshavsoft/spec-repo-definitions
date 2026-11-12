import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('[Test] Running build check ...');
build();

const distV6 = path.join(rootDir, 'dist', 'v6', 'definitions.json');
const specRepoV6 = path.resolve(rootDir, '..', 'spec-repo', 'src', 'v6', 'definitions.json');

if (!fs.existsSync(distV6)) {
    console.error('FAIL: dist/v6/definitions.json does not exist!');
    process.exit(1);
}

if (!fs.existsSync(specRepoV6)) {
    console.warn('WARN: spec-repo/src/v6/definitions.json not found to compare.');
    console.log('PASS: Build succeeded.');
    process.exit(0);
}

const compiledContent = fs.readFileSync(distV6, 'utf8').trim();
const originalContent = fs.readFileSync(specRepoV6, 'utf8').trim();

if (compiledContent === originalContent) {
    console.log('PASS: Compiled v6 definitions.json is 100% byte-for-byte identical to spec-repo!');
} else {
    // Check deep equality
    const compiledObj = JSON.parse(compiledContent);
    const originalObj = JSON.parse(originalContent);
    if (JSON.stringify(compiledObj) === JSON.stringify(originalObj)) {
        console.log('PASS: Compiled v6 definitions.json is structurally 100% equivalent!');
    } else {
        console.error('FAIL: Mismatch detected between compiled and original definitions.');
        process.exit(1);
    }
}
