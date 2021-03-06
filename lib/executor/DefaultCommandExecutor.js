"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("../factory");
class CommandExecutor {
    constructor() {
    }
    executeCommand(command, callback) {
        // console.log(`CommandExecutor: executeCommand: ${command.name}, ${command.id}`)
        switch (command.name) {
            case factory_1.RCSCommandName.play:
                // mock, temp
                setTimeout(() => {
                    callback(command, factory_1.RCSCommandStatus.OK);
                }, 1200);
                break;
            default:
                callback(command, factory_1.RCSCommandStatus.unimplemented, `Command ${command.name} unimplemented.`);
                break;
        }
    }
}
exports.default = CommandExecutor;
//# sourceMappingURL=DefaultCommandExecutor.js.map