/**
 * Implements Environment configurations.
 */

const environments = {};

/** Staging Server. */
environments.staging = {
    'httpPort': 2500,
    'httpsPort': 3000,
    'envName': 'Staging',
};

/** Production Server. */
environments.production = {
    'httpPort': 3500,
    'httpsPort': 4000,
    'envName': 'Production',
};

/** Validate the NODE_ENV. */
const requestedEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : "";

/** Validate the request and export. */
const responseEnv = typeof (environments[requestedEnv]) == 'object' ? environments[requestedEnv] : environments.staging;
module.exports = responseEnv;