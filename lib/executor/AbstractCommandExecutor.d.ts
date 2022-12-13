import { RCSCommand, RCSCommandStatus } from '../factory';
export declare type CommandExecutorCallback = (command: RCSCommand, status: RCSCommandStatus, completedAtTime: number, message?: string) => void;
export default abstract class AbstractCommandExecutor {
    private _id;
    constructor(id: string);
    get id(): string;
    abstract executeCommand(command: RCSCommand, callback: CommandExecutorCallback): void;
}
