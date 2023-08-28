import { Direction } from "./grid";


function spiral(length: number) {
    const dirs = 'RULD';
    let i = 0;
    let side = 0; // in grid cells
    let seq = '';
    while (i < length) {
        let dir = i % 4; // R U L D
        let incSide = i % 2;
        if (incSide == 0) {
            side++;
        }
        seq += `${dirs[i % 4]}${side} `;
        i++;
    }
    console.log(seq);
}

spiral(12);