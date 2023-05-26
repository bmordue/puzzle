import { writeFileSync } from "fs";
import { svgGrid } from "./draw";
import { Direction, Grid, GridSquare, isBlank, notOnEdge, pathIncludesCoord, sameRowOrColumn, squareFromCoords } from "./grid";

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

    if (start.col === goal.col && start.row === goal.row) {
        return currentPath;
    }

    const availableMoves = grid
        .listSquares()
        .filter((s) => sameRowOrColumn(s, start))
        .filter((s) => notOnEdge(grid, s))
        .filter((s) => !pathIncludesCoord(currentPath, s));

    if (availableMoves.length === 0) {
        currentPath.pop();
        return currentPath;
    }

    if (targetSteps < 2 && includesByCoord(availableMoves, goal)) {
        currentPath.push(goal);
        return currentPath;
    }

    const nextIndex = rnd(availableMoves.length);
    const next = availableMoves[nextIndex];
    currentPath.push(next);

    return pathToGoalRec(grid, goal, next, targetSteps--, currentPath);
}


function fillBlanks(grid: Grid, winningPath: Coord[]) {
    // for each blank square
    // try to jump to another blank square
    // if none available, jump to any square not on the winning path
    grid.listSquares().filter(isBlank).forEach((sq) => {
        const dir = randomDirection();
        grid.setDirection(sq.row, sq.col, dir);
        let destCandidates: GridSquare[] = [];
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
            .filter(dirPredicate)
            .filter(isBlank)
        if (destCandidates.length == 0) {
            grid.setNumber(sq.row, sq.col, exitNumber);
        } else {
            i = rnd(destCandidates.length);
            dest = destCandidates[i];
            console.log(`current: (${sq.row}, ${sq.col}); dest: (${dest.row}, ${dest.col}) - ${dest.number} ${dest.direction}`);
            if (pathIncludesCoord(winningPath, { row: dest.row!, col: dest.col! })) {
                console.log("candidate for filling blanks is on the winning path");
            }
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


    // TODO: come up with a useful heuristic for target path length
    const pathLength = 6;

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

    // fill in any remaining (unreachable) blank grid squares
    fillBlanks(grid, winningPath);

    return grid;
}
