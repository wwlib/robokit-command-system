const { SynchronizedClock, TimeData } = require('../lib')

// console.log(SynchronizedClock)

const clock = new SynchronizedClock()
const offset = 25
clock.onSyncOffsetChanged(offset)

console.log(new Date().getTime(), clock.synchronizedTime)

clock.startUpdate()
clock.on('1sec', (timeData) => {
    console.log(`1sec: ${timeData.synchronized} ${timeData.syncOffset} ${timeData.simpleFormat} -- ${timeData.string}`)
})
// clock.on('100ms', (timeData) => {
//     console.log(`100ms: ${timeData.synchronized} ${timeData.syncOffset} ${timeData.simpleFormat} -- ${timeData.string}`)
// })
