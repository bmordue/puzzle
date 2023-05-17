import assert from "assert";
import { startPoint } from "../puzzle";


describe("puzzle", () => {
    describe("testStartSquares", () => {
        const expected = [
            { row: 0, col: 0 },
            { row: 1, col: 0 },
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
            { row: 1, col: 4 },
            { row: 0, col: 4 },
            { row: 0, col: 3 },
            { row: 0, col: 2 },
            { row: 0, col: 1 },
        ];

        const rows = 5;
        const cols = 3;

        it("should find start points for 5x3 grid", () => {
            for (let i = 0; i < 12; i++) {
                const s = startPoint(rows, cols, i);
                assert.deepEqual(s, expected[i]);
            }
        });
    });
});
