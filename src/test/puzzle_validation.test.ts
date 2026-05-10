import assert from "assert";
import { generate } from "../puzzle";
import { isBlank } from "../grid";

describe("puzzle generate validation", () => {
    it("should generate a grid with correct invariants", () => {
        // Use a 5x5 grid
        const rows = 5;
        const cols = 5;
        const grid = generate(rows, cols);

        // 1. Check dimensions
        assert.strictEqual(grid.rows, rows, "Rows should match");
        assert.strictEqual(grid.columns, cols, "Columns should match");

        // 2. Check exactly one goal (number 0)
        const squares = grid.listSquares();
        const goals = squares.filter(s => s.number === 0);
        assert.strictEqual(goals.length, 1, "Should have exactly one goal square");

        // 3. Check no blank squares (number 1, direction NONE)
        const blanks = squares.filter(isBlank);
        assert.strictEqual(blanks.length, 0, "Should have no blank squares");

        // 4. Check that all squares have a valid number and direction
        squares.forEach(sq => {
            assert(sq.number >= 0, `Square at (${sq.row}, ${sq.col}) should have a non-negative number`);
            // Goal has no direction, others should have one
            if (sq.number !== 0) {
                assert.notStrictEqual(sq.direction, "none", `Non-goal square at (${sq.row}, ${sq.col}) should have a direction`);
            }
        });
    });
});
