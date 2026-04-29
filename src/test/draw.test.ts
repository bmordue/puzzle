import assert from "assert";
import { Grid, Direction } from "../grid";
import { svgGrid } from "../draw";

describe("draw", () => {
    describe("svgGrid", () => {
        it("should throw an error if grid is null", () => {
            assert.throws(() => svgGrid(null as any), /Invalid grid parameter. Grid must be provided./);
        });

        it("should throw an error if grid is not an instance of Grid", () => {
            assert.throws(() => svgGrid({} as any), /Invalid grid parameter. Grid must be an instance of the Grid class./);
        });

        it("should render a goal square with a red circle", () => {
            const grid = new Grid(1, 1);
            grid.setNumber(0, 0, 0);
            grid.setDirection(0, 0, Direction.NONE);
            const svg = svgGrid(grid);
            assert(svg.includes('stroke="red"'));
            assert(svg.includes('<circle'));
        });

        it("should render an uninitialized square with a black circle", () => {
            const grid = new Grid(1, 1);
            grid.setNumber(0, 0, 1);
            grid.setDirection(0, 0, Direction.NONE);
            const svg = svgGrid(grid);
            assert(svg.includes('stroke="black"'));
            assert(svg.includes('<circle'));
        });

        it("should render directional arrows and numbers", () => {
            const grid = new Grid(2, 3);
            grid.setDirection(0, 0, Direction.UP);
            grid.setNumber(0, 0, 1);
            grid.setDirection(0, 1, Direction.DOWN);
            grid.setNumber(0, 1, 2);
            grid.setDirection(1, 0, Direction.LEFT);
            grid.setNumber(1, 0, 3);
            grid.setDirection(1, 1, Direction.RIGHT);
            grid.setNumber(1, 1, 4);
            grid.setDirection(0, 2, Direction.NONE);
            grid.setNumber(0, 2, 5);

            const svg = svgGrid(grid);
            assert(svg.includes('class="arrow"'));
            assert.equal(svg.split('class="arrow"').length - 1, 4);
            assert(svg.includes('>1</text>'));
            assert(svg.includes('>2</text>'));
            assert(svg.includes('>3</text>'));
            assert(svg.includes('>4</text>'));
            assert(svg.includes('>5</text>'));
            // svgArrow should return '' for Direction.NONE, which happens when number is not 0 or 1
            // We already have a test for NONE and 0/1, this one is for NONE and >1
        });
    });
});
