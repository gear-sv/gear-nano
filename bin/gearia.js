const { planaria } = require("neonplanaria")
const level = require("level")
const L = require("interlevel")
const { exec, spawn } = require("child_process")

let txDB

let stateDB

let contract

const gearia = (contractModule, contractID, getters, _constructor, startBlock) => {
  console.log("startBlock", startBlock, startBlock.length)
  console.log("contractID", contractID)
  contractModule.onRuntimeInitialized = () => {
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
        console.log("event:",e)
        console.log("constructor:",_constructor)
        console.log("on start")
        contract = new contractModule.FungibleToken(...JSON.parse(_constructor))


        txDB = level("txDB", { valueEncoding: "json" })
        L.server({ db: txDB, port: 28335 })

        stateDB = level("stateDB", { valueEncoding: "json" })
        L.server({ db: stateDB, port: 28336 })
      },
      onblock: (e) => {

        // run some DB tests
        txDB.put('test','OK', function(err){
          if (err) return console.log("oops,",err)
          txDB.get('test', function(err){
            if (err) return console.log("oops",err)
          })
        })

        stateDB.put('test','OK', function(err){
          if (err) return console.log("oops,",err)
          stateDB.get('test', function(err){
            if (err) return console.log("oops",err)
          })
        })

        console.log("onBlock HIT");
        console.log("e:",JSON.stringify(e))
        console.log("e.height: ",e.height)
        console.log("transaction.tx.h", e.tx.h)

        // e.tx.forEach((unit, i) => {
        //   console.log("unit:", unit)
        // })

        // 1. update contract with method calls
        //const status = e.tx.map(transaction => updateState(transaction))




        // 2. save transactions
        e.tx.forEach((transaction, i) => {

          console.log("loop hit")

          const tx = {
            SENDER: transaction.in[0].e.a,
            method: transaction.out[0].s3,
            params: JSON.parse(transaction.out[0].s4),
            index: transaction.i
            //status: status[i]
          }

          console.log("key:",transaction.tx.h);
          console.log("tx-object:", tx)


          txDB.put(transaction.tx.h, tx, (error) => {
            if (error) console.error("# could not write transaction to db: ",error)
            if (error) console.error("# could not write state update to db: ",error)
            if(transaction.tx.h == null) console.log("tx was null, please check mapping.")
            console.log("\n\n####################")
            console.log("#")
            console.log(`# Transaction: ${transaction.h}`)
            console.log("#")
            console.log("####################\n")
            console.log(tx)

        })
      })

        // 3. save contract state
        const stateObj = Object.keys(getters).reduce((accumulator, getter) => {
          console.log("global object? ",JSON.stringify(Object))

          console.log("object-keys",JSON.stringify(Object.keys))
          console.log("getter: ",JSON.stringify(getter))
          
          const state = getState(getter, getters[getter])
          accumulator[getter] = state
          return accumulator
        }, {})

        // 3. save state snapshot by block number
        stateDB.put(e.height, stateObj, (error) => {
          if (error) console.error("# could not write state update to db: ",error)
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
    if (error) console.log("### Error in ", name, error)
    else console.log("#### stdout:", stdout)
         console.log("stderr", stderr)
  })
}

module.exports = { gearia, createServer }
