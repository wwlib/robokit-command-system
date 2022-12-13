import { RCSCommand, RCSCommandStatus } from '../factory'

export type CommandExecutorCallback = (command: RCSCommand, status: RCSCommandStatus, completedAtTime: number, message?: string) => void

export default abstract class AbstractCommandExecutor {

    private _id: string

    constructor(id: string) {
        this._id = id
    }

    get id(): string {
        return this._id
    }

    abstract executeCommand(command: RCSCommand, callback: CommandExecutorCallback): void   
}