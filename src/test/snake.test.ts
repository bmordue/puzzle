import assert from "assert";

describe("snake", () => {
    let originalLog: (...data: any[]) => void;

    beforeEach(() => {
        originalLog = console.log;

        // Clear cache to allow re-requiring the snake module
        const snakeModulePath = require.resolve("../snake");
        if (require.cache[snakeModulePath]) {
            delete require.cache[snakeModulePath];
        }
    });

    afterEach(() => {
        console.log = originalLog;
    });

    it("should execute the snake unwrap logic and log the grid", () => {
        let logOutput = "";
        console.log = (msg: any) => {
            logOutput += msg + "\n";
        };

        // This will trigger unwrap() in snake.ts
        require("../snake");

        // The unwrap function logs a 7x7 grid
        // We verify that there is output and it has 7 lines
        const lines = logOutput.trim().split("\n");
        assert.strictEqual(lines.length, 7, "Output should have 7 lines");
        lines.forEach((line, index) => {
            // Each line should represent 7 cells
            // In snake.ts: rawCells.map((r) => r.join("")).join("\n")
            // Some cells might have "-1" which is 2 characters, others might have tokens (1 char)
            // Actually, tokens are chars from the tokens string.
            // Wait, looking at snake.ts:
            // rawCells.push(new Array<number>(7).fill(-1));
            // rawCells[c.x][c.y] = tokenFor(i)
            // So if it's -1, it's a number. If it's a token, it's a string.
            // join("") will join them.
            // Let's check the length of each line.
            assert(line.length >= 7, `Line ${index} should have at least 7 characters`);
        });
    });
});
