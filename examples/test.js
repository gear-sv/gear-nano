const { gearInit, createServer } = require("../gearia")
const { initializeMachine, fetchBlueprint, fetchConstructor } = require("../initializer.js")


const getters = {
  getOwner: "string",
  getSupply: "unsigned int",
  getBalances: "map"
}

// init machineConfig
initializeMachine("73cc7dd4937af750aa824f7b0f297e9fe7cca744379d08be74e738f7aa5d9afb")

//fetchBlueprint
//fetchBlueprint()

// 1. run block handler
//gearia("63eec681025b07b9aa9d3720a125ce33dfd46e0b940a518100811c1f4eea86f0", getters)

// 2. run transaction server
//createServer("TxDB")

// 3. run state server
//createServer("StateDB")
