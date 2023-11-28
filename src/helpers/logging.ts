//-- NodeJS
import {Writable} from 'node:stream';

//-- NPM Packages
import chalk from 'chalk';

//-- Project Code
import {DEFAULT_VERBOSE_LOGGING} from '../constants';

/**
 * A list of all created loggers.
 */
const ALL_LOGGERS: Logger[] = [];

/**
 * Whether the loggers are operating in verbose mode.
 *
 * Used when creating new loggers to set their default logging level.
 */
let verbose = DEFAULT_VERBOSE_LOGGING;

/**
 * An enumeration of known logging levels.
 */
enum LogLevel {
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
const LogLevelDescriptor: Record<string, string | null> = {
    /**
     * The descriptor text for the `None` logging level.
     */
    None: null,

    /**
     * The descriptor text for the `Fatal` logging level.
     */
    Fatal: '[FATAL]',

    /**
     * The descriptor text for the `Error` logging level.
     */
    Error: '[ERROR]',

    /**
     * The descriptor text for the `Warning` logging level.
     */
    Warning: '[WARN]',

    /**
     * The descriptor text for the `Info` logging level.
     */
    Info: '[INFO]',

    /**
     * The descriptor text for the `Verbose` logging level.
     */
    Verbose: '[VERBOSE]',

    /**
     * The descriptor text for the `Debug` logging level.
     */
    Debug: '[DEBUG]',

    /**
     * The descriptor text for the `Trace` logging level.
     */
    Trace: '[TRACE]',

    /**
     * The descriptor text for the `All` logging level.
     */
    All: null
};

/**
 * A map of logging levels to the color function to use for their descriptor
 * text.
 */
const LogLevelColor: Record<string, chalk.ChalkFunction | null> = {
    /**
     * The color function for the `None` logging level.
     */
    None: null,

    /**
     * The color function for the `Fatal` logging level.
     */
    Fatal: chalk.bgRed.whiteBright,

    /**
     * The color function for the `Error` logging level.
     */
    Error: chalk.red,

    /**
     * The color function for the `Warning` logging level.
     */
    Warning: chalk.yellow,

    /**
     * The color function for the `Info` logging level.
     */
    Info: chalk.reset,

    /**
     * The color function for the `Verbose` logging level.
     */
    Verbose: chalk.magenta,

    /**
     * The color function for the `Debug` logging level.
     */
    Debug: chalk.bgBlueBright.whiteBright,

    /**
     * The color function for the `Trace` logging level.
     */
    Trace: chalk.cyanBright,

    /**
     * The color function for the `All` logging level.
     */
    All: null
};

/**
 * The main logger class.
 */
class Logger {
    /**
     * The name of the logger.
     */
    public readonly name: string;

    /**
     * The logging level the logger is outputting at.
     */
    public level: LogLevel;

    /**
     * The stream to write logging output to.
     *
     * Defaults to `process.stdout`.
     */
    public outputStream: Writable;

    /**
     * Create a new instance.
     *
     * @param name - The name to give the new instance.
     * @param outputStream - The stream to write logging output from the new
     * instance to.
     */
    public constructor(name: string, outputStream: Writable = process.stdout) {
        this.name = name;
        this.level = verbose ? LogLevel.Verbose : LogLevel.Info;
        this.outputStream = outputStream;
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
        let levelText = exported.LogLevelDescriptor[exported.LogLevel[level]];
        const colorFunc = exported.LogLevelColor[exported.LogLevel[level]];
        if (typeof levelText === 'string' && typeof colorFunc === 'function') {
            levelText = colorFunc(levelText);
        }
        this.outputStream.write(
            `${typeof levelText === 'string' ? levelText : ''} [${
                this.name
            }] ${message}\n`
        );
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

const exported = {
    /**
     * An enumeration of known logging levels.
     */
    LogLevel,

    /**
     * A map of logging levels to a descriptor text for them.
     */
    LogLevelDescriptor,

    /**
     * A map of logging levels to the color function to use for their descriptor
     * text.
     */
    LogLevelColor,

    /**
     * Get whether the loggers are operating in verbose mode.
     *
     * @returns Whether the loggers are operating in verbose mode.
     */
    getVerbose: (): boolean => {
        return verbose;
    },

    /**
     * Set whether the loggers are operating in verbose mode.
     *
     * @param value - The value to set the verbose flag to.
     */
    setVerbose: (value: boolean) => {
        verbose = value;
        const level = value ? LogLevel.Verbose : LogLevel.Info;
        //-- Change all existing loggers over
        ALL_LOGGERS.forEach((logger) => (logger.level = level));
    },

    /**
     * Reset whether the loggers are operating in verbose mode.
     */
    resetVerbose: () => {
        exported.setVerbose(DEFAULT_VERBOSE_LOGGING);
    },

    /**
     * Get a shallow copy of the list of all loggers.
     *
     * @returns A shallow copy of the list of all loggers.
     */
    getAllLoggers: (): Logger[] => {
        return ALL_LOGGERS.slice();
    },

    /**
     * Clear the internal list of all loggers.
     */
    clearAllLoggers: () => {
        ALL_LOGGERS.length = 0;
    },

    /**
     * The main logger class.
     */
    Logger
};

export = exported;
