# ws.js
### by NeutronX-dev
# Table of Contents
* Node.js [Client](#nodejs-client)
* * [Get Started](#get-started-npm-client)
* * [Implementation](#implementation-npm-client)
* * [Methods](#methods-npm-client)
* * [Examples](#examples-npm-client)


# Node.js Client


## Get Started (npm client)
To install `ws.js` you need to input the following in your console:
```
npm i ws.js
```


## Implementation (npm client)
To start using `ws.js` (client) you need to write the following code:
```js
// CLASS
const ws_js = require('ws.js');
const ws = new ws_js( debug );

// BUILT
const ws = require('ws.js').build.client( debug );
```

## Methods (npm client)
| Class | Method | Parameters | Promise | Return
| -------------------------------- | -------------   | -------------- | ------------- | ---------------- |
| ws.js.[client](#nodejs-client)  | [`constructor`](#constructor-npm-client)  | `boolean debug`, `string URL` (all opt.) | `NO` | `void`
| ws.js.[client](#nodejs-client)  | [`.setURL`](#seturl-npm-client)      | `string URL` | `NO`          | `void`
| ws.js.[client](#nodejs-client)  | [`.setHeaders`](#setheaders-npm-client)  | `object headers` (JSON) | `NO`          | `void`
| ws.js.[client](#nodejs-client)  | [`.setAgent`](#setagent-npm-client)  | `string proxy`, `string type` | `NO`          | `void`
| ws.js.[client](#nodejs-client)  | [`.on`](#on-npm-client) | `string event`, `function callback`, `boolean bind` (opt.) | `NO` | `void`
| ws.js.[client](#nodejs-client)  | [`.connect`](#connect-npm-client)  | `string proxy`, `string type` | `YES`          | `JSON` `{success, time, message, external}`
| ws.js.[client](#nodejs-client)  | [`.send`](#send-npm-client) | `ANY message` | `YES` | `true` or `false`

### `constructor` (npm client)
* **Parameters**
* * `boolean debug` (optional)
* * `string URL` (optional)
* **Description**: Make the Class.
* **Return**: void

### `.setURL` (npm client)
* **Parameters**
* * `string URL` (required)
* **Description**: Set an URL to connect (if not set in the constructor)
* **Return**: void

### `.setHeaders` (npm client)
* **Parameters**
* * `object headers` (JSON) (required)
* **Description**: Sets the connection Headers.
* **Return**: void

### `.setAgent` (npm client)
* **Parameters**
* * `string proxy` (required)
* * `string type` (`"http"`, `"https"`, or `"socks"`) (required)
* **Description**: Makes an `type` agent from `proxy` to connect with.
* **Return**: void

### `.on` (npm client)
* **Parameters**
* * `string event` (required) (`"open"`, `"close"`, `"message"`, or `"error"`)
* * `function callback` (required)
* * `boolean bind` (optional)
* **Description**: Set a callback for an event.
* **Return**: void

### `.connect` (npm client)
* **Parameters**
* * NONE
* **Return**: void

### `.send` (npm client)
* **Parameters**
* * `ANY message` (required)
* **Return**: `true` or `false`

### `on` Information (npm client)
| Event     | Parameters                   | Values
| --------- | ---------------------------- | ------
| `open`    | NONE                         | N/A
| `close`   | NONE                         | N/A
| `message` | `JSON` or `String` **`res`** | `string` **`message`**, `bool` **`parsed`**
| `error`   | `String` **`err`**           | N/A

## Examples (npm client)
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
I made a `ws.js` object on debug mode (shows when setters are triggered, when a connection is made, messages sent/recieved, etc...) set the URL to `wss://echo.websocket.org` which is basically a WebSocket server that sends back any messages it recieves. I made a callback that whenever a message is recieved checks if it was parsed, if it was then format and print the recieved message, if it is not parsed or was unable to parse print the text message alone. Then I triggered the [`.connect`](#connect-npm-client) method, waited for the WebSocket to make the connection, and send a message (JSON: `{type: "ws.js"}`). It was sent, the echo server sent it back, triggering the `message` event which prints the message.

## Other
In order for `ws.js` to work you need to set a URL, either as the second parameter of the [`constructor`](#constructor-npm-client), or using the [`.setURL`](#seturl-npm-client) method.

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
