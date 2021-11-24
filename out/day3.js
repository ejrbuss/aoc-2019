import { readInput, sign } from "./common.js";
function distance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
function pointToKey(point) {
    return point.x + "," + point.y;
}
function keyToPoint(key) {
    const [x, y] = key.split(",").map((n) => parseInt(n));
    return { x, y };
}
function stepsToPath(steps) {
    const path = {};
    let position = { x: 0, y: 0 };
    steps.forEach((step) => {
        let deltaX = sign(step.x);
        const destX = position.x + step.x;
        while (position.x !== destX) {
            position.x += deltaX;
            path[pointToKey(position)] = true;
        }
        let deltaY = sign(step.y);
        const destY = position.y + step.y;
        while (position.y !== destY) {
            position.y += deltaY;
            path[pointToKey(position)] = true;
        }
    });
    return path;
}
function stepsToPointPath(steps) {
    const path = {};
    let position = { x: 0, y: 0 };
    let distance = 0;
    steps.forEach((step) => {
        let deltaX = sign(step.x);
        const destX = position.x + step.x;
        while (position.x !== destX) {
            position.x += deltaX;
            path[pointToKey(position)] = ++distance;
        }
        let deltaY = sign(step.y);
        const destY = position.y + step.y;
        while (position.y !== destY) {
            position.y += deltaY;
            path[pointToKey(position)] = ++distance;
        }
    });
    return path;
}
function findIntersections(path1, path2) {
    const intersections = [];
    Object.keys(path1).forEach((key) => {
        if (key in path2) {
            intersections.push(keyToPoint(key));
        }
    });
    return intersections;
}
function closestIntersection(intersections) {
    const origin = { x: 0, y: 0 };
    let minDistance = Infinity;
    let minPoint = { x: Infinity, y: Infinity };
    intersections.forEach((p) => {
        const d = distance(origin, p);
        if (d < minDistance) {
            minDistance = d;
            minPoint = p;
        }
    });
    return minPoint;
}
function lowestPointIntersection(path1, path2, intersections) {
    const origin = { x: 0, y: 0 };
    let minPathPoints = Infinity;
    let minPoint = { x: Infinity, y: Infinity };
    intersections.forEach((p) => {
        const pp = path1[pointToKey(p)] + path2[pointToKey(p)];
        if (pp < minPathPoints) {
            minPathPoints = pp;
            minPoint = p;
        }
    });
    return minPoint;
}
function parseSteps(source) {
    return source.split("\n").map((line) => line.split(",").map((step) => {
        if (step.startsWith("R")) {
            return { x: parseInt(step.substr(1)), y: 0 };
        }
        if (step.startsWith("L")) {
            return { x: -parseInt(step.substr(1)), y: 0 };
        }
        if (step.startsWith("U")) {
            return { x: 0, y: parseInt(step.substr(1)) };
        }
        if (step.startsWith("D")) {
            return { x: 0, y: -parseInt(step.substr(1)) };
        }
        throw new Error(`Unknown step: ${step}!`);
    }));
}
const [steps1, steps2] = parseSteps(readInput("day3.txt"));
console.log("Day 3 -- Part One --");
{
    const path1 = stepsToPath(steps1);
    const path2 = stepsToPath(steps2);
    const intersections = findIntersections(path1, path2);
    const closest = closestIntersection(intersections);
    console.log(distance({ x: 0, y: 0 }, closest));
}
console.log("Day 3 -- Part Two --");
{
    const path1 = stepsToPointPath(steps1);
    const path2 = stepsToPointPath(steps2);
    const intersections = findIntersections(path1, path2);
    const closest = lowestPointIntersection(path1, path2, intersections);
    console.log(path1[pointToKey(closest)] + path2[pointToKey(closest)]);
}
