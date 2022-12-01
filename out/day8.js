import { chunk, readInput } from "./common.js";
var Color;
(function (Color) {
    Color[Color["Black"] = 0] = "Black";
    Color[Color["White"] = 1] = "White";
    Color[Color["Transparent"] = 2] = "Transparent";
})(Color || (Color = {}));
function parseImage(source, width, height) {
    const digits = source.split("").map((i) => parseInt(i));
    return { layers: chunk(digits, width * height), width, height };
}
function layerCounts(layer) {
    const counts = { 0: 0, 1: 0, 2: 0 };
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
