if (!globalThis.BroadcastChannel) {
	
}

if (!Symbol.dispose) {
	(Symbol as any).dispose = Symbol('dispose');
}

if (!Symbol.asyncDispose) {
	(Symbol as any).asyncDispose = Symbol('asyncDispose');
}
