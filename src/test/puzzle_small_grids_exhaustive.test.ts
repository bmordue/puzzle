import assert from "assert";
import { generate } from "../puzzle";
import { isBlank, Direction } from "../grid";

describe("Exhaustive small grid generation", () => {
    const dimensions = [
        { rows: 2, columns: 2 },
        { rows: 2, columns: 3 },
        { rows: 3, columns: 2 }
    ];

    dimensions.forEach(({ rows, columns }) => {
        it(`should generate valid ${rows}x${columns} grids 1000 times`, () => {
            for (let i = 0; i < 1000; i++) {
                const grid = generate(rows, columns);

                // Invariant: Dimensions
                assert.strictEqual(grid.rows, rows, `Iteration ${i}: Row count mismatch`);
                assert.strictEqual(grid.columns, columns, `Iteration ${i}: Column count mismatch`);

                const squares = grid.listSquares();

                // Invariant: Exactly one goal (number 0)
                const goalSquares = squares.filter(s => s.number === 0);
                assert.strictEqual(goalSquares.length, 1, `Iteration ${i}: Goal count should be 1, found ${goalSquares.length}`);
                assert.strictEqual(goalSquares[0].direction, Direction.NONE, `Iteration ${i}: Goal square should have Direction.NONE`);

                // Invariant: No blank squares
                const blankSquares = squares.filter(isBlank);
                assert.strictEqual(blankSquares.length, 0, `Iteration ${i}: Found ${blankSquares.length} blank squares`);

                // Invariant: All non-goal squares have number > 0 and direction != NONE
                squares.forEach(sq => {
                    if (sq.number !== 0) {
                        assert(sq.number > 0, `Iteration ${i}: Square at (${sq.row}, ${sq.col}) has invalid number ${sq.number}`);
                        assert.notStrictEqual(sq.direction, Direction.NONE, `Iteration ${i}: Square at (${sq.row}, ${sq.col}) has number ${sq.number} but Direction.NONE`);
                    }
                });
            }
        });
    });
});
