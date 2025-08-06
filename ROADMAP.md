# Roadmap for `puzzle`

This document outlines potential areas for improvement for the `puzzle` project. The suggestions are categorized into four main areas: Code Quality and Maintainability, Testing, Features and Functionality, and Documentation.

## Code Quality and Maintainability

### Refactor `puzzle.ts`
The `generate` function in `src/puzzle.ts` is long and complex. The `pathToGoalRec` function is recursive and hard to follow. This file could be broken down into smaller, more manageable functions to improve readability and maintainability.

### Remove `console.log` statements
There are `console.log` statements in `src/puzzle.ts` and `src/grid.ts` that were likely used for debugging. These should be removed or replaced with a proper logging mechanism to avoid cluttering the output.

### Consistent Error Handling
The error handling is inconsistent. Some functions throw `Error` objects, while others just log to the console. A consistent error handling strategy should be implemented across the codebase.

### Eliminate Magic Numbers
There are several magic numbers in the code, for example, the hardcoded `pathLength = 6` in `src/puzzle.ts`. These should be replaced with named constants to improve readability and make the code easier to configure.

### Improve SVG Generation
The SVG generation in `src/draw.ts` uses string concatenation. While functional, this can be hard to read and maintain. Using a dedicated library like `svg.js` or a template engine could make the code cleaner and more robust.

## Testing

### Increase Test Coverage for `puzzle.ts`
The test coverage for `src/puzzle.ts` is very low. The core logic for puzzle generation (`generate`, `pathToGoalRec`, and `fillBlanks`) is not tested at all. This is the most critical area for improvement. Unit tests should be added to ensure this logic is working as expected and to prevent regressions.

### Deterministic Tests
The puzzle generation is currently random, which makes testing difficult. The tests should be made deterministic by using a seeded random number generator. This will ensure that tests are repeatable and reliable.

### Snapshot Testing
For the SVG output, snapshot testing could be used. This would involve saving a "snapshot" of the generated SVG and comparing it against future outputs to ensure that changes to the drawing logic don't produce unexpected visual results.

## Features and Functionality

### Improve Path Generation Algorithm
The `pathToGoalRec` algorithm is quite simple and may not always produce interesting or challenging puzzles. This algorithm could be improved to create more complex and varied paths. The `TODO` comment regarding `pathLength` should also be addressed to make the path length more dynamic and intelligent.

### Guarantee Puzzle Solvability
There is no guarantee that the generated puzzles are solvable, especially with the current `fillBlanks` implementation. A mechanism to verify that a generated puzzle is solvable would be a valuable addition. This could involve a solver that attempts to solve the puzzle after it's generated.

### Configuration File
Currently, the grid size is passed as command-line arguments. It would be beneficial to allow configuration through a file (e.g., `config.json`). This file could control not only the grid size but also other parameters like the path length heuristic, making the tool more flexible.

## Documentation

### Add Code Comments
More comments should be added to explain the complex parts of the code, especially in `src/puzzle.ts`. This will help future developers understand the logic behind the puzzle generation.

### Expand `README.md`
The `README.md` file is very sparse. It should be expanded to include:
- Detailed instructions on how to install dependencies, run the tool, and run the tests.
- An explanation of the project's architecture and how the different components work together.
- Examples of generated puzzles.
