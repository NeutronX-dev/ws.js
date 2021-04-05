const WebSocket = require('ws');

module.exports = class {
    constructor(debug) {
        this.ws = null;
        this.data = {
            debug: (typeof (debug) == 'boolean' && debug == true) ? true : false,
            server: {
                enabled: false,
                instance: null,
                sockets: {
                    active: {
                        list: [],
                        total: 0
                    },
                    inactive: {
                        list: [],
                        total: 0
                    }
                }
            },
            port: {
                enabled: false,
                number: 80
            },
            callbacks: {
                connection: (Socket, Request) => {},
                listening: () => {},
                message: (Socket, Request, Message) => {},
                error: () => {},
                close: (code, data) => {}
            }
        };
    }
    log(message) {
        if (this.data.debug) {
            console.log(`[ws.js] [server] ${message.split("\n").join("\n[ws.js] ")}`);
        }
    }
    addServer(server) {
        if (server) {
            if (!this.data.port.enabled) {
                try {
                    this.data.server.enabled = true;
                    this.data.server.instance = server;
                    this.log("Set Server");
                    return true;
                } catch (e) {
                    this.log("Error setting server...   <ws.js_server_object>.addServer(Server)");
                    this.log(e);
                    return false;
                }
            } else {
                this.log("Did not enable Server: All ready listening on Port.");
                return false;
            }
        } else {
            throw new Error(`[ws.js]   <ws.js_server_object>.addServer(Server);\n[ws.js]   Did not recieve a Server.`);
        }
    }
    addPort(port) {
        if (port) {
            if (!this.data.server.enabled) {
                try {
                    this.data.port.enabled = true;
                    this.data.port.number = port;
                    this.log("Set Port to " + port);
                    return true;
                } catch (e) {
                    this.log("Error setting server...   <ws.js_server_object>.addServer(Server)");
                    this.log(e);
                    return false;
                }
            } else {
                this.log("Did not enable Port: Server all ready enabled.");
                return false;
            }
        } else {
            throw new Error(`[ws.js]   <ws.js_server_object>.addServer(Server);\n[ws.js]   Did not recieve a Server.`);
        }
    }
    on(event, callback, bind) {
        if (typeof (event) == 'string' && typeof (callback)) {
            callback = (typeof (bind) == "boolean" && bind == true) ? callback.bind(this) : callback;
            switch (event.toLowerCase()) {
                case "listen":
                case "ready":
                    this.data.callbacks.listening = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                case "connection":
                case "connect":
                    this.data.callbacks.connection = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                case "exception":
                case "error":
                    this.data.callbacks.error = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                case "disconnection":
                case "disconnect":
                case "close":
                    this.data.callbacks.close = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                case "message":
                case "msg":
                    this.data.callbacks.message = callback;
                    this.log("Set callback for event \"" + event + "\".");
                    break;
                default:
                    this.log("<ws.js_server_object>.on(String event, Function callback); No event \"" + event + "\" found.");
                    break;
            }
        } else {
            throw new Error(`[ws.js]   <ws.js_server_object>.on(String event, Function callback);\n[ws.js]   event is not a string, or callback is not a function`);
        }
    }
    broadcast(message) {
        return new Promise((resolve, reject) => {
            if (this.data.server.sockets.active.total > 1) {
                let sent = 0;
                let length = 0;
                if (typeof (message) == "object" && !message.length) {
                    message = JSON.stringify(message);
                } else if (typeof (message) == "boolean" || typeof (message) == "number") {
                    message = (message).toString();
                }
                length = message.length;
                this.data.server.sockets.active.list.forEach((Socket) => {
                    try {
                        (Socket).send(message);
                        sent++;
                    } catch (e) {
                        this.log("<ws.js_server>.broadcast(message);   Unable to broadcast to Socket ID: #" + Socket['ws.js'].id);
                        this.log(e);
                        reject(e);
                    }
                });
                resolve(sent);
            } else {
                this.log("<ws.js_server>.broadcast(message);   No sockets to broadcast to.");
                resolve(0);
            }
        });
    }
    listen() {
        return new Promise((resolve, reject) => {
            let options = {};
            if (this.data.server.enabled) {
                options['server'] = this.data.server.instance;
                this.log("Binded to Server.");
            } else if (this.data.port.enabled) {
                options['port'] = this.data.port.number;
                this.log("Listening on Port.");
            } else {
                this.log("Did not detect server, or port.");
                reject({
                    error: false,
                    message: "Did not detect server, or port."
                });
            }
            try {
                this.ws = new WebSocket.Server(options);
                this.ws.listening = () => {
                    this.log("Listening...");
                    this.data.callbacks.listening(port);
                    resolve({
                        error: false,
                        message: null
                    });
                };
                this.ws.on('connection', (Socket, Request) => {
                    this.data.callbacks.connection();
                    Socket['ws.js'] = {
                        id: this.data.server.sockets.active.total + 1,
                        connected: new Date().valueOf()
                    };
                    this.data.server.sockets.active.total++;
                    this.data.server.sockets.active.list.push(Socket);
                    Socket.on('message', (msg) => {
                        this.log(`[+] Message (${(msg && msg.length) ? msg.length : "??"} bytes)`);
                        let message = msg;
                        let isParsed = false;
                        try {
                            message = JSON.parse(msg);
                            isParsed = true;
                        } catch (e) {
                            isParsed = false;
                            this.log("Unable to parse Message");
                        }
                        this.data.callbacks.message(Socket, Request, message, isParsed);
                    });
                    Socket.on('close', (code, data) => {
                        let socket_index = this.data.server.sockets.active.list.indexOf(Socket);
                        this.data.server.sockets.active.list.slice(socket_index, socket_index + 1);
                        this.data.server.sockets.active.total--;

                        this.data.server.sockets.inactive.total++;
                        this.data.server.sockets.inactive.list.push({
                            id: Socket["ws.js"].id,
                            connected: Socket["ws.js"].connected,
                            elapsed: new Date().valueOf() - Socket["ws.js"].connected
                        });

                        this.log("Socket ID #" + Socket['ws.js'].id + " closed with code: " + code + " and data: " + data);
                        this.log(`${this.data.server.sockets.active.total} active connections.`);
                        this.data.callbacks.close(code, data);
                    });
                });
            } catch (e) {
                reject({
                    error: true,
                    message: e
                });
            }
        });
    }
    getActiveSockets(socketID){
        if(socketID){
            return this.data.server.sockets.inactive.list.filter(socket => socket.id == socketID);
        } else {
            return this.data.server.sockets.inactive.list;
        }
    }
    getInactiveSockets(socketID){
        if(socketID){
            return this.data.server.sockets.active.list.filter(socket => socket.id == socketID);
        } else {
            return this.data.server.sockets.active.list;
        }
    }
    destroy() {
        this.ws.close();
    }
    close() {
        this.destroy();
    }
}
