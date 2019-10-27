
const util = require("util")
const { exec } = require("child_process")
const fs = require("fs")
const writeFile = util.promisify(require("fs").writeFile)
const readDir = util.promisify(require("fs").readdir)
const readFile = util.promisify(require("fs").readFile)
const axios = require("axios")
const txo = require("txo")
const tar = require("tar")

const initializeMachine = async (transactionID) => {
  const blockHash = await fetchBlockHash(transactionID)
  const blockHeight = await fetchBlockHeight(blockHash)
  const constructor = await fetchConstructor(transactionID)

  await fetchPackage(transactionID)

  const contractName = await fetchContractName()

  await createConfig({
    contractName, 
    transactionID,
    blockHash,
    blockHeight,
    constructor: JSON.stringify(constructor)
  })
}

const fetchPackage = (transactionID) => {
  return new Promise((resolve, reject) => {
    axios.request({
      responseType: 'arraybuffer',
      url: `https://bico.media/${transactionID}`,
      method: 'get',
    }).then((response) => {
      const { data } = response
      fs.writeFileSync(`${process.cwd()}/gear-${transactionID}.tar.gz`, Buffer.from(data, "utf-8"))
    }).then(() => {
      return tar.x({ file: `gear-${transactionID}.tar.gz`})
    }).then(() => {
      console.log(`
#################################################################
#
#   Pulled contract package from the blockchain
#
#################################################################
      `)
      resolve(true)
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

const fetchContractName = async () => {
  const files = await readDir(`${process.cwd()}/tmp`)
  const name = files[0].split('.')[0]
  return name
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
  .catch((error) => {
    reject(error)
  })
}

module.exports = {
  initializeMachine
}
