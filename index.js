const client = require('./client');
const server = require('./server');

module.exports = client;
module.exports.client = client;
module.exports.server = server;
module.exports.build = {
    client: (debug) => {
        debug = debug || null;
        return new client(debug);
    }
}