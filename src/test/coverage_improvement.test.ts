import assert from "assert";
import { generate } from "../puzzle";

describe("Coverage Improvement", () => {
    it("should exercise line 157 in puzzle.ts by running generate many times", () => {
        // We run generate many times on small grids to increase the chance
        // that fillBlanks picks a destination that is on the winning path.
        // This targets line 157: console.log("candidate for filling blanks is on the winning path");
        for (let i = 0; i < 500; i++) {
            generate(2, 2);
        }
        for (let i = 0; i < 500; i++) {
            generate(3, 3);
        }
    });
});
