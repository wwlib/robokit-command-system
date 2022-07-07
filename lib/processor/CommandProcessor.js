"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const factory_1 = require("../factory");
const DefaultCommandExecutor_1 = require("../executor/DefaultCommandExecutor");
class CommandProcessor extends events_1.EventEmitter {
    constructor() {
        super();
        this._pendingCommandMap = new Map();
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
    getPendingCommandDataWithId(id) {
        return this._pendingCommandMap.get(id);
    }
    processCommand(command) {
        const startTime = new Date().getTime();
        this._pendingCommandMap.set(command.id, { startTime, command });
        this._commandExecutor.executeCommand(command, (command, status, message) => {
            const commandData = this._pendingCommandMap.get(command.id);
            this._pendingCommandMap.delete(command.id);
            const commandAck = {
                id: command.id,
                type: factory_1.RCSCommandType.ack,
                status: status,
                commandStartedAtTime: commandData ? commandData.startTime : 0,
                commandCompletedAtTime: new Date().getTime(),
                message: message,
            };
            this.emit('commandCompleted', commandAck);
        });
    }
}
exports.default = CommandProcessor;
//# sourceMappingURL=CommandProcessor.js.map