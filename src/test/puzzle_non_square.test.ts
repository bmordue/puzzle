import assert from "assert";
import { generate } from "../puzzle";
import { isBlank, Grid, Direction } from "../grid";

describe("puzzle non-square generate", () => {
    it("should generate grids with various non-square dimensions and satisfy invariants", () => {
        const sizes = [
            { r: 2, c: 5 },
            { r: 5, c: 2 },
            { r: 2, c: 10 },
            { r: 10, c: 2 },
            { r: 3, c: 7 },
            { r: 7, c: 3 }
        ];

        for (const size of sizes) {
            const grid = generate(size.r, size.c);
            assert.strictEqual(grid.rows, size.r);
            assert.strictEqual(grid.columns, size.c);

            const squares = grid.listSquares();
            const goals = squares.filter(s => s.number === 0);
            assert.strictEqual(goals.length, 1, `Should have exactly one goal for ${size.r}x${size.c}`);

            const blanks = squares.filter(isBlank);
            assert.strictEqual(blanks.length, 0, `Should have no blanks for ${size.r}x${size.c}`);
        }
    });

    it("should improve coverage by processing squares in reverse order during fillBlanks", () => {
        const originalListSquares = Grid.prototype.listSquares;

        // Mock listSquares to return squares in reverse order
        // This helps fillBlanks hit branches for LEFT and UP directions
        // because squares to the left/above will still be blank during processing.
        Grid.prototype.listSquares = function() {
            const squares = originalListSquares.apply(this);
            return squares.reverse();
        };

        try {
            // Use several iterations to increase chance of hitting all directions
            for (let i = 0; i < 100; i++) {
                const grid = generate(5, 5);

                // Still verify invariants
                const squares = grid.listSquares();
                assert.strictEqual(squares.filter(isBlank).length, 0);
                assert.strictEqual(squares.filter(s => s.number === 0).length, 1);
            }
        } finally {
            // Restore original listSquares
            Grid.prototype.listSquares = originalListSquares;
        }
    });
});
