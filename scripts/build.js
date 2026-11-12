import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

const PREFERRED_ORDER = [
    'table', 'simple', 'withFooter', 'bodyOnly', 'footerOnly', 'headerOnly',
    'select', 'dataList', 'selectOptionsOnly', 'searchInput', 'form',
    'base', 'single', 'double'
];

function sortKeys(a, b) {
    const ia = PREFERRED_ORDER.indexOf(a);
    const ib = PREFERRED_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
}

function compileDirectory(dirPath) {
    const result = {};
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    const files = entries.filter(e => e.isFile() && e.name.endsWith('.json'));
    const dirs = entries.filter(e => e.isDirectory());

    const allKeys = [
        ...files.map(f => path.basename(f.name, '.json')),
        ...dirs.map(d => d.name)
    ];

    allKeys.sort(sortKeys);

    for (const key of allKeys) {
        const fileEntry = files.find(f => path.basename(f.name, '.json') === key);
        if (fileEntry) {
            const filePath = path.join(dirPath, fileEntry.name);
            try {
                result[key] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (err) {
                console.error(`[Error parsing ${filePath}]:`, err.message);
                throw err;
            }
        } else {
            result[key] = compileDirectory(path.join(dirPath, key));
        }
    }

    return result;
}

export function build() {
    console.log('[spec-repo-definitions] Building definitions from src/ ...');

    if (!fs.existsSync(srcDir)) {
        throw new Error(`src/ directory not found at ${srcDir}`);
    }

    fs.mkdirSync(distDir, { recursive: true });

    const versionEntries = fs.readdirSync(srcDir, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name);

    if (versionEntries.length === 0) {
        throw new Error('No version directories found in src/');
    }

    // Sort versions e.g. v5, v6
    versionEntries.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
    });

    const latestVersion = versionEntries[versionEntries.length - 1];
    const compiledVersions = {};

    for (const version of versionEntries) {
        const vSrc = path.join(srcDir, version);
        const vDist = path.join(distDir, version);
        fs.mkdirSync(vDist, { recursive: true });

        const compiled = compileDirectory(vSrc);
        compiledVersions[version] = compiled;

        const jsonOutput = JSON.stringify(compiled, null, 2) + '\n';
        fs.writeFileSync(path.join(vDist, 'definitions.json'), jsonOutput, 'utf8');

        // Version-specific index.js
        const vJsOutput = `import definitions from "./definitions.json" with { type: "json" };\n\nexport { definitions };\nexport default definitions;\n`;
        fs.writeFileSync(path.join(vDist, 'index.js'), vJsOutput, 'utf8');

        console.log(`  ✓ Built ${version} -> dist/${version}/definitions.json`);
    }

    // Latest version at dist root
    const latestCompiled = compiledVersions[latestVersion];
    fs.writeFileSync(path.join(distDir, 'definitions.json'), JSON.stringify(latestCompiled, null, 2) + '\n', 'utf8');

    // Root dist/index.js
    let rootJs = `import definitions from "./definitions.json" with { type: "json" };\n\n`;
    for (const v of versionEntries) {
        rootJs += `import ${v} from "./${v}/definitions.json" with { type: "json" };\n`;
    }
    rootJs += `\nexport { definitions, ${versionEntries.join(', ')} };\n`;
    rootJs += `export default definitions;\n`;
    fs.writeFileSync(path.join(distDir, 'index.js'), rootJs, 'utf8');

    console.log(`  ✓ Built root dist/definitions.json (latest: ${latestVersion})`);

    // Handle --deliver flag
    const shouldDeliver = process.argv.includes('--deliver');
    if (shouldDeliver) {
        deliver(compiledVersions);
    }
}

export function deliver(compiledMap) {
    const specRepoDir = path.resolve(rootDir, '..', 'spec-repo', 'src');
    if (!fs.existsSync(specRepoDir)) {
        console.warn(`[Deliver] Target spec-repo/src not found at ${specRepoDir}`);
        return;
    }

    for (const [version, compiled] of Object.entries(compiledMap)) {
        const targetV = path.join(specRepoDir, version);
        if (fs.existsSync(targetV)) {
            const destPath = path.join(targetV, 'definitions.json');
            fs.writeFileSync(destPath, JSON.stringify(compiled, null, 2) + '\n', 'utf8');
            console.log(`  🚀 Delivered ${version} definitions.json -> ${destPath}`);
        }
    }
}

// Auto-run when executed directly
if (process.argv[1] && process.argv[1].endsWith('build.js')) {
    build();
}

