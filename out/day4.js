import { range } from "./common.js";
const Min = 248345;
const Max = 746315;
function meetCriteria1(n) {
    const s = n.toString();
    // It is a six-digit number.
    if (s.length !== 6) {
        return false;
    }
    // Two adjacent digits are the same (like 22 in 122345).
    let adjacent = false;
    for (let i = 0; i + 1 < s.length; i += 1) {
        if (s[i] === s[i + 1]) {
            adjacent = true;
            break;
        }
    }
    if (!adjacent) {
        return false;
    }
    // Going from left to right, the digits never decrease; they only ever
    // increase or stay the same.
    let increasing = true;
    for (let i = 0; i + 1 < s.length; i += 1) {
        if (parseInt(s[i]) > parseInt(s[i + 1])) {
            increasing = false;
            break;
        }
    }
    if (!increasing) {
        return false;
    }
    return true;
}
function meetCriteria2(n) {
    if (!meetCriteria1(n)) {
        return false;
    }
    const s = n.toString();
    for (let i = -1; i + 2 < s.length; i += 1) {
        if (s[i] !== s[i + 1] && s[i + 1] === s[i + 2] && s[i + 2] !== s[i + 3]) {
            return true;
        }
    }
    for (let i = 0; i + 2 < s.length; i += 1) {
        if (s[i] === s[i + 1] && s[i] === s[i + 2]) {
            return false;
        }
    }
    return true;
}
console.log("Day 4 -- Part One --");
{
    let passwords = 0;
    range(Min, Max).forEach((n) => {
        if (meetCriteria1(n)) {
            passwords += 1;
        }
    });
    console.log(passwords);
}
console.log("Dat 4 -- Part Two --");
{
    let passwords = 0;
    range(Min, Max).forEach((n) => {
        if (meetCriteria2(n)) {
            passwords += 1;
        }
    });
    console.log(passwords);
}
