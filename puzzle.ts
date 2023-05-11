import { readFileSync, writeFileSync } from "fs";

export enum Direction {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    NONE = "none"
}

export interface GridSquare {
    direction: Direction;
    number: number;
    decorators?: string;
}

export class Grid {
    private grid: GridSquare[][];
    rows: number;
    columns: number;

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
        this.grid = new Array(rows);
        for (let i = 0; i < rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < columns; j++) {
                this.grid[i].push({
                    direction: Direction.NONE,
                    number: 1
                });
            }
        }
    }

    static clone(old: Grid) {
        let clone = new Grid(old.rows, old.columns);
        for (let i = 0; i < old.rows; i++) {
            for (let j = 0; j < old.columns; j++) {
                clone.setDirection(i, j, old.grid[i][j].direction);
                clone.setNumber(i, j, old.grid[i][j].number);
            }
        }
        return clone;
    }


    public setDirection(row: number, column: number, direction: Direction): void {
        const square = this.grid[row][column];

        square.direction = direction;
    }

    public setNumber(row: number, column: number, number: number): void {
        this.grid[row][column].number = number;
    }

    addDecorator(row: number, column: number, decorator: string) {
        const dec = this.grid[row][column].decorators;
        if (dec) {
            this.grid[row][column].decorators += decorator;
        } else {
            this.grid[row][column].decorators = decorator;
        }
    }

    public getSquare(row: number, column: number): GridSquare {
        return this.grid[row][column];
    }

    public toString() {
        let str = "";
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                str += `${this.grid[i][j].number} ${this.grid[i][j].direction}, `;
            }
            str += '\n';
        }
        return str;
    }
}


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

function exampleGrid() {
    return gridFromRaw(
        [1, 2, 1, 3, 2, 3, 2, 3, 1],
        ["r", "r", "l", "r", "r", "d", "r", "r", "d"],
        3,
        3);
}

function gridFromFile(path: string) {
    return Grid.clone(JSON.parse(readFileSync(path, "utf8")));
}

export function svgGrid(grid: Grid, rows: number, cols: number) {

    // SVG parameters
    const CELL_SIZE = 50;
    const STROKE_WIDTH = 2;
    const STROKE_COLOR = "black";
    const FONT_SIZE = 24;
    const FONT_FAMILY = "sans-serif";
    // SVG elements
    let svg = `<svg viewBox="0 0 ${cols * CELL_SIZE} ${rows * CELL_SIZE}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `\n<defs><link rel="stylesheet" href="grid.css" /></defs>`;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const { direction, number } = grid.getSquare(row, col);

            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            const centerX = x + CELL_SIZE / 2;
            const centerY = y + CELL_SIZE / 2;

            // Draw the square
            svg += `\n<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" fill="white" />`;

            // add coords
            svg += `\n<text x="${centerX + CELL_SIZE / 4}" y="${centerY + CELL_SIZE / 3}" font-size="10" font-family="${FONT_FAMILY}" text-anchor="middle" alignment-baseline="central" stroke="black" fill="black">${row}, ${col}</text>`;

            if (direction === Direction.NONE && number === 0) {
                // Draw the goal
                svg += `\n<circle cx="${centerX}" cy="${centerY}" r="${CELL_SIZE * 0.2}" stroke-width="3" stroke="red" fill="none" />`;

            } else if (direction === Direction.NONE && number === 1) {
                // draw an uninitialised square
                svg += `\n<circle cx="${centerX}" cy="${centerY}" r="${CELL_SIZE * 0.2}" stroke-width="2" stroke="black" fill="none" />`;
            } else {

                // Draw the arrow
                svg += svgArrow(CELL_SIZE, direction, centerX, y, x, centerY);

                // Draw the number
                svg += `\n<text x="${centerX}" y="${centerY}" font-size="${FONT_SIZE}" font-family="${FONT_FAMILY}" text-anchor="middle" alignment-baseline="central" stroke="black" fill="black">${number}</text>`;
            }

            // debug decorators
            const decorators = grid.getSquare(row, col).decorators;
            if (decorators?.includes('s')) {
                svg += `\n<rect x="${x + 5}" y="${y + 5}" width="5" height="5" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" fill="red" />`;
            }

        }
        svg += '\n';
    }
    svg += "\n</svg>";
    return svg;
}

function svgArrow(cellSize: number, direction: Direction, centerX: number, y: number, x: number, centerY: number) {
    let arrowSvg = "";
    let points = "";
    const arrowSize = cellSize / 4;
    switch (direction) {
        case Direction.UP:
            points = `${centerX},${y + arrowSize} ${x + arrowSize},${y + cellSize - arrowSize} ${x + cellSize - arrowSize},${y + cellSize - arrowSize}`;
            break;
        case Direction.DOWN:
            points = `${centerX},${y + cellSize - arrowSize} ${x + arrowSize},${y + arrowSize} ${x + cellSize - arrowSize},${y + arrowSize}`;
            break;
        case Direction.LEFT:
            points = `${x + arrowSize},${centerY} ${x + cellSize - arrowSize},${y + arrowSize} ${x + cellSize - arrowSize},${y + cellSize - arrowSize}`;
            break;
        case Direction.RIGHT:
            points = `${x + cellSize - arrowSize},${centerY} ${x + arrowSize},${y + arrowSize} ${x + arrowSize},${y + cellSize - arrowSize}`;
            break;
    }

    arrowSvg = `\n<polygon points="${points}" class="arrow" fill="lightgrey" stroke="darkslategrey" stroke-width="2" />`;

    return arrowSvg;
}

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

// console.log(svgGrid(gridFromFile("example_7x7.json"), 7, 7));

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

function startPoint(rows: number, columns: number, index: number) {
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

// TODO make this a method of the Grid class
function distanceToEdge(theGrid: Grid, startX: number, startY: number, dir: Direction) {
    let distance = 0;

    switch (dir) {
        case Direction.DOWN:
            distance = theGrid.rows - 1 - startY;
            break;
        case Direction.UP:
            distance = startY;
            break;
        case Direction.RIGHT:
            distance = theGrid.columns - 1 - startX;
            break;
        case Direction.LEFT:
            distance = startX;
            break;
    }

    return distance;
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
            steps = rnd(distanceToEdge(grid, row!, col!, dir) - 1) + 1; //+ 1; // + 1: allow exits from grid
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

function testStartSquares() {
    console.log("testStartSquares");
    const expected = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 1, y: 4 },
        { x: 0, y: 4 },
        { x: 0, y: 3 },
        { x: 0, y: 2 },
        { x: 0, y: 1 },
    ];

    const rows = 5;
    const cols = 3;
    for (let i = 0; i < 12; i++) {
        const s = startPoint(rows, cols, i);
        if (s.col !== expected[i].x || s.row !== expected[i].y) {
            console.log(`${i}: ${s.row}, ${s.col}`);
            console.log("test failed");
        }
    }
    console.log("end test");
}

//testStartSquares();

writeFileSync("newgrid.svg", (svgGrid(generate(5, 5), 5, 5)));
