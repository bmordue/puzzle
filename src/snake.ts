import { Direction } from "./grid";

const dirs = 'RULD';


function doSomething(dir: number, side: number, cellCount: number) {
    console.log(`${dirs[dir]}${side}`);
}


function spiral(max: number) {
    let x = 0;
    let y = 0;
    let steps = 0;
    let side = 0; // in grid cells
    let cellCount = 0;
    let seq = '';
    while (steps < max) {
        let dir = steps % 4; // R U L D
        let incSide = steps % 2;
        if (incSide == 0) {
            side++;
        }
        cellCount += side;
        doSomething(dir, side, cellCount)
        steps++;
    }
}

spiral(12);
