import assert from "assert";
import { generate } from "../puzzle";

describe("puzzle coverage improvement extra", () => {
    it("should exercise line 157 in puzzle.ts (candidate on winning path) reliably", () => {
        const originalLog = console.log;
        let hitLine157 = false;

        // Mock console.log to detect the target message and suppress output
        console.log = (...args: any[]) => {
            if (args[0] === "candidate for filling blanks is on the winning path") {
                hitLine157 = true;
            }
        };

        try {
            // We use a large number of iterations to statistically guarantee hitting the branch.
            // On a 4x4 or 5x5 grid, this is expected to happen reasonably often.
            let iterations = 0;
            const maxIterations = 20000;

            while (!hitLine157 && iterations < maxIterations) {
                // Alternating sizes to increase variety
                const size = 4 + (iterations % 2);
                generate(size, size);
                iterations++;
            }

            assert(hitLine157, `Did not hit line 157 in puzzle.ts after ${iterations} iterations.`);
        } finally {
            // Always restore console.log
            console.log = originalLog;
        }
    });
});
