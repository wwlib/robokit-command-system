const { expect } = require('@jest/globals');
const { DefaultCommandExecutor } = require('../lib/index.js');
const { CommandFactory, RCSCommandType, RCSCommandStatus } = require('../lib/index.js');

// console.log(`DefaultCommandExecutor:`, DefaultCommandExecutor);

test('DefaultCommandExecutor is defined', () => {
    expect(DefaultCommandExecutor).toBeDefined();
});

test('DefaultCommandExecutor returns unimplemented for invalid command', () => {
    const commandData = {
        id: '',
        type: RCSCommandType.command,
        name: 'fake-command',
        payload: {}
    }
    const command = CommandFactory.getInstance().createCommand(commandData, 'fake-acccount-id', new Date().getTime())
    expect(command).toBeDefined()
    expect(command.name).toBe('fake-command')
    expect(command.createdAtTime).toBeGreaterThan(0)

    const executor = new DefaultCommandExecutor()
    executor.executeCommand(command, (command, status, message) => {
        // console.log('callback:', status, message)
        expect(status).toBe(RCSCommandStatus.unimplemented)
    })
});