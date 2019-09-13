# gearia ⚙️
![engine](engine.jpeg)

Planaria instance for contract state updates and event driven storage.

___

### Node

`npm i gearia -S` 
```
const { gearia, createServer } = require("gearia")

const getters = {
  getOwner: "string",
  getSupply: "unsigned int",
  getBalances: "map"
}

// 1. run block handler
gearia('<contract-txid>')

// 2. run transaction server
createServer('tx')

// 3. run state server
createServer('state')

```

### TODO: Docker

`docker run <onchain-gearia> TX_ID=<contract-txid>`  
___
