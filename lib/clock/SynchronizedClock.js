"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class SynchronizedClock extends events_1.EventEmitter {
    constructor() {
        super();
        this.dateSimpleFormat = (date) => {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const ms = date.getMilliseconds();
            return `${hours}:${minutes}:${seconds}.${ms}`;
        };
        this._syncOffset = 0;
        this._receivedLastSynchOffsetAtTime = 0;
        this._receivedLastSynchOffsetChangeAtTime = 0;
        this._last1SecUpdateTime = 0;
        this._last100MsUpdateTime = 0;
    }
    get localTime() {
        return new Date().getTime();
    }
    get synchronizedTime() {
        return this.localTime + this._syncOffset;
    }
    get lastSynchOffsetAtTime() {
        return this._receivedLastSynchOffsetAtTime;
    }
    get lastSynchOffsetChangeAtTime() {
        return this._receivedLastSynchOffsetChangeAtTime;
    }
    set syncOffest(offset) {
        this._syncOffset = offset;
        this._receivedLastSynchOffsetAtTime = this.synchronizedTime;
    }
    onSyncOffsetChanged(offset) {
        this.syncOffest = offset;
        this._receivedLastSynchOffsetChangeAtTime = this.synchronizedTime;
    }
    synchronizedTimeData() {
        const date = new Date(this.synchronizedTime);
        return {
            local: this.localTime,
            syncOffset: this._syncOffset,
            synchronized: this.synchronizedTime,
            string: date.toString(),
            simpleFormat: this.dateSimpleFormat(date)
        };
    }
    startUpdate() {
        this._updateInterval = setInterval(() => {
            if (this.synchronizedTime - this._last1SecUpdateTime >= 1000) {
                this.emit('1sec', this.synchronizedTimeData());
                const delta1Sec = this.synchronizedTime % 1000;
                this._last1SecUpdateTime = this.synchronizedTime - delta1Sec; // update at exactly 1sec
            }
            if (this.synchronizedTime - this._last100MsUpdateTime >= 100) {
                this.emit('100ms', this.synchronizedTimeData());
                const delta100ms = this.synchronizedTime % 100;
                this._last100MsUpdateTime = this.synchronizedTime - delta100ms; // update at exactly 100ms
            }
            this.emit('update', this.synchronizedTimeData());
        }, 1);
    }
    stopUpdate() {
        if (this._updateInterval) {
            clearInterval(this._updateInterval);
            this._updateInterval = undefined;
        }
    }
    dispose() {
        this.stopUpdate();
        this.removeAllListeners();
    }
}
exports.default = SynchronizedClock;
//# sourceMappingURL=SynchronizedClock.js.map