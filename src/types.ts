/**
 * The global command-line options.
 */
export interface GlobalCLIOptions {
    /**
     * Whether to log verbosely.
     */
    verbose: boolean;

    /**
     * The maximum number of parallel connections to use during operations.
     *
     * Defaults to `3`.
     */
    maxConnections: number;
}
