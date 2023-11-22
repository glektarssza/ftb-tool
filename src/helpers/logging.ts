import chalk from 'chalk';

/**
 * An enumeration of known logging levels.
 */
export enum LogLevel {
    /**
     * No logging.
     */
    None = 0,

    /**
     * A fatal error message.
     */
    Fatal = 1,

    /**
     * An error message.
     */
    Error = 2,

    /**
     * A warning message.
     */
    Warning = 3,

    /**
     * An informational message.
     */
    Info = 4,

    /**
     * A verbose message.
     */
    Verbose = 5,

    /**
     * A debugging message.
     */
    Debug = 6,

    /**
     * A tracing message.
     */
    Trace = 7,

    /**
     * All logging message.
     */
    All = 8
}

/**
 * A map of logging levels to a descriptor text for them.
 */
export const LogLevelDescriptor: Record<string, string> = {
    None: '',
    Fatal: '[FATAL]',
    Error: '[ERROR]',
    Warning: '[WARN]',
    Info: '[INFO]',
    Verbose: '[VERBOSE]',
    Debug: '[DEBUG]',
    Trace: '[TRACE]',
    All: ''
};

/**
 * A map of logging levels to the color to use for their descriptor text.
 */
export const LogLevelColor: Record<string, chalk.ChalkFunction> = {
    None: chalk.reset,
    Fatal: chalk.bgRed.whiteBright,
    Error: chalk.red,
    Warning: chalk.yellow,
    Info: chalk.reset,
    Verbose: chalk.magenta,
    Debug: chalk.bgBlueBright.whiteBright,
    Trace: chalk.cyanBright,
    All: chalk.reset
};

/**
 * A list of all created loggers.
 */
const ALL_LOGGERS: Logger[] = [];

/**
 * Whether the loggers are operating in verbose mode.
 *
 * Used when creating new loggers to set their default logging level.
 */
let verbose = false;

/**
 * Get whether the loggers are operating in verbose mode.
 *
 * @returns Whether the loggers are operating in verbose mode.
 */
export function getVerbose(): boolean {
    return verbose;
}

/**
 * Set whether the loggers are operating in verbose mode.
 *
 * @param value - The value to set the verbose flag to.
 */
export function setVerbose(value: boolean) {
    verbose = value;
    const level = value ? LogLevel.Verbose : LogLevel.Info;
    //-- Change all existing loggers over
    ALL_LOGGERS.forEach((logger) => (logger.level = level));
}

/**
 * Reset whether the loggers are operating in verbose mode.
 */
export function resetVerbose() {
    setVerbose(false);
}

/**
 * The main logger class.
 */
export class Logger {
    /**
     * The name of the logger.
     */
    public readonly name: string;

    /**
     * The logging level the logger is outputting at.
     */
    public level: LogLevel;

    /**
     * Create a new instance.
     *
     * @param name - The name to give the new instance.
     */
    public constructor(name: string) {
        this.name = name;
        this.level = verbose ? LogLevel.Verbose : LogLevel.Info;
        ALL_LOGGERS.push(this);
    }

    /**
     * Log a message at a given level.
     *
     * @param level - The level to log the message at.
     * @param message - The message to log.
     */
    public log(level: LogLevel, message: string) {
        if (level > this.level) {
            return;
        }
        let levelText = LogLevelDescriptor[LogLevel[level]];
        const colorFunc = LogLevelColor[LogLevel[level]];
        if (colorFunc) {
            levelText = colorFunc(levelText);
        }
        process.stdout.write(`${levelText} [${this.name}] ${message}\n`);
    }

    /**
     * Log a fatal error message.
     *
     * @param message - The message to log.
     */
    public fatal(message: string) {
        this.log(LogLevel.Fatal, message);
    }

    /**
     * Log an error message.
     *
     * @param message - The message to log.
     */
    public error(message: string) {
        this.log(LogLevel.Error, message);
    }

    /**
     * Log a warning message.
     *
     * @param message - The message to log.
     */
    public warn(message: string) {
        this.log(LogLevel.Warning, message);
    }

    /**
     * Log an informational message.
     *
     * @param message - The message to log.
     */
    public info(message: string) {
        this.log(LogLevel.Info, message);
    }

    /**
     * Log a verbose message.
     *
     * @param message - The message to log.
     */
    public verbose(message: string) {
        this.log(LogLevel.Verbose, message);
    }

    /**
     * Log a debugging message.
     *
     * @param message - The message to log.
     */
    public debug(message: string) {
        this.log(LogLevel.Debug, message);
    }

    /**
     * Log a tracing message.
     *
     * @param message - The message to log.
     */
    public trace(message: string) {
        this.log(LogLevel.Trace, message);
    }
}
