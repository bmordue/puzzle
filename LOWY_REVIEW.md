# Lowy Architecture Review: Puzzle Generator

This review evaluates the "Puzzle Generator" project through the lens of Juval Lowy's "The Method", focusing on volatility-based decomposition and the IDesign architecture.

## 1. Volatility-Based Decomposition

Lowy's central thesis is that we should decompose systems based on **volatilities** (areas of change) rather than **functional requirements** (what the system does).

### Identified Volatilities
-   **Generation Algorithm**: The strategy for creating the winning path and filling the remaining squares.
-   **Output Format**: The medium used to represent the puzzle (currently SVG, potentially JSON or others).
-   **Persistence**: How and where the generated puzzles are stored.
-   **Grid Representation**: The internal data structure for the puzzle grid.

### Analysis of Current Decomposition
The current project uses a **Functional Decomposition**:
-   `src/puzzle.ts`: "Generate the puzzle"
-   `src/draw.ts`: "Draw the puzzle"
-   `src/app.ts`: "Run the application"

In "The Method", this is considered a "functional trap." If the generation algorithm changes, `puzzle.ts` must be modified. If the SVG format requirements change, `draw.ts` must be modified. While these seem separated, they often lead to tight coupling where the `Manager` (the use case orchestrator) is missing or buried in the `Client`.

## 2. Layered Architecture (IDesign)

Lowy recommends a specific layering: Clients, Managers, Engines, and Accessors.

### Findings
-   **Missing Manager**: There is no explicit Manager layer. `src/app.ts` (the Client) directly orchestrates the `generate` function and the `svgGrid` function. This couples the entry point to the specific implementation of the use case.
-   **Complected Engine**: `src/puzzle.ts` acts as an Engine but also contains logic that should be managed at a higher level (like goal placement).
-   **Accessor Coupling**: `src/draw.ts` is an Accessor for SVG, but it is called directly by the Client.

## 3. Recommendations for "The Method"

To align with Lowy's principles, the project should be restructured to hide volatilities behind service boundaries:

### Proposed Architecture

1.  **Client**: `src/app.ts`
    -   Only responsible for parsing CLI arguments and calling the Manager.
2.  **Manager**: `src/PuzzleManager.ts`
    -   Orchestrates the use case: "Generate a puzzle and save it."
    -   Coordinates between the Engines and Accessors.
    -   Hides the orchestration volatility.
3.  **Engines**:
    -   `PathEngine`: Encapsulates the volatility of the path-finding algorithm.
    -   `FillEngine`: Encapsulates the volatility of the blank-filling strategy.
4.  **Accessors**:
    -   `OutputAccessor` (Interface): Hides the volatility of the output format.
    -   `SvgAccessor` (Implementation): Specific implementation for SVG.
    -   `StorageAccessor`: Hides the volatility of file I/O.

### Benefits
-   **Encapsulation of Change**: Changing from SVG to JSON only requires a new Accessor, not a change to the core logic or the Manager.
-   **Testability**: Each component (Engine, Accessor, Manager) can be tested in isolation against its contract.
-   **Extensibility**: New generation strategies can be added by implementing a new Engine without affecting the rest of the system.

## Conclusion

The current project is a classic example of functional decomposition. While it works for a small utility, it will become fragile as more features (new output formats, complex path algorithms) are added. Transitioning to a volatility-based decomposition following the IDesign Method would provide a more robust and maintainable foundation.
