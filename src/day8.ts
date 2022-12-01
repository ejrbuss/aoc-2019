import { chunk, readInput } from "./common.js";

enum Color {
	Black = 0,
	White = 1,
	Transparent = 2,
}

type Layer = number[];

type Image = { layers: Layer[]; width: number; height: number };

function parseImage(source: string, width: number, height: number): Image {
	const digits = source.split("").map((i) => parseInt(i));
	return { layers: chunk(digits, width * height), width, height };
}

function layerCounts(layer: Layer): Record<number, number> {
	const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
	layer.forEach((i) => {
		counts[i] = (counts[i] ?? 0) + 1;
	});
	return counts;
}

const image = parseImage(readInput("day8.txt"), 25, 6);

console.log("Day 8 -- Part One --");
{
	let minZeroCount = Infinity;
	let countProduct = 0;
	image.layers.forEach((layer) => {
		const counts = layerCounts(layer);
		if (counts[0] < minZeroCount) {
			minZeroCount = counts[0];
			countProduct = counts[1] * counts[2];
		}
	});
	console.log(countProduct);
}

console.log("Day 8 -- Part Two --");
{
}
