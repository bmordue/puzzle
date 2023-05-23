import { writeFileSync } from "fs";
import { svgGrid } from "./draw";
import { Direction, Grid, GridSquare, isBlank, isNotBlank, sameRowOrColumn, squareFromCoords } from "./grid";

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

export function startPoint(rows: number, columns: number, index: number): Coord {
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

    if (x == undefined) x = -1;
    if (y == undefined) y = -1;
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

function includesByCoord(squares: GridSquare[], target: Coord): boolean {
    return squares.filter((s) => s.col === target.col && s.row === target.row).length > 0;
}

function pathToGoalRec(grid: Grid, goal: Coord, start: Coord, targetSteps: number, currentPath: Coord[]): Coord[] {
    console.log(`Finding path to goal: ${goal.row},${goal.col}; start: ${start.row},${start.col}`);
    const pathStr = currentPath.map((c) => `(${c.row}, ${c.col})`).join(', ');
    console.log(`${pathStr}\n`);

    if (start.col === goal.col && start.row === goal.row) {
        console.log(`found the goal!`);
        return currentPath;
    }

    function notInCurrentPath(s: GridSquare) {
        const c: Coord = { row: s.row!, col: s.col! }
        return currentPath.indexOf(c) === -1;
    }

    const availableMoves = grid
        .listSquares()
        .filter((s) => sameRowOrColumn(s, start))
        .filter((s) => !currentPath.includes({ row: s.row, col: s.col }));

    console.log(`Available moves: ${availableMoves.length}; length of current path: ${currentPath.length}`);
    if (currentPath.length > grid.columns * grid.rows) {
        throw new Error('going round in circles');

    }

    if (availableMoves.length === 0) {
        console.log(`couldn't find any moves from ${start.row},${start.col}`);
        currentPath.pop();
        return currentPath;
    }

    if (targetSteps < 2 && includesByCoord(availableMoves, goal)) {
        currentPath.push(goal);
        return currentPath;
    }

    const nextIndex = rnd(availableMoves.length);
    const next = availableMoves[nextIndex];
    if (!next) {
        throw new Error('ruh roh!');
    }
    currentPath.push(next);

    return pathToGoalRec(grid, goal, next, targetSteps, currentPath);
}



// TODO move this to Grid class...
function pathToGoal(grid: Grid, goal: Coord, start: Coord, pathLength: number): Coord[] {
    console.log(`Finding path to goal: ${goal.row},${goal.col}; start: ${start.row},${start.col}`);

    const rows = grid.rows;
    const columns = grid.columns;

    let paths = 0;
    let currRow = start.row;
    let currCol = start.col;
    grid.addDecorator(currRow, currCol, 's'); // decorator for starting square

    const winningPath: Coord[] = [];
    // winningPath.push({ row, col });

    // TODO: move this out into its own function
    // jump around randomly a few times
    while (paths < pathLength) {
        // if (blankSquares > 0)
        const { dir, steps } = nextMoveToGoal(grid, start, { row: currRow, col: currCol }, winningPath);

        grid.setDirection(currRow, currCol, dir);
        grid.setNumber(currRow, currCol, steps);
        winningPath.push({ row: currRow, col: currCol });

        const next = applySteps(currRow, currCol, dir, steps);
        currRow = next.row;
        currCol = next.col;

        if (currRow === goal.row && currCol === goal.col) {
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
    straightToGoal(grid, goal, { row: currRow, col: currCol }, winningPath);
    winningPath.push(goal);

    return winningPath;
}

function nextMoveToGoal(grid: Grid, start: Coord, current: Coord, winningPath: Coord[]) {
    let dir = Direction.NONE;
    let steps = 0;

    let badPath = true;
    let attempts = 0;
    while (badPath && attempts < 10) {
        attempts++;
        dir = randomDirection();
        steps = rnd(grid.distanceToEdge(start.row, start.col, dir)) + 1;
        const candidate = applySteps(current.row, current.col, dir, steps);
        if (candidate.row >= grid.rows - 1 || candidate.col >= grid.columns - 1 || candidate.row < 1 || candidate.col < 1) {
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
    return { dir, steps };
}

function straightToGoal(grid: Grid, goal: Coord, current: Coord, winningPath: Coord[]) {
    const offsetX = goal.row - current.row;
    const offsetY = goal.col - current.col;

    if (offsetX == 0 && offsetY == 0) {
        // do not overwrite the goal!
        return;
    }
    winningPath.push(current);

    if (offsetX == 0) {
        grid.setDirection(current.row, current.col, offsetY > 0 ? Direction.DOWN : Direction.UP);
        grid.setNumber(current.row, current.col, Math.abs(offsetY));
    } else if (offsetY == 0) {
        grid.setDirection(current.row, current.col, offsetX > 0 ? Direction.RIGHT : Direction.LEFT);
        grid.setNumber(current.row, current.col, Math.abs(offsetX));
    } else { // two moves required
        const yDir = offsetY > 0 ? Direction.DOWN : Direction.UP;
        grid.setDirection(current.row, current.col, yDir);
        grid.setNumber(current.row, current.col, Math.abs(offsetY));

        const next = applySteps(current.row, current.col, yDir, Math.abs(offsetY));


        winningPath.push({ row: next.row, col: next.col });

        grid.setDirection(next.row, next.col, offsetX > 0 ? Direction.RIGHT : Direction.LEFT);
        grid.setNumber(next.row, next.col, Math.abs(offsetX));
    }
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
            const { dir, steps } = nextMoveToExit(grid, { row: startRow, col: startCol }, { row: currRow, col: currCol }, { row: goalRow, col: goalCol }, winningPath);

            console.log(`Found a step: ${steps} ${dir}`);

            grid.setDirection(currRow, currCol, dir);
            grid.setNumber(currRow, currCol, steps);

            const next = applySteps(currRow, currCol, dir, steps);
            currRow = next.row;
            currCol = next.col;

            if (currRow >= rows || currRow < 0 || currCol >= columns || currCol < 0) {
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
        writeFileSync("complete.svg", svgGrid(grid));
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

function nextMoveToExit(grid: Grid, start: Coord, current: Coord, goal: Coord, winningPath: Coord[]) {
    let dir = Direction.NONE;
    let steps = 0;

    let validMove = false;
    let attempts = 0;
    while (!validMove) {
        attempts++;
        if (attempts >= 10) {
            const jump = straightToExit(grid, start);
            return { dir: jump.direction, steps: jump.number };
        }

        dir = randomDirection();
        steps = rnd(grid.distanceToEdge(start.row, start.col, dir)) + 1;
        console.log(`candidate step: ${steps} ${dir}`);

        const candidate = applySteps(current.row, current.col, dir, steps);
        console.log(`candidate destination: ${candidate.row}, ${candidate.col}`);

        validMove = isValidMoveToExit(current, goal, candidate, grid, winningPath);
    }

    return { dir, steps };
}

function isValidMoveToExit(current: Coord, goal: Coord, candidate: { row: number; col: number; }, grid: Grid, winningPath: Coord[]): boolean {
    let validMove;
    if (current.row === goal.row && current.col === goal.col) {
        console.log("reached goal - don't want this path!");
        return false;
    }

    if (candidate.row >= grid.rows || candidate.col >= grid.columns || candidate.row < 0 || candidate.col < 0) {
        // leaving grid
        validMove = true;
    } else {
        const candidateSquare = grid.getSquare(candidate.row, candidate.col);
        if (candidateSquare.direction === Direction.NONE && candidateSquare.number !== 0) {
            validMove = true;
        } else {
            validMove = false; // square is already occupied
        }
    }

    if (winningPath.includes(candidate)) {
        // do not join the winning path!
        validMove = false;
    }
    return validMove;
}

function fillBlanks(grid: Grid, winningPath: Coord[]) {
    // for each blank square
    // try to jump to another blank square
    // if none available, jump to any square not on the winning path
    grid.listSquares().filter(isBlank).forEach((sq) => {
        const dir = randomDirection();
        grid.setDirection(sq.row, sq.col, dir);
        let destCandidates = [];
        let i; let dest;
        let dirPredicate = (x: GridSquare) => false;
        let destNumber = (x: GridSquare) => 0;
        let exitNumber = 0;
        switch (dir) {
            case Direction.LEFT:
                dirPredicate = (s: GridSquare) => s.row === sq.row && s.col! < sq.col;
                exitNumber = sq.col + 1;
                destNumber = (dest: GridSquare) => sq.col - dest.col!;
                break;
            case Direction.RIGHT:
                dirPredicate = (s: GridSquare) => s.row === sq.row && s.col! > sq.col;
                exitNumber = grid.columns - sq.col;
                destNumber = (dest: GridSquare) => dest.col! - sq.col;
                break;
            case Direction.UP:
                dirPredicate = (s: GridSquare) => s.col === sq.col && s.row! < sq.row;
                exitNumber = sq.row + 1;
                destNumber = (dest: GridSquare) => sq.row - dest.row!;
                break;
            case Direction.DOWN:
                dirPredicate = (s: GridSquare) => s.col === sq.col && s.row! > sq.row;
                exitNumber = grid.rows - sq.row;
                destNumber = (dest: GridSquare) => dest.row! - sq.row;
                break;
        }
        destCandidates = grid
            .listSquares()
            .filter(dirPredicate).filter(isBlank);
        if (destCandidates.length == 0) {
            grid.setNumber(sq.row, sq.col, exitNumber);
        } else {
            i = rnd(destCandidates.length);
            dest = destCandidates[i];
            grid.setNumber(sq.row, sq.col, destNumber(dest));
        }

    });
}


export function generate(rows: number, columns: number) {
    let grid = new Grid(rows, columns);

    // pick a goal square
    const goalRow = rnd(columns - 2) + 1; // not on edge
    const goalCol = rnd(rows - 2) + 1; // not on edge
    grid.setNumber(goalRow, goalCol, 0);

    // aim for a rough path length, but not guaranteed
    //    const pathLength = rows * columns / (2 * (rows + columns - 2));
    // console.log(`target path length: ${pathLength}`);

    // TODO: come up with a useful heuristic for target path length
    const pathLength = 6;

    console.log(`Grid size ${rows}x${columns}`);

    // pick a winning start square and path to goal
    const winningIndex = rnd(countEdgeSquares(rows, columns));
    const winningStart = startPoint(rows, columns, winningIndex);

    let winningPath = [winningStart];

    winningPath = pathToGoalRec(grid, { row: goalRow, col: goalCol }, winningStart, pathLength, winningPath);
    winningPath.forEach((current, i, arr) => {
        if (i < arr.length - 1) {
            const sq = squareFromCoords(current, arr[i + 1]);
            grid.setSquare(sq);
        }
    });
    writeFileSync("winning.svg", svgGrid(grid));

    console.log(winningPath.length);
    console.log(winningPath.map((c) => `(${c.row}, ${c.col})`).join(', '));

    // complete the non-winning paths from edge back to edge (or loop?!)
    // for (let i = 0; i < countEdgeSquares(rows, columns); i++) {
    //     if (i !== winningIndex) {
    //         const start = startPoint(rows, columns, i);
    //         pathsToExit(grid, goalRow, goalCol, start.row, start.col, pathLength, winningPath);
    //     }
    // }

    // fill in any remaining (unreachable) blank grid squares
    fillBlanks(grid, winningPath);

    return grid;
}

// writeFileSync("complete.svg", svgGrid(generate(10, 10)));
