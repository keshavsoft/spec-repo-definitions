# @keshavsoft/spec-repo-definitions

> Modular, version-controlled JSON-to-DOM definitions and compiler wrapper for [KeshavSoft spec-repo](https://github.com/keshavsoft/spec-repo).

## Overview

Previously, `definitions.json` lived as a monolithic 600+ line "godfather" file inside `spec-repo`. A single typo or syntax error in one component could break the entire runtime for all other components.

**`spec-repo-definitions`** solves this by:
1. **Decoupling Responsibilities**: Maintaining definitions in an isolated, dedicated repository.
2. **Version-Driven Source Trees**: Organizing all definitions by version under `src/` (`src/v5/`, `src/v6/`, etc.).
3. **Folder-Isolated Components & Variants**: Breaking each definition down into atomic files:
   - `base.json` (DOM skeleton)
   - `single.json` (1D mappings like colgroups, headers, footers)
   - `double.json` (2D mappings like table bodies)
4. **Deterministic Compiler**: A lightweight build wrapper that compiles the directory trees into production-ready `definitions.json` artifacts with pinpoint syntax validation and zero runtime dependencies.

---

## Directory Structure

```text
spec-repo-definitions/
├── package.json
├── README.md
├── scripts/
│   ├── build.js                                 # Compiler wrapper
│   └── test.js                                  # Verification and parity test
├── bin/
│   └── cli.js                                   # CLI runner
├── src/
│   ├── v5/                                      # Version 5 definitions
│   └── v6/                                      # Version 6 definitions (current)
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
    ├── definitions.json                         # Latest version (v6)
    └── index.js                                 # Main ESM entry point
```

---

## Installation & Usage

### Via npm

```bash
npm install @keshavsoft/spec-repo-definitions
```

#### Import in JavaScript (ESM)

```javascript
// Import latest version definitions
import definitions from "@keshavsoft/spec-repo-definitions";

// Or import specific versions
import { v5, v6 } from "@keshavsoft/spec-repo-definitions";

// Or import a version directly
import v6Definitions from "@keshavsoft/spec-repo-definitions/v6";
```

#### Direct JSON import

```javascript
import definitions from "@keshavsoft/spec-repo-definitions/v6/definitions.json" with { type: "json" };
```

---

## Build & Delivery Commands

- **Build definitions**:
  ```bash
  npm run build
  ```
- **Test parity against `spec-repo`**:
  ```bash
  npm run test
  ```
- **Build and Deliver to local `spec-repo`**:
  ```bash
  npm run deliver
  ```

---

## Publishing

To publish to npm:
```bash
npm publish --access public
```

---

## License

ISC © KeshavSoft
