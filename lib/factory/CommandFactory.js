"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RCSHubCommandName = exports.RCSCommandName = exports.RCSCommandStatus = exports.RCSCommandType = void 0;
const events_1 = require("events");
const uuid_1 = require("uuid");
var RCSCommandType;
(function (RCSCommandType) {
    RCSCommandType["message"] = "message";
    RCSCommandType["command"] = "command";
    RCSCommandType["hubCommand"] = "hubCommand";
    RCSCommandType["event"] = "event";
    RCSCommandType["ack"] = "ack";
    RCSCommandType["sync"] = "sync";
    RCSCommandType["notification"] = "notification";
})(RCSCommandType = exports.RCSCommandType || (exports.RCSCommandType = {}));
var RCSCommandStatus;
(function (RCSCommandStatus) {
    RCSCommandStatus["OK"] = "OK";
    RCSCommandStatus["NOK"] = "NOK";
    RCSCommandStatus["unimplemented"] = "unimplemented";
})(RCSCommandStatus = exports.RCSCommandStatus || (exports.RCSCommandStatus = {}));
var RCSCommandName;
(function (RCSCommandName) {
    RCSCommandName["play"] = "play";
    RCSCommandName["syncOffset"] = "syncOffset";
    RCSCommandName["notification"] = "notification";
    RCSCommandName["asrSOS"] = "asrSOS";
    RCSCommandName["asrEOS"] = "asrEOS";
    RCSCommandName["asrResult"] = "asrResult";
    RCSCommandName["asrEnded"] = "asrEnded";
})(RCSCommandName = exports.RCSCommandName || (exports.RCSCommandName = {}));
var RCSHubCommandName;
(function (RCSHubCommandName) {
    RCSHubCommandName["subscribe"] = "subscribe";
    RCSHubCommandName["unsubscribe"] = "unsubscribe";
    RCSHubCommandName["stats"] = "stats";
})(RCSHubCommandName = exports.RCSHubCommandName || (exports.RCSHubCommandName = {}));
class CommandFactory extends events_1.EventEmitter {
    constructor() {
        super();
        this.createCommand = ((data, targetAccountId, registerCommand = true) => {
            const command = {
                id: uuid_1.v4(),
                targetAccountId,
                type: data.type,
                name: 'tbd',
                createdAtTime: new Date().getTime(),
                ackReceivedAtTime: 0,
            };
            switch (data.type) {
                case 'command':
                    command.name = data.name;
                    command.payload = data.payload || {};
                    break;
            }
            if (registerCommand) {
                this._pendingCommandMap.set(command.id, command);
            }
            return command;
        });
        this._pendingCommandMap = new Map();
    }
    static getInstance() {
        if (!CommandFactory._instance) {
            CommandFactory._instance = new CommandFactory();
        }
        return CommandFactory._instance;
    }
    createPlayPromptCommand(prompt, targetAccountId, registerCommand = true) {
        const data = {
            type: RCSCommandType.command,
            name: RCSCommandName.play,
            payload: {
                prompt: prompt,
            }
        };
        return this.createCommand(data, targetAccountId, registerCommand);
    }
    createPlayMidiNoteCommand(note, channel, volume, startAtTime, targetAccountId, registerCommand = true) {
        const data = {
            type: RCSCommandType.command,
            name: RCSCommandName.play,
            payload: {
                midi: {
                    note,
                    channel,
                    volume,
                    startAtTime
                }
            }
        };
        return this.createCommand(data, targetAccountId, registerCommand);
    }
    createPlayMidiFileCommand(filename, channelsToPlay, startAtTime, targetAccountId, registerCommand = true) {
        const data = {
            type: RCSCommandType.command,
            name: RCSCommandName.play,
            payload: {
                midi: {
                    filename,
                    channelsToPlay,
                    startAtTime
                }
            }
        };
        return this.createCommand(data, targetAccountId, registerCommand);
    }
    getPendingCommandWithId(id) {
        return this._pendingCommandMap.get(id);
    }
    onCommandAck(ack) {
        const command = this.getPendingCommandWithId(ack.id);
        if (command) {
            command.ackReceivedAtTime = new Date().getTime();
            ack.command = command;
            this._pendingCommandMap.delete(ack.id);
        }
        else {
            throw new Error('Ack error. Command not found');
        }
        this.emit('commandAck', ack);
    }
}
exports.default = CommandFactory;
//# sourceMappingURL=CommandFactory.js.map