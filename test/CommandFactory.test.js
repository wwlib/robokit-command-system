const { expect } = require('@jest/globals');
const { CommandFactory, RCSCommandType, RCSCommandName, RCSCommandStatus } = require('../lib/index.js');

// console.log(`RCSCommandType:`, RCSCommandType);
// console.log(`RCSCommandName:`, RCSCommandName);

test('CommandFactory is defined', () => {
    expect(CommandFactory).toBeDefined();
});

test('createCommand returns valid command', () => {
    const commandData = {
        id: '',
        type: RCSCommandType.command,
        name: RCSCommandName.play,
        payload: {
            media: {
                type: 'midi',
                uri: 'sync-test.mid',
            },
            playAtTime: new Date().getTime() + 1000,
        }
    }
    const command = CommandFactory.getInstance().createCommand(commandData)

    expect(command).toBeDefined()
    expect(command.name).toBe(RCSCommandName.play)
    expect(command.createdAtTime).toBeGreaterThan(0)
});

test('createCommand returns valid PLAY command', () => {
    const command = CommandFactory.getInstance().createPlayPromptCommand('hello, robo.', 'robot_1')
    expect(command).toBeDefined()
    expect(command.name).toBe(RCSCommandName.play)
    expect(command.targetAccountId).toBe('robot_1')
    expect(command.payload.prompt).toBe('hello, robo.')
    expect(command.createdAtTime).toBeGreaterThan(0)
});

test('CommandFactory successfully handles command Ack', () => {
    const commandData = {
        id: '',
        type: RCSCommandType.command,
        name: RCSCommandName.play,
        payload: {
            media: {
                type: 'midi',
                uri: 'sync-test.mid',
            },
            playAtTime: new Date().getTime() + 1000,
        }
    }
    const command = CommandFactory.getInstance().createCommand(commandData)
    expect(command.name).toBe(RCSCommandName.play)
    const pendingCommand = CommandFactory.getInstance().matchPendingCommandWithId(command.id)
    expect(pendingCommand).toBeDefined
    expect(CommandFactory.getInstance().getPendingCommandWithId(command.id)).toBeUndefined
});
