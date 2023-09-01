import { Grid, Direction } from "./grid";

export function svgGrid(grid: Grid) {
    if (!grid) {
        throw new Error("Invalid grid parameter. Grid must be provided.");
    }

    if (!(grid instanceof Grid)) {
        throw new Error("Invalid grid parameter. Grid must be an instance of the Grid class.");
    }
    const rows = grid.rows;
    const cols = grid.columns;
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
            // svg += `\n<text x="${centerX + CELL_SIZE / 4}" y="${centerY + CELL_SIZE / 3}" font-size="10" font-family="${FONT_FAMILY}" text-anchor="middle" alignment-baseline="central" stroke="black" fill="black">${row}, ${col}</text>`;

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
            // const decorators = grid.getSquare(row, col).decorators;
            // if (decorators?.includes('s')) {
            //     svg += `\n<rect x="${x + 5}" y="${y + 5}" width="5" height="5" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" fill="red" />`;
            // }

        }
        svg += '\n';
    }
    svg += "\n</svg>";
    return svg;
}

function svgArrow(cellSize: number, direction: Direction, centerX: number, y: number, x: number, centerY: number) {
    if (![Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN].includes(direction)) {
        throw new Error("Invalid direction parameter. Direction must be one of the valid Direction values.");
    }
    if (typeof direction !== "number") {
        throw new Error("Invalid direction parameter. Direction must be a number.");
    }
    let arrowSvg = "";
    let points = "";
    const arrowSize = cellSize / 4;
    switch (direction) {
        case Direction.LEFT:
            points = `${centerX},${y + arrowSize} ${x + arrowSize},${y + cellSize - arrowSize} ${x + cellSize - arrowSize},${y + cellSize - arrowSize}`;
            break;
        case Direction.RIGHT:
            points = `${centerX},${y + cellSize - arrowSize} ${x + arrowSize},${y + arrowSize} ${x + cellSize - arrowSize},${y + arrowSize}`;
            break;
        case Direction.UP:
            points = `${x + arrowSize},${centerY} ${x + cellSize - arrowSize},${y + arrowSize} ${x + cellSize - arrowSize},${y + cellSize - arrowSize}`;
            break;
        case Direction.DOWN:
            points = `${x + cellSize - arrowSize},${centerY} ${x + arrowSize},${y + arrowSize} ${x + arrowSize},${y + cellSize - arrowSize}`;
            break;
    }

    arrowSvg = `\n<polygon points="${points}" class="arrow" fill="lightgrey" stroke="darkslategrey" stroke-width="2" />`;

    return arrowSvg;
}