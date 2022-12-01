import { range } from "./common.js";

enum KeyCode {
	Space,
	Left,
	Right,
	Up,
	Down,
	Enter,
	A,
	B,
	C,
	D,
	E,
	F,
	G,
	H,
	I,
	J,
	K,
	L,
	M,
	N,
	O,
	P,
	Q,
	R,
	S,
	T,
	U,
	V,
	W,
	X,
	Y,
	Z,
}

type TermEvent = { tick: number } | { key: KeyCode; rawCode: number };

enum TermColor {
	Black,
	Red,
	Green,
	Yellow,
	Blue,
	Magenta,
	Cyan,
	White,
}

export type TermSymbolStyle = {
	foregound?: TermColor;
	background?: TermColor;
	bold?: boolean;
	bright?: boolean;
};

export type TermSymbol = TermSymbolStyle & {
	character: string;
};

export const EmptyTermSymbol: TermSymbol = { character: " " };

export class TermBuffer {
	width: number;
	height: number;
	data: TermSymbol[];

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.data = [];
		range(width * height).forEach(() => {
			this.data.push(EmptyTermSymbol);
		});
	}
}

export type TermUpdateFn = (
	buffer: TermBuffer,
	detlaMs: number,
	event: TermEvent
) => boolean;

async function enterInteractiveMode(updateFn: TermUpdateFn) {}

const ExitCodes: Record<number, boolean | undefined> = {
	3: true,
	4: true,
};
const RawCodeToKeyCode: Record<number, KeyCode | undefined> = {
	65: KeyCode.A,
	97: KeyCode.A,
};

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on("data", (chunk) => {
	const rawCode = chunk[0];
	if (ExitCodes[rawCode] !== undefined) {
		process.exit(0);
	}
	const character = String.fromCodePoint(rawCode);
	process.stdout.write(character + "\n");
});
