# robokit-command-system

(draft)

Robokit Command System
- generates/handles remote control commands
- generates/remote skill commands
- manages on-device (on-robot) command execution
- provides a mechanism for synchronizing execution with other devices (robots), controllers, apps

CommandFactory (controller)
- generates JSON protocol
- assigns transaction IDs
- maintains transaction id database
- handles/matches/recognizes ACK messages

CommandProcessor (device)
- receives commands
- invokes CommandExecutor
- generates ACK response on completed

CommandExecutor (device)
- executes commands
- proposed: entity component system

SynchronizedClock
- provides a clock that can be syncronized with a server
