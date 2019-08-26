const { gearia, createServer } = require("../gearia")

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
