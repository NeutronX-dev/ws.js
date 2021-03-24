const socks     = require('socks-proxy-agent');
const hagent    = require('proxy-agent');
const WebSocket = require('ws');

module.exports = class {
    constructor(debug, URL) {
        this.ws = null;
        this.data = {
            URL: (URL) ? URL : "",
            debug: (typeof (debug) == 'boolean' && debug == true) ? true : false,
            headers: {},
            callbacks: {
                open: () => {},
                error: () => {},
                close: () => {},
                message: () => {}
            },
            timeout: {
                enabled: false,
                time: 0
            },
            proxy: {
                enabled: false,
                string: "",
                agent: null
            }
        };

    }
    log(message) {
        if (this.data.debug) {
            console.log(`[ws.js] ${message}`);
        }
    }
    setURL(url) {
        this.data.URL = url;
        this.log(`URL set. (URL: ${url})`);
    }
    setHeaders(headers) {
        this.data.headers = headers;
        this.log(`Headers set. (Headers: ${JSON.stringify(headers)})`);
    }
    setTimeout(timeout) {
        if (timeout == 0) {
            this.data.timeout.enabled = false;
        } else if (timeout > 0) {
            this.data.timeout.enabled = true;
            this.data.timeout.time = timeout;
        }
    }
    setAgent(proxy, type) {
        if (typeof (proxy) == 'string' && typeof (type) == 'string') {
            this.data.proxy.enabled = true;
            this.data.proxy.string = proxy;
            switch (type) {
                case "socks":
                case "scks5":
                case "soks5":
                case "socs5":
                case "sock5":
                case "ocks5":
                case "socks":
                case "scks":
                case "soks":
                case "socs":
                case "sock":
                case "ocks":
                    this.data.proxy.agent = new socks('socks://' + proxy);
                    this.log("Set proxy to " + proxy + " (" + type + ")")
                    break;
                case "http":
                case "ttps":
                case "htps":
                case "htts":
                case "ttp":
                case "htp":
                case "htt":
                    this.data.proxy.agent = new hagent('http://' + proxy);
                    this.log("Set proxy to " + proxy + " (" + type + ")")
                    break;
                case "https":
                    this.data.proxy.agent = new hagent('https://' + proxy);
                    this.log("Set proxy to " + proxy + " (" + type + ")")
                    break;
                default:
                    throw new Error(`[ws.js]   <ws.js_object>.setAgent(String proxy, String type);\n[ws.js]   ${type} is an unsupported type.`);
                    break;
            }
        } else {
            throw new Error(`[ws.js]   <ws.js_object>.setAgent(String proxy, String type);\n[ws.js]   proxy or type is not a string.`);
        }
    }
    setProxy(proxy, type) {
        this.setAgent(proxy, type);
    }
    connect() {
        return new Promise((resolve, reject) => {
            try {
                if (this.data.URL != "") {
                    let options = {
                        headers: this.data.headers
                    };
                    if (this.data.proxy.enabled) {
                        options["agent"] = this.data.proxy.agent;
                    }
                    this.ws = new WebSocket(this.data.URL, options);
                    this.log("Starting to Connect...")
                    this.ws.onopen = this.data.callbacks.open;
                    this.ws.onerror = this.data.callbacks.error;
                    this.ws.onclose = this.data.callbacks.close;
                    this.ws.onmessage = this._onMessage.bind(this);
                    this.log("Binded Callbacks.");
                    let time = 0;
                    let interval = setInterval(() => {
                        if (this.ws.readyState == this.ws.OPEN) {
                            clearInterval(interval);
                            this.log("Made a connection to " + this.data.URL + " successfuly.");
                            resolve({
                                success: true,
                                time: time,
                                message: null,
                                external: false
                            });
                        } else if (this.data.timeout.enabled && this.data.timeout.time > 0) {
                            if (time >= this.data.timeout.time) {
                                clearInterval(interval);
                                this.log("Connection to " + this.data.URL + " timed Out.")
                                resolve({
                                    success: false,
                                    time: time,
                                    message: "[ws.js] Timed Out.",
                                    external: false
                                });
                            }
                        }
                        time += 1;
                    }, 1);
                } else {
                    this.log("Threw an Error. at      <ws.js_object>.connect()     URL is not set.");
                    reject("[ws.js]   URL is not set.");
                }
            } catch (e) {
                reject({
                    success: false,
                    time: 0,
                    message: e,
                    external: true
                })
            }
        });
    }
    on(event, callback, bind) {
        if (typeof (event) == 'string' && typeof (callback)) {
            callback = (typeof (bind) == "boolean" && bind == true) ? callback.bind(this) : callback;
            switch (event.toLowerCase()) {
                case "disconnection":
                case "disconnect":
                case "close":
                    this.data.callbacks.close = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                case "connection":
                case "connect":
                case "open":
                    this.data.callbacks.open = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                case "message":
                    this.data.callbacks.message = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                case "error":
                    this.data.callbacks.error = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                default:
                    this.log("<ws.js_object>.on(String event, Function callback); No event \"" + event + "\" found.");
                    break;
            }
        } else {
            throw new Error(`[ws.js]   <ws.js_object>.on(String event, Function callback);\n[ws.js]   event is not a string, or callback is not a function`);
        }
    }
    send(msg) {
        return new Promise((resolve, reject) => {
            let message = msg;
            let type = typeof (msg)
            let size = 0;
            if (typeof (msg) == 'object' && !msg.length) {
                try {
                    message = JSON.stringify(msg);
                    size = JSON.stringify(msg).length;
                    type = "JSON";
                } catch (e) {
                    this.log("Unable to stringify Message.");
                }
            } else if (typeof (msg) == "number" || typeof (msg) == "boolean") {
                message = msg.toString();
                size = msg.toString().length;
            }
            if (this.ws && this.ws.readyState == this.ws.OPEN) {
                try {
                    this.ws.send(message);
                    this.log("Sent a message. (" + type + ") (" + size + " bytes)")
                    resolve(true);
                } catch (e) {
                    resolve(false);
                }
            } else {
                setTimeout(() => {
                    this.send(msg).then(bool => {
                        resolve(bool);
                    });
                }, 1);
            }
        });

    }
    close(code, data) {
        code = code || 0;
        data = data || "unknown";
        if (this.ws.readyState == this.ws.OPEN) {
            this.ws.close(code, data);
            return true;
        } else {
            this.log("Unable to close a closed connection.");
            return false;
        }
    }
    isOpen() {
        if (this.ws && this.ws.readyState == this.ws.OPEN) {
            return true;
        } else {
            return false;
        }
    }
    isConnecting() {
        if (this.ws && this.ws.readyState == this.ws.CONNECTING) {
            return true;
        } else {
            return false;
        }
    }
    isClosed() {
        if (this.ws && this.ws.readyState == this.ws.CLOSED) {
            return true;
        } else {
            return false;
        }
    }
    _onMessage(msg) {
        let message = msg.data;
        let isParsed = false;
        this.log("[+] Message (" + msg.data.length + " bytes)");
        try {
            message = JSON.parse(msg.data);
            isParsed = true;
        } catch (e) {
            isParsed = false;
            this.log("Unable to parse Message");
        }
        this.data.callbacks.message(message, isParsed);
    }
}
