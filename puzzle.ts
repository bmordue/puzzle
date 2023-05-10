import { readFileSync } from "fs";

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
}

export class Grid {
    private grid: GridSquare[][];
    private rows: number;
    private columns: number;

    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.columns = columns;
        this.grid = new Array(rows);
        for (let i = 0; i < rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < columns; j++) {
                this.grid[i].push({
                    direction: Direction.NONE,
                    number: 0
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


            if (direction === Direction.NONE || number === 0) {
                // Draw the goal
                svg += `\n<circle cx="${centerX}" cy="${centerY}" r="${CELL_SIZE * 0.2}" stroke-width="3" stroke="red" fill="none" />`;

            } else {

                // Draw the arrow
                svg += svgArrow(CELL_SIZE, direction, centerX, y, x, centerY);

                // Draw the number
                svg += `\n<text x="${centerX}" y="${centerY}" font-size="${FONT_SIZE}" font-family="${FONT_FAMILY}" text-anchor="middle" alignment-baseline="central" stroke="black" fill="black">${number}</text>`;

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
    const grid = bigExampleGrid();
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

function rnd(max) {

    return Math.floor(Math.random() * max) + 1;
}

function generate(rows :number, columns :number) {
    let grid = new Grid(rows, columns);
    

    const goalX = Math.floor(Math.random() * rows) + 1;


    const goalY = Math.floor(Math.random() * columns) + 1;
    
    const startX = rnd(rows);
    const startY = rnd(columns);

}
