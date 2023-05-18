import { writeFileSync } from "fs";
import { svgGrid } from "./draw";
import { Direction, Grid, GridSquare } from "./grid";

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
    return values[rnd(4)];
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

export type Coord = {
    row: number;
    col: number;
};

// TODO move this to Grid class...
function pathToGoal(grid: Grid, goalRow: number, goalCol: number, row: number, col: number, pathLength: number): Coord[] {
    console.log(`Finding path to goal: ${goalRow},${goalCol}; start: ${row},${col}`);

    const rows = grid.rows;
    const columns = grid.columns;

    let paths = 0;
    let currRow = row;
    let currCol = col;
    grid.addDecorator(currRow, currCol, 's'); // decorator for starting square

    const winningPath: Coord[] = [];
    // winningPath.push({ row, col });

    // TODO: move this out into its own function
    // jump around randomly a few times
    while (paths < pathLength) {
        // if (blankSquares > 0)
        let dir = Direction.NONE;
        let steps = 0;

        let badPath = true;
        let attempts = 0;
        while (badPath && attempts < 10) {
            attempts++;
            dir = randomDirection();
            steps = rnd(grid.distanceToEdge(row, col, dir)) + 1;
            const candidate = applySteps(currRow, currCol, dir, steps);
            if (candidate.row >= rows - 1 || candidate.col >= columns - 1 || candidate.row < 1 || candidate.col < 1) {
                // leaving grid or on edge - no good for winning path generation
            } else {
                if (grid.getSquare(candidate.row, candidate.col).direction === Direction.NONE) {
                    badPath = false;
                }
            }
            // avoid loops
            if (winningPath.includes(candidate)) {
                badPath = true;
            }

        }


        grid.setDirection(currRow, currCol, dir);
        grid.setNumber(currRow, currCol, steps);
        winningPath.push({ row: currRow, col: currCol });

        const next = applySteps(currRow, currCol, dir, steps);
        currRow = next.row;
        currCol = next.col;

        if (currRow === goalRow && currCol === goalCol) {
            console.log("reached goal");
            break;
        }

        if (currRow === rows || currRow < 0 || currCol === columns || currCol < 0) {
            // console.log(`Exited grid: ${currRow},${currCol}`);
            break;
        }

        paths++;
    }


    // complete the winning path to the goal
    const offsetX = goalRow - currRow;
    const offsetY = goalCol - currCol;

    if (offsetX == 0 && offsetY == 0) {
        // do not overwrite the goal!
    } else {
        winningPath.push({ row: currRow, col: currCol });

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

            winningPath.push({ row: next.row, col: next.col });

            grid.setDirection(next.row, next.col, offsetX > 0 ? Direction.RIGHT : Direction.LEFT);
            grid.setNumber(next.row, next.col, Math.abs(offsetX));
        }
    }
    winningPath.push({ row: goalRow, col: goalCol });

    return winningPath;
}

function pathsToExit(grid: Grid, goalRow: number, goalCol: number, startRow: number, startCol: number, pathLength: number, winningPath: Coord[]) {
    console.log(`Finding path to exit for ${startRow},${startCol}`);

    if (grid.getSquare(startRow, startCol).direction !== Direction.NONE) {
        console.log('already done this one!');
        return;
    }

    const rows = grid.rows;
    const columns = grid.columns;

    let paths = 0;
    let currRow = startRow;
    let currCol = startCol;

    try {
        // TODO: move this out into its own function
        // jump around randomly a few times
        let exited = false;
        while (paths < pathLength && !exited) {
            const { dir, steps } = nextMoveToExit(grid, startRow, startCol, currRow, currCol, goalRow, goalCol, rows, columns, winningPath);

            console.log(`Found a step: ${steps} ${dir}`);

            grid.setDirection(currRow, currCol, dir);
            grid.setNumber(currRow, currCol, steps);

            const next = applySteps(currRow, currCol, dir, steps);
            currRow = next.row;
            currCol = next.col;

            if (currRow >= rows || currRow < 0 || currCol >= columns || currCol < 0) {
                // console.log(`Exited grid: ${currRow},${currCol}`);
                exited = true;
            }

            paths++;
        }

        // if not already exited, complete the path by exiting the grid
        if (!exited) {
            straightToExit(grid, { row: currRow, col: currCol });
        }
    } catch (e) {
        console.log(`Caught an error; dumping partial SVG`);
        writeFileSync("complete.svg", svgGrid(grid, grid.rows, grid.columns));
        throw e;
    }

}

