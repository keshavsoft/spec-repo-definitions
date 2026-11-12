# @keshavsoft/spec-repo-definitions

> Modular, version-controlled JSON-to-DOM definitions and compiler wrapper for [KeshavSoft spec-repo](https://github.com/keshavsoft/spec-repo).

## Overview

Previously, `definitions.json` lived as a monolithic 600+ line "godfather" file inside `spec-repo`. A single typo or syntax error in one component could break the entire runtime for all other components.

**`spec-repo-definitions`** solves this by:
1. **Decoupling Responsibilities**: Maintaining definitions in an isolated, dedicated repository.
2. **Version-Driven Source Trees**: Organizing all definitions by version under `src/` (`src/v5/`, `src/v6/`, and latest `src/v7/`).
3. **Two-Level Folder Clarity**:
   - **Level 1**: Component (`table`, `select`, `dataList`, `form`, `searchInput`, `selectOptionsOnly`)
   - **Level 2**: Variant (e.g. under `table`: `simple`, `withFooter`, `bodyOnly`, `footerOnly`, `headerOnly`)
   - **Inside**: Micro-files (`base.json`, `single.json`, `double.json`)
4. **Deterministic Compiler**: A lightweight build wrapper that compiles the directory trees into production-ready `definitions.json` artifacts with pinpoint syntax validation and zero runtime dependencies.

---

## Directory Structure

```text
spec-repo-definitions/
├── package.json                                 # Exposes ., ./src/*, and ./dist/*
├── README.md
├── scripts/
│   ├── build.js                                 # Compiler wrapper
│   └── test.js                                  # Parity & integrity test suite
├── bin/
│   └── cli.js                                   # CLI runner
├── src/
│   ├── v5/                                      # Historical version 5
│   ├── v6/                                      # Historical version 6
│   └── v7/                                      # ★ Active latest version
│       ├── table/
│       │   ├── simple/
│       │   │   ├── base.json
│       │   │   ├── single.json
│       │   │   └── double.json
│       │   ├── withFooter/
│       │   ├── bodyOnly/
│       │   ├── footerOnly/
│       │   └── headerOnly/
│       ├── select/
│       │   ├── base.json
│       │   ├── single.json
│       │   └── double.json
│       ├── dataList/
│       │   ├── simple/
│       │   ├── base.json
│       │   ├── single.json
│       │   └── double.json
│       ├── selectOptionsOnly/
│       ├── searchInput/
│       └── form/
└── dist/
    ├── v5/
    │   ├── definitions.json
    │   └── index.js
    ├── v6/
    │   ├── definitions.json
    │   └── index.js
    ├── v7/
    │   ├── definitions.json
    │   └── index.js
    ├── definitions.json                         # Latest compiled definitions (v7)
    └── index.js                                 # Main ESM entry point
```

---

## Installation & Usage

### Via npm

```bash
npm install @keshavsoft/spec-repo-definitions
```

#### Import Latest Definitions in JavaScript (ESM)

```javascript
import definitions from "@keshavsoft/spec-repo-definitions";
```

#### Import Specific Versions

```javascript
import { v5, v6, v7 } from "@keshavsoft/spec-repo-definitions";
```

#### Raw Modular Micro-Files (Direct Access to `src/`)

Because `./src/*` is exported, you can inspect or import any component definition directly:

```javascript
import tableBase from "@keshavsoft/spec-repo-definitions/src/v7/table/simple/base.json" with { type: "json" };
```

#### Compiled Artifacts (Direct Access to `dist/`)

```javascript
import v7Defs from "@keshavsoft/spec-repo-definitions/dist/v7/definitions.json" with { type: "json" };
```

---

## Build & Test Commands

- **Build definitions** (compiles all versions into `dist/`):
  ```bash
  npm run build
  ```
- **Run tests & verify integrity**:
  ```bash
  npm run test
  ```
- **Deliver compiled output to local `spec-repo`**:
  ```bash
  npm run deliver
  ```

---

## License

ISC © KeshavSoft
