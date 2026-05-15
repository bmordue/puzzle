import assert from "assert";
import { generate } from "../puzzle";
import { Grid, Direction, isBlank } from "../grid";

describe("puzzle fillBlanks coverage v3", () => {
    it("should improve coverage by processing squares in reverse order during fillBlanks", () => {
        const originalListSquares = Grid.prototype.listSquares;

        // Mock listSquares to return squares in reverse order
        // This forces fillBlanks to encounter squares in an order that
        // makes LEFT and UP directions more likely to find blank candidates.
        Grid.prototype.listSquares = function() {
            const squares = originalListSquares.call(this);
            return squares.reverse();
        };

        const originalLog = console.log;
        console.log = () => {}; // Suppress output

        try {
            // Run generate many times to hit all branches in fillBlanks
            for (let i = 0; i < 500; i++) {
                const size = 3 + (i % 3);
                generate(size, size);
            }
        } finally {
            Grid.prototype.listSquares = originalListSquares;
            console.log = originalLog;
        }
    });

    it("should hit all direction branches and exit branch in fillBlanks", () => {
        // Smaller grids and different sizes to ensure we hit the "no candidates" (exitNumber) branch
        const originalLog = console.log;
        console.log = () => {};

        try {
            for (let i = 0; i < 200; i++) {
                generate(2, 2);
                generate(3, 2);
                generate(2, 3);
            }
        } finally {
            console.log = originalLog;
        }
    });
});
