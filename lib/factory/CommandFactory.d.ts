/// <reference types="node" />
import { EventEmitter } from 'events';
export declare enum RCSCommandType {
    message = "message",
    command = "command",
    hubCommand = "hubCommand",
    event = "event",
    ack = "ack",
    sync = "sync",
    notification = "notification"
}
export declare enum RCSCommandStatus {
    OK = "OK",
    NOK = "NOK",
    unimplemented = "unimplemented"
}
export declare enum RCSCommandName {
    play = "play",
    syncOffset = "syncOffset",
    notification = "notification",
    asrSOS = "asrSOS",
    asrEOS = "asrEOS",
    asrResult = "asrResult",
    asrEnd = "asrEnd",
    subscribe = "subscribe",
    getBase64Photo = "getBase64Photo"
}
export declare enum RCSHubCommandName {
    subscribe = "subscribe",
    unsubscribe = "unsubscribe",
    stats = "stats"
}
export interface RCSCommand {
    id: string;
    source: string;
    targetAccountId: string;
    type: RCSCommandType;
    message?: string;
    name: RCSCommandName | RCSHubCommandName | string;
    status?: RCSCommandStatus;
    payload?: any;
    createdAtTime: number;
    processedAtTime?: number;
    ackReceivedAtTime?: number;
}
export interface RCSCommandAck {
    id: string;
    source: string;
    targetAccountId: string;
    type: RCSCommandType.ack;
    status: RCSCommandStatus;
    createdAtTime: number;
    processedAtTime: number;
    completedAtTime: number;
    command?: RCSCommand;
    message?: string;
}
export default class CommandFactory extends EventEmitter {
    private static _instance;
    private _pendingCommandMap;
    private constructor();
    static getInstance(): CommandFactory;
    createCommand: (data: any, source: string, targetAccountId: string, createdAtTime?: number | undefined, registerCommand?: boolean) => RCSCommand;
    createPlayPromptCommand(prompt: string, source: string, targetAccountId: string, createdAtTime?: number, registerCommand?: boolean): RCSCommand;
    createPlayMidiNoteCommand(note: number, channel: number, volume: number, startAtTime: number, source: string, targetAccountId: string, createdAtTime?: number, registerCommand?: boolean): RCSCommand;
    createPlayMidiFileCommand(filename: string, channelsToPlay: number[] | undefined, startAtTime: number, source: string, targetAccountId: string, createdAtTime?: number, registerCommand?: boolean): RCSCommand;
    getPendingCommandWithId(id: string): RCSCommand | undefined;
    deletePendingCommandWithId(id: string): boolean;
    matchPendingCommandWithId(id: string, deletePendingCommand?: boolean): RCSCommand | undefined;
}
