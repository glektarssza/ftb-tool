/**
 * The name of the application.
 */
export const APP_NAME = 'ftb-tool';

/**
 * The version of the application.
 */
export const APP_VERSION = '0.1.0';

/**
 * The default user agent to use when making network requests.
 */
export const DEFAULT_USER_AGENT = `${APP_NAME}/${APP_VERSION} NodeJS/${process.version}`;

/**
 * The default base URL of the Feed the Beast API.
 */
export const DEFAULT_FTB_API_BASE_URL = 'https://api.modpacks.ch/public';

/**
 * The default base URL of the CurseForge API.
 */
export const DEFAULT_FLAME_API_BASE_URL = 'https://api.curseforge.com/v1';

/**
 * The default timeout on network requests, in milliseconds.
 */
export const DEFAULT_NET_TIMEOUT = 10000;

/**
 * The default maximum number of parallel network requests that can be made.
 */
export const DEFAULT_NET_REQUEST_LIMIT = 3;
