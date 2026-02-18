import { Grid, Direction } from "./grid";
import { getConfig } from "./config";

export function svgGrid(grid: Grid) {
    if (!grid) {
        throw new Error("Invalid grid parameter. Grid must be provided.");
    }

    if (!(grid instanceof Grid)) {
        throw new Error("Invalid grid parameter. Grid must be an instance of the Grid class.");
    }
    
    const config = getConfig();
    const rows = grid.rows;
    const cols = grid.columns;
    
    // SVG parameters from configuration
    const { cellSize, strokeWidth, strokeColor, fontSize, fontFamily } = config.rendering;
    // SVG elements
    let svg = `<svg viewBox="0 0 ${cols * cellSize} ${rows * cellSize}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `\n<defs><link rel="stylesheet" href="grid.css" /></defs>`;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const { direction, number } = grid.getSquare(row, col);

            const x = col * cellSize;
            const y = row * cellSize;
            const centerX = x + cellSize / 2;
            const centerY = y + cellSize / 2;

            // Draw the square
            svg += `\n<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="white" />`;

            // Draw number on the cell

            if (direction === Direction.NONE && number === 0) {
                // Draw the goal
                svg += `\n<circle cx="${centerX}" cy="${centerY}" r="${cellSize * 0.2}" stroke-width="3" stroke="red" fill="none" />`;

            } else if (direction === Direction.NONE && number === 1) {
                // draw an uninitialised square
                svg += `\n<circle cx="${centerX}" cy="${centerY}" r="${cellSize * 0.2}" stroke-width="2" stroke="black" fill="none" />`;
            } else {

                // Draw the arrow
                svg += svgArrow(cellSize, direction, centerX, y, x, centerY);

                // Draw the number
                svg += `\n<text x="${centerX}" y="${centerY}" font-size="${fontSize}" font-family="${fontFamily}" text-anchor="middle" alignment-baseline="central" stroke="black" fill="black">${number}</text>`;
            }
        }
        svg += '\n';
    }
    svg += "\n</svg>";
    return svg;
}

function svgArrow(cellSize: number, direction: Direction, centerX: number, y: number, x: number, centerY: number) {
    if (![Direction.LEFT, Direction.RIGHT, Direction.UP, Direction.DOWN].includes(direction)) {
        return '';
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
