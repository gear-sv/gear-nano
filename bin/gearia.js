const {
  planaria
} = require("neonplanaria")
const level = require("level")
const L = require("interlevel")
const {
  exec,
  spawn
} = require("child_process")

let txDB

let stateDB

let contract

const gearia = (contractModule, contractID, getters, _constructor, startBlock, contractName) => {
  contractModule.onRuntimeInitialized = () => {


    contract = new contractModule[contractName](...JSON.parse(_constructor))

    console.log("### Contract Initialized")
    planaria.start({
      filter: {
        from: startBlock,
        host: {
          bitbus: "https://bitbus.network",
        },
        q: {
          "find": {
            "out.s1": "gear",
            "out.s2": contractID
          }
        }
      },

      onstart: (e) => {
        txDB = level("txDB", {
          valueEncoding: "json"
        })
        L.server({
          db: txDB,
          port: 28335
        })

        stateDB = level("stateDB", {
          valueEncoding: "json"
        })
        L.server({
          db: stateDB,
          port: 28336
        })


      },
      onblock: (e) => {
        try {
          // 1. update contract with method calls
          const status = e.tx.map(transaction => updateState(transaction))

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
              if (error) console.error("# could not write state update to db: ", error)
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
            if (error) console.error("# could not write state update to db: ", error)
            console.log("\n\n####################")
            console.log("#")
            console.log(`# State Updated: ${e.height}`)
            console.log("#")
            console.log("####################\n")
            console.log("stateobj", stateObj)
            console.log("\n\n")
          })
        } catch (err) {
          console.error("onBlock() issue...", err)
        }
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
  if (!contract[methodName]) return "invalid method"

  try {
    const status = contract[methodName](SENDER, ...params)
    return status
  }
  catch(err) {
    console.error(err)
    return "invalid params"
  }
}

const getState = (method, returnType) => {

  // check that method exists
  if (!contract[method]) {
    console.error("### WARNING: unsupported getter function", method)
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

const createServer = (name) => {
  const serverPort = (name === "TxDB") ? 3009 : 3010
  const clientPort = (name === "TxDB") ? 28335 : 28336
  exec(`GEARIA_SERVER_PORT=${serverPort} GEARIA_NAME=${name} GEARIA_CLIENT_PORT=${clientPort} pm2 start ${__dirname}/server.js --name ${name}`, (error, stdout, stderr) => {
    if (error) console.error("### Error in ", name, error)
    else console.log("#### stdout:", stdout)
  })
}

module.exports = {
  gearia,
  createServer
}
