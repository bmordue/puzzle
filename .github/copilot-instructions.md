# Puzzle Generator

TypeScript puzzle generator that creates number puzzles with directional arrows and outputs them as SVG files. Each puzzle consists of a grid where numbers indicate how many steps to take in the direction shown by the arrow. The project includes automated daily puzzle generation, SVG-to-PNG conversion, and social media posting.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- Bootstrap, build, and test the repository:
  ```bash
  npm ci                    # Install dependencies - takes 45-60 seconds with warnings
  npx tsc                   # Build TypeScript - takes 1-2 seconds
  npm test                  # Run tests with coverage - takes 3-5 seconds. NEVER CANCEL.
  ```

- Run the puzzle generator:
  ```bash
  npm start                 # Generates 10x10 puzzle (default) - takes 1-2 seconds
  node built/app.js 5 5     # Generate custom 5x5 puzzle - takes <1 second
  node built/app.js 20 20   # Generate large 20x20 puzzle - takes 1-2 seconds
  ```

- **CRITICAL**: Always build TypeScript first with `npx tsc` before running `node built/app.js` directly.

- **PARAMETER VALIDATION**: The app crashes on invalid parameters. Always provide valid numeric row/column arguments.

## Validation

- **ALWAYS** run complete build and test cycle after making changes:
  ```bash
  npx tsc && npm test       # Build and test - NEVER CANCEL, takes 5-10 seconds total
  ```

- **Manual Testing Scenarios**: After making changes, always test these scenarios:
  - Generate small puzzle: `node built/app.js 3 3` and verify `complete.svg` is created
  - Generate default puzzle: `npm start` and verify console output shows puzzle generation
  - Check SVG output: `ls -la complete.svg` should show file size varies by grid size
  - Test edge case: `node built/app.js 2 2` for minimal grid (generates ~1KB SVG)

- **File Output Validation**: The app generates `complete.svg` in the repository root. Always verify this file exists and has reasonable size after running.

- **No linting tools**: This project does not have ESLint, Prettier, or other linting configured. Focus on TypeScript compilation errors only.

## Build and Test Details

- **TypeScript Configuration**: Compiles from `src/` to `built/` directory with source maps
- **Test Framework**: Mocha with nyc for coverage, tests in `src/test/`
- **Dependencies**: Node.js 18+, TypeScript 5.0+, Mocha 10+
- **Coverage Target**: Tests cover grid operations and puzzle generation logic
- **Mutation Testing**: Stryker is configured but not run in CI (takes significant time)

## Repository Structure

### Key Directories
```
src/                    # TypeScript source code
├── app.ts             # Main application entry point
├── draw.ts            # SVG rendering functions
├── grid.ts            # Grid data structures and operations
├── puzzle.ts          # Puzzle generation logic
├── snake.ts           # Snake-like path generation
├── util.ts            # Utility functions
└── test/              # Test files
built/                 # Compiled JavaScript output
docs/                  # Static documentation and demo
└── grid.html         # HTML viewer for puzzles
.github/               # CI/CD workflows and scripts
└── workflows/
    ├── build.yml      # Main CI: build, test, SonarCloud
    ├── daily.yml      # Daily puzzle generation
    ├── svg2png.yaml   # SVG to PNG conversion
    └── post.yml       # Weekly Mastodon posting
```

### Important Files
- `package.json`: Only has 3 scripts: prestart (tsc), start (run app), test (mocha+nyc)
- `tsconfig.json`: TypeScript config targeting ES2016, outputs to built/
- `stryker.conf.js`: Mutation testing configuration (not run automatically)
- `complete.svg`: Generated puzzle output file
- `example_7x7.json`: Example puzzle data structure

## Common Commands Reference

### Repository Root Files
```bash
ls -la
# Key files: README.md, package.json, tsconfig.json, complete.svg, example_7x7.json
```

### Package.json Scripts
```json
{
  "scripts": {
    "prestart": "npx tsc",
    "start": "node built/app.js 10 10", 
    "test": "nyc --reporter=lcov --reporter=text mocha"
  }
}
```

### Test Output (21 tests, ~3 seconds)
```bash
npm test
# ✔ 21 passing (29ms)
# Coverage report shows grid.ts 70% covered, puzzle.ts 15% covered
```

## Workflows and Automation

- **Daily Generation**: Runs `npm start` daily at 1:15 AM UTC, commits result to `docs/grid.svg`
- **PNG Conversion**: Automatically converts any SVG file commits to PNG using Python/cairosvg
- **Mastodon Bot**: Posts weekly puzzle images to social media
- **CI Requirements**: All PRs must pass Node.js 18 build and test suite
- **SonarCloud**: Code quality analysis runs on all pushes

## Application Behavior

- **Input**: Accepts row and column count as command line arguments
- **Output**: Generates SVG file with puzzle grid showing numbers and directional arrows
- **Console Output**: Prints puzzle generation progress and coordinate mappings
- **File Size**: 10x10 grid generates ~36KB SVG with ~1300 lines, 2x2 grid generates ~1KB with ~15 lines
- **Supported Sizes**: Successfully tested from 3x3 to 20x20 grids

- **Error Handling Notes**

- **Invalid Parameters**: App crashes with RangeError on non-numeric or missing parameters. Always provide valid numbers.
- **Missing Arguments**: Running `node built/app.js` without parameters crashes instead of showing usage help
- **File Permissions**: App writes to repository root, ensure write access to create `complete.svg`

## Development Tips

- Use `npx tsc --watch` for continuous compilation during development
- Test files follow pattern `*.test.ts` in `src/test/` directory
- Grid coordinates use (row, col) convention throughout codebase
- SVG generation logic in `draw.ts` references `docs/grid.css` for styling
- Puzzle generation uses snake-like path algorithm for interesting layouts