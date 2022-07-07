const { expect } = require('@jest/globals');
const { SynchronizedClock } = require('../lib/index.js');

// console.log(`SynchronizedClock:`, SynchronizedClock);

test('SynchronizedClock is defined', () => {
    expect(SynchronizedClock).toBeDefined();
});

test('SynchronizedClock returns synchronized time', () => {
    const clock = new SynchronizedClock()
    const offset = 25
    clock.onSyncOffsetChanged(offset)
    const localTime = new Date().getTime()
    expect(clock.synchronizedTime).toEqual(localTime - offset)
});