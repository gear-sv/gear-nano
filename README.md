# gearia ⚙️
![engine](engine.jpg)

Planaria instance for contract state updates and event driven storage.
___

### Install

1. Include emscripten javascript output `a.out.js` and wasm bytecode `a.out.wasm` from [gear-contracts](https://github.com/gear-sv/gear-contracts) into `/contract`.
2. Start bitbus server. See [gear-bus](https://github.com/gear-sv/gear-bus) for instructions.
3. `npm i gearia -S`

```
const { gearia, createServer } = require("gearia")

const getters = {
  getOwner: "string",
  getSupply: "unsigned int",
  getBalances: "map"
}

// 1. run block handler
gearia(28335, 28336, getters, "/../../gear-bus/bus/b26b0dbe1e06763f56d9a343f778f57c78798b0ab5fcce0a31258f12e0ce93ed/")

// 2. run transaction server
createServer(3009, 28335, "TxDB")

// 3. run state server
createServer(3010, 28336, "StateDB")

```
___
