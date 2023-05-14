import { Direction, Grid } from "../grid";
import { exampleGrid } from "../util";

function testTwo() {
    const grid = exampleGrid();
    const square = grid.getSquare(1, 6);

    let passed = true;

    console.log(`${square.direction} ${square.number}`);

    passed = passed && square.direction === Direction.LEFT;
    passed = passed && square.number === 4;


    if (!passed) {
        throw new Error("test failed");
    } else {
        console.log("Test passed");
    }
}

function testOne() {
    let passed = true;

    const grid = new Grid(2, 2);
    grid.setDirection(0, 1, Direction.DOWN);
    grid.setNumber(1, 0, 2);

    passed = passed && grid.getSquare(0, 0).number === 0;
    passed = passed && grid.getSquare(0, 0).direction === Direction.NONE;
    passed = passed && grid.getSquare(0, 1).number === 0;
    passed = passed && grid.getSquare(0, 1).direction === Direction.DOWN;
    passed = passed && grid.getSquare(1, 0).number === 2;
    passed = passed && grid.getSquare(1, 0).direction === Direction.NONE;
    passed = passed && grid.getSquare(1, 1).number === 0;
    passed = passed && grid.getSquare(1, 1).direction === Direction.NONE;

    console.log(grid.toString());

    if (!passed) {
        throw new Error("test failed");
    } else {
        console.log("Test passed");
    }
}