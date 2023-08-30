import assert from "assert";
import { Direction, Grid, notOnEdge, pathIncludesCoord, squareFromCoords } from "../grid";
import { exampleGrid } from "../util";


describe("grid", () => {
    describe("getSquare", () => {
        it("should return correct direction and steps for a grid square", () => {
            const grid = exampleGrid();
            const square = grid.getSquare(2, 1);
            assert.equal(square.direction, Direction.RIGHT);
            assert.equal(square.number, 3);
        });
    });

    it("should update direction and steps for a grid square", () => {
        const grid = new Grid(2, 2);
        grid.setDirection(0, 1, Direction.DOWN);
        grid.setNumber(1, 0, 2);

        assert.equal(grid.getSquare(0, 0).number, 1);
        assert.equal(grid.getSquare(0, 0).direction, Direction.NONE);
        assert.equal(grid.getSquare(0, 1).number, 1);
        assert.equal(grid.getSquare(0, 1).direction, Direction.DOWN);
        assert.equal(grid.getSquare(1, 0).number, 2);
        assert.equal(grid.getSquare(1, 0).direction, Direction.NONE);
        assert.equal(grid.getSquare(1, 1).number, 1);
        assert.equal(grid.getSquare(1, 1).direction, Direction.NONE);

        // Additional test case for setDirection
        grid.setDirection(1, 1, Direction.UP);
        assert.equal(grid.getSquare(1, 1).direction, Direction.UP);
    });

    it("should go straight to goal with occupied square", () => {
        const grid = new Grid(2, 2);
        grid.setDirection(0, 1, Direction.DOWN);
        grid.setNumber(1, 0, 2);
        console.log(grid.toString());

        // Additional test case for setNumber
        grid.setNumber(0, 0, 3);
        assert.equal(grid.getSquare(0, 0).number, 3);
    });

    it("should find the direction and steps given two coords", () => {
        const sq = squareFromCoords({ row: 9, col: 6 }, { row: 6, col: 6 });
        assert.equal(sq.direction, Direction.LEFT);
        assert.equal(sq.number, 3);
    });
    
    // Additional test case for toString
    it("should return the correct string representation of the grid", () => {
        const grid = new Grid(2, 2);
        grid.setDirection(0, 1, Direction.DOWN);
        grid.setNumber(1, 0, 2);
        const expected = "0 1\n2 1";
        assert.equal(grid.toString(), expected);
    });

    it("should find a coord in a path", () => {
        const path = [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 0, col: 1 }];

        [0, 1].forEach((r) => {
            [0, 1].forEach((c) => {
                assert(pathIncludesCoord(path, { row: r, col: c }));
            });
        });
    });

    // Additional test case for squareFromCoords
    it("should return the correct square object given two coordinates", () => {
        const coords1 = { row: 2, col: 3 };
        const coords2 = { row: 1, col: 1 };
        const expected = { direction: Direction.UP, number: 2 };
        assert.deepEqual(squareFromCoords(coords1, coords2), expected);
    });

    it("should identify whether a square is on the edge of the grid", () => {
        const grid = new Grid(3, 3);
        assert(notOnEdge(grid, { row: 1, col: 1 }));
        assert(!notOnEdge(grid, { row: 1, col: 2 }));

    });

    // Additional test case for pathIncludesCoord
    it("should correctly identify whether a coordinate is present in a path", () => {
        const path = [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 0, col: 1 }];
        assert(pathIncludesCoord(path, { row: 1, col: 0 }));
        assert(!pathIncludesCoord(path, { row: 2, col: 2 }));
    });

    it("should list squares not on edge", () => {
        const grid = new Grid(5, 5);
        const squares = grid.listSquares().filter((s) => notOnEdge(grid, s));
        assert.equal(squares.length, 9);
        const squaresStr = squares.map(s => `(${s.row}, ${s.col})`).join(', ');
        assert.equal(squaresStr, '\\(1, 1\\), \\(1, 2\\), \\(1, 3\\), \\(2, 1\\), \\(2, 2\\), \\(2, 3\\), \\(3, 1\\), \\(3, 2\\), \\(3, 3\\)');
    });
    
    // Additional test case for notOnEdge
    it("should correctly identify whether a square is on the edge of the grid", () => {
        const grid = new Grid(3, 3);
        assert(notOnEdge(grid, { row: 1, col: 1 }));
        assert(!notOnEdge(grid, { row: 1, col: 2 }));
    });

});
