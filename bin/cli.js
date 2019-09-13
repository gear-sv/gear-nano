#! /usr/bin/env node

const program = require("commander")
const { exec } = require("child_process")
const util = require("util")
const readFile = util.promisify(require("fs").readFile)

const { initializeMachine } = require("./initializer.js")
// const { gearia, createServer } = require("./gearia.js")

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

program
  .command("processor")
  .action(async () => {
    console.log("starting processor")
    // 1. fetch config
    let config = await readFile(`${process.cwd()}/config.json`)
    config = JSON.parse(config.toString())
    console.log("config", config)
    // 2. start processor
  })

program
  .command("state")
  .action(() => {
    console.log("state")
  })

program
  .command("transactions")
  .action(() => {
    console.log("transactions")
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
