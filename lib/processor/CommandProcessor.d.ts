/// <reference types="node" />
import { EventEmitter } from 'events';
import { RCSCommand } from '../factory';
import AbstractCommandExecutor from '../executor/AbstractCommandExecutor';
export default class CommandProcessor extends EventEmitter {
    private static _instance;
    private _commandExecutor;
    private constructor();
    setCommandExecutor(commandExecutor: AbstractCommandExecutor): void;
    static getInstance(): CommandProcessor;
    processCommand(command: RCSCommand, processedAtTime?: number): void;
}
