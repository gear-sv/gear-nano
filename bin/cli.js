#! /usr/bin/env node

const program = require("commander")
const { exec } = require("child_process")
const util = require("util")
const readFile = util.promisify(require("fs").readFile)

const { initializeMachine } = require("./initializer.js")
const { gearia, createServer } = require("./gearia.js")
const { getModule, dynamicRequire, fetchABI } = require("./processor.js")
const { getStats } = require("./stats.js")

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
    exec(`pm2 start ${__dirname}/run.js --name processor`, (error, stdout, stderr) => {
      if (error) console.log("### error running processor", error)
      if (stderr) console.log("### error running processor", stderr)
      console.log("stdout", stdout)
    })
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

/*******************************************
*
* $ gear-nano stats
*
*******************************************/

program
  .command("stats")
  .action(async () => {
    console.log(`
#################################################################
#
#   Stats: fetching contract statistics
#
#################################################################
    `)
    await getStats()
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
