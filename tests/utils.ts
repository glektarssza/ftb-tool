/**
 * Check whether the environment has a value for a given variable.
 *
 * @param name - The name of the environment variable to check for.
 *
 * @returns `true` if `process.env` has a value for the given name; `false`
 * otherwise.
 */
export function envHasValue(name: string): boolean {
    return typeof process.env[name] === 'string';
}

/**
 * Get the raw value of an environment variable.
 *
 * @param name - The name of the environment variable to get the value of.
 *
 * @returns The raw string value of the environment variable.
 *
 * @throws `Error` - Thrown if the environment variable does not exist.
 */
export function getRawEnvValue(name: string): string {
    if (!envHasValue(name)) {
        throw new Error(`No environment variable with name "${name}"`);
    }
    return process.env[name]!;
}

/**
 * Get the raw value of an environment variable.
 *
 * @param name - The name of the environment variable to get the value of.
 * @param defaultValue - The default value to return if the environment variable
 * does not exist.
 *
 * @returns The raw string value of the environment variable.
 */
export function getOptionalRawEnvValue(
    name: string,
    defaultValue: string | null = null
): string | null {
    try {
        return getRawEnvValue(name);
    } catch {
        return defaultValue;
    }
}

/**
 * Parse an integer from the contents of an environment variable.
 *
 * @param name - The name of the environment variable to parse.
 *
 * @returns The integer value of the environment variable contents.
 *
 * @throws `Error` - Thrown if the environment variable does not exist.
 * @throws `Error` - Thrown if the environment variable contents cannot be
 * parsed into an integer.
 */
export function parseEnvInteger(name: string): number {
    const value = getRawEnvValue(name);
    const parsed = parseInt(value);
    if (!isFinite(parsed)) {
        throw new Error(
            `Cannot parse environment variable "${name}" into an integer`
        );
    }
    return parsed;
}

/**
 * Parse an integer from the contents of an environment variable.
 *
 * @param name - The name of the environment variable to parse.
 * @param default - The default value to return if the environment has no
 * variable with the given name or an integer cannot be parsed from the
 * contents.
 *
 * @returns The integer value of the environment variable contents on success;
 * the default value otherwise.
 */
export function parseOptionalEnvInteger(
    name: string,
    defaultValue: number | null = null
): number | null {
    try {
        return parseEnvInteger(name);
    } catch {
        return defaultValue;
    }
}

/**
 * Parse a float from the contents of an environment variable.
 *
 * @param name - The name of the environment variable to parse.
 *
 * @returns The float value of the environment variable contents.
 *
 * @throws `Error` - Thrown if the environment variable does not exist.
 * @throws `Error` - Thrown if the environment variable contents cannot be
 * parsed into a float.
 */
export function parseEnvFloat(name: string): number {
    const value = getRawEnvValue(name);
    const parsed = parseFloat(value);
    if (!isFinite(parsed)) {
        throw new Error(
            `Cannot parse environment variable "${name}" into a float`
        );
    }
    return parsed;
}

/**
 * Parse an float from the contents of an environment variable.
 *
 * @param name - The name of the environment variable to parse.
 * @param default - The default value to return if the environment has no
 * variable with the given name or a float cannot be parsed from the contents.
 *
 * @returns The float value of the environment variable contents on success;
 * the default value otherwise.
 */
export function parseOptionalEnvFloat(
    name: string,
    defaultValue: number | null = null
): number | null {
    try {
        return parseEnvFloat(name);
    } catch {
        return defaultValue;
    }
}

/**
 * Parse a boolean from the contents of an environment variable.
 *
 * An environment variable is considered to be `true` in the following
 * circumstances:
 *
 * * When parsed into an integer its value is equivalent to `1`.
 * * When treated as a string and converted to all lower case its value is
 * equivalent to `true`.
 *
 * All other values will be considered as `false`.
 *
 * @param name - The name of the environment variable to parse.
 *
 * @returns The boolean value of the environment variable contents.
 *
 * @throws `Error` - Thrown if the environment variable does not exist.
 */
export function parseEnvBoolean(name: string): boolean {
    const value = getRawEnvValue(name);
    const parsedNumber = parseOptionalEnvInteger(name);
    if (parsedNumber !== undefined) {
        return parsedNumber === 1;
    }
    return value.toLowerCase() === 'true';
}

/**
 * Parse an boolean from the contents of an environment variable.
 *
 * @param name - The name of the environment variable to parse.
 * @param default - The default value to return if the environment has no
 * variable with the given name or a boolean cannot be parsed from the contents.
 *
 * @returns The boolean value of the environment variable contents on success;
 * the default value otherwise.
 */
export function parseOptionalEnvBoolean(
    name: string,
    defaultValue: boolean | null = null
): boolean | null {
    try {
        return parseEnvBoolean(name);
    } catch {
        return defaultValue;
    }
}
