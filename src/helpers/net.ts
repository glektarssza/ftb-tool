import {
    Axios,
    AxiosHeaderValue,
    AxiosRequestConfig,
    AxiosResponse
} from 'axios';
import _ from 'lodash';
import {v4 as createUUID} from 'uuid';
import {Logger} from './logging';
import {
    DEFAULT_FLAME_API_BASE_URL,
    DEFAULT_FTB_API_BASE_URL,
    DEFAULT_NET_REQUEST_LIMIT,
    DEFAULT_NET_TIMEOUT,
    DEFAULT_USER_AGENT
} from '../constants';
import {Readable} from 'stream';
import {CurseForgeFileManifest} from '../types';

/**
 * An interface defining the shape of an item in a request queue.
 *
 * @typeparam T - The shape of the response data from the request.
 * @typeparam D - The shape of the request data to be sent.
 */
interface RequestQueueItem<T, D = unknown> {
    /**
     * The UUID of the request if it is in flight.
     */
    uuid?: string | undefined;

    /**
     * The Axios instance being used to make the request.
     */
    instance: Axios;

    /**
     * The request to be made.
     */
    request: AxiosRequestConfig<D>;

    /**
     * Resolve the request.
     *
     * @param data - The data to return to the requester.
     */
    resolve(data: T): void;

    /**
     * Fail the request.
     *
     * @param reason - The reason the request failed.
     */
    fail(reason?: Error): void;
}

/**
 * An item that is waiting for the request queue to have space for another
 * request.
 */
interface WaitingQueueItem {
    /**
     * Whether this item has been settled.
     */
    settled: boolean;

    /**
     * Resolve the waiting item.
     *
     * @param data - The data to return to the requester.
     */
    resolve(): void;

    /**
     * Fail the waiting item.
     *
     * @param reason - The reason the request failed.
     */
    fail(reason?: Error): void;
}

/**
 * The logger for this module.
 */
const logger = new Logger('net');

/**
 * The default options for configuring Axios.
 */
const DEFAULT_OPTIONS: AxiosRequestConfig = {
    responseType: 'json',
    responseEncoding: 'UTF-8',
    validateStatus(status: number) {
        return status >= 200 && status < 300;
    },
    transformResponse: [
        (resp: unknown) => {
            if (typeof resp === 'string') {
                return JSON.parse(resp) as unknown;
            }
            return resp;
        }
    ]
};

/**
 * The app-wide Axios instance for working with the Feed the Beast API.
 */
const ftb = new Axios({
    baseURL: DEFAULT_FTB_API_BASE_URL
});

/**
 * The app-wide Axios instance for working with the CurseForge API.
 */
const flame = new Axios({
    baseURL: DEFAULT_FLAME_API_BASE_URL
});

/**
 * A list of requests in flight.
 */
const requestsInFlight: RequestQueueItem<unknown>[] = [];

/**
 * A list of requests waiting to be processed.
 */
const requestQueue: RequestQueueItem<unknown>[] = [];

/**
 * The queue of items waiting for the request queue to have space for their
 * request.
 */
const waitingQueue: WaitingQueueItem[] = [];

/**
 * The current user agent.
 */
let userAgent: AxiosHeaderValue = null;

/**
 * The API key to use when making requests to the CurseForge API.
 */
let flameAPIKey: AxiosHeaderValue = null;

/**
 * The maximum number of parallel network requests that can be made.
 */
let requestLimit = DEFAULT_NET_REQUEST_LIMIT;

/**
 * The timeout of network requests, in milliseconds.
 */
let requestTimeout = DEFAULT_NET_TIMEOUT;

/**
 * Make a request to the given endpoint.
 *
 * @typeparam T - The shape of the data expected in the response.
 * @typeparam D - The shape of the data expected in the request body.
 * @param instance - The Axios instance to make the request to.
 * @param request - The request to make.
 */
