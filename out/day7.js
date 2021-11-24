import { Channel } from "./channel.js";
import { permute, range, readInput } from "./common.js";
import { parseIntCode, runIntCode } from "./intcode.js";
async function runAmps(code, phases, signal) {
    for (const phase of phases) {
        const output = new Channel();
        await runIntCode(code, [phase, signal], output);
        signal = await output.receive();
    }
    return signal;
}
async function runAmpsWithFeedback(code, phases, signal) {
    let initialChannel = new Channel();
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
// const exampleCode = parseIntCode(`3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
// 27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`);
// console.log(await runAmpsWithFeedback(exampleCode, [9, 8, 7, 6, 5], 0));
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
