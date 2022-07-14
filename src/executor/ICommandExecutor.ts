import { RCSCommand, RCSCommandStatus } from '../factory'

export type CommandExecutorCallback = (command: RCSCommand, status: RCSCommandStatus, completedAtTime: number, message?: string) => void

export default abstract class ICommandExecutor {

    constructor() {
    }

    abstract executeCommand(command: RCSCommand, callback: CommandExecutorCallback): void   
}