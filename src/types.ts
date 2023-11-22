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

    /**
     * The timeout for network requests, in milliseconds.
     *
     * Defaults to `10000`.
     */
    timeout: number;

    /**
     * The API key to use when connecting to the CurseForge API.
     */
    curseForgeAPIKey?: string | undefined;

    /**
     * A custom user agent to use when making network requests.
     */
    userAgent?: string | undefined;
}

/**
 * Data about a modpack.
 */
export interface ModpackManifest {
    /**
     * The ID of the modpack.
     */
    id: number;

    /**
     * The name of the modpack.
     */
    name: string;

    /**
     * A short description of the modpack.
     */
    synopsis: string;

    /**
     * A description of the modpack.
     */
    description: string;
}
