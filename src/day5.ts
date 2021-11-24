import { Channel } from "./channel.js";
import { readInput } from "./common.js";
import { parseIntCode, runIntCode } from "./intcode.js";

const code = parseIntCode(readInput("day5.txt"));

console.log("Day 5 -- Part One --");
{
	const output = new Channel<number>();
	await runIntCode(code, [1], output);
	console.log(await output.receiveAll());
}

console.log("Day 5 -- Part Two --");
{
	const output = new Channel<number>();
	await runIntCode(code, [5], output);
	console.log(await output.receiveAll());
}
