# gearia ⚙️
![engine](engine.jpg)

Planaria instance for contract state updates and event driven storage.
___

### Install

1. Include emscripten javascript output `a.out.js` and wasm bytecode `a.out.wasm` from [gear-contracts](https://github.com/gear-sv/gear-contracts).
2. Start bitbus server. See [gear-bus](https://github.com/gear-sv/gear-bus) for instructions.
3. `npm i gearia -S`

```
const { gearia, transactions, state } = require("gearia")

const getters = {
  getOwner: "string",
  getSupply: "unsigned int",
  getBalances: "map"
}

gearia(28335, 28336, getters)

transactions(28335)

state(28336)
```
___
