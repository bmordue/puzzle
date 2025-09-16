import { writeFileSync } from "fs";
import { svgGrid } from "./draw";
import { generate } from "./puzzle";
import { getConfig } from "./config";

function validateInput(rows: number, cols: number): void {
    const config = getConfig();
    
    if (rows <= 0 || cols <= 0) {
        throw new Error("Grid dimensions must be positive integers");
    }
    
    if (rows > config.generation.maxGridSize || cols > config.generation.maxGridSize) {
        throw new Error(`Grid dimensions cannot exceed ${config.generation.maxGridSize}x${config.generation.maxGridSize}`);
    }
    
    if (rows < 3 || cols < 3) {
        throw new Error("Grid dimensions must be at least 3x3 to allow for non-edge goal placement");
    }
}

function main() {
    const config = getConfig();
    let rows = config.generation.defaultSize.rows;
    let cols = config.generation.defaultSize.cols;
    
    try {
        if (process.argv[2]) {
            rows = parseInt(process.argv[2]);
        }
        if (process.argv[3]) {
            cols = parseInt(process.argv[3]);
        }
        
        if (isNaN(rows) || isNaN(cols)) {
            throw new Error("Invalid numeric arguments");
        }
        
        validateInput(rows, cols);
        
    } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.log("\nUsage: node built/app.js [rows] [cols]");
        console.log(`Default: ${config.generation.defaultSize.rows}x${config.generation.defaultSize.cols}`);
        console.log(`Maximum: ${config.generation.maxGridSize}x${config.generation.maxGridSize}`);
        console.log("Minimum: 3x3\n");
        process.exit(1);
    }
    
    console.log(`Generating grid: ${rows}x${cols}`);
    
    try {
        const grid = generate(rows, cols);
        const svg = svgGrid(grid);
        writeFileSync(config.output.defaultFilename, svg);
        console.log(`✅ Grid generated successfully: ${config.output.defaultFilename}`);
    } catch (error) {
        console.error(`❌ Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}

main();