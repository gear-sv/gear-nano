# gear-pla
![engine](engine.jpg)

Planaria/Planarium instance for contract state updates and event driven storage.
___

### RUN

1. Include emscripten javascript output `a.out.js` and wasm bytecode `a.out.wasm` from [gear-contracts](https://github.com/gear-sv/gear-contracts).
2. Start bitbus server. See [gear-bus](https://github.com/gear-sv/gear-bus) for instructions.
3. Point planaria `src` at the bus output directory `bus/[hash]`
3. `npm i && npm run start`

___

### Block Handler
`index.js` Planaria onBlock handler.
```
1. Stores all write transactions to transactionDB
2. Parses and dispatches contract calls over wasm bridge
3. Fetches state from getter functions and stores to stateDB
```

### Transactions
`transactions.js` Planarium server for transactionDB.

### State
`state.js` Planarium server for stateDB.
