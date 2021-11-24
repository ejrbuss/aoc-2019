type Resolve<T> = (value: T) => void;
type Reject = (error: any) => void;
type Receiver<T> = { resolve: Resolve<T>; reject: Reject };

export type ChannelLike<T> = ArrayLike<T> | Iterable<T> | Channel<T>;

export class Closed extends Error {}

export class Channel<T> {
	#closed: boolean = false;
	#buffer: T[] = [];
	#receivers: Receiver<T>[] = [];

	static from<T>(values: ChannelLike<T>): Channel<T> {
		if (values instanceof Channel) {
			return values;
		}
		const channel = new Channel<T>();
		channel.#buffer = Array.from(values);
		return channel;
	}

	get closed() {
		return this.#closed;
	}

	send(value: T) {
		if (this.#closed) {
			throw new Error("Cannot send on a closed Channel!");
		}
		const receiver = this.#receivers.shift();
		if (receiver) {
			receiver.resolve(value);
		} else {
			this.#buffer.push(value);
		}
	}

	async receive(): Promise<T> {
		if (this.#buffer.length > 0) {
			return this.#buffer.shift() as T;
		}
		if (this.#closed) {
			throw new Closed();
		}
		const receiver = {} as Receiver<T>;
		const promise = new Promise<T>((resolve, reject) => {
			receiver.resolve = resolve;
			receiver.reject = reject;
		});
		this.#receivers.push(receiver);
		return promise;
	}

	async next(): Promise<IteratorResult<T>> {
		try {
			return { value: await this.receive(), done: false };
		} catch (error) {
			if (error instanceof Closed) {
				return { value: undefined, done: true };
			}
			throw error;
		}
	}

	async into(next: Channel<T>) {
		for await (const value of this) {
			if (next.#closed) {
				this.#buffer.unshift(value);
				return;
			}
			next.send(value);
		}
	}

	async receiveAll(): Promise<T[]> {
		const received: T[] = [];
		for await (const value of this) {
			received.push(value);
		}
		return received;
	}

	close() {
		this.#closed = true;
		let receiver = this.#receivers.shift();
		while (receiver) {
			receiver.reject(new Closed());
			receiver = this.#receivers.shift();
		}
	}

	[Symbol.asyncIterator](): AsyncIterator<T> {
		return this;
	}
}
