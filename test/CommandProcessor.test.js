const { expect } = require('@jest/globals');
const { CommandProcessor } = require('../lib/index.js');
const { CommandFactory, RCSCommandType, RCSCommandStatus, RCSCommandAck } = require('../lib/index.js');

// console.log(`CommandProcessor:`, CommandProcessor);

// see: https://www.jackfranklin.co.uk/blog/testing-event-listeners-javascript/
//      https://ilikekillnerds.com/2020/02/testing-event-listeners-in-jest-without-using-a-library/

test('CommandProcessor is defined', () => {
    expect(CommandProcessor).toBeDefined();
});

test('CommandExecutor returns unimplemented for invalid command', () => {
    const handler = jest.fn((commandAck) => {
        // console.log('on commandCompleted', commandAck)
        expect(commandAck.status).toBe(RCSCommandStatus.unimplemented)
        CommandFactory.getInstance().matchPendingCommandWithId(commandAck.id)
        expect(CommandFactory.getInstance().getPendingCommandWithId(commandAck.id)).toBeUndefined()
    });

    CommandProcessor.getInstance().on('commandCompleted', handler)
    const commandData = {
        id: '',
        type: RCSCommandType.command,
        name: 'fake-command',
        payload: {}
    }
    const command = CommandFactory.getInstance().createCommand(commandData, 'fake-account-id', new Date().getTime())
    expect(command).toBeDefined()
    expect(command.name).toBe('fake-command')
    expect(command.targetAccountId).toBe('fake-account-id')
    expect(command.createdAtTime).toBeGreaterThan(0)

    CommandProcessor.getInstance().processCommand(command)

    expect(handler).toBeCalledTimes(1)
    // expect(handler).toBeCalledWith({
    //     status: RCSCommandStatus.unimplemented,
    // })
});