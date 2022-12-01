import { Channel } from "./channel.js";
var OpCode;
(function (OpCode) {
    OpCode[OpCode["Add"] = 1] = "Add";
    OpCode[OpCode["Mul"] = 2] = "Mul";
    OpCode[OpCode["In"] = 3] = "In";
    OpCode[OpCode["Out"] = 4] = "Out";
    OpCode[OpCode["Jt"] = 5] = "Jt";
    OpCode[OpCode["Jf"] = 6] = "Jf";
    OpCode[OpCode["Lt"] = 7] = "Lt";
    OpCode[OpCode["Eq"] = 8] = "Eq";
    OpCode[OpCode["Stop"] = 99] = "Stop";
})(OpCode || (OpCode = {}));
var Mode;
(function (Mode) {
    Mode[Mode["Position"] = 0] = "Position";
    Mode[Mode["Immediate"] = 1] = "Immediate";
})(Mode || (Mode = {}));
function decode(instruction) {
    const op = instruction % 100;
    const aMode = Math.floor(instruction / 100) % 10;
    const bMode = Math.floor(instruction / 1000) % 10;
    return { op, aMode, bMode };
}
function load(memory, value, mode) {
    if (mode === Mode.Position) {
        return memory[value];
    }
    if (mode === Mode.Immediate) {
        return value;
    }
    throw new Error(`Unknown load mode: ${mode}!`);
}
export async function runIntCode(code, input, output) {
    const inputChannel = Channel.from(input);
    const outputChannel = Channel.from(output);
    const memory = [...code];
    let pc = 0;
    for (;;) {
        const instruction = memory[pc];
        const a = memory[pc + 1];
        const b = memory[pc + 2];
        const c = memory[pc + 3];
        const { op, aMode, bMode } = decode(instruction);
        switch (op) {
            case OpCode.Add:
                memory[c] = load(memory, a, aMode) + load(memory, b, bMode);
                pc += 4;
                break;
            case OpCode.Mul:
                memory[c] = load(memory, a, aMode) * load(memory, b, bMode);
                pc += 4;
                break;
            case OpCode.In:
                memory[a] = await inputChannel.receive();
                pc += 2;
                break;
            case OpCode.Out:
                outputChannel.send(load(memory, a, aMode));
                pc += 2;
                break;
            case OpCode.Jt:
                if (load(memory, a, aMode) !== 0) {
                    pc = load(memory, b, bMode);
                }
                else {
                    pc += 3;
                }
                break;
            case OpCode.Jf:
                if (load(memory, a, aMode) === 0) {
                    pc = load(memory, b, bMode);
                }
                else {
                    pc += 3;
                }
                break;
            case OpCode.Lt:
                memory[c] = load(memory, a, aMode) < load(memory, b, bMode) ? 1 : 0;
                pc += 4;
                break;
            case OpCode.Eq:
                memory[c] = load(memory, a, aMode) === load(memory, b, bMode) ? 1 : 0;
                pc += 4;
                break;
            case OpCode.Stop:
                outputChannel.close();
                return;
            default:
                throw new Error(`Unknown opcode: ${op} at position: ${pc}`);
        }
    }
}
export function parseIntCode(source) {
    return source.split(",").map((code) => parseInt(code));
}
