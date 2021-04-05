const client = require('./client');
const server = require('./server');

module.exports = client;
module.exports.client = client;
module.exports.server = server;
module.exports.FetchCloseCode = (close_code) => {
    if (close_code) {
        if (close_code >= 0 && close_code <= 999) {
            return {
                name: "",
                description: "Reserved and not used."
            };
        } else {
            code = {
                name: "",
                description: ""
            };
            switch (close_code) {
                case 1000:
                    code['name'] = "Normal Closure";
                    code['description'] = "Normal closure; the connection successfully completed whatever purpose for which it was created.";
                    break;
                case 1001:
                    code['name'] = "Going Away";
                    code['description'] = "The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.";
                    break;
                case 1002:
                    code['name'] = "Protocol Error";
                    code['description'] = "The endpoint is terminating the connection due to a protocol error.";
                    break;
                case 1003:
                    code['name'] = "Unsupported Data";
                    code['description'] = "The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).";
                    break;
                case 1004:
                    code['name'] = "Reserved";
                    code['description'] = "Reserved. A meaning might be defined in the future.";
                    break;
                case 1005:
                    code['name'] = "No Status Received";
                    code['description'] = "Indicates that no status code was provided even though one was expected.";
                    break;
                case 1006:
                    code['name'] = "Abnormal Closure";
                    code['description'] = "Used to indicate that a connection was closed abnormally (that is, with no close frame being sent) when a status code is expected.";
                    break;
                case 1007:
                    code['name'] = "Invalid frame payload data";
                    code['description'] = "The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message).";
                    break;
                case 1008:
                    code['name'] = "Policy Violation";
                    code['description'] = "The endpoint is terminating the connection because it received a message that violates its policy. This is a generic status code, used when codes 1003 and 1009 are not suitable.";
                    break;
                case 1009:
                    code['name'] = "Message too big";
                    code['description'] = "The endpoint is terminating the connection because a data frame was received that is too large.";
                    break;
                case 1010:
                    code['name'] = "Missing Extension";
                    code['description'] = "The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn't.";
                    break;
                case 1011:
                    code['name'] = "Internal Error";
                    code['description'] = "The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
                    break;
                case 1012:
                    code['name'] = "Service Restart";
                    code['description'] = "The server is terminating the connection because it is restarting.";
                    break;
                case 1013:
                    code['name'] = "Try Again Later";
                    code['description'] = "The server is terminating the connection due to a temporary condition, e.g. it is overloaded and is casting off some of its clients.";
                    break;
                case 1014:
                    code['name'] = "Bad Gateway";
                    code['description'] = "The server was acting as a gateway or proxy and received an invalid response from the upstream server. This is similar to 502 HTTP Status Code.";
                    break;
                case 1015:
                    code['name'] = "TLS Handshake";
                    code['description'] = "Indicates that the connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
                    break;
                default:
                    code['name'] = "Unknown";
                    code['description'] = "-----";
                    break;
            }
            return code;
        }
    } else {
        this.log("Did not recieve close code in   <ws.js>.FetchCloseCode(int close_code);");
        return {
            name: "Unknown",
            description: "-----"
        };
    }
}
module.exports.build = {
    client: (debug, URL) => {
        debug = debug || null;
        return new client(URL, debug);
    },
    server: (debug) => {
        debug = debug || null;
        return new Server(debug);
    }
}
