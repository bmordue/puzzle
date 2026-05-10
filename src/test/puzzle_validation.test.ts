import assert from "assert";
import { generate } from "../puzzle";
import { Direction, Grid, GridSquare, isBlank } from "../grid";

describe("puzzle generate validation", () => {
    function followPath(grid: Grid, startRow: number, startCol: number) {
        let currRow = startRow;
        let currCol = startCol;
        const visited = new Set<string>();

        while (true) {
            const key = `${currRow},${currCol}`;
            if (visited.has(key)) return "cycle";
            visited.add(key);

            const sq = grid.getSquare(currRow, currCol);
            if (sq.number === 0 && sq.direction === Direction.NONE) return "goal";

            let nextRow = currRow;
            let nextCol = currCol;

            switch (sq.direction) {
                case Direction.UP: nextCol -= sq.number; break;
                case Direction.DOWN: nextCol += sq.number; break;
                case Direction.LEFT: nextRow -= sq.number; break;
                case Direction.RIGHT: nextRow += sq.number; break;
                case Direction.NONE: return "stuck";
            }

            if (nextRow < 0 || nextRow >= grid.rows || nextCol < 0 || nextCol >= grid.columns) {
                return "out";
            }

            currRow = nextRow;
            currCol = nextCol;
        }
    }

    it("should generate a valid and solvable puzzle", () => {
        // Use a 5x5 grid for a good balance of complexity and speed
        const rows = 5;
        const cols = 5;
        const grid = generate(rows, cols);

        // 1. Check dimensions
        assert.strictEqual(grid.rows, rows);
        assert.strictEqual(grid.columns, cols);

        // 2. Check exactly one goal
        const squares = grid.listSquares();
        const goals = squares.filter(s => s.number === 0 && s.direction === Direction.NONE);
        assert.strictEqual(goals.length, 1, "Should have exactly one goal square");

        // 3. Check no blank squares
        const blanks = squares.filter(isBlank);
        assert.strictEqual(blanks.length, 0, "Should have no blank squares");

        // 4. Verify that there's a path from some edge square to the goal
        // We know that generate() picks one edge square and builds a path from it.
        // We can find all edge squares and check if at least one leads to the goal.
        let foundPathToGoal = false;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
                    const result = followPath(grid, r, c);
                    if (result === "goal") {
                        foundPathToGoal = true;
                        break;
                    }
                }
            }
            if (foundPathToGoal) break;
        }
        assert(foundPathToGoal, "Should find at least one starting point that leads to the goal");
    });
});
