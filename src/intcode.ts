import { Channel, ChannelLike } from "./channel.js";

type IntCode = number[];

enum OpCode {
	Add = 1,
	Mul = 2,
	In = 3,
	Out = 4,
	Jt = 5,
	Jf = 6,
	Lt = 7,
	Eq = 8,
	Stop = 99,
}

enum Mode {
	Position = 0,
	Immediate = 1,
}

function decode(instruction: number): { op: number; aMode: Mode; bMode: Mode } {
	const op = instruction % 100;
	const aMode = Math.floor(instruction / 100) % 10;
	const bMode = Math.floor(instruction / 1000) % 10;
	return { op, aMode, bMode };
}

function load(memory: number[], value: number, mode: Mode): number {
	if (mode === Mode.Position) {
		return memory[value];
	}
	if (mode === Mode.Immediate) {
		return value;
	}
	throw new Error(`Unknown load mode: ${mode}!`);
}

export async function runIntCode(
	code: IntCode,
	input: ChannelLike<number>,
	output: ChannelLike<number>
): Promise<void> {
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
				} else {
					pc += 3;
				}
				break;
			case OpCode.Jf:
				if (load(memory, a, aMode) === 0) {
					pc = load(memory, b, bMode);
				} else {
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

export function parseIntCode(source: string): IntCode {
	return source.split(",").map((code) => parseInt(code));
}
