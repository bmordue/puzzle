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

    // TODO make this a method of the Grid class
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
}