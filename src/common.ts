import { readFileSync } from "fs";

export function readInput(name: string): string {
	return readFileSync(`./inputs/${name}`, "utf-8").trim();
}

export function sum(...ns: number[]): number {
	return ns.reduce((a, b) => a + b, 0);
}

export function product(...ns: number[]): number {
	return ns.reduce((a, b) => a * b, 0);
}

export function sign(n: number): number {
	return n >= 0 ? 1 : -1;
}

export function range(begin: number, end?: number, step?: number): number[] {
	if (typeof end === "undefined") {
		return range(0, begin, begin >= 0 ? 1 : -1);
	}
	if (typeof step === "undefined") {
		step = begin < end ? 1 : -1;
	}
	const result = [];
	for (let i = begin; i < end; i += step) {
		result.push(i);
	}
	return result;
}

export function cartesianProduct<T>(firstArray: T[], ...arrays: T[][]): T[][] {
	const initialProduct = firstArray.map((a) => [a]);
	return arrays.reduce((product, array) => {
		return product.flatMap((tuple) => {
			return array.map((a) => [...tuple, a]);
		});
	}, initialProduct);
}

export function permute<T>(array: T[]): T[][] {
	if (array.length <= 1) {
		return [array];
	}
	const [first, ...rest] = array;
	const restPerms = permute(rest);
	return restPerms.flatMap((perm) => {
		return range(perm.length + 1).map((i) => [
			...perm.slice(0, i),
			first,
			...perm.slice(i),
		]);
	});
}

export function chunk<T>(array: T[], n: number): T[][] {
	const chunks: T[][] = [];
	let chunk: T[] = [];
	array.forEach((a, i) => {
		if (chunk.length > 0 && i % n === 0) {
			chunks.push(chunk);
			chunk = [];
		}
		chunk.push(a);
	});
	if (chunk.length > 0) {
		chunks.push(chunk);
	}
	return chunks;
}
