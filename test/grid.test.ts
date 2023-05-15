import assert from "assert";
import { Direction, Grid } from "../src/grid";
import { exampleGrid } from "../src/util";


describe("grid", () => {
    describe("getSquare", () => {
        it("should return correct direction and steps for a grid square", () => {
            const grid = exampleGrid();
            const square = grid.getSquare(1, 6);
            assert.equal(square.direction, Direction.LEFT);
            assert.equal(square.number, 4);
        })
    });

    it("should update direction and steps for a grid square", () => {
        const grid = new Grid(2, 2);
        grid.setDirection(0, 1, Direction.DOWN);
        grid.setNumber(1, 0, 2);

        assert.equal(grid.getSquare(0, 0).number, 0);
        assert.equal(grid.getSquare(0, 0).direction, Direction.NONE);
        assert.equal(grid.getSquare(0, 1).number, 0);
        assert.equal(grid.getSquare(0, 1).direction, Direction.DOWN);
        assert.equal(grid.getSquare(1, 0).number, 2);
        assert.equal(grid.getSquare(1, 0).direction, Direction.NONE);
        assert.equal(grid.getSquare(1, 1).number, 0);
        assert.equal(grid.getSquare(1, 1).direction, Direction.NONE);

    });
});
