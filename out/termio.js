import { range } from "./common.js";
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["Space"] = 0] = "Space";
    KeyCode[KeyCode["Left"] = 1] = "Left";
    KeyCode[KeyCode["Right"] = 2] = "Right";
    KeyCode[KeyCode["Up"] = 3] = "Up";
    KeyCode[KeyCode["Down"] = 4] = "Down";
    KeyCode[KeyCode["Enter"] = 5] = "Enter";
    KeyCode[KeyCode["A"] = 6] = "A";
    KeyCode[KeyCode["B"] = 7] = "B";
    KeyCode[KeyCode["C"] = 8] = "C";
    KeyCode[KeyCode["D"] = 9] = "D";
    KeyCode[KeyCode["E"] = 10] = "E";
    KeyCode[KeyCode["F"] = 11] = "F";
    KeyCode[KeyCode["G"] = 12] = "G";
    KeyCode[KeyCode["H"] = 13] = "H";
    KeyCode[KeyCode["I"] = 14] = "I";
    KeyCode[KeyCode["J"] = 15] = "J";
    KeyCode[KeyCode["K"] = 16] = "K";
    KeyCode[KeyCode["L"] = 17] = "L";
    KeyCode[KeyCode["M"] = 18] = "M";
    KeyCode[KeyCode["N"] = 19] = "N";
    KeyCode[KeyCode["O"] = 20] = "O";
    KeyCode[KeyCode["P"] = 21] = "P";
    KeyCode[KeyCode["Q"] = 22] = "Q";
    KeyCode[KeyCode["R"] = 23] = "R";
    KeyCode[KeyCode["S"] = 24] = "S";
    KeyCode[KeyCode["T"] = 25] = "T";
    KeyCode[KeyCode["U"] = 26] = "U";
    KeyCode[KeyCode["V"] = 27] = "V";
    KeyCode[KeyCode["W"] = 28] = "W";
    KeyCode[KeyCode["X"] = 29] = "X";
    KeyCode[KeyCode["Y"] = 30] = "Y";
    KeyCode[KeyCode["Z"] = 31] = "Z";
})(KeyCode || (KeyCode = {}));
var TermColor;
(function (TermColor) {
    TermColor[TermColor["Black"] = 0] = "Black";
    TermColor[TermColor["Red"] = 1] = "Red";
    TermColor[TermColor["Green"] = 2] = "Green";
    TermColor[TermColor["Yellow"] = 3] = "Yellow";
    TermColor[TermColor["Blue"] = 4] = "Blue";
    TermColor[TermColor["Magenta"] = 5] = "Magenta";
    TermColor[TermColor["Cyan"] = 6] = "Cyan";
    TermColor[TermColor["White"] = 7] = "White";
})(TermColor || (TermColor = {}));
export const EmptyTermSymbol = { character: " " };
export class TermBuffer {
    width;
    height;
    data;
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = [];
        range(width * height).forEach(() => {
            this.data.push(EmptyTermSymbol);
        });
    }
}
async function enterInteractiveMode(updateFn) { }
const ExitCodes = {
    3: true,
    4: true,
};
const RawCodeToKeyCode = {
    65: KeyCode.A,
    97: KeyCode.A,
};
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", (chunk) => {
    const rawCode = chunk[0];
    if (ExitCodes[rawCode] !== undefined) {
        process.exit(0);
    }
    const character = String.fromCodePoint(rawCode);
    process.stdout.write(character + "\n");
});
