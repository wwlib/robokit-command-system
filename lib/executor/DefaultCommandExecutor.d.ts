import { RCSCommand } from '../factory';
import AbstractCommandExecutor, { CommandExecutorCallback } from './AbstractCommandExecutor';
export default class CommandExecutor extends AbstractCommandExecutor {
    executeCommand(command: RCSCommand, callback: CommandExecutorCallback): void;
}
