import { RCSCommand, RCSCommandStatus } from '../factory';
export declare type CommandExecutorCallback = (command: RCSCommand, status: RCSCommandStatus, message?: string) => void;
export default abstract class ICommandExecutor {
    constructor();
    abstract executeCommand(command: RCSCommand, callback: CommandExecutorCallback): void;
}
