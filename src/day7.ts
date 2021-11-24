import { Channel } from "./channel.js";
import { permute, range, readInput } from "./common.js";
import { parseIntCode, runIntCode } from "./intcode.js";

async function runAmps(
	code: number[],
	phases: number[],
	signal: number
): Promise<number> {
	for (const phase of phases) {
		const output = new Channel<number>();
		await runIntCode(code, [phase, signal], output);
		signal = await output.receive();
	}
	return signal;
}

async function runAmpsWithFeedback(
	code: number[],
	phases: number[],
	signal: number
): Promise<number> {
	let initialChannel = new Channel<number>();
	let signalChannel = initialChannel;
	for (const phase of phases) {
		const inputChannel = signalChannel;
		inputChannel.send(phase);
		signalChannel = new Channel();
		runIntCode(code, inputChannel, signalChannel);
	}
	initialChannel.send(signal);
	for await (const value of signalChannel) {
		signal = value;
		initialChannel.send(value);
	}
	return signal;
}

const code = parseIntCode(readInput("day7.txt"));

console.log("Day 7 -- Part One --");
{
	let maxSignal = 0;
	for (const phases of permute(range(5))) {
		const signal = await runAmps(code, phases, 0);
		if (signal > maxSignal) {
			maxSignal = signal;
		}
	}
	console.log(maxSignal);
}

console.log("Day 8 -- Part Two --");
{
	let maxSignal = 0;
	for (const phases of permute(range(5, 10))) {
		const signal = await runAmpsWithFeedback(code, phases, 0);
		if (signal > maxSignal) {
			maxSignal = signal;
		}
	}
	console.log(maxSignal);
}
