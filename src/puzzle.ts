import { Direction, Grid } from "./grid";

// random integer in 0..max-1
function rnd(max: number) {

    return Math.floor(Math.random() * max);
}

function countEdgeSquares(rows: number, columns: number) {
    let edges = 2 * rows;
    if (columns > 2) {
        edges += 2 * (columns - 2);
    }
    return edges;
}

export function startPoint(rows: number, columns: number, index: number) {
    let x;
    let y;
    if (index < columns) {
        x = index;
        y = 0;
    }
    if (index >= columns && index < columns + rows - 1) {
        x = columns - 1;
        y = index - columns + 1;
    }
    if (index >= columns + rows - 1 && index < 2 * columns + rows - 3) {
        x = 2 * columns + rows - 3 - index;
        y = rows - 1;
    }
    if (index >= 2 * columns + rows - 3) {
        x = 0;
        y = 2 * columns + 2 * rows - 4 - index;
    }

    return { row: x, col: y };
}

function randomDirection(): Direction {
    const values = Object.values(Direction);
    // don't choose Direction.NONE!
    return values[rnd(4) + 1];
}

function applySteps(row: number, col: number, dir: Direction, steps: number) {
    let newRow = row;
    let newCol = col;
    switch (dir) {
        case Direction.DOWN:
            newCol = col + steps;
            break;
        case Direction.UP:
            newCol = col - steps;
            break;
        case Direction.RIGHT:
            newRow = row + steps;
            break;
        case Direction.LEFT:
            newRow = row - steps;
            break;
    }
    return { row: newRow, col: newCol };
}

function generate(rows: number, columns: number) {
    let grid = new Grid(rows, columns);

    // pick a goal square
    const goalRow = rnd(columns - 2) + 1; // not on edge
    const goalCol = rnd(rows - 2) + 1; // not on edge
    grid.setNumber(goalRow, goalCol, 0);

    // aim for a rough path length, but not guaranteed
    const pathLength = rows * columns / (2 * (rows + columns - 2));
    console.log(`Grid size ${rows}x${columns}; target path length: ${pathLength}`);

    // pick a winning start square and path to goal
    const { row, col } = startPoint(rows, columns, rnd(countEdgeSquares(rows, columns)));

    console.log(`goal: ${goalRow},${goalCol}; start: ${row},${col}`);

    let paths = 0;
    let currRow = row!;
    let currCol = col!;
    grid.addDecorator(currRow, currCol, 's'); // decorator for starting square

    // TODO: move this out into its own function
    // jump around randomly a few times
    while (paths < 4) {
        // if (blankSquares > 0)
        let dir = Direction.NONE;
        let steps = 0;

        let badLoop = true;
        let attempts = 0;
        while (badLoop && attempts < 10) {
            dir = randomDirection();
            steps = rnd(grid.distanceToEdge(row!, col!, dir) - 1) + 1; //+ 1; // + 1: allow exits from grid
            console.log(`candidate step: ${steps} ${dir}`);
            const candidate = applySteps(currRow, currCol, dir, steps);
            console.log(`candidate destination: ${candidate.row}, ${candidate.col}`);
            console.log(`grid square: ${JSON.stringify(grid.getSquare(candidate.row, candidate.col))}`);
            if (grid.getSquare(candidate.row, candidate.col).direction === Direction.NONE) {
                badLoop = false;
            }
            attempts++;
        }

        console.log(`Found a step: ${steps} ${dir}`);

        grid.setDirection(currRow, currCol, dir);
        grid.setNumber(currRow, currCol, steps);

        const next = applySteps(currRow, currCol, dir, steps);
        currRow = next.row;
        currCol = next.col;

        if (currRow === goalRow && currCol === goalCol) {
            console.log("reached goal");
            paths = 4;
            break;
        }

        if (currRow === rows || currRow < 0 || currCol === columns || currCol < 0) {
            // exited grid
            console.log(`Exited grid: ${currRow},${currCol}`);
            paths = 4;
            break;
        }

        paths++;
    }

    // complete the winning path to the goal
    const offsetX = goalRow - currRow;
    const offsetY = goalCol - currCol;

    if (offsetX == 0) {
        grid.setDirection(currRow, currCol, offsetY > 0 ? Direction.DOWN : Direction.UP);
        grid.setNumber(currRow, currCol, Math.abs(offsetY));
    } else if (offsetY == 0) {
        grid.setDirection(currRow, currCol, offsetX > 0 ? Direction.RIGHT : Direction.LEFT);
        grid.setNumber(currRow, currCol, Math.abs(offsetX));
    } else { // two moves required
        const yDir = offsetY > 0 ? Direction.DOWN : Direction.UP;
        grid.setDirection(currRow, currCol, yDir);
        grid.setNumber(currRow, currCol, Math.abs(offsetY));

        const next = applySteps(currRow, currCol, yDir, Math.abs(offsetY));
        grid.setDirection(next.row, next.col, offsetX > 0 ? Direction.RIGHT : Direction.LEFT);
        grid.setNumber(next.row, next.col, Math.abs(offsetX));
    }

    // complete the non-winning paths from edge back to edge (or loop?!)

    // fill in any remaining (unreachable) blank grid squares 

    return grid;
}



//testStartSquares();
