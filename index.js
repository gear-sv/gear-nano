const { planaria } = require("neonplanaria")
const level = require("level")
const L = require("interlevel")
const contractModule = require("./a.out.js")

// transaction DB container
let txDB

// state DB container
let stateDB

// contract interface
let getOwner
let getSupply
let getBalance
let setOwner
let mint
let transfer

// wait for contract to initialize before starting planaria
contractModule.onRuntimeInitialized = () => {
  planaria.start({
    // remote bitbus reference
    src: {
      from: 591200,
      path: `${process.cwd()}/../gear-bus/bus/589f29e8a632246397fd10d8bab746a5d35eb189118676c20673f82d1ca57ca7/`
    },
    onstart: (e) => {
      // 1. instantiate contract
      getOwner = contractModule.cwrap("getOwner", "string")
      getSupply = contractModule.cwrap("getSupply", "number")
      getBalance = contractModule.cwrap("getBalance", "number", ["string"])

      setOwner = contractModule.cwrap("setOwner", "bool", ["string", "string"])
      mint = contractModule.cwrap("mint", "bool", ["string", "number"])
      transfer = contractModule.cwrap("transfer", "bool", ["string", "string", "number"])

      // 2. instantiate transaction db
      txDB = level("txDB", { valueEncoding: "json" })
      L.server({ db: txDB, port: 28335 })

      // 3. instantiate state db
      stateDB = level("stateDB", { valueEncoding: "json" })
      L.server({ db: stateDB, port: 28336 })
    },
    onmempool: (e) => {
      console.log("inside onmempool listener")
    },
    onblock: (e) => {
      console.log("inside onblock listener")

      // 1. send transaction in relative order to transaction db
      e.tx.forEach((transaction) => {
        txDB.put(transaction.tx.h, transaction, (error) => {
          if (error) console.log("could not write transaction to db")
        })
      })

      // 2. update state based on transactions
      e.tx.forEach((transaction) => {
        const methodName = transaction.out[0].s3
        const params = JSON.parse(transaction.out[0].s4)
        const SENDER = transaction.in[0].e.a

        switch (methodName) {
          case "setOwner":
            setOwner(SENDER, ...params)
            break
          case "mint":
            mint(SENDER, ...params)
            break
          case "transfer":
            transfer(SENDER, ...params)
            break
          default:
            console.log("invalid method reference")
            break
        }
      })

      // 3. fetch state from getters
      const owner = getOwner()
      const supply = getSupply()
      // TODO: get all balances getter, add to state
      const state = { owner, supply }

      // 3. save state snapshot by block number
      stateDB.put(e.height, state, (error) => {
        if (error) console.log("could not write transaction to db")
      })
    },
  })
}