async function makeRequest<T, D = unknown>(
    instance: Axios,
    request: AxiosRequestConfig<D>
): Promise<AxiosResponse<T>> {
    logger.verbose(
        `Making ${request.method} request to ${instance.defaults.baseURL} for ${request.url}`
    );
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
        requestQueue.push({
            instance,
            request,
            resolve,
            fail: reject
        });
        pumpQueue();
    });
}

/**
 * Build the base Axios request config for a given path.
 *
 * @param path - The path component of the request to make.
 *
 * @returns A base Axios request config.
 */
function buildBaseRequestConfig(path: string): AxiosRequestConfig {
    return _.merge(_.cloneDeep(DEFAULT_OPTIONS), {
        timeout: requestTimeout,
        url: path,
        headers: {
            'User-Agent': userAgent
        }
    });
}

/**
 * Build the Axios request config for making a request to the given path on the
 * Feed the Beast API.
 *
 * @param path - The path component of the request to make.
 *
 * @returns An Axios request config.
 */
function buildFTBBaseRequestConfig(path: string): AxiosRequestConfig {
    return buildBaseRequestConfig(path);
}

/**
 * Build the Axios request config for making a request to the given path on the
 * Feed the Beast API.
 *
 * @param path - The path component of the request to make.
 *
 * @returns An Axios request config.
 */
function buildFTBRequestConfig(path: string): AxiosRequestConfig {
    return buildFTBBaseRequestConfig(path);
}

/**
 * Build the Axios request config for making a request to the given path on the
 * Feed the Beast API in order to download binary data.
 *
 * @param path - The path component of the request to make.
 *
 * @returns An Axios request config.
 */
function buildFTBFileRequestConfig(path: string): AxiosRequestConfig {
    const request = _.merge(buildFTBBaseRequestConfig(path), {
        responseType: 'stream'
    });
    return request;
}

/**
 * Build the Axios request config for making a request to the given path on the
 * CurseForge API.
 *
 * @param path - The path component of the request to make.
 *
 * @returns An Axios request config.
 */
function buildFlameBaseRequestConfig(path: string): AxiosRequestConfig {
    return _.merge(buildBaseRequestConfig(path), {
        headers: {
            'X-API-Key': flameAPIKey
        }
    });
}

/**
 * Build the Axios request config for making a request to the given path on the
 * CurseForge API.
 *
 * @param path - The path component of the request to make.
 *
 * @returns An Axios request config.
 */
function buildFlameRequestConfig(path: string): AxiosRequestConfig {
    return _.merge(buildFlameBaseRequestConfig(path), {
        transformResponse: [
            (resp: unknown) => {
                return (resp as {data: unknown}).data;
            }
        ]
    });
}

/**
 * Build the Axios request config for making a request to the given path on the
 * CurseForge API in order to download binary data.
 *
 * @param path - The path component of the request to make.
 *
 * @returns An Axios request config.
 */
function buildFlameFileRequestConfig(path: string): AxiosRequestConfig {
    const config = _.merge(buildFlameBaseRequestConfig(path), {
        responseType: 'stream'
    });
    return config;
}

/**
 * Get the timeout of network requests, in milliseconds.
 *
 * @returns The timeout of network requests, in milliseconds.
 */
export function getRequestTimeout(): number {
    return requestTimeout;
}

/**
 * Set the timeout of network requests, in milliseconds.
 *
 * @param value - The new timeout of network requests, in milliseconds.
 */
export function setRequestTimeout(value: number) {
    requestTimeout = value;
}

/**
 * Reset the timeout of network requests, in milliseconds.
 */
export function resetRequestTimeout() {
    requestTimeout = DEFAULT_NET_TIMEOUT;
}

/**
 * Get the maximum number of parallel network requests that can be made.
 *
 * @returns The maximum number of parallel network requests that can be made.
 */
export function getRequestLimit(): number {
    return requestLimit;
}

/**
 * Set the maximum number of parallel network requests that can be made.
 *
 * @param value - The new maximum number of parallel network requests that can
 * be made.
 */
