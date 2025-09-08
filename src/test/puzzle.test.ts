import assert from "assert";
import { startPoint } from "../puzzle";


describe("puzzle", () => {
    describe("testStartSquares", () => {
        it("should find start points for 4x4 grid", () => {
            const expected = [
                { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 },
                { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 },
                { row: 2, col: 3 }, { row: 1, col: 3 }, { row: 0, col: 3 },
                { row: 0, col: 2 }, { row: 0, col: 1 },
            ];

            const rows = 4;
            const cols = 4;

            for (let i = 0; i < 12; i++) {
                const s = startPoint(rows, cols, i);
                assert.deepEqual(s, expected[i], `failed at index ${i}`);
            }

        });

        it("should find start points for 5x3 grid", () => {
            const expected = [
                { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 3, col: 0 }, { row: 4, col: 0 },
                { row: 4, col: 1 }, { row: 4, col: 2 },
                { row: 3, col: 2 }, { row: 2, col: 2 }, { row: 1, col: 2 }, { row: 0, col: 2 },
                { row: 0, col: 1 },
            ];

            const rows = 5;
            const cols = 3;

            for (let i = 0; i < 12; i++) {
                const s = startPoint(rows, cols, i);
                assert.deepEqual(s, expected[i], `failed at index ${i}`);
            }
        });

        it("should find start points for 3x3 grid", () => {
            const expected = [
                { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 },
                { row: 2, col: 1 }, { row: 2, col: 2 },
                { row: 1, col: 2 }, { row: 0, col: 2 },
                { row: 0, col: 1 },
            ];

            const rows = 3;
            const cols = 3;

            for (let i = 0; i < 8; i++) {
                const s = startPoint(rows, cols, i);
                assert.deepEqual(s, expected[i], `failed at index ${i}`);
            }
        });

        it("should find start points for 3x5 grid", () => {
            const expected = [
                { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 },
                { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
                { row: 1, col: 4 }, { row: 0, col: 4 },
                { row: 0, col: 3 }, { row: 0, col: 2 }, { row: 0, col: 1 },
            ];

            const rows = 3;
            const cols = 5;

            for (let i = 0; i < 12; i++) {
                const s = startPoint(rows, cols, i);
                assert.deepEqual(s, expected[i], `failed at index ${i}`);
            }
        });
    });
});
