/// <reference types="node" />
import { EventEmitter } from "events";
export interface TimeData {
    local: number;
    syncOffset: number;
    synchronized: number;
    string: string;
    simpleFormat: string;
}
export default class SynchronizedClock extends EventEmitter {
    private _syncOffset;
    private _receivedLastSynchOffsetAtTime;
    private _receivedLastSynchOffsetChangeAtTime;
    private _updateInterval;
    private _last1SecUpdateTime;
    private _last100MsUpdateTime;
    constructor();
    get localTime(): number;
    get synchronizedTime(): number;
    get lastSynchOffsetAtTime(): number;
    get lastSynchOffsetChangeAtTime(): number;
    set syncOffest(offset: number);
    onSyncOffsetChanged(offset: number): void;
    private dateSimpleFormat;
    synchronizedTimeData(): TimeData;
    startUpdate(): void;
    stopUpdate(): void;
    dispose(): void;
}
