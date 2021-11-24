import { cartesianProduct, range, readInput } from "./common.js";

enum OpCode {
	Add = 1,
	Mul = 2,
	End = 99,
}

function parseIntCode(source: string): number[] {
	return source.split(",").map((code) => parseInt(code));
}

function interpIntCode(code: number[]) {
	let pc = 0;
	for (;;) {
		const op = code[pc];
		const a = code[pc + 1];
		const b = code[pc + 2];
		const c = code[pc + 3];
		switch (op) {
			case OpCode.Add:
				code[c] = code[a] + code[b];
				pc += 4;
				break;
			case OpCode.Mul:
				code[c] = code[a] * code[b];
				pc += 4;
				break;
			case OpCode.End:
				return;
			default:
				throw new Error(`Unknown opcode: ${op} at position: ${pc}`);
		}
	}
}

function runIntCode(code: number[], noun: number, verb: number): number {
	const memory = [...code];
	memory[1] = noun;
	memory[2] = verb;
	interpIntCode(memory);
	return memory[0];
}

const code = parseIntCode(readInput("day2.txt"));

console.log("Day 2 -- Part One --");
console.log(runIntCode(code, 12, 2));

console.log("Day 2 -- Part Two --");
const desiredOutput = 19690720;
for (const [noun, verb] of cartesianProduct(range(100), range(100))) {
	if (runIntCode(code, noun, verb) === desiredOutput) {
		console.log(100 * noun + verb);
		break;
	}
}
