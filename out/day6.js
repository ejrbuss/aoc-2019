import { readInput } from "./common.js";
function parseOrbits(source) {
    const orbits = {};
    source.split("\n").forEach((line) => {
        const [orbitee, orbiter] = line.split(")");
        orbits[orbiter] = orbitee;
    });
    return orbits;
}
function countOrbits(orbits) {
    const frontier = Object.keys(orbits);
    let count = 0;
    let orbiter = frontier.pop();
    while (orbiter) {
        const orbitee = orbits[orbiter];
        if (orbitee) {
            count += 1;
            frontier.push(orbitee);
        }
        orbiter = frontier.pop();
    }
    return count;
}
function orbitPath(orbits, orbiter) {
    const path = [];
    while (orbiter) {
        path.push(orbiter);
        orbiter = orbits[orbiter];
    }
    return path;
}
function transfterDistance(orbits, from, to) {
    const fromPath = orbitPath(orbits, from);
    const toPath = orbitPath(orbits, to);
    while (fromPath[fromPath.length - 1] === toPath[toPath.length - 1]) {
        fromPath.pop();
        toPath.pop();
    }
    return fromPath.length + toPath.length;
}
const orbits = parseOrbits(readInput("day6.txt"));
console.log("Day 6 -- Part One --");
console.log(countOrbits(orbits));
console.log("Day 6 -- Part Two --");
console.log(transfterDistance(orbits, orbits["YOU"], orbits["SAN"]));
