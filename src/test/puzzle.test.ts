import { startPoint } from "../puzzle";

function testStartSquares() {
    console.log("testStartSquares");
    const expected = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 2, y: 4 },
        { x: 1, y: 4 },
        { x: 0, y: 4 },
        { x: 0, y: 3 },
        { x: 0, y: 2 },
        { x: 0, y: 1 },
    ];

    const rows = 5;
    const cols = 3;
    for (let i = 0; i < 12; i++) {
        const s = startPoint(rows, cols, i);
        if (s.col !== expected[i].x || s.row !== expected[i].y) {
            console.log(`${i}: ${s.row}, ${s.col}`);
            console.log("test failed");
        }
    }
    console.log("end test");
}