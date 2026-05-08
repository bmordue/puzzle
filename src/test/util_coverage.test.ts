import assert from "assert";
import { Direction } from "../grid";
import { dirForShort, gridFromFile } from "../util";
import fs from "fs";

describe("util coverage improvement", () => {
    describe("dirForShort", () => {
        it("should return Direction.UP for 'u'", () => {
            assert.strictEqual(dirForShort('u'), Direction.UP);
        });

        it("should return Direction.DOWN for 'd'", () => {
            assert.strictEqual(dirForShort('d'), Direction.DOWN);
        });

        it("should return Direction.LEFT for 'l'", () => {
            assert.strictEqual(dirForShort('l'), Direction.LEFT);
        });

        it("should return Direction.RIGHT for 'r'", () => {
            assert.strictEqual(dirForShort('r'), Direction.RIGHT);
        });

        it("should return Direction.DOWN for unknown inputs", () => {
            assert.strictEqual(dirForShort('x'), Direction.DOWN);
        });
    });

    describe("gridFromFile", () => {
        const testFile = "test_grid.json";

        before(() => {
            const gridData = {
                rows: 2,
                columns: 2,
                grid: [
                    [{ direction: Direction.RIGHT, number: 1 }, { direction: Direction.DOWN, number: 1 }],
                    [{ direction: Direction.UP, number: 1 }, { direction: Direction.NONE, number: 0 }]
                ]
            };
            fs.writeFileSync(testFile, JSON.stringify(gridData));
        });

        after(() => {
            if (fs.existsSync(testFile)) {
                fs.unlinkSync(testFile);
            }
        });

        it("should load a grid from a file", () => {
            const grid = gridFromFile(testFile);
            assert.strictEqual(grid.rows, 2);
            assert.strictEqual(grid.columns, 2);
            assert.strictEqual(grid.getSquare(0, 0).direction, Direction.RIGHT);
            assert.strictEqual(grid.getSquare(1, 1).number, 0);
        });
    });
});
