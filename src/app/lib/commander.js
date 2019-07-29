import chalk from 'chalk';

const noop = () => undefined;

class Commander {
  /**
   * Commander will run you spawnSync commands
   * @param {Function} spawnSync function to run you commands with, required
   * @param {Function} log       function to log you commands with
   */
  constructor({ spawnSync = noop, log = noop } = {}) {
    this.spawnSync = spawnSync;
    this.log = log;
  }

  /**
   * Run commands
   * @param  {Array}  [commands] array of string commands
   */
  run(commands) {
    if (typeof commands === 'string') {
      commands = [commands];
    }

    for (const command of commands) {
      this._runCommand(command);
    }
  }

  _runCommand(command) {
    const { main, args } = this._parseCommand(command);

    this._logCommand(main, args);
    this.spawnSync(main, args);
  }

  _parseCommand(command) {
    let main;
    let args;

    if (typeof command === 'string') {
      [main, ...args] = command.split(' ');
    } else if (Array.isArray(command)) {
      [main, ...args] = command;
    } else {
      throw new TypeError(
        `Unsupported command type (${typeof command}): ${command}`
      );
    }

    return { main, args };
  }

  _logCommand(main, args) {
    this.log(chalk`  {gray ${main} ${args.join(' ')}}`);
  }
}

export default Commander;
