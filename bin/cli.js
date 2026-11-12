#!/usr/bin/env node

import { build } from '../scripts/build.js';

try {
    build();
    console.log('[spec-repo-definitions] Done.');
} catch (err) {
    console.error('[spec-repo-definitions] Build failed:', err);
    process.exit(1);
}
