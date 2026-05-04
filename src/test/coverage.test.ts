import assert from "assert";
import { generate } from "../puzzle";
import { Direction, isBlank } from "../grid";

describe("generate coverage", () => {
    it("should exercise generate with various grid sizes to increase branch coverage", () => {
        // By using various sizes and many iterations, we increase the probability
        // of hitting different random paths in both pathToGoalRec and fillBlanks.
        const sizes = [
            { r: 2, c: 2 },
            { r: 3, c: 3 },
            { r: 4, c: 4 },
            { r: 2, c: 5 },
            { r: 5, c: 2 },
            { r: 10, c: 10 }
        ];

        for (const size of sizes) {
            for (let i = 0; i < 50; i++) {
                const grid = generate(size.r, size.c);

                assert.strictEqual(grid.rows, size.r);
                assert.strictEqual(grid.columns, size.c);

                const squares = grid.listSquares();

                // All squares should be filled
                const blanks = squares.filter(isBlank);
                assert.strictEqual(blanks.length, 0, `Grid ${size.r}x${size.c} has blank squares`);

                // There should be exactly one goal (number 0)
                const goals = squares.filter(s => s.number === 0);
                assert.strictEqual(goals.length, 1, `Grid ${size.r}x${size.c} should have exactly one goal`);

                // Basic validation: squares with numbers should have a direction
                squares.forEach(sq => {
                    if (sq.number > 0) {
                        assert.notStrictEqual(sq.direction, Direction.NONE, `Square at (${sq.row},${sq.col}) has number ${sq.number} but no direction`);
                    }
                });
            }
        }
    });
});
