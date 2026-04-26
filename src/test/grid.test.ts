import assert from "assert";
import {
  Direction,
  Grid,
  isBlank,
  isNotBlank,
  notOnEdge,
  pathIncludesCoord,
  squareFromCoords,
} from "../grid";
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

  describe("constructor", () => {
    it("should initialize the grid with the specified number of rows and columns", () => {
      const grid = new Grid(2, 2);
      assert.equal(grid.rows, 2);
      assert.equal(grid.columns, 2);
    });
  });

  describe("clone", () => {
    it("should correctly clone a grid", () => {
      const grid = new Grid(2, 2);
      grid.setDirection(0, 0, Direction.RIGHT);
      grid.setNumber(0, 0, 1);
      grid.setDirection(0, 1, Direction.DOWN);
      grid.setNumber(0, 1, 2);

      const clone = Grid.clone(grid);
      assert.equal(clone.rows, grid.rows);
      assert.equal(clone.columns, grid.columns);
      assert.deepEqual(clone.getSquare(0, 0), grid.getSquare(0, 0));
      assert.deepEqual(clone.getSquare(0, 1), grid.getSquare(0, 1));
      assert.deepEqual(clone.getSquare(1, 0), grid.getSquare(1, 0));
      assert.deepEqual(clone.getSquare(1, 1), grid.getSquare(1, 1));

      // Ensure it's a deep copy (at least for the grid structure)
      clone.setNumber(1, 1, 99);
      assert.notEqual(clone.getSquare(1, 1).number, grid.getSquare(1, 1).number);
    });
  });

  describe("setDirection", () => {
    it("should set the direction correctly for a given row and column", () => {
      const grid = new Grid(2, 2);
      grid.setDirection(0, 1, Direction.DOWN);
      assert.equal(grid.getSquare(0, 1).direction, Direction.DOWN);
    });
  });

  describe("setNumber", () => {
    it("should set the number correctly for a given row and column", () => {
      const grid = new Grid(2, 2);
      grid.setNumber(1, 0, 2);
      assert.equal(grid.getSquare(1, 0).number, 2);
    });
  });

  describe("setSquare", () => {
    it("should set the square correctly for a given row and column", () => {
      const grid = new Grid(2, 2);
      const square = { row: 0, col: 1, direction: Direction.DOWN, number: 2 };
      grid.setSquare(square);
      assert.deepEqual(grid.getSquare(0, 1), square);
    });
  });

  describe("addDecorator", () => {
    it("should add the decorator correctly for a given row and column", () => {
      const grid = new Grid(2, 2);
      grid.addDecorator(0, 1, "decorator1");
      grid.addDecorator(1, 0, "decorator2");
      assert.equal(grid.getSquare(0, 1).decorators, "decorator1");
      assert.equal(grid.getSquare(1, 0).decorators, "decorator2");
    });
  });

  it("should go straight to goal with occupied square", () => {
    const grid = new Grid(2, 2);
    grid.setDirection(0, 1, Direction.DOWN);
    grid.setNumber(1, 0, 2);
    grid.setNumber(0, 0, 3);
    assert.equal(grid.getSquare(0, 0).number, 3);
  });

  it("should find the direction and steps given two coords", () => {
    const sq = squareFromCoords({ row: 9, col: 6 }, { row: 6, col: 6 });
    assert.equal(sq.direction, Direction.LEFT);
    assert.equal(sq.number, 3);
  });

  it("should return the correct string representation of the grid", () => {
    const grid = new Grid(2, 2);
    grid.setDirection(0, 1, Direction.DOWN);
    grid.setNumber(1, 0, 2);
    const expected = "1 none, 1 down, \n2 none, 1 none, \n";
    assert.equal(grid.toString(), expected);
  });

  it("should find a coord in a path", () => {
    const path = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 0, col: 1 },
    ];

    [0, 1].forEach((r) => {
      [0, 1].forEach((c) => {
        assert(pathIncludesCoord(path, { row: r, col: c }));
      });
    });
  });

  it("should error if start to dest is not a straight line", () => {
    const coords1 = { row: 2, col: 3 };
    const coords2 = { row: 1, col: 1 };
    assert.throws(() => squareFromCoords(coords1, coords2));
  });

  it("should find straight line on same row", () => {
    const coords1 = { row: 1, col: 0 };
    const coords2 = { row: 1, col: 2 };
    const expected = {
      row: 1,
      col: 0,
      direction: Direction.DOWN,
      number: 2
    };
    assert.deepEqual(squareFromCoords(coords1, coords2), expected);
  });

  it("should find straight line on same row in reverse", () => {
    const coords1 = { row: 1, col: 2 };
    const coords2 = { row: 1, col: 0 };
    const expected = {
      row: 1,
      col: 2,
      direction: Direction.UP,
      number: 2
    };
    assert.deepEqual(squareFromCoords(coords1, coords2), expected);
  });

  it("should return NONE direction if start and dest are the same", () => {
    const coords = { row: 1, col: 1 };
    const expected = {
      row: 1,
      col: 1,
      direction: Direction.NONE,
      number: 0
    };
    assert.deepEqual(squareFromCoords(coords, coords), expected);
  });

  it("should find straight line on same column", () => {
    const coords1 = { row: 0, col: 1 };
    const coords2 = { row: 2, col: 1 };
    const expected = {
      row: 0,
      col: 1,
      direction: Direction.RIGHT,
      number: 2
    };
    assert.deepEqual(squareFromCoords(coords1, coords2), expected);
  });


  it("should identify whether a square is on the edge of the grid", () => {
    const grid = new Grid(3, 3);
    assert(notOnEdge(grid, { row: 1, col: 1 }));
    assert(!notOnEdge(grid, { row: 1, col: 2 }));
  });

  it("should correctly identify whether a coordinate is present in a path", () => {
    const path = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 0, col: 1 },
    ];
    assert(pathIncludesCoord(path, { row: 1, col: 0 }));
    assert(!pathIncludesCoord(path, { row: 2, col: 2 }));
  });

  it("should list squares not on edge", () => {
    const grid = new Grid(5, 5);
    const squares = grid.listSquares().filter((s) => notOnEdge(grid, s));
    assert.equal(squares.length, 9);
    const squaresStr = squares.map((s) => `(${s.row}, ${s.col})`).join(", ");
    const expected = "(1, 1), (1, 2), (1, 3), (2, 1), (2, 2), (2, 3), (3, 1), (3, 2), (3, 3)";
    assert.equal(squaresStr, expected);
  });

  it("should correctly identify whether a square is on the edge of the grid", () => {
    const grid = new Grid(3, 3);
    assert(notOnEdge(grid, { row: 1, col: 1 }));
    assert(!notOnEdge(grid, { row: 1, col: 2 }));
  });

  describe("addDecorator", () => {
    it("should add the decorator correctly for a given row and column", () => {
      const grid = new Grid(2, 2);
      grid.addDecorator(0, 1, "decorator1");
      grid.addDecorator(1, 0, "decorator2");
      assert.equal(grid.getSquare(0, 1).decorators, "decorator1");
      assert.equal(grid.getSquare(1, 0).decorators, "decorator2");
    });

    it("should append decorators if they already exist", () => {
      const grid = new Grid(2, 2);
      grid.addDecorator(0, 0, "first");
      grid.addDecorator(0, 0, "second");
      assert.equal(grid.getSquare(0, 0).decorators, "firstsecond");
    });
  });

  describe("getSize", () => {
    it("should return the correct size", () => {
      const grid = new Grid(3, 4);
      assert.deepEqual(grid.getSize(), { row: 3, col: 4 });
    });
  });

  describe("isBlank", () => {
    it("should return true for a blank square", () => {
      const grid = new Grid(1, 1);
      assert(isBlank(grid.getSquare(0, 0)));
    });

    it("should return false for a non-blank square", () => {
      const grid = new Grid(1, 1);
      grid.setDirection(0, 0, Direction.DOWN);
      assert(!isBlank(grid.getSquare(0, 0)));
    });
  });

  describe("isNotBlank", () => {
    it("should return true for a non-blank square", () => {
      const grid = new Grid(1, 1);
      grid.setDirection(0, 0, Direction.DOWN);
      assert(isNotBlank(grid.getSquare(0, 0)));
    });

    it("should return false for a blank square", () => {
      const grid = new Grid(1, 1);
      assert(!isNotBlank(grid.getSquare(0, 0)));
    });
  });

  describe("setDirection errors", () => {
    it("should throw error if overwriting existing direction", () => {
      const grid = new Grid(2, 2);
      grid.setDirection(0, 0, Direction.UP);
      assert.throws(() => grid.setDirection(0, 0, Direction.DOWN), /Eek: overwriting existing direction/);
    });
  });

  describe("distanceToEdge", () => {
    it("should return correct distance to edge for all directions", () => {
      const grid = new Grid(5, 5);
      // center is (2, 2)
      assert.equal(grid.distanceToEdge(2, 2, Direction.UP), 2);
      assert.equal(grid.distanceToEdge(2, 2, Direction.DOWN), 2);
      assert.equal(grid.distanceToEdge(2, 2, Direction.LEFT), 2);
      assert.equal(grid.distanceToEdge(2, 2, Direction.RIGHT), 2);

      // (1, 3) -> col 1, row 3
      assert.equal(grid.distanceToEdge(1, 3, Direction.UP), 3);
      assert.equal(grid.distanceToEdge(1, 3, Direction.DOWN), 1);
      assert.equal(grid.distanceToEdge(1, 3, Direction.LEFT), 1);
      assert.equal(grid.distanceToEdge(1, 3, Direction.RIGHT), 3);
    });

    it("should return 0 when already on the edge", () => {
      const grid = new Grid(5, 5);
      assert.equal(grid.distanceToEdge(0, 0, Direction.UP), 0);
      assert.equal(grid.distanceToEdge(0, 0, Direction.LEFT), 0);
      assert.equal(grid.distanceToEdge(4, 4, Direction.DOWN), 0);
      assert.equal(grid.distanceToEdge(4, 4, Direction.RIGHT), 0);
    });

    it("should return 0 for Direction.NONE", () => {
      const grid = new Grid(5, 5);
      assert.equal(grid.distanceToEdge(2, 2, Direction.NONE), 0);
    });
  });
});
