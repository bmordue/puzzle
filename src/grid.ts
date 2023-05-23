import { Dir } from "fs";
import { Coord } from "./puzzle";

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
    row?: number;
    col?: number;
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

        if (square.direction !== Direction.NONE) {
            console.log('dumping partial grid:\n');
            console.log(this.toString());
            throw new Error(`Eek: overwriting existing direction (${row},${column}: ${square.number} ${square.direction})`);
        }
        square.direction = direction;
    }

    public setNumber(row: number, column: number, number: number): void {
        const square = this.grid[row][column];
        // if (square.number !== 1) {
        //     console.log(`Eek: overwriting existing direction (${row},${column}: ${square.number} ${square.direction})`);
        // }
        square.number = number;
    }

    public setSquare(sq: GridSquare) {
        this.grid[sq.row!][sq.col!] = sq;
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

    public distanceToEdge(startX: number, startY: number, dir: Direction) {
        let distance = 0;

        switch (dir) {
            case Direction.DOWN:
                distance = this.rows - 1 - startY;
                break;
            case Direction.UP:
                distance = startY;
                break;
            case Direction.RIGHT:
                distance = this.columns - 1 - startX;
                break;
            case Direction.LEFT:
                distance = startX;
                break;
        }

        return distance;
    }

    public listSquares() {
        const squares = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                squares.push({ ...this.getSquare(r, c), row: r, col: c });
            }
        }
        return squares;
    }

    public getSize(): Coord {
        return { row: this.rows, col: this.columns };
    }

}

export function isBlank(square: GridSquare) {
    return square.direction === Direction.NONE && square.number === 1;
}

export function isNotBlank(square: GridSquare) {
    return !isBlank(square);
}

export function sameRowOrColumn(start: Coord, dest: Coord): boolean {
    return start.row === dest.row || start.col === dest.col;
}

export function squareFromCoords(start: Coord, dest: Coord): GridSquare {
    if (!sameRowOrColumn(start, dest)) {
        throw new Error("no valid move; squares not on some row or column");
    }
    let dir: Direction = Direction.NONE;
    let steps: number = 0;
    const sameRow = start.row === dest.row;
    if (sameRow && start.col > dest.col) {
        dir = Direction.UP;
        steps = start.col - dest.col;
    }
    if (sameRow && start.col < dest.col) {
        dir = Direction.DOWN;
        steps = dest.col - start.col;
    }
    if (!sameRow && start.row > dest.row) {
        dir = Direction.LEFT;
        steps = start.row - dest.row;
    }
    if (!sameRow && start.row < dest.row) {
        dir = Direction.RIGHT;
        steps = dest.row - start.row;
    }
    return { row: start.row, col: start.col, direction: dir, number: steps };
}

export function pathIncludesCoord(path: Coord[], coord: Coord): boolean {
    return path.filter((c) => c.col === coord.col && c.row === coord.row).length > 0;
}

export function notOnEdge(grid: Grid, c: Coord): boolean {
    return c.row !== 0 && c.col !== 0 && c.row !== grid.rows - 1 && c.col !== grid.columns - 1;
}
