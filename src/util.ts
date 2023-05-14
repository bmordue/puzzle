import { readFileSync } from "fs";
import { Direction, Grid } from "./grid";


function dirForShort(short: string): Direction {
    let dir = Direction.DOWN;
    switch (short) {
        case 'u':
            dir = Direction.UP;
            break;
        case 'd':
            dir = Direction.DOWN;
            break;
        case 'l':
            dir = Direction.LEFT;
            break;
        case 'r':
            dir = Direction.RIGHT;
            break;
    }
    return dir;
}

function gridFromRaw(numbers: number[], directions: string[], rows: number, cols: number) {
    const grid = new Grid(rows, cols);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const num = numbers[i * rows + j];
            const dir = dirForShort(directions[i * rows + j]);
            grid.setDirection(i, j, dir);
            grid.setNumber(i, j, num);
        }
    }
    return grid;
}

export function exampleGrid() {
    return gridFromRaw(
        [1, 2, 1, 3, 2, 3, 2, 3, 1],
        ["r", "r", "l", "r", "r", "d", "r", "r", "d"],
        3,
        3);
}

function gridFromFile(path: string) {
    return Grid.clone(JSON.parse(readFileSync(path, "utf8")));
}
