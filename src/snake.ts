const dirs = 'RULD';

let cells: { x: number; y: number; }[] = [];
// let cells: [{ x: number, y: number }] = [];

function spiral(max: number) {
    let pos = { x: 0, y: 0 };
    let steps = 0;
    let sideLen = 0; // in grid cells
    let cellCount = 0;

    while (steps < max) {
        let dir = steps % 4; // R U L D
        let incSide = steps % 2;
        if (incSide == 0) {
            sideLen++;
        }
        cellCount += sideLen;
        steps++;

        // do something
        for (let i = 0; i < sideLen; i++) {
            pos = applyDir(pos.x, pos.y, dir);
            cells.push(pos);
        }
    }
}

function applyDir(currX: number, currY: number, dir: number) {
    let newX = currX; let newY = currY;
    switch (dir) {
        case 0: // R
            newX++;
            break;
        case 1: // U
            newY--;
            break;
        case 2: // L
            newX--;
            break;
        case 3: // D
            newY++;
            break;
    }
    return { x: newX, y: newY }
}

const tokens = 'ABCAAABACBABBBCCACBCCAAAAABAACABAABBABCACAACBACCBAABABBACBBABBBBBCCAACABCACCBACBBCBCCCACCBCCC'; // up to 3 digits
function tokenFor(i: number) {
    return tokens[i];
}

function unwrap() {
    spiral(12);
    let cellsShifted = cells.map(c => { return { x: c.x + 3, y: c.y + 3 }; });
    let rawCells = new Array();
    for (let i = 0; i < 7; i++) {
        rawCells.push(new Array<number>(7).fill(-1));
    }

    cellsShifted.forEach((c, i) => rawCells[c.x][c.y] = tokenFor(i));
    console.log(rawCells.map(r => r.join('')).join('\n'));
    // console.log(rawCells);
    // console.log(cellsShifted.map(c => `(${c.x}, ${c.y}) `));
}
unwrap();