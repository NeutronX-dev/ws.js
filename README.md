# ws.js
### by NeutronX-dev
# Table of Contents
* Node.js [Client](#nodejs-client)
* * [Get Started](#get-started-node-client)
* * [Implementation](#implementation-node-client)
* * [Methods](#methods-node-client)
* * [Examples](#examples-node-client)
* Node.js [Server](#nodejs-server)
* * [Get Started](#get-started-node-client)
* * [Implementation](#implementation-node-server)
* * [Methods](#)
* * [Examples](#)
* Other Exports
* * [Fetch Close Code](#fetch-close-code)

# Node.js Client


## Get Started (node client)
To install `ws.js` you need to input the following in your console:
```
npm i ws.js
```

## Implementation (node client)
To start using `ws.js` (client) you need to write the following code:
```js
// CLASS
const ws_js = require('ws.js');
const ws = new ws_js( debug, URL );

// BUILT
const ws = require('ws.js').build.client( debug, URL );
```

## Methods (node client)
| Class | Method | Parameters | Promise | Return
| -------------------------------- | -------------   | -------------- | ------------- | ---------------- |
| ws.js.[client](#nodejs-client)  | [`constructor`](#constructor-node-client)  | `boolean debug`, `string URL` (all opt.) | `NO` | `void`
| ws.js.[client](#nodejs-client)  | [`.setURL`](#seturl-node-client)      | `string URL` | `NO`          | `void`
| ws.js.[client](#nodejs-client)  | [`.setHeaders`](#setheaders-node-client)  | `object headers` (JSON) | `NO`          | `void`
| ws.js.[client](#nodejs-client)  | [`.setAgent`](#setagent-node-client)  | `string proxy`, `string type` | `NO`          | `void`
| ws.js.[client](#nodejs-client)  | [`.isOpen`](#isopen-node-client)  | `NONE` | `NO` | `true` or `false`
| ws.js.[client](#nodejs-client)  | [`.isClosed`](#isclosed-node-client)  | `NONE` | `NO` | `true` or `false`
| ws.js.[client](#nodejs-client)  | [`.isConnecting`](#isconnecting-node-client)  | `NONE` | `NO` | `true` or `false`
| ws.js.[client](#nodejs-client)  | [`.on`](#on-node-client) | `string event`, `function callback`, `boolean bind` (opt.) | `NO` | `void`
| ws.js.[client](#nodejs-client)  | [`.connect`](#connect-node-client)  | `string proxy`, `string type` | `YES` | `JSON` `{success, time, message, external}`
| ws.js.[client](#nodejs-client)  | [`.send`](#send-node-client) | `ANY message` | `YES` | `true` or `false`
| ws.js.[client](#nodejs-client)  | [`.close`](#close-node-client) | `int code`, `string data` | `NO` | `true` or `false`

### `constructor` (node client)
* **Parameters**
* * `boolean debug` (optional)
* * `string URL` (optional)
* **Description**: Make the Class.
* **Return**: void

### `.setURL` (node client)
* **Parameters**
* * `string URL` (required)
* **Description**: Set an URL to connect (if not set in the constructor)
* **Return**: void

### `.setHeaders` (node client)
* **Parameters**
* * `object headers` (JSON) (required)
* **Description**: Sets the connection Headers.
* **Return**: void

### `.setAgent` (node client)
* **Parameters**
* * `string proxy` (required)
* * `string type` (`"http"`, `"https"`, or `"socks"`) (required)
* **Description**: Makes an `type` agent from `proxy` to connect with.
* **Return**: void

### `.isOpen` (node client)
* **Parameters**
* * NONE
* **Return**: `true` or `false`

### `.isClosed` (node client)
* **Parameters**
* * NONE
* **Return**: `true` or `false`

### `.isConnecting` (node client)
* **Parameters**
* * NONE
* **Return**: `true` or `false`

### `.on` (node client)
* **Parameters**
* * `string event` (required) (`"open"`, `"close"`, `"message"`, or `"error"`)
* * `function callback` (required)
* * `boolean bind` (optional)
* **Description**: Set a callback for an event.
* **Return**: void

### `.connect` (node client)
* **Parameters**
* * NONE
* **Return**: void

### `.send` (node client)
* **Parameters**
* * `ANY message` (required)
* **Return**: `true` or `false`

### `.close` (node client)
* **Parameters**
* * `int message` (optional)
* * `string data` (optional)
* **Return**: `true` or `false`

### `on` Information (node client)
| Event     | Parameters                   | Values
| --------- | ---------------------------- | ------
| `open`    | NONE                         | N/A
| `close`   | NONE                         | N/A
| `message` | `JSON` or `String` **`res`** | `string` **`message`**, `bool` **`parsed`**
| `error`   | `String` **`err`**           | N/A

## Examples (node client)
### Example #1:
Connection to `wss://echo.websocket.org` (debug mode)
```js
const ws_js = require('ws.js');

const client = new ws_js(true);                                // Make class on debug mode.
client.setURL("wss://echo.websocket.org");                     // Sets URL to connect to.
client.on("open", () => {                                      // Set a callback that:
    console.log("[Custom Callback] Opened");                   //   logs "Opened" when connection opens
});
client.on("message", (message, parsed) => {
    if(parsed){                                                // If the text was parsed (String -> JSON)
        console.log(JSON.stringify(message, true, '   '));     // Format and print the JSON.
    } else {                                                   // else (if unable to parse)
        console.log(message);                                  // Print the unparsed string
    }
});

client.connect().then((res) => {
    console.log(`[Custom Callback] connected within ${res.time} ms.`);
    client.send({                                              // Send a JSON with
        type: 'ws.js'                                          // property "type", value "l"
    });
});
client.close(0);                                               // Closes the connection.
```
Console:
```
> [ws.js] URL set. (URL: wss://echo.websocket.org)
> [ws.js] Headers set. (Headers: {})
> [ws.js] Set callback for event "open".
> [ws.js] Set callback for event "message".
> [ws.js] Starting to Connect...
> [ws.js] Binded Callbacks.
> [Custom Callback] Opened
> [ws.js] Made a connection to wss://echo.websocket.org successfuly.
> [Custom Callback] connected within 196 ms.
> [ws.js] Sent a message. (JSON) (16 bytes)
> [ws.js] [+] Message (16 bytes)
> {
>    "type": "ws.js"
> }
```
#### How does it work?
I made a `ws.js` object on debug mode (shows when setters are triggered, when a connection is made, messages sent/recieved, etc...) set the URL to `wss://echo.websocket.org` which is basically a WebSocket server that sends back any messages it recieves. I made a callback that whenever a message is recieved checks if it was parsed, if it was then format and print the recieved message, if it is not parsed or was unable to parse print the text message alone. Then I triggered the [`.connect`](#connect-node-client) method, waited for the WebSocket to make the connection, and send a message (JSON: `{type: "ws.js"}`). It was sent, the echo server sent it back, triggering the `message` event which prints the message.

## Other
In order for `ws.js` to work you need to set a URL, either as the second parameter of the [`constructor`](#constructor-node-client), or using the [`.setURL`](#seturl-node-client) method.

The debug mode logs pretty much everything, When setters are trigerred, connection started, ended, recieved/sent messages, etc...

# Node.js Server
## Get Started (node server)
To install `ws.js` you need to input the following in your console:
```
npm i ws.js
```

# Implementation (node server)
To start using `ws.js` (server) you need to write the following code:
```js
// CLASS
const ws_js = require('ws.js');
const ws = new ws_js.server( debug );

// BUILT
const ws = require('ws.js').build.server( debug );
```

## Methods (node client)
| Class | Method | Parameters | Promise | Return
| -------------------------------- | -------------   | -------------- | ------------- | ---------------- |
| ws.js.[server](#nodejs-server)  | [`constructor`](#constructor-server-client)  | `boolean debug` | `NO` | `void`
| ws.js.[server](#nodejs-server)  | [`.addServer`](#addserver-server-client)      | `server instance` (e.x.: express().listen()) | `NO`          | `void`
| ws.js.[server](#nodejs-server)  | [`.addPort`](#addport-server-client)  | `int port` | `NO`          | `void`
| ws.js.[server](#nodejs-server)  | [`.on`](#on-server-client) | `string event`, `function callback`, `boolean bind` (opt.) | `NO` | `void`
| ws.js.[server](#nodejs-server)  | [`.listen`](#listen-server-client)  | N/A | `NO` | `void`
| ws.js.[server](#nodejs-server)  | [`.broadcast`](#broadcast-server-client) | `ANY message` | `YES` | `int sent` (successful sent messages)
| ws.js.[server](#nodejs-server)  | [`.getActiveSockets`](#getactivesockets-server-client) | `int socketID` | `NO` | `[Socket, Socket, ...]` or `Socket`
| ws.js.[server](#nodejs-server)  | [`.destroy`](#destroy-server-client) | N/A | `NO` | N/A

### `.constructor` (node server)
* **Parameters**
* * `boolean debug` (optional)
* **Description**: Make the Class.
* **Return**: void

### `.addServer` (node server)
* **Parameters**
* * `server instance` (required)
* **Description**: Bind the WebSocket Server to another Server.
* **Return**: void

### `.addPort` (node server)
* **Parameters**
* * `int port` (required)
* **Description**: Sets a port to listen to.
* **Return**: void

### `.on` (node server)
* **Parameters**
* * `string event` (required)
* * `function ballback` (required)
* * `bool bind` (optional)
* **Description**: Set a callback for an Event.
* **Return**: void

### `.listen` (node server)
* **Parameters**
* * `string event` (required)
* * `function ballback` (required)
* * `bool bind` (optional)
* **Description**: Set a callback for an Event.
* **Return**: void

### `.broadcast` (node server)
* **Parameters**
* * `ANY message` (required)
* **Description**: Sends a message to all active Sockets
* **Return**: void

### `.getActiveSockets` (node server)
* **Parameters**
* * `int socketID` (optional)
* **Description**: Gets an active Socket from an ID, or all if not specified.
* **Return**: `[Socket, Socket, ...]` or `Socket`.

### `.getInactiveSockets` (node server)
* **Parameters**
* * `int socketID` (optional)
* **Description**: Gets an inactive Socket from an ID, or all if not specified.
* **Return**: `[JSON, JSON, ...]` or `JSON`. (`{id: int, connected: int, elapsed: int}`)

# Other Exports
Here are other extra functions included in the module.
## Fetch Close Code
* **CALL**:  `<ws_js>.FetchCloseCode(code);`
* **RETURN**: `{  name: "",  description: ""  }`
* **DESCRIPTION**: Returns a name and description of the close code (`code`).

# LICENSE
![gnu-logo](logos/gplv3-88x31.png)

This program is free software: you can redistribute it and/or modify
it under the terms of the [GNU General Public License](https://github.com/NeutronX-dev/ws.js/blob/main/LICENSE) as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
