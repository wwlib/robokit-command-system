import { EventEmitter } from 'events';
import { RCSCommand, RCSCommandStatus, RCSCommandAck, RCSCommandType } from '../factory'
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
            const commandAck: RCSCommandAck = {
                id: command.id,
                source: command.source,
                targetAccountId: command.targetAccountId,
                type: RCSCommandType.ack,
                status: status,
                createdAtTime: command.createdAtTime || 0,
                processedAtTime: processedAtTime,
                completedAtTime: completedAtTime || 0,
                message: message,
            }
            this.emit('commandCompleted', commandAck)
        })
    }
}
