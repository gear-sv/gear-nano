const { gearia, createServer } = require("../gearia")

const getters = {
  getOwner: "string",
  getSupply: "unsigned int",
  getBalances: "map"
}



//const _constructor = ["1CDAfzAK8t6poNBv4K7uiMFyZKvoKdrS9q"]

// 1. run block handler
//gearia("63eec681025b07b9aa9d3720a125ce33dfd46e0b940a518100811c1f4eea86f0", getters, _constructor, 591200)

// 2. run transaction server
//createServer("TxDB")

// 3. run state server
//createServer("StateDB")
