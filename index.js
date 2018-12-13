
/** 
 * Implements modules/dependencies.
 */
const HTTP = require('http');
const HTTPS = require('https');
const URL = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
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
const unifiedServer = (request, response) => {

  /** Implements request manager. */
  var decoderObj = new stringDecoder('utf-8');
  var dataBuffer = '';

  /** Request data event handler. */
  request.on('data', (data) => {
    dataBuffer += decoderObj.write(data);
  });

  /** Request end event handler. */
  request.on('end', () => {

    /** Request parameters. */
    let parsedUrl = URL.parse(request.url, true);
    let method = request.method.toLowerCase();
    let headers = request.headers;
    let path = parsedUrl.pathname.replace(/^\/+|\/$/g, '');
    let queryStringObj = parsedUrl.query;
    dataBuffer += decoderObj.end();

    /** Validate request router. */
    let requestHandler = typeof (router[path]) == 'undefined' ? handlers.notFound : router[path];
    let requestMetaData = {
      'path': path,
      'method': method,
      'payload': dataBuffer,
      'queryStringObject': queryStringObj,
      'headers': headers,
    };

    /** Implements Request Handler */
    requestHandler(requestMetaData, (statusCode, payload) => {

      /** Default Response Params. */
      let respStatusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      let respPayload = typeof (payload) == 'object' ? payload : {};

      /** Set response headers. */
      response.setHeader('content-type', 'application/json');
      response.writeHead(respStatusCode);

      /** Set response body. */
      let bufferString = JSON.stringify(respPayload);
      response.end(bufferString);

      /** Server log. */
      console.log(`Responded this request with: `, respStatusCode, bufferString);
    });
  });

  /** Implements URL router & handlers. */
  const handlers = {};
  handlers.ping = (data, callback) => {
    callback(200);
  };

  handlers.notFound = (data, callback) => {
    callback(404);
  };

  handlers.welcome = (data, callback) => {
    callback(200, {'appResponse': 'Welcome Guest!', 'payload': dataBuffer});
  };

  const router = {
    'ping': handlers.ping,
    'hello': handlers.welcome,
  };
};