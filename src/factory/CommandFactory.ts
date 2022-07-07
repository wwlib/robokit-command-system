import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';


export enum RCSCommandType {
    message = 'message',
    command = 'command',
    hubCommand = 'hubCommand',
    event = 'event',
    ack = 'ack',
    sync = 'sync',
}

export enum RCSCommandStatus {
    OK = 'OK',
    NOK = 'NOK',
    unimplemented = 'unimplemented',
}

export enum RCSCommandName {
    play = 'play',
    syncOffset = 'syncOffset',
}

export enum RCSHubCommandName {
    play = 'subscribe'
}

export interface RCSCommand {
    id: string
    targetAccountId: string // accountId of targeted device/app
    type: RCSCommandType
    message?: string
    name?: RCSCommandName | RCSHubCommandName
    status?: RCSCommandStatus
    payload?: any
    createdAtTime: number
    ackReceivedAtTime: number
}

export interface RCSCommandAck {
    id: string
    type: RCSCommandType.ack
    status: RCSCommandStatus
    commandStartedAtTime: number
    commandCompletedAtTime: number
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

    createCommand = ((data: any, targetAccountId: string): RCSCommand => {
        const command: RCSCommand = {
            id: uuidv4(),
            targetAccountId,
            type: data.type,
            createdAtTime: new Date().getTime(),
            ackReceivedAtTime: 0,
        }

        switch (data.type) {
            case 'command':
                command.name = data.name
                command.payload = data.payload || {}
                break;
        }

        this._pendingCommandMap.set(command.id, command)
        return command
    })

    createPlayPromptCommand(prompt: string, targetAccountId: string): RCSCommand {
        const data = {
            type: RCSCommandType.command,
            name: RCSCommandName.play,
            payload: {
                prompt: prompt,
            }
        }
        return this.createCommand(data, targetAccountId)
    }

    createPlayMidiNoteCommand(note: number, channel: number, startAtTime: number, targetAccountId: string): RCSCommand {
        const data = {
            type: RCSCommandType.command,
            name: RCSCommandName.play,
            payload: {
                midi: {
                    note,
                    channel,
                    startAtTime
                }
            }
        }
        return this.createCommand(data, targetAccountId)
    }

    getPendingCommandWithId(id: string): RCSCommand | undefined {
        return this._pendingCommandMap.get(id)
    }

    onCommandAck(ack: RCSCommandAck) {
        const command = this.getPendingCommandWithId(ack.id)
        if (command) {
            command.ackReceivedAtTime = new Date().getTime()
            ack.command = command
            this._pendingCommandMap.delete(ack.id)
        } else {
            throw new Error('Ack error. Command not found')
        }
        this.emit('commandAck', ack)
    }
}


