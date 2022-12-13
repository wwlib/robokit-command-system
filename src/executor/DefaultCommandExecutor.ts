import { RCSCommand, RCSCommandName, RCSCommandStatus } from '../factory'
import AbstractCommandExecutor, { CommandExecutorCallback } from './AbstractCommandExecutor';

export default class CommandExecutor extends AbstractCommandExecutor {

    executeCommand(command: RCSCommand, callback: CommandExecutorCallback) {
        // console.log(`CommandExecutor: executeCommand: ${command.name}, ${command.id}`)
        switch (command.name) {
            case RCSCommandName.play:
                // mock, temp
                setTimeout(() => {
                    callback(command, RCSCommandStatus.OK, 0)
                }, 1200)
                break;
            default:
                callback(command, RCSCommandStatus.unimplemented, 0, `Command ${command.name} unimplemented.`)
                break;
        }
        
    }
}