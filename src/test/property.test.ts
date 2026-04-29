import assert from "assert";
import * as fc from "fast-check";
import {
    Direction,
    Grid,
    isBlank,
    isNotBlank,
    sameRowOrColumn,
    squareFromCoords,
    pathIncludesCoord,
    notOnEdge,
    GridSquare,
} from "../grid";
import { Coord, startPoint, generate } from "../puzzle";

// Arbitrary for Coord values
const coordArb = fc.record({ row: fc.integer(), col: fc.integer() });

// Arbitrary for valid grid dimensions (min 2x2, reasonable max)
const gridDimsArb = fc.record({
    rows: fc.integer({ min: 2, max: 20 }),
    cols: fc.integer({ min: 2, max: 20 }),
});

// Arbitrary for Direction (excluding NONE)
const directionArb = fc.constantFrom(
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT
);

// Arbitrary for any Direction (including NONE)
const anyDirectionArb = fc.constantFrom(
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
    Direction.NONE
);

describe("Property-based tests", () => {
    describe("isBlank / isNotBlank", () => {
        it("isBlank and isNotBlank are always complementary", () => {
            fc.assert(
                fc.property(
                    anyDirectionArb,
                    fc.integer({ min: 0, max: 100 }),
                    (dir, num) => {
                        const sq: GridSquare = { direction: dir, number: num };
                        assert.strictEqual(isBlank(sq), !isNotBlank(sq));
                    }
                )
            );
        });

        it("isBlank is true only for NONE direction with number 1", () => {
            fc.assert(
                fc.property(
                    anyDirectionArb,
                    fc.integer({ min: 0, max: 100 }),
                    (dir, num) => {
                        const sq: GridSquare = { direction: dir, number: num };
                        const expected =
                            dir === Direction.NONE && num === 1;
                        assert.strictEqual(isBlank(sq), expected);
                    }
                )
            );
        });
    });

    describe("sameRowOrColumn", () => {
        it("is reflexive: any coord is on the same row/column as itself", () => {
            fc.assert(
                fc.property(coordArb, (c) => {
                    assert.strictEqual(sameRowOrColumn(c, c), true);
                })
            );
        });

        it("is symmetric", () => {
            fc.assert(
                fc.property(coordArb, coordArb, (a, b) => {
                    assert.strictEqual(
                        sameRowOrColumn(a, b),
                        sameRowOrColumn(b, a)
                    );
                })
            );
        });

        it("returns true when rows match", () => {
            fc.assert(
                fc.property(
                    fc.integer(),
                    fc.integer(),
                    fc.integer(),
                    (row, col1, col2) => {
                        assert.strictEqual(
                            sameRowOrColumn(
                                { row, col: col1 },
                                { row, col: col2 }
                            ),
                            true
                        );
                    }
                )
            );
        });

        it("returns true when columns match", () => {
            fc.assert(
                fc.property(
                    fc.integer(),
                    fc.integer(),
                    fc.integer(),
                    (col, row1, row2) => {
                        assert.strictEqual(
                            sameRowOrColumn(
                                { row: row1, col },
                                { row: row2, col }
                            ),
                            true
                        );
                    }
                )
            );
        });
    });

    describe("squareFromCoords", () => {
        it("produces non-negative step count for coords on same row", () => {
            fc.assert(
                fc.property(
                    fc.integer(),
                    fc.integer(),
                    fc.integer(),
                    (row, col1, col2) => {
                        const start = { row, col: col1 };
                        const dest = { row, col: col2 };
                        const result = squareFromCoords(start, dest);
                        assert(result.number >= 0);
                    }
                )
            );
        });

        it("produces non-negative step count for coords on same column", () => {
            fc.assert(
                fc.property(
                    fc.integer(),
                    fc.integer(),
                    fc.integer(),
                    (col, row1, row2) => {
                        const start = { row: row1, col };
                        const dest = { row: row2, col };
                        const result = squareFromCoords(start, dest);
                        assert(result.number >= 0);
                    }
                )
            );
        });

        it("step count equals Manhattan distance for aligned coords", () => {
            fc.assert(
                fc.property(
                    fc.integer(),
                    fc.integer(),
                    fc.integer(),
                    (shared, a, b) => {
                        // Same row
                        const r1 = squareFromCoords(
                            { row: shared, col: a },
                            { row: shared, col: b }
                        );
                        assert.strictEqual(r1.number, Math.abs(a - b));

                        // Same column
                        const r2 = squareFromCoords(
                            { row: a, col: shared },
                            { row: b, col: shared }
                        );
                        assert.strictEqual(r2.number, Math.abs(a - b));
                    }
                )
            );
        });

        it("throws for coords not on same row or column", () => {
            fc.assert(
                fc.property(
                    fc.integer(),
                    fc.integer(),
                    fc.integer(),
                    fc.integer(),
                    (r1, c1, r2, c2) => {
                        fc.pre(r1 !== r2 && c1 !== c2);
                        assert.throws(() => {
                            squareFromCoords(
                                { row: r1, col: c1 },
                                { row: r2, col: c2 }
                            );
                        });
                    }
                )
            );
        });

        it("same start and dest produces zero steps and NONE direction", () => {
            fc.assert(
                fc.property(coordArb, (c) => {
                    const result = squareFromCoords(c, c);
                    assert.strictEqual(result.number, 0);
                    assert.strictEqual(result.direction, Direction.NONE);
                })
            );
        });
    });

    describe("pathIncludesCoord", () => {
        it("finds a coord that was added to the path", () => {
            fc.assert(
                fc.property(
                    fc.array(coordArb),
                    coordArb,
                    fc.array(coordArb),
                    (before, target, after) => {
                        const path = [...before, target, ...after];
                        assert.strictEqual(
                            pathIncludesCoord(path, target),
                            true
                        );
                    }
                )
            );
        });

        it("returns false for empty path", () => {
            fc.assert(
                fc.property(coordArb, (c) => {
                    assert.strictEqual(pathIncludesCoord([], c), false);
                })
            );
        });
    });

    describe("notOnEdge", () => {
        it("corners are always on the edge", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = new Grid(rows, cols);
                    const corners: Coord[] = [
                        { row: 0, col: 0 },
                        { row: 0, col: cols - 1 },
                        { row: rows - 1, col: 0 },
                        { row: rows - 1, col: cols - 1 },
                    ];
                    corners.forEach((c) => {
                        assert.strictEqual(notOnEdge(grid, c), false);
                    });
                })
            );
        });

        it("interior points are not on edge for grids >= 3x3", () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 3, max: 20 }),
                    fc.integer({ min: 3, max: 20 }),
                    (rows, cols) => {
                        const grid = new Grid(rows, cols);
                        // Pick an interior point
                        const row = 1;
                        const col = 1;
                        assert.strictEqual(
                            notOnEdge(grid, { row, col }),
                            true
                        );
                    }
                )
            );
        });
    });

    describe("Grid", () => {
        it("clone preserves all square data", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = new Grid(rows, cols);
                    const clone = Grid.clone(grid);
                    assert.strictEqual(clone.rows, grid.rows);
                    assert.strictEqual(clone.columns, grid.columns);
                    for (let r = 0; r < rows; r++) {
                        for (let c = 0; c < cols; c++) {
                            const orig = grid.getSquare(r, c);
                            const cl = clone.getSquare(r, c);
                            assert.strictEqual(cl.direction, orig.direction);
                            assert.strictEqual(cl.number, orig.number);
                        }
                    }
                })
            );
        });

        it("new Grid has all blank squares", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = new Grid(rows, cols);
                    grid.listSquares().forEach((sq) => {
                        assert.strictEqual(isBlank(sq), true);
                    });
                })
            );
        });

        it("listSquares returns rows * cols squares", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = new Grid(rows, cols);
                    assert.strictEqual(
                        grid.listSquares().length,
                        rows * cols
                    );
                })
            );
        });

        it("getSize returns correct dimensions", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = new Grid(rows, cols);
                    const size = grid.getSize();
                    assert.strictEqual(size.row, rows);
                    assert.strictEqual(size.col, cols);
                })
            );
        });
    });

    describe("startPoint", () => {
        it("all start points are on the grid edge", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const perimeter = 2 * rows + 2 * Math.max(0, cols - 2);
                    for (let i = 0; i < perimeter; i++) {
                        const p = startPoint(rows, cols, i);
                        const onEdge =
                            p.row === 0 ||
                            p.col === 0 ||
                            p.row === rows - 1 ||
                            p.col === cols - 1;
                        assert.strictEqual(
                            onEdge,
                            true,
                            `startPoint(${rows}, ${cols}, ${i}) = (${p.row}, ${p.col}) is not on edge`
                        );
                    }
                })
            );
        });

        it("all start points are unique (no duplicates)", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const perimeter = 2 * rows + 2 * Math.max(0, cols - 2);
                    const points = new Set<string>();
                    for (let i = 0; i < perimeter; i++) {
                        const p = startPoint(rows, cols, i);
                        const key = `${p.row},${p.col}`;
                        assert(
                            !points.has(key),
                            `Duplicate start point at index ${i}: (${p.row}, ${p.col})`
                        );
                        points.add(key);
                    }
                })
            );
        });

        it("all start points are within grid bounds", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const perimeter = 2 * rows + 2 * Math.max(0, cols - 2);
                    for (let i = 0; i < perimeter; i++) {
                        const p = startPoint(rows, cols, i);
                        assert(p.row >= 0 && p.row < rows);
                        assert(p.col >= 0 && p.col < cols);
                    }
                })
            );
        });

        it("throws for out-of-range index", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const perimeter = 2 * rows + 2 * Math.max(0, cols - 2);
                    assert.throws(() => startPoint(rows, cols, perimeter));
                    assert.throws(() => startPoint(rows, cols, -1));
                })
            );
        });
    });

    describe("generate", () => {
        it("produces grid with correct dimensions", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = generate(rows, cols);
                    assert.strictEqual(grid.rows, rows);
                    assert.strictEqual(grid.columns, cols);
                }),
                { numRuns: 20 }
            );
        });

        it("produces grid with exactly one goal square (number 0)", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = generate(rows, cols);
                    const goals = grid
                        .listSquares()
                        .filter((s) => s.number === 0);
                    assert.strictEqual(goals.length, 1);
                }),
                { numRuns: 20 }
            );
        });

        it("produces grid with no blank squares", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = generate(rows, cols);
                    const blanks = grid.listSquares().filter(isBlank);
                    assert.strictEqual(
                        blanks.length,
                        0,
                        `Found ${blanks.length} blank squares in ${rows}x${cols} grid`
                    );
                }),
                { numRuns: 20 }
            );
        });

        it("all squares have a valid direction", () => {
            fc.assert(
                fc.property(gridDimsArb, ({ rows, cols }) => {
                    const grid = generate(rows, cols);
                    const validDirs = new Set(Object.values(Direction));
                    grid.listSquares().forEach((sq) => {
                        assert(
                            validDirs.has(sq.direction),
                            `Invalid direction: ${sq.direction}`
                        );
                    });
                }),
                { numRuns: 20 }
            );
        });
    });
});
