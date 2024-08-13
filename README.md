## INSTALLATION

**With npm:**

```typescript
npm install --save @rxjs-toolkit/broadcast-channel
```

## EXAMPLES

```typescript
import { RxBroadcastChannel } from '@rxjs-toolkit/broadcast-channel';

let window1 = new RxBroadcastChannel('channelName');

window1.events.subscribe((msg: any) => {
	console.log('message', msg);
});
```

```typescript
import { RxBroadcastChannel } from '@rxjs-toolkit/broadcast-channel';

let window2 = new RxBroadcastChannel('channelName');

window2.postMessage('Hello message');
```

## CONTRIBUTING

We'd love for you to contribute to our source code! We just ask to:

- Write tests for the new feature or bug fix that you are solving
- Ensure all tests pass before send the pull-request (Use: `npm test`)
- Pull requests will not be merged if:
  - has not unit tests
  - reduce the code coverage
  - not passing in the `npm test` task

## LICENSE

Copyright (c) 2024 Lucas Dornelas

Licensed under the MIT license.
