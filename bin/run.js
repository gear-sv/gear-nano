const util = require("util")
const readFile = util.promisify(require("fs").readFile)
const { getModule, dynamicRequire, fetchABI } = require("./processor.js")
const { gearia } = require("./gearia.js")

const run = (async () => {
  // 1. fetch config
  let config = await readFile(`${process.cwd()}/config.json`)
  config = JSON.parse(config.toString())
  console.table(config)

  console.log(`
  #################################################################
  #
  #   Initializing Emscripten Module
  #
  #################################################################
  `)

  // 2.
  const code = await getModule("FungibleToken")
  const contractModule = dynamicRequire(code)

  //  3. fetch getters
  const getters = await fetchABI("FungibleToken")

  console.log("### successfully compiled emscripten module")

  console.log(`
  #################################################################
  #
  #   Processor: starting block handler
  #
  #################################################################
  `)

  gearia(contractModule, config.transactionID, getters, config.constructor, config.blockHeight, config.contractName)
})()