export function setRequestLimit(value: number) {
    requestLimit = value;
}

/**
 * Reset the maximum number of parallel network requests that can be made.
 */
export function resetRequestLimit() {
    requestLimit = DEFAULT_NET_REQUEST_LIMIT;
}

/**
 * Get the user agent to use when making requests.
 *
 * @returns The user agent to use when making requests.
 */
export function getUserAgent(): AxiosHeaderValue {
    return userAgent;
}

/**
 * Set the user agent to use when making requests.
 *
 * @param value - The value to set the user agent to.
 */
export function setUserAgent(value: string) {
    userAgent = value;
}

/**
 * Reset the user agent to use when making requests to the default value.
 */
export function resetUserAgent() {
    setUserAgent(DEFAULT_USER_AGENT);
}

/**
 * Get the API key to use when making requests to the CurseForge API.
 *
 * @returns The API key to use when making requests to the CurseForge API.
 */
export function getFlameAPIKey(): AxiosHeaderValue {
    return flameAPIKey;
}

/**
 * Set the API key to use when making requests to the CurseForge API.
 *
 * @param value - The API key to use when making requests to the CurseForge API.
 */
export function setFlameAPIKey(value: string) {
    flameAPIKey = value;
}

/**
 * Reset the API key to use when making requests to the CurseForge API.
 */
export function resetFlameAPIKey() {
    flameAPIKey = null;
}

/**
 * Make a request to the Feed the Beast API.
 *
 * @typeparam T - The shape of the data expected as a response.
 * @param request - The request to make.
 *
 * @returns A promise that resolves to the response of the request or rejects if
 * an error occurs.
 */
export async function makeFTBRequest<T>(
    request: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return makeRequest(ftb, request);
}

/**
 * Make a request to the Feed the Beast API to download binary data.
 *
 * @param request - The request to make.
 *
 * @returns A promise that resolves to the response of the request or rejects if
 * an error occurs.
 */
export async function makeFTBFileRequest(
    request: AxiosRequestConfig
): Promise<AxiosResponse<Readable>> {
    return makeRequest(ftb, request);
}

/**
 * Make a request to the CurseForge API.
 *
 * @typeparam T - The shape of the data expected as a response.
 * @param request - The request to make.
 *
 * @returns A promise that resolves to the response of the request or rejects if
 * an error occurs.
 */
export async function makeFlameRequest<T>(
    request: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
    return makeRequest(flame, request);
}

/**
 * Make a request to the CurseForge API to download binary data.
 *
 * @param request - The request to make.
 *
 * @returns A promise that resolves to the response of the request or rejects if
 * an error occurs.
 */
export async function makeFlameFileRequest(
    request: AxiosRequestConfig
): Promise<AxiosResponse<Readable>> {
    return makeRequest(flame, request);
}

/**
 * Make a `GET` request to the Feed the Beast API.
 *
 * @typeparam T - The shape of the data expected as a response.
 * @typeparam D - The shape of the data to send with the request.
 * @param path - The path to make the request to.
 *
 * @returns A promise that resolves to the response of the request or rejects if
 * an error occurs.
 */
export async function getFTB<T, D = unknown>(
    path: string,
    data?: D | undefined
): Promise<T> {
    return (
        await makeFTBRequest<T>(
            _.merge(buildFTBRequestConfig(path), {
                method: 'GET',
                data
            })
        )
    ).data;
}

/**
 * Make a `GET` request to the Feed the Beast API.
 *
 * @typeparam D - The shape of the data to send with the request.
 * @param path - The path to make the request to.
 *
 * @returns A promise that resolves to the response of the request or rejects if
 * an error occurs.
 */
export async function getFTBFile<D = unknown>(
    path: string,
    data?: D | undefined
): Promise<Readable> {
    return (
        await makeFTBFileRequest(
            _.merge(buildFTBFileRequestConfig(path), {
                method: 'GET',
                data
            })
        )
    ).data;
}

