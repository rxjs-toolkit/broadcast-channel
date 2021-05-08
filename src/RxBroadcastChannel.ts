import { Observable, Subject } from "rxjs";
import { share, takeUntil } from "rxjs/operators";

export class RxBroadcastChannel {
  private _broadcastChannel: BroadcastChannel;
  private get broadcastChannel() {
    if (!this._broadcastChannel && !this.disposed) {
      this._broadcastChannel = new BroadcastChannel(this.channelName);
    }

    return this._broadcastChannel;
  }

  private _broadcastChannelSubject: Subject<void>;
  private _broadcastChannelObservable: Observable<MessageEvent>;

  disposed: boolean = false;

  constructor(private readonly channelName: string) {}

  get events() {
    if (!this._broadcastChannelObservable) {
      this._broadcastChannelSubject = new Subject();
      const selfRef = new WeakRef(this);
      this._broadcastChannelObservable = new Observable<MessageEvent>(
        (subscriber) => {
          const self = selfRef.deref();
          if (!self || self.disposed) {
            subscriber.complete();
            return;
          }

          const broadcastChannel = self.broadcastChannel;
          const callbackMessage = (e: MessageEvent) => {
            subscriber.next(e);
          };
          const callbackError = (e: MessageEvent) => {
            subscriber.error(e);
          };
          broadcastChannel.addEventListener("message", callbackMessage);
          broadcastChannel.addEventListener("messageerror", callbackError);

          subscriber.add(() => {
            broadcastChannel.removeEventListener("message", callbackMessage);
            broadcastChannel.removeEventListener("messageerror", callbackError);
          });
        }
      ).pipe(takeUntil(this._broadcastChannelSubject), share());
    }

    return this._broadcastChannelObservable;
  }

  postMessage(message: any) {
    if (this.disposed) {
      return;
    }

    this.broadcastChannel.postMessage(message);
  }

  dispose() {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this._broadcastChannelSubject?.next();
    this._broadcastChannelSubject?.complete();
    this._broadcastChannel?.close();
    this._broadcastChannel = null;
  }
}
