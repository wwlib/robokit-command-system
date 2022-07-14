/// <reference types="node" />
import { EventEmitter } from 'events';
import { RCSCommand } from '../factory';
import ICommandExecutor from '../executor/ICommandExecutor';
export default class CommandProcessor extends EventEmitter {
    private static _instance;
    private _commandExecutor;
    private constructor();
    setCommandExecutor(commandExecutor: ICommandExecutor): void;
    static getInstance(): CommandProcessor;
    processCommand(command: RCSCommand, processedAtTime?: number): void;
}
