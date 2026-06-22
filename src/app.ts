import { writeFileSync } from "node:fs";
import { svgGrid } from "./draw";
import { generate } from "./puzzle";

function main() {
    let rows = 4; let cols = 4;
    try {
        rows = Number.parseInt(process.argv[2]);
        cols = Number.parseInt(process.argv[3]);
        if (Number.isNaN(rows) || Number.isNaN(cols)) {
            throw new Error("Invalid arguments");
        }
    } catch {
        console.log("\nUsage: node built/app.js rows cols\n");
        process.exit(1);
    }
    console.log(`Generating grid: ${rows}x${cols}`);
    writeFileSync("complete.svg", svgGrid(generate(rows, cols)));
}

main();
