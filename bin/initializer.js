
//TODO: Use axios / node-jq for HTTP requests and filtering. Eliminate 'exec' calls.

const { exec } = require("child_process")
const fs = require('fs')
const jq = require('node-jq')
const axios = require("axios")
const txo = require("txo")

const initializeMachine = async (transactionID) => {
  const blockHash = await fetchBlockHash(transactionID)
  const blockHeight = await fetchBlockHeight(blockHash)
  const constructor = fetchConstructor(transactionID)

  await fetchBlueprint(transactionID)

  await createConfig({
    transactionID,
    blockHash,
    blockHeight,
    constructor
  })
}

const verifyEnv = () => {
  if (process.env.TRANSACTION_ID !== 'undefined') {
    let transaction_id = process.env.TRANSACTION_ID
    //console.log('contract specified @ '+transaction_id);
    return transaction_id;
  }
  return console.error('please speicify contract transaction ID by setting TRANSACTION_ID env variable');
}

const fetchBlueprint = (transaction_id) => {
  return new Promise((resolve, reject) => {
    exec(`curl https://bico.media/${transaction_id} > gear-${transaction_id}.tar.gz && tar -xvzf gear-${transaction_id}.tar.gz`,
      (error, stdout, stderr) => {
      if (error) console.log("#### problem fetching machine configuration from on chain", error)
      console.log(stderr)
      resolve(true)
    })
  })
}

const fetchBlockHash = (transaction_id) => {
  return new Promise((resolve, reject) => {
    exec(`curl https://api.whatsonchain.com/v1/bsv/main/tx/hash/${transaction_id} | jq '.blockhash'`,
        (error, stdout, stderr) => {
        if (error) console.log("#### problem fetching blockhash from on chain", error)
        console.log("stdout", stdout)
        resolve(stdout.replace(`"`, "").replace(`"`, "").slice(0,-1))
      })
  })
}

// This may be redundant and waste of time to get Blockheight every time, we may just want to start from a standard blockheight.
const fetchBlockHeight = (blockhash) => {
  return new Promise((resolve, reject) => {
    exec(`curl https://api.whatsonchain.com/v1/bsv/main/block/hash/${blockhash} | jq '.height'`,
        (error, stdout, stderr) => {
        if (error) console.log("### problem fetching blockhash from on chain", error)
        resolve(stdout.slice(0,-1))
      })
  })
}

const fetchConstructor = async (transactionID) => {
  const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${transactionID}`)
  const { data: { hex }} = response
  const tx = await txo.fromTx(hex)

  return ([tx.out[0].s3])
}

const createConfig = (config) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("config.json", JSON.stringify(config), (error) => {
      if (error) console.log("### error creating config file", error)
      console.table(config)
      console.log("\n")
      resolve(true)
    })
  })
}

module.exports = {
  initializeMachine,
  fetchBlueprint,
  fetchConstructor,
  verifyEnv
}
