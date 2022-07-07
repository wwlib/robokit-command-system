import { RCSCommand } from '../factory';
import ICommandExecutor, { CommandExecutorCallback } from './ICommandExecutor';
export default class CommandExecutor implements ICommandExecutor {
    constructor();
    executeCommand(command: RCSCommand, callback: CommandExecutorCallback): void;
}
