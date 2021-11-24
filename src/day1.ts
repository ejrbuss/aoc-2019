import { readInput, sum } from "./common.js";

function fuelForMass1(mass: number): number {
	return Math.floor(mass / 3) - 2;
}

function fuelForMass2(mass: number): number {
	let totalFuel = 0;
	let fuel = fuelForMass1(mass);
	while (fuel > 0) {
		totalFuel += fuel;
		fuel = fuelForMass1(fuel);
	}
	return totalFuel;
}

const masses = readInput("day1.txt")
	.split("\n")
	.map((i) => parseInt(i));

console.log("Day 1 -- Part One --");
console.log(sum(...masses.map(fuelForMass1)));

console.log("Day 1 -- Part Two --");
console.log(sum(...masses.map(fuelForMass2)));
