export class Closed extends Error {
}
export class Channel {
    #closed = false;
    #buffer = [];
    #receivers = [];
    static from(values) {
        if (values instanceof Channel) {
            return values;
        }
        const channel = new Channel();
        channel.#buffer = Array.from(values);
        return channel;
    }
    get closed() {
        return this.#closed;
    }
    send(value) {
        if (this.#closed) {
            throw new Error("Cannot send on a closed Channel!");
        }
        const receiver = this.#receivers.shift();
        if (receiver) {
            receiver.resolve(value);
        }
        else {
            this.#buffer.push(value);
        }
    }
    async receive() {
        if (this.#buffer.length > 0) {
            return this.#buffer.shift();
        }
        if (this.#closed) {
            throw new Closed();
        }
        const receiver = {};
        const promise = new Promise((resolve, reject) => {
            receiver.resolve = resolve;
            receiver.reject = reject;
        });
        this.#receivers.push(receiver);
        return promise;
    }
    async next() {
        try {
            return { value: await this.receive(), done: false };
        }
        catch (error) {
            if (error instanceof Closed) {
                return { value: undefined, done: true };
            }
            throw error;
        }
    }
    async into(next) {
        for await (const value of this) {
            if (next.#closed) {
                this.#buffer.unshift(value);
                return;
            }
            next.send(value);
        }
    }
    async receiveAll() {
        const received = [];
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
    [Symbol.asyncIterator]() {
        return this;
    }
}
