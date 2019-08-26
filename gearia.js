const contractModule = require("./contract/FungibleToken.out.js")
const { planaria } = require("neonplanaria")
const level = require("level")
const L = require("interlevel")

let txDB

let stateDB

let contract

const gearia = (txPort, statePort, getters) => {

  contractModule.onRuntimeInitialized = () => {
    console.log("contract Initialized")
    planaria.start({
      src: {
        from: 594280,
        path: `${process.cwd()}/../gear-bus/bus/b26b0dbe1e06763f56d9a343f778f57c78798b0ab5fcce0a31258f12e0ce93ed/`
      },
      onstart: (e) => {
        contract = new contractModule.FungibleToken("1CDAfzAK8t6poNBv4K7uiMFyZKvoKdrS9q")

        txDB = level("txDB", { valueEncoding: "json" })
        L.server({ db: txDB, port: txPort })

        stateDB = level("stateDB", { valueEncoding: "json" })
        L.server({ db: stateDB, port: stateDB })
      },
      onblock: (e) => {
        // 1. update contract with method calls
        const status = e.tx.map(transaction => updateState(transaction))
        console.log(status)

        // 2. save transactions
        e.tx.forEach((transaction, i) => {
          const tx = {
            SENDER: transaction.in[0].e.a,
            method: transaction.out[0].s3,
            params: JSON.parse(transaction.out[0].s4),
            index: transaction.i,
            status: status[i]
          }

          txDB.put(transaction.tx.h, tx, (error) => {
            if (error) console.log("# could not write transaction to db")
            if (error) console.log("# could not write state update to db")
            console.log("\n\n####################")
            console.log("#")
            console.log(`# Transaction: ${transaction.tx.h}`)
            console.log("#")
            console.log("####################\n")
            console.log(tx)
          })
        })

        // 3. save contract state
        const stateObj = Object.keys(getters).reduce((accumulator, getter) => {
          const state = getState(getter, getters[getter])
          accumulator[getter] = state
          return accumulator
        }, {})

        // 3. save state snapshot by block number
        stateDB.put(e.height, stateObj, (error) => {
          if (error) console.log("# could not write state update to db")
          console.log("\n\n####################")
          console.log("#")
          console.log(`# State Updated: ${e.height}`)
          console.log("#")
          console.log("####################\n")
          console.log(stateObj)
          console.log("\n\n")
        })
      }
    })
  }
}

const updateState = (transaction) => {
  // get transaction data
  const methodName = transaction.out[0].s3
  const params = JSON.parse(transaction.out[0].s4)
  const SENDER = transaction.in[0].e.a

  // make sure method is available
  if (!contract[methodName]) return "invalid"

  // hit method, return status
  return contract[methodName](SENDER, ...params)
}

const getState = (method, returnType) => {
  console.log(method)
  console.log(returnType)
  // check that method exists
  if (!contract[method]) {
    console.log("### WARNING: unsupported getter function", method)
    return "unsupported method"
  }

  // call getter
  const data = contract[method]()

  switch (returnType) {
    case "string":
      return data
    case "unsigned int":
      return data
    case "map":
      const map = {}
      const keys = data.keys()
      for (let i = 0; i < keys.size(); i++) {
        map[keys.get(i)] = data.get(keys.get(i))
      }
      return map
    default:
      return "unsupported type"
  }
}

const txServer = (port) => {

}

const stateServer = (port) => {

}

module.exports = gearia
