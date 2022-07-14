"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const factory_1 = require("../factory");
const DefaultCommandExecutor_1 = require("../executor/DefaultCommandExecutor");
class CommandProcessor extends events_1.EventEmitter {
    constructor() {
        super();
        this._commandExecutor = new DefaultCommandExecutor_1.default();
    }
    setCommandExecutor(commandExecutor) {
        this._commandExecutor = commandExecutor;
    }
    static getInstance() {
        if (!CommandProcessor._instance) {
            CommandProcessor._instance = new CommandProcessor();
        }
        return CommandProcessor._instance;
    }
    processCommand(command, processedAtTime = 0) {
        this._commandExecutor.executeCommand(command, (command, status, completedAtTime, message) => {
            const pendingCommand = factory_1.CommandFactory.getInstance().matchPendingCommandWithId(command.id); // this._pendingCommandMap.get(command.id)
            if (pendingCommand && pendingCommand.id === command.id) {
                const commandAck = {
                    id: command.id,
                    targetAccountId: pendingCommand.targetAccountId,
                    type: factory_1.RCSCommandType.ack,
                    status: status,
                    createdAtTime: pendingCommand.createdAtTime || 0,
                    processedAtTime: processedAtTime,
                    completedAtTime: completedAtTime || 0,
                    message: message,
                };
                this.emit('commandCompleted', commandAck);
            }
            else {
                console.log(`processCommand: on completed - pending command not found. Ignoring.`);
            }
        });
    }
}
exports.default = CommandProcessor;
//# sourceMappingURL=CommandProcessor.js.map