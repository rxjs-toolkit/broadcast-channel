const CHANNELS = new Map<string, MockBroadcastChannel[]>();

type CallbackEventListener = (this: BroadcastChannel, ev: MessageEvent) => any;

class MockBroadcastChannel implements BroadcastChannel {
	private listeners = new Map<string, CallbackEventListener[]>();

	constructor(public readonly name: string) {
		let list = CHANNELS.get(name);
		if (!list) {
			list = [];
			CHANNELS.set(name, list);
		}

		list.push(this);
	}

	private _onmessage: CallbackEventListener | null;
	private _onmessageerror: CallbackEventListener | null;

	get onmessage() {
		return this._onmessage;
	}

	set onmessage(callback) {
		if (this._onmessage !== callback) {
			this.removeEventListener('message', this._onmessage as any);

			this._onmessage = callback;
			this.addEventListener('message', this._onmessage as any);
		}
	}

	get onmessageerror() {
		return this._onmessageerror;
	}

	set onmessageerror(callback) {
		if (this._onmessageerror !== callback) {
			this.removeEventListener('messageerror', this._onmessageerror as any);

			this._onmessageerror = callback;
			this.addEventListener('messageerror', this._onmessageerror as any);
		}
	}

	close(): void {}

	dispatchEvent(event: Event): boolean {
		return true;
	}

	postMessage(data: any) {
		const list = CHANNELS.get(this.name)?.filter((x) => x !== this) ?? [];

		for (const channel of list) {
			const event = new MessageEvent('message', {
				data,
			});

			((channel.listeners.get(event.type) ?? []) as any[]).forEach(
				(callback: (msg: any) => void) => {
					try {
						callback.call(channel, event);
					} catch (e) {
						console.error(e);
					}
				},
			);
		}
	}

	addEventListener<K extends keyof BroadcastChannelEventMap>(
		type: K,
		listener: (this: BroadcastChannel, ev: BroadcastChannelEventMap[K]) => any,
		options?: boolean | AddEventListenerOptions,
	): void;
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	): void;
	addEventListener(type: unknown, listener: unknown, options?: unknown): void {
		if (!type || typeof type !== 'string') {
			return;
		}

		let list = this.listeners.get(type);
		if (!list) {
			list = [];
			this.listeners.set(type, list);
		}

		list.push(listener as any);
	}
	removeEventListener<K extends keyof BroadcastChannelEventMap>(
		type: K,
		listener: (this: BroadcastChannel, ev: BroadcastChannelEventMap[K]) => any,
		options?: boolean | EventListenerOptions,
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions,
	): void;
	removeEventListener(
		type: unknown,
		listener: unknown,
		options?: unknown,
	): void {
		if (!type || typeof type !== 'string') {
			return;
		}

		const list = this.listeners.get(type);
		const index = list?.indexOf(listener as any);
		if (index! > -1) {
			list?.splice(index!, 1);
		}
	}
}

(globalThis as any).BroadcastChannel = MockBroadcastChannel;
