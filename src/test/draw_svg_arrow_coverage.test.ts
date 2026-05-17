import assert from "assert";
import { Grid, Direction } from "../grid";
import { svgGrid } from "../draw";

describe("draw svgArrow coverage", () => {
    it("should return an empty string for Direction.NONE in svgArrow via svgGrid", () => {
        const grid = new Grid(1, 1);
        // Set number to something other than 0 or 1, and direction to NONE
        grid.setNumber(0, 0, 5);
        // By default direction is NONE, but let's be explicit if we could.
        // Grid constructor sets it to NONE and number to 1.
        // We already set number to 5. Direction is still NONE.

        const svg = svgGrid(grid);

        // It should NOT contain an arrow polygon
        assert(!svg.includes("<polygon"), "SVG should not contain an arrow for Direction.NONE");
        assert(!svg.includes("class=\"arrow\""), "SVG should not contain an arrow class for Direction.NONE");

        // It should contain the number
        assert(svg.includes(">5</text>"), "SVG should contain the number 5");
    });
});
