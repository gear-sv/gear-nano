const { gearia, createServer } = require("../gearia")

const getters = {
  getOwner: "string",
  getSupply: "unsigned int",
  getBalances: "map"
}

// 1. run block handler
gearia(28335, 28336, getters, "63eec681025b07b9aa9d3720a125ce33dfd46e0b940a518100811c1f4eea86f0")

// 2. run transaction server
createServer(3009, 28335, "TxDB")

// 3. run state server
createServer(3010, 28336, "StateDB")
