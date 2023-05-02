enum Direction {
    UP = "up",
    DOWN = "down",
    LEFT = "left",
    RIGHT = "right",
}

interface GridSquare {
    direction: Direction;
    number: number;
}

class Grid {
    private grid: GridSquare[][];

    constructor(rows: number, columns: number) {
        this.grid = new Array(rows).fill(null).map(() => new Array(columns).fill({ direction: Direction.UP, number: 0 }));
    }

    public setDirection(row: number, column: number, direction: Direction): void {
        this.grid[row][column].direction = direction;
    }

    public setNumber(row: number, column: number, number: number): void {
        this.grid[row][column].number = number;
    }

    public getSquare(row: number, column: number): GridSquare {
        return this.grid[row][column];
    }
}

// Example usage:
// const grid = new Grid(3, 3);
// grid.setDirection(0, 0, Direction.UP);
// grid.setNumber(0, 0, 2);
// console.log(grid.getSquare(0, 0)); // { direction: Direction.UP, number: 2 }


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


function svgGrid() {

    const ROWS = 3;
    const COLS = 3;

    const grid = new Grid(ROWS, COLS);

    const numbers = [1, 2, 1, 3, 2, 3, 2, 3, 1];
    const directions = ["r", "r", "l", "r", "r", "d", "r", "r", "d"];


    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            grid.setDirection(i, j, dirForShort(directions[i * ROWS + j]));
            grid.setNumber(i, j, numbers[i * ROWS + j]);
        }
    }

    // ...populate the grid here...

    // SVG parameters
    const CELL_SIZE = 50;
    const STROKE_WIDTH = 2;
    const STROKE_COLOR = "black";
    const FONT_SIZE = 24;
    const FONT_FAMILY = "sans-serif";
    // SVG elements
    let svg = `<svg viewBox="0 0 ${COLS * CELL_SIZE} ${ROWS * CELL_SIZE}" xmlns="http://www.w3.org/2000/svg">`;
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const { direction, number } = grid.getSquare(row, col);
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            const centerX = x + CELL_SIZE / 2;
            const centerY = y + CELL_SIZE / 2;

            // Draw the square
            svg += `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" fill="none" />`;

            // Draw the number
            svg += `<text x="${centerX}" y="${centerY}" font-size="${FONT_SIZE}" font-family="${FONT_FAMILY}" text-anchor="middle" alignment-baseline="central">${number}</text>`;

            // Draw the arrow
            const arrowSize = CELL_SIZE / 4;
            switch (direction) {
                case Direction.UP:
                    svg += `<polygon points="${centerX},${y + arrowSize} ${x + arrowSize},${y + CELL_SIZE - arrowSize} ${x + CELL_SIZE - arrowSize},${y + CELL_SIZE - arrowSize}" fill="${STROKE_COLOR}" />`;
                    break;
                case Direction.DOWN:
                    svg += `<polygon points="${centerX},${y + CELL_SIZE - arrowSize} ${x + arrowSize},${y + arrowSize} ${x + CELL_SIZE - arrowSize},${y + arrowSize}" fill="${STROKE_COLOR}" />`;
                    break;
                case Direction.LEFT:
                    svg += `<polygon points="${x + arrowSize},${centerY} ${x + CELL_SIZE - arrowSize},${y + arrowSize} ${x + CELL_SIZE - arrowSize},${y + CELL_SIZE - arrowSize}" fill="${STROKE_COLOR}" />`;
                    break;
                case Direction.RIGHT:
                    svg += `<polygon points="${x + CELL_SIZE - arrowSize},${centerY} ${x + arrowSize},${y + arrowSize} ${x + arrowSize},${y + CELL_SIZE - arrowSize}" fill="${STROKE_COLOR}" />`;
                    break;
            }
        }
    }
    svg += "</svg>";

    console.log(svg);
}

svgGrid();