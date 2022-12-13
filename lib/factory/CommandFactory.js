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
    RCSCommandName["subscribe"] = "subscribe";
    RCSCommandName["getBase64Photo"] = "getBase64Photo";
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
        this.createCommand = ((data, source, targetAccountId, createdAtTime, registerCommand = true) => {
            const command = {
                id: uuid_1.v4(),
                source: source,
                targetAccountId,
                type: data.type,
                name: data.name || 'tbd',
                createdAtTime: createdAtTime || 0,
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
    createPlayPromptCommand(prompt, source, targetAccountId, createdAtTime, registerCommand = true) {
        const data = {
            type: RCSCommandType.command,
            name: RCSCommandName.play,
            payload: {
                prompt: prompt,
            }
        };
        return this.createCommand(data, source, targetAccountId, createdAtTime, registerCommand);
    }
    createPlayMidiNoteCommand(note, channel, volume, startAtTime, source, targetAccountId, createdAtTime, registerCommand = true) {
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
        return this.createCommand(data, source, targetAccountId, createdAtTime, registerCommand);
    }
    createPlayMidiFileCommand(filename, channelsToPlay, startAtTime, source, targetAccountId, createdAtTime, registerCommand = true) {
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
        return this.createCommand(data, source, targetAccountId, createdAtTime, registerCommand);
    }
    getPendingCommandWithId(id) {
        return this._pendingCommandMap.get(id);
    }
    deletePendingCommandWithId(id) {
        return this._pendingCommandMap.delete(id);
    }
    matchPendingCommandWithId(id, deletePendingCommand = true) {
        const command = this.getPendingCommandWithId(id);
        if (deletePendingCommand) {
            this.deletePendingCommandWithId(id);
        }
        return command;
    }
}
exports.default = CommandFactory;
//# sourceMappingURL=CommandFactory.js.map