function straightToExit(grid: Grid, current: Coord): GridSquare {
    const exitDir = randomDirection();
    grid.setDirection(current.row, current.col, exitDir);
    // TODO: make it just one step too far -- less obvious when looking at puzzle
    grid.setNumber(current.row, current.col, grid.rows > grid.columns ? grid.rows : grid.columns);
    return grid.getSquare(current.row, current.col);
}


function nextMoveToExit(grid: Grid, startRow: number, startCol: number, currRow: number, currCol: number, goalRow: number, goalCol: number, rows: number, columns: number, winningPath: Coord[]) {
    let dir = Direction.NONE;
    let steps = 0;

    let badPath = true;
    let attempts = 0;
    while (badPath) {
        attempts++;
        if (attempts >= 10) {
            const jump = straightToExit(grid, { row: startCol, col: startCol });
            return { dir: jump.direction, steps: jump.number };
        }

        dir = randomDirection();
        steps = rnd(grid.distanceToEdge(startRow, startCol, dir)) + 1;
        console.log(`candidate step: ${steps} ${dir}`);
        const candidate = applySteps(currRow, currCol, dir, steps);
        badPath = false;
        console.log(`candidate destination: ${candidate.row}, ${candidate.col}`);
        if (currRow === goalRow && currCol === goalCol) {
            console.log("reached goal - don't want this path!");
            badPath = true;
            break;
        }

        if (candidate.row >= rows || candidate.col >= columns || candidate.row < 0 || candidate.col < 0) {
            // console.log("leaving grid - no good for winning path generation");
            badPath = false;
        } else {
            // console.log(`grid square: ${JSON.stringify(grid.getSquare(candidate.row, candidate.col))}`);
            const candidateSquare = grid.getSquare(candidate.row, candidate.col);
            if (candidateSquare.direction === Direction.NONE && candidateSquare.number !== 0) {
                badPath = false;
            } else {
                badPath = true; // square is already occupied
            }
        }

        if (winningPath.includes(candidate)) {
            // do not join the winning path!
            badPath = true;
        }
    }

    return { dir, steps };
}

function generate(rows: number, columns: number) {
    let grid = new Grid(rows, columns);

    // pick a goal square
    const goalRow = rnd(columns - 2) + 1; // not on edge
    const goalCol = rnd(rows - 2) + 1; // not on edge
    grid.setNumber(goalRow, goalCol, 0);

    // aim for a rough path length, but not guaranteed
    //    const pathLength = rows * columns / (2 * (rows + columns - 2));
    // console.log(`target path length: ${pathLength}`);

    // TODO: come up with a useful heuristic for target path length
    const pathLength = 4;

    console.log(`Grid size ${rows}x${columns}`);

    // pick a winning start square and path to goal
    const winningIndex = rnd(countEdgeSquares(rows, columns));
    const { row, col } = startPoint(rows, columns, winningIndex);

    const winningPath: Coord[] = pathToGoal(grid, goalRow, goalCol, row!, col!, pathLength);
    writeFileSync("winning.svg", svgGrid(grid, 4, 4));

    console.log(winningPath.length);
    console.log(winningPath.map((c) => `(${c.row}, ${c.col})`).join(', '));

    // complete the non-winning paths from edge back to edge (or loop?!)
    for (let i = 0; i < countEdgeSquares(rows, columns); i++) {
        if (i !== winningIndex) {
            const start = startPoint(rows, columns, i);
            pathsToExit(grid, goalRow, goalCol, start.row!, start.col!, pathLength, winningPath);
        }
    }

    // fill in any remaining (unreachable) blank grid squares 

    return grid;
}

writeFileSync("complete.svg", svgGrid(generate(4, 4), 4, 4));
