enum Direction {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
    NONE = "none"
}

interface GridSquare {
    direction: Direction;
    number: number;
}

class Grid {
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


    public setDirection(row: number, column: number, direction: Direction): void {
        const square = this.grid[row][column];

        square.direction = direction;
        // this.grid[row][column].direction = direction;
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

function gridFromRawRows(numbers: number[], directions: string, rows: number, cols: number) {
    const grid = new Grid(rows, cols);

    const directionsLines = directions.split('\n');

    for (let i = 0; i < rows; i++) {
        const row = directionsLines[i];
        for (let j = 0; j < cols; j++) {
            const dirChar = directions.charAt(j);
            grid.setDirection(i, j, dirForShort(dirChar));
            grid.setNumber(i, j, numbers[i * rows + j]);
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

function bigExampleGrid() {
    return gridFromRawRows(
        [1, 2, 1, 1, 2, 2, 3,
            3, 2, 3, 1, 2, 1, 4,
            2, 3, 1, 1, 0, 2, 1,
            4, 1, 2, 2, 2, 2, 3,
            1, 2, 2, 1, 4, 1, 2,
            2, 2, 3, 3, 2, 3, 1,
            3, 1, 1, 2, 2, 3, 2
        ],
        `rrldrdr
        rrdrdul
        rrdlurl
        rrrudul
        ruluull
        rdrurul
        uuuuuul
        `,
        7,
        7);
}


function svgGrid(grid: Grid, rows: number, cols: number) {

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

            // Draw the arrow
            svg += svgArrow(CELL_SIZE, direction, centerX, y, x, centerY);

            // Draw the number
            svg += `\n<text x="${centerX}" y="${centerY}" font-size="${FONT_SIZE}" font-family="${FONT_FAMILY}" text-anchor="middle" alignment-baseline="central" stroke="black" fill="black">${number}</text>`;
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

console.log(svgGrid(bigExampleGrid(), 7, 7));
