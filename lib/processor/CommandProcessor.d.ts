/// <reference types="node" />
import { EventEmitter } from 'events';
import { RCSCommand } from '../factory';
import ICommandExecutor from '../executor/ICommandExecutor';
export default class CommandProcessor extends EventEmitter {
    private static _instance;
    private _pendingCommandMap;
    private _commandExecutor;
    private constructor();
    setCommandExecutor(commandExecutor: ICommandExecutor): void;
    static getInstance(): CommandProcessor;
    getPendingCommandDataWithId(id: string): {
        startTime: number;
        command: RCSCommand;
    } | undefined;
    processCommand(command: RCSCommand): void;
}
