const { gearia, createServer } = require("./gearia.js")

const getters = {
  getOwner: "string",
  getSupply: "unsigned int",
  getBalances: "map"
}

// 1. run block handler
gearia(28335, 28336, getters)

// 2. run transaction server
createServer(3009, 28335, "TxDB")

// 3. run state server
createServer(3010, 28336, "StateDB")
