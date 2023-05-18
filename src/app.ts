import { writeFileSync } from "fs";
import { svgGrid } from "./draw";
import { generate } from "./puzzle";

function main() {
    let rows = 4; let cols = 4;
    try {
        rows = parseInt(process.argv[2]);
        cols = parseInt(process.argv[3]);
    } catch {
        console.log("\nUsage: node built/app.js rows cols\n");
    }
    writeFileSync("complete.svg", svgGrid(generate(rows, cols)));
}

main();