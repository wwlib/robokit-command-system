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
    asrEnded = "asrEnded"
}
export declare enum RCSHubCommandName {
    subscribe = "subscribe",
    unsubscribe = "unsubscribe",
    stats = "stats"
}
export interface RCSCommand {
    id: string;
    targetAccountId: string;
    type: RCSCommandType;
    message?: string;
    name: RCSCommandName | RCSHubCommandName | string;
    status?: RCSCommandStatus;
    payload?: any;
    createdAtTime: number;
    ackReceivedAtTime?: number;
}
export interface RCSCommandAck {
    id: string;
    type: RCSCommandType.ack;
    status: RCSCommandStatus;
    commandStartedAtTime: number;
    commandCompletedAtTime: number;
    command?: RCSCommand;
    message?: string;
}
export default class CommandFactory extends EventEmitter {
    private static _instance;
    private _pendingCommandMap;
    private constructor();
    static getInstance(): CommandFactory;
    createCommand: (data: any, targetAccountId: string, registerCommand?: boolean) => RCSCommand;
    createPlayPromptCommand(prompt: string, targetAccountId: string, registerCommand?: boolean): RCSCommand;
    createPlayMidiNoteCommand(note: number, channel: number, startAtTime: number, targetAccountId: string, registerCommand?: boolean): RCSCommand;
    getPendingCommandWithId(id: string): RCSCommand | undefined;
    onCommandAck(ack: RCSCommandAck): void;
}
