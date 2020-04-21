import chalk from 'chalk';
import Commander from './commander';

describe('Commander', () => {
  let commander;
  const spawnSync = jest.fn();
  const log = jest.fn();

  beforeEach(() => {
    spawnSync.mockClear();
    log.mockClear();
    commander = new Commander({ spawnSync, log });
  });

  it('should create an instance with no args', () => {
    commander = new Commander();

    commander.spawnSync();
    commander.log();

    expect(typeof commander.spawnSync).toBe('function');
    expect(typeof commander.log).toBe('function');
  });

  it('should run commands', () => {
    commander._runCommand = jest.fn();

    const commands = ['command 1', 'command 2', 'command 3'];

    commander.run(commands);

    for (const [index, command] of commands.entries()) {
      expect(commander._runCommand).nthCalledWith(index + 1, command);
    }
  });

  it('should run one command', () => {
    commander._runCommand = jest.fn();

    const command = 'some command';
    commander.run(command);

    expect(commander._runCommand).toBeCalledWith(command);
  });

  it('should _runCommand', () => {
    const command = 'some command';
    const main = 'main';
    const args = 'args';

    commander._parseCommand = jest
      .fn()
      .mockImplementation((command) => ({ main, args }));
    commander._logCommand = jest.fn();

    commander._runCommand(command);

    expect(commander._parseCommand).toBeCalledWith(command);
    expect(commander._logCommand).toBeCalledWith(main, args);
    expect(spawnSync).toBeCalledWith(main, args);
  });

  it('should parse a string command', () => {
    const command = 'some command with args';

    const { main, args } = commander._parseCommand(command);

    expect(main).toBe('some');
    expect(args).toEqual(['command', 'with', 'args']);
  });

  it('should parse an array command', () => {
    const command = ['some', 'command', 'with', 'args'];

    const { main, args } = commander._parseCommand(command);

    expect(main).toBe('some');
    expect(args).toEqual(['command', 'with', 'args']);
  });

  it('should throw error when parse unsupported command type', () => {
    const command = true;

    expect(() => commander._parseCommand(command)).toThrow(TypeError);
  });

  it('should log command', () => {
    const main = 'command';
    const args = ['arg1', 'arg2', 'arg3'];

    commander._logCommand(main, args);

    expect(log).toBeCalledWith(chalk`  {gray ${main} ${args.join(' ')}}`);
  });
});
