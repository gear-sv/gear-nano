#! /usr/bin/env node

const program = require("commander")
const { exec } = require("child_process")
const util = require("util")
const readFile = util.promisify(require("fs").readFile)

const { initializeMachine } = require("./initializer.js")
const { gearia, createServer } = require("./gearia.js")
const { getModule, dynamicRequire, fetchABI } = require("./processor.js")

/*******************************************
*
* $ gear-nano init
*
*******************************************/

program
  .command("init [transactionID]")
  .action((transactionID) => {
    console.log(`
#################################################################
#
#   GearSV: smart contracts on bitcoin
#
#################################################################
    `)

    initializeMachine(transactionID)
  })

/*******************************************
*
* $ gear-nano clear
*
*******************************************/

program
  .command("clear")
  .action(() => {
    exec(`. ${__dirname}/clear.sh`, (error, stdout, stderr) => {
      console.log(`
#################################################################
#
#   Clear: removed tape, stateDB, txDB, and bus files
#
#################################################################
      `)
    })
  })

/*******************************************
*
* $ gear-nano processor
*
*******************************************/

program
  .command("processor")
  .action(async () => {
    console.log(`
#################################################################
#
#   Processor: starting contract engine
#
#################################################################
    `)

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

    // 2. fetch module
    const code = await getModule("FungibleToken")
    const contractModule = dynamicRequire(code, config.transactionID, )

    // 3. fetch getters and constructor
    const getters = await fetchABI("FungibleToken")
    const constructor = ['sean']

    console.log("### successfully compiled emscripten module")

    console.log(`
#################################################################
#
#   Processor: starting block handler
#
#################################################################
    `)

    // 3. start processor
    gearia(contractModule, config.transactionID, getters, constructor, config.blockHeight)

  })

/*******************************************
*
* $ gear-nano state
*
*******************************************/

program
  .command("state")
  .action(() => {
    console.log("state")
    console.log(`
#################################################################
#
#   State: LevelDB and Http Server
#
#################################################################
    `)
    createServer("StateDB")
  })

/*******************************************
*
* $ gear-nano transactions
*
*******************************************/

program
  .command("transactions")
  .action(() => {
    console.log(`
#################################################################
#
#   Tx: LevelDB and Http Server
#
#################################################################
    `)
    createServer("TxDB")
  })

program
  .command("app")
  .action(() => {
    console.log("app")
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
