import chalk from 'chalk';

/**
 * An enumeration of known logging levels.
 */
export enum LogLevel {
    /**
     *
     */
    None = 0,
    Fatal = 1,
    Error = 2,
    Warning = 3,
    Info = 4,
    Verbose = 5,
    Debug = 6,
    Trace = 7,
    All = 8
}

const LogLevelDescriptor: Record<string, string> = {
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

const LogLevelColor: Record<string, chalk.ChalkFunction> = {
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

const ALL_LOGGERS: Logger[] = [];

export const setVerbose = (value: boolean) => {
    const level = value ? LogLevel.Verbose : LogLevel.Info;
    ALL_LOGGERS.forEach((logger) => (logger.level = level));
};

export class Logger {
    public readonly name: string;

    public level: LogLevel;

    public constructor(name: string) {
        this.name = name;
        this.level = LogLevel.Info;
        ALL_LOGGERS.push(this);
    }

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

    public fatal(message: string) {
        this.log(LogLevel.Fatal, message);
    }

    public error(message: string) {
        this.log(LogLevel.Error, message);
    }

    public warn(message: string) {
        this.log(LogLevel.Warning, message);
    }

    public info(message: string) {
        this.log(LogLevel.Info, message);
    }

    public verbose(message: string) {
        this.log(LogLevel.Verbose, message);
    }

    public debug(message: string) {
        this.log(LogLevel.Debug, message);
    }

    public trace(message: string) {
        this.log(LogLevel.Trace, message);
    }
}
