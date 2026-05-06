import assert from "assert";
import { Grid, Direction } from "../grid";

describe("Grid.distanceToEdge", () => {
    it("should return correct distances for a 5x5 grid from the center (2, 2)", () => {
        const grid = new Grid(5, 5);
        assert.strictEqual(grid.distanceToEdge(2, 2, Direction.UP), 2);
        assert.strictEqual(grid.distanceToEdge(2, 2, Direction.DOWN), 2);
        assert.strictEqual(grid.distanceToEdge(2, 2, Direction.LEFT), 2);
        assert.strictEqual(grid.distanceToEdge(2, 2, Direction.RIGHT), 2);
    });

    it("should return correct distances for a 5x5 grid from a corner (0, 0)", () => {
        const grid = new Grid(5, 5);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.UP), 0);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.LEFT), 0);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.DOWN), 4);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.RIGHT), 4);
    });

    it("should return correct distances for a 5x5 grid from another corner (4, 4)", () => {
        const grid = new Grid(5, 5);
        assert.strictEqual(grid.distanceToEdge(4, 4, Direction.UP), 4);
        assert.strictEqual(grid.distanceToEdge(4, 4, Direction.LEFT), 4);
        assert.strictEqual(grid.distanceToEdge(4, 4, Direction.DOWN), 0);
        assert.strictEqual(grid.distanceToEdge(4, 4, Direction.RIGHT), 0);
    });

    it("should return correct distances for a non-square grid (3x7) from (1, 3)", () => {
        const grid = new Grid(3, 7);
        // rows = 3, cols = 7
        // (row, col) = (1, 3) -> startX=3, startY=1
        // Note: distanceToEdge takes (startX, startY, dir)
        // startX is column index, startY is row index based on internal implementation
        assert.strictEqual(grid.distanceToEdge(3, 1, Direction.UP), 1);
        assert.strictEqual(grid.distanceToEdge(3, 1, Direction.DOWN), 1); // 3 - 1 - 1 = 1
        assert.strictEqual(grid.distanceToEdge(3, 1, Direction.LEFT), 3);
        assert.strictEqual(grid.distanceToEdge(3, 1, Direction.RIGHT), 3); // 7 - 1 - 3 = 3
    });

    it("should return 0 for Direction.NONE regardless of position", () => {
        const grid = new Grid(10, 10);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.NONE), 0);
        assert.strictEqual(grid.distanceToEdge(5, 5, Direction.NONE), 0);
        assert.strictEqual(grid.distanceToEdge(9, 9, Direction.NONE), 0);
    });

    it("should handle 1x1 grid correctly", () => {
        const grid = new Grid(1, 1);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.UP), 0);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.DOWN), 0);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.LEFT), 0);
        assert.strictEqual(grid.distanceToEdge(0, 0, Direction.RIGHT), 0);
    });

    it("should handle cases where start point is on one edge but not others", () => {
        const grid = new Grid(5, 5);
        // (0, 2) is on the top edge (startY=0)
        assert.strictEqual(grid.distanceToEdge(2, 0, Direction.UP), 0);
        assert.strictEqual(grid.distanceToEdge(2, 0, Direction.DOWN), 4);
        assert.strictEqual(grid.distanceToEdge(2, 0, Direction.LEFT), 2);
        assert.strictEqual(grid.distanceToEdge(2, 0, Direction.RIGHT), 2);

        // (2, 4) is on the right edge (startX=4)
        assert.strictEqual(grid.distanceToEdge(4, 2, Direction.UP), 2);
        assert.strictEqual(grid.distanceToEdge(4, 2, Direction.DOWN), 2);
        assert.strictEqual(grid.distanceToEdge(4, 2, Direction.LEFT), 4);
        assert.strictEqual(grid.distanceToEdge(4, 2, Direction.RIGHT), 0);
    });
});
