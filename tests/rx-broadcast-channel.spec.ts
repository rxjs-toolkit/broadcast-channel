import { zip } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { RxBroadcastChannel } from '../src/RxBroadcastChannel';

describe('RxBroadcastChannel', () => {
  test('Should Create Instance', (done) => {
    const rxBC1 = new RxBroadcastChannel('test');
    const rxBC2 = new RxBroadcastChannel('test');
    const rxBC3 = new RxBroadcastChannel('test');

    let dataSended = 1;

    zip(rxBC2.events.pipe(filter(e => e.data === dataSended)), 
    rxBC3.events.pipe(filter(e => e.data === dataSended)))
    .pipe(first(), map(evts => evts.map(e => e.data))).subscribe((evts) => {
      for (let aux of evts) {
        expect(aux).toBe(dataSended)
      }

      done();
    });

    rxBC1.postMessage(dataSended)
  });
});
