# ⚙️ gear-nano
Planaria instance for contract state updates and event driven storage.

![engine](engine.jpg)

<button name="button"  
  style="background-color: #00FF00;"
  onclick="window.location.href='https://www.npmjs.com/package/gear-nano'">
  NPM
</button>
<button name="button"  
  style="background-color: #00FF00;"
  onclick="window.location.href='https://medium.com/@_seanavery/gearsv-smart-contracts-for-bitcoin-68ee92a2e66e'">
  BLOG
</button>
___

### Install

1. `npm i pm2 -g`
2. `npm i gear-nano -g`



### CLI
```
1. gear-nano init [contractID]
2. gear-nano processor
3. gear-nano state
4. gear-nano transactions
```

___
#### gear-nano init [contractID]

```
gear-nano init 6787dfa742f963c6641e901d8e81da2930d62820b7837b7fd1e28c7bbf394727
```
```
1. Fetches contract package tar ball from the on chain transaction. `contractID` is the transaction hash of the contract deployment.
2. Fetches the `blockHeight` from the transaction.
3. Fetches the `constructor` input from the transaction.
```
#### gear-nano processor
```
1. Converts emscripten module [contractName].out.js and wasm bytecode file [contractName].out.wasm into a single javascript Module.
2. Initializes contract with the constructor input from deployement.
3. Starts Bitbus and Neon Planaria scraping servers which filter for contract calls pointed at the contractID.
4. Initializes contract inside the WASM virtual machine runtime.
5. Starts block handler that aggregates contract calls and feeds into the contract.
```
#### gear-nano state
```
1. Starts Planarium server which accepts state updates from the processor over ZeroMQ.
2. Starts Http server which allows you to query the state at a given block height.
```
#### gear-nano transactions
```
1. Starts Planarium server which accepts state updates from the processor over ZeroMQ.
2. Starts Http server which allows you to query a transaction by the transaction hash.
```
#### gear-nano clear
```
1. Clears the server state by deleting `StateDB`, `TxDB` and `tape.txt`.
```