/**
 * Make a `GET` request to the CurseForge API.
 *
 * @typeparam T - The shape of the data expected as a response.
 * @typeparam D - The shape of the data to send with the request.
 * @param path - The path to make the request to.
 *
 * @returns A promise that resolves to the response of the request or rejects if
 * an error occurs.
 */
export async function getFlame<T, D = unknown>(
    path: string,
    data?: D | undefined
): Promise<T> {
    return (
        await makeFlameRequest<T>(
            _.merge(buildFlameRequestConfig(path), {
                transformResponse: [
                    (resp: unknown) => {
                        if (_.isPlainObject(resp)) {
                            return (resp as {data: CurseForgeFileManifest})
                                .data;
                        }
                        return resp;
                    }
                ],
                method: 'GET',
                data
            })
        )
    ).data;
}

/**
 * Make a `GET` request to the CurseForge API.
 *
 * @typeparam D - The shape of the data to send with the request.
 * @param projectId - The project ID which the file belongs to.
 * @param fileId - The ID of the file to get.
 *
 * @returns A promise that resolves to the response of the request or rejects if
 * an error occurs.
 */
export async function getFlameFile<D = unknown>(
    projectId: number,
    fileId: number,
    data?: D | undefined
): Promise<Readable> {
    const {downloadUrl} = await getFlame<CurseForgeFileManifest>(
        `/mods/${projectId}/files/${fileId}`
    );
    return (
        await makeFlameFileRequest(
            _.merge(buildFlameFileRequestConfig(downloadUrl), {
                method: 'GET',
                data
            })
        )
    ).data;
}

/**
 * Pump the request queue.
 */
export function pumpQueue() {
    const remainingRequestCapacity = requestLimit - requestsInFlight.length;
    if (remainingRequestCapacity <= 0) {
        return;
    }
    for (
        let i = 0;
        i < remainingRequestCapacity && i < requestQueue.length;
        i++
    ) {
        const requestItem = requestQueue.shift();
        if (requestItem === undefined) {
            throw new Error('Failed to get next request to perform');
        }
        const requestUUID = createUUID();
        requestItem.uuid = requestUUID;
        requestsInFlight.push(requestItem);
        requestItem.instance
            .request(requestItem.request)
            .then((response) => requestItem.resolve(response))
            .catch((err: Error) => requestItem.fail(err))
            .finally(() => {
                const i = requestsInFlight.findIndex(
                    (request) => request.uuid === requestUUID
                );
                if (i >= 0) {
                    requestsInFlight.splice(i, 1);
                }
                pumpQueue();
            });
        //-- Notify first thing waiting that there's space in the queue
        const waiter = waitingQueue.shift();
        if (waiter === undefined) {
            return;
        }
        waiter.resolve();
    }
}

export async function waitUntilQueueHasSpace(
    timeout = Infinity
): Promise<void> {
    let remainingRequestCapacity = requestLimit - requestsInFlight.length;
    //-- Resolve immediately if there's capacity available
    if (remainingRequestCapacity > 0) {
        return;
    }
    await new Promise<void>((resolve, reject) => {
        remainingRequestCapacity = requestLimit - requestsInFlight.length;
        //-- Resolve immediately if there's capacity available
        if (remainingRequestCapacity > 0) {
            return;
        }
        const item = {
            settled: false,
            resolve: () => {
                if (item.settled) {
                    return;
                }
                item.settled = true;
                resolve();
            },
            fail: (err: Error) => {
                if (item.settled) {
                    return;
                }
                item.settled = true;
                reject(err);
            }
        };
        waitingQueue.push(item);
        if (isFinite(timeout) && timeout > 0) {
            setTimeout(() => {
                item.fail(
                    new Error(
                        `Spent more than ${timeout} ms waiting for space in network queue`
                    )
                );
            }, timeout);
        }
        pumpQueue();
    });
}
