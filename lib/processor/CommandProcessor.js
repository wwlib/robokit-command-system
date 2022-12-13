"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const factory_1 = require("../factory");
const DefaultCommandExecutor_1 = require("../executor/DefaultCommandExecutor");
class CommandProcessor extends events_1.EventEmitter {
    constructor() {
        super();
        this._commandExecutor = new DefaultCommandExecutor_1.default('DEFAULT_COMMAND_EXECUTOR');
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
            const commandAck = {
                id: command.id,
                source: command.source,
                targetAccountId: command.targetAccountId,
                type: factory_1.RCSCommandType.ack,
                status: status,
                createdAtTime: command.createdAtTime || 0,
                processedAtTime: processedAtTime,
                completedAtTime: completedAtTime || 0,
                message: message,
            };
            this.emit('commandCompleted', commandAck);
        });
    }
}
exports.default = CommandProcessor;
//# sourceMappingURL=CommandProcessor.js.map