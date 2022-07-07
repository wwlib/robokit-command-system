import { EventEmitter } from 'events';
import {RCSCommand, RCSCommandStatus, RCSCommandAck, RCSCommandType } from '../factory'
import DefaultCommandExecutor from '../executor/DefaultCommandExecutor';
import ICommandExecutor from '../executor/ICommandExecutor';


export default class CommandProcessor extends EventEmitter {
    private static _instance: CommandProcessor;

    private _pendingCommandMap: Map<string, { startTime: number, command: RCSCommand }>
    private _commandExecutor: ICommandExecutor

    private constructor() {
        super()
        this._pendingCommandMap = new Map<string, { startTime: number, command: RCSCommand }>()
        this._commandExecutor = new DefaultCommandExecutor()
    }

    setCommandExecutor(commandExecutor: ICommandExecutor) {
        this._commandExecutor = commandExecutor
    }

    public static getInstance(): CommandProcessor {
        if (!CommandProcessor._instance) {
            CommandProcessor._instance = new CommandProcessor()
        }
        return CommandProcessor._instance
    }

    getPendingCommandDataWithId(id: string): { startTime: number, command: RCSCommand } | undefined {
        return this._pendingCommandMap.get(id)
    }

    processCommand(command: RCSCommand) {
        const startTime = new Date().getTime()
        this._pendingCommandMap.set(command.id, { startTime, command })
        this._commandExecutor.executeCommand(command, (command: RCSCommand, status: RCSCommandStatus, message?: string) => {
            const commandData = this._pendingCommandMap.get(command.id)
            this._pendingCommandMap.delete(command.id)
            const commandAck: RCSCommandAck = {
                id: command.id,
                type: RCSCommandType.ack,
                status: status,
                commandStartedAtTime: commandData ? commandData.startTime : 0,
                commandCompletedAtTime: new Date().getTime(),
                message: message,
            }
            this.emit('commandCompleted', commandAck)
        })
    }
}
