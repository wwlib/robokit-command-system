import { EventEmitter } from 'events';
import {RCSCommand, RCSCommandStatus, RCSCommandAck, RCSCommandType, CommandFactory } from '../factory'
import DefaultCommandExecutor from '../executor/DefaultCommandExecutor';
import ICommandExecutor from '../executor/ICommandExecutor';


export default class CommandProcessor extends EventEmitter {
    private static _instance: CommandProcessor;

    private _commandExecutor: ICommandExecutor

    private constructor() {
        super()
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

    processCommand(command: RCSCommand, processedAtTime: number = 0) {
        this._commandExecutor.executeCommand(command, (command: RCSCommand, status: RCSCommandStatus, completedAtTime: number, message?: string) => {
            const pendingCommand = CommandFactory.getInstance().matchPendingCommandWithId(command.id) // this._pendingCommandMap.get(command.id)
            if (pendingCommand && pendingCommand.id === command.id) {
                const commandAck: RCSCommandAck = {
                    id: command.id,
                    targetAccountId: pendingCommand.targetAccountId,
                    type: RCSCommandType.ack,
                    status: status,
                    createdAtTime: pendingCommand.createdAtTime || 0,
                    processedAtTime: processedAtTime,
                    completedAtTime: completedAtTime || 0,
                    message: message,
                }
                this.emit('commandCompleted', commandAck)
            } else {
                console.log(`processCommand: on completed - pending command not found. Ignoring.`)
            }
        })
    }
}
