
/** 
 * Implements modules/dependencies.
 */
const HTTP = require('http');
const HTTPS = require('https');
const URL = require('url');
const stringDecoder = require('string_decoder').stringDecoder;
const FS = require('fs');
const conf = require('./config');

/**
 * Implements Servers.
 */
const httpServer = HTTP.createServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(conf.httpPort, () => {
    console.log(`HTTP server is listning on port: ${conf.httpPort}`);
});

const httpsArgs = {
    'key': FS.readFileSync('./https/key.pem'),
    'cert': FS.readFileSync('./https/cert.pem'),
};

const httpsServer = HTTPS.createServer(httpsArgs, (req, res) => {
    unifiedServer(req, res);
});

httpsServer.listen(conf.httpsPort, () => {
    console.log(`HTTPS Encrypted server is listening on port: ${conf.httpsPort}`);
});

/**
 * Application Logics.
 */
const unifiedServer = (rec, res) => {

};