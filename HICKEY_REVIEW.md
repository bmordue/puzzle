# Hickey Architecture Review: Puzzle Generator

This review evaluates the "Puzzle Generator" project through the lens of Rich Hickey's architectural principles, primarily drawing from "Simple Made Easy".

## 1. Simplicity vs. Complexity (Complecting)

Hickey defines "simple" as "one fold/braid" (unentwined) and "complex" as "complected" (interwoven).

### Findings
- **Complected Grid Operations**: The `Grid` class in `src/grid.ts` complects the data structure of the grid with the operations allowed on it. It uses methods like `setDirection` and `setNumber` that mutate the internal state.
- **Complected Rendering**: `src/draw.ts` complects the knowledge of the grid structure (traversing rows and columns) with the specifics of SVG generation. A simpler approach would involve a generic grid-to-data-points transformation followed by a data-to-SVG renderer.
- **Complected Generation Logic**: In `src/puzzle.ts`, the `generate` function complects the selection of the goal, the pathfinding, and the filling of blanks. These are interleaved in a single flow that relies on a single mutable `Grid` instance.

## 2. State vs. Values (Immutability)

Hickey argues that we should program with values (immutable data) and only manage state explicitly when necessary.

### Findings
- **Heavy Mutation**: The project is heavily reliant on mutation. The `Grid` class is designed around in-place updates. In Hickey's view, the `Grid` should be a value. Updating a square should return a *new* Grid value.
- **The `targetSteps--` Bug**: A prime example of the dangers of complecting is found in `src/puzzle.ts`:
  ```typescript
  return pathToGoalRec(grid, goal, next, targetSteps--, currentPath);
  ```
  Here, `targetSteps` was being mutated *and* passed. Because it was a post-decrement, the value passed was unchanged, but the local variable was mutated. This is a "complected" operation that caused a bug in recursion depth.

## 3. Data as Data

Hickey advocates for using generic data structures (maps, lists, sets) rather than specialized class hierarchies.

### Findings
- **GridSquare Interface**: The project uses an interface `GridSquare` in `src/grid.ts`, which is a step toward "data as data". However, it's immediately wrapped in a `Grid` class that hides the data behind methods.
- **Coordinate Handling**: `Coord` is a simple type, which is good. However, the logic for moving between coordinates is spread across `grid.ts` (`squareFromCoords`) and `puzzle.ts` (`applySteps`).

## 4. Recommendations for a "Simpler" Architecture

To align more closely with Hickey's principles, the following changes are recommended:

1.  **Immutable Grid**: Redesign the `Grid` as an immutable value. Methods like `setSquare` should return a new `Grid` instance. This makes reasoning about the generation process much easier, especially when backtracking in pathfinding.
2.  **Pure Functions for Generation**: Transform `pathToGoalRec` into a pure function that takes a grid value and returns a path/grid value, without side effects on the input.
3.  **De-complect Rendering**: Create a middle-layer representation of the "visual instructions" so that `draw.ts` only knows how to render those instructions, not how to navigate a `Grid`.
4.  **Separation of Concerns**: Split `src/puzzle.ts` into distinct modules for:
    -   Path generation
    -   Blank filling
    -   Goal placement
    Each should be a pure function taking data and returning data.

## Conclusion

While the current project is functional and uses TypeScript effectively, it is "complex" in the Hickey sense due to its reliance on mutable state and complected concerns. Moving towards a value-oriented, functional approach would improve testability and reduce bugs like the recursion depth error.
