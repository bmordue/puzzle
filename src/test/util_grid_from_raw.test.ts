import assert from "assert";
import { Direction } from "../grid";
import { gridFromRaw } from "../util";

describe("util gridFromRaw", () => {
    it("should correctly create a 2x2 grid from raw numbers and directions", () => {
        const numbers = [1, 2, 3, 4];
        const directions = ["r", "d", "l", "u"];
        const rows = 2;
        const cols = 2;

        const grid = gridFromRaw(numbers, directions, rows, cols);

        assert.strictEqual(grid.rows, rows);
        assert.strictEqual(grid.columns, cols);

        assert.strictEqual(grid.getSquare(0, 0).number, 1);
        assert.strictEqual(grid.getSquare(0, 0).direction, Direction.RIGHT);

        assert.strictEqual(grid.getSquare(0, 1).number, 2);
        assert.strictEqual(grid.getSquare(0, 1).direction, Direction.DOWN);

        assert.strictEqual(grid.getSquare(1, 0).number, 3);
        assert.strictEqual(grid.getSquare(1, 0).direction, Direction.LEFT);

        assert.strictEqual(grid.getSquare(1, 1).number, 4);
        assert.strictEqual(grid.getSquare(1, 1).direction, Direction.UP);
    });
});
