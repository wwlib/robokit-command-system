"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../factory");
const AbstractCommandExecutor_1 = require("./AbstractCommandExecutor");
class CommandExecutor extends AbstractCommandExecutor_1.default {
    executeCommand(command, callback) {
        // console.log(`CommandExecutor: executeCommand: ${command.name}, ${command.id}`)
        switch (command.name) {
            case factory_1.RCSCommandName.play:
                // mock, temp
                setTimeout(() => {
                    callback(command, factory_1.RCSCommandStatus.OK, 0);
                }, 1200);
                break;
            default:
                callback(command, factory_1.RCSCommandStatus.unimplemented, 0, `Command ${command.name} unimplemented.`);
                break;
        }
    }
}
exports.default = CommandExecutor;
//# sourceMappingURL=DefaultCommandExecutor.js.map