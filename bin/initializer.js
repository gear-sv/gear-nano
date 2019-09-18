
//TODO: Use axios / node-jq for HTTP requests and filtering. Eliminate 'exec' calls.
const util = require("util")
const { exec } = require("child_process")
const fs = require("fs")
const writeFile = util.promisify(require("fs").writeFile)
const axios = require("axios")
const txo = require("txo")
const tar = require("tar")

const initializeMachine = async (transactionID) => {
  const blockHash = await fetchBlockHash(transactionID)
  const blockHeight = await fetchBlockHeight(blockHash)
  const constructor = fetchConstructor(transactionID)

  await fetchPackage(transactionID)

  await createConfig({
    transactionID,
    blockHash,
    blockHeight,
    constructor
  })
}

const fetchPackage = (transactionID) => {
  return new Promise((resolve, reject) => {
    axios.request({
      responseType: 'arraybuffer',
      url: `https://bico.media/${transactionID}`,
      method: 'get',
    })
    .then((response) => {
      const { data } = response
      fs.writeFileSync(`${process.cwd()}/gear-${transactionID}.tar.gz`, Buffer.from(data, "utf-8"))
    }).then(() => {
      return tar.x({ file: `gear-${transactionID}.tar.gz`})
    }).then(() => {
      console.log(process.cwd())
      console.log(`
#################################################################
#
#   Pulled contract package from the blockchain
#
#################################################################
      `)
    }).catch((error) => {
      reject(error)
    })
  })

  console.log(response)
}

const fetchBlockHash = async (transactionID) => {
  const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${transactionID}`)
  const { data: { blockhash }} = response
  return blockhash
}

const fetchBlockHeight = async (blockhash) => {
  const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/block/hash/${blockhash}`)
  const { data: { height }} = response
  return height
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
  initializeMachine
}
