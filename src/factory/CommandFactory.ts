import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export enum RCSCommandType {
    message = 'message',
    command = 'command',
    hubCommand = 'hubCommand',
    event = 'event',
    ack = 'ack',
    sync = 'sync',
    notification = 'notification',
}

export enum RCSCommandStatus {
    OK = 'OK',
    NOK = 'NOK',
    unimplemented = 'unimplemented',
}

export enum RCSCommandName {
    play = 'play',
    syncOffset = 'syncOffset',
    notification = 'notification',
    asrSOS = 'asrSOS',
    asrEOS = 'asrEOS',
    asrResult = 'asrResult',
    asrEnded = 'asrEnded',
    subscribe = 'subscribe',
    getBase64Photo = 'getBase64Photo',
}

export enum RCSHubCommandName {
    subscribe = 'subscribe',
    unsubscribe = 'unsubscribe',
    stats = 'stats',
}

export interface RCSCommand {
    id: string
    source: string
    targetAccountId: string // accountId of targeted device/app
    type: RCSCommandType
    message?: string
    name: RCSCommandName | RCSHubCommandName | string // added string to allow flexibility during development
    status?: RCSCommandStatus
    payload?: any
    createdAtTime: number
    processedAtTime?: number
    ackReceivedAtTime?: number
}

export interface RCSCommandAck {
    id: string
    source: string
    targetAccountId: string // accountId of targeted device/app
    type: RCSCommandType.ack
    status: RCSCommandStatus
    createdAtTime: number
    processedAtTime: number
    completedAtTime: number
    command?: RCSCommand
    message?: string
}

export default class CommandFactory extends EventEmitter {

    private static _instance: CommandFactory;

    private _pendingCommandMap: Map<string, RCSCommand>

    private constructor() {
        super()
        this._pendingCommandMap = new Map<string, RCSCommand>()
    }

    public static getInstance(): CommandFactory {
        if (!CommandFactory._instance) {
            CommandFactory._instance = new CommandFactory()
        }
        return CommandFactory._instance
    }

    createCommand = ((data: any, source: string, targetAccountId: string, createdAtTime?: number, registerCommand: boolean = true): RCSCommand => {
        const command: RCSCommand = {
            id: uuidv4(),
            source: source,
            targetAccountId,
            type: data.type,
            message: data.message,
            name: data.name || 'tbd',
            status: data.status,
            payload: data.payload,
            createdAtTime: createdAtTime || 0,
            ackReceivedAtTime: 0,
        }

        switch (data.type) {
            case 'command':
                command.name = data.name
                command.payload = data.payload || {}
                break;
        }
        if (registerCommand) {
            this._pendingCommandMap.set(command.id, command)
        }
        return command
    })

    createPlayPromptCommand(prompt: string, source: string, targetAccountId: string, createdAtTime?: number, registerCommand: boolean = true): RCSCommand {
        const data = {
            type: RCSCommandType.command,
            name: RCSCommandName.play,
            payload: {
                prompt: prompt,
            }
        }
        return this.createCommand(data, source, targetAccountId, createdAtTime, registerCommand)
    }

    createPlayMidiNoteCommand(note: number, channel: number, volume: number, startAtTime: number, source: string, targetAccountId: string, createdAtTime?: number, registerCommand: boolean = true): RCSCommand {
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
        }
        return this.createCommand(data, source, targetAccountId, createdAtTime, registerCommand)
    }

    createPlayMidiFileCommand(filename: string, channelsToPlay: number[] | undefined, startAtTime: number, source: string, targetAccountId: string, createdAtTime?: number, registerCommand: boolean = true): RCSCommand {
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
        }
        return this.createCommand(data, source, targetAccountId, createdAtTime, registerCommand)
    }

    getPendingCommandWithId(id: string): RCSCommand | undefined {
        return this._pendingCommandMap.get(id)
    }

    deletePendingCommandWithId(id: string): boolean {
        return this._pendingCommandMap.delete(id)
    }

    matchPendingCommandWithId(id: string, deletePendingCommand: boolean = true) {
        const command = this.getPendingCommandWithId(id)
        if (deletePendingCommand) {
            this.deletePendingCommandWithId(id)
        }
        return command
    }
}


