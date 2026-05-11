import assert from "assert";
import { generate } from "../puzzle";
import { Direction, isBlank } from "../grid";

describe("puzzle fillBlanks exhaustive", () => {
    it("should hit all branches in fillBlanks by running generate many times and verify grid invariants", () => {
        const originalLog = console.log;
        // Suppress console.log output during the heavy iteration
        console.log = () => {};

        try {
            // Run enough times to statistically hit everything
            for (let i = 0; i < 500; i++) {
                const size = 3 + (i % 3); // 3x3, 4x4, 5x5
                const grid = generate(size, size);

                // Verify basic invariants for each generated grid
                assert.strictEqual(grid.rows, size);
                assert.strictEqual(grid.columns, size);

                const squares = grid.listSquares();

                // All squares must be filled
                assert.strictEqual(squares.filter(isBlank).length, 0, "Should have no blank squares");

                // Exactly one goal square
                assert.strictEqual(squares.filter(s => s.number === 0).length, 1, "Should have exactly one goal square");
            }
        } finally {
            console.log = originalLog;
        }
    });
});
