//TODO: Use axios / node-jq for HTTP requests and filtering. Eliminate 'exec' calls. 

const { exec } = require("child_process")
const fs = require('fs')
const jq = require('node-jq')


const verifyEnv = () => {
  if (process.env.TRANSACTION_ID !== 'undefined') {
    let transaction_id = process.env.TRANSACTION_ID
    //console.log('contract specified @ '+transaction_id);
    return transaction_id;
  }
  return console.error('please speicify contract transaction ID by setting TRANSACTION_ID env variable');
}


const initializeMachine = (transaction_id) => {
  fetchBlueprint(transaction_id)
  fetchConstructor(transaction_id)
}

const fetchBlueprint = (transaction_id) => {
  exec(`curl https://bico.media/${transaction_id} > gear-${transaction_id}.tar.gz && tar -xvzf gear-${transaction_id}.tar.gz`,
(error, stdout, stderr) => {
      if (error) console.log("#### problem fetching machine configuration from on chain", error)
      console.log(stderr)
      console.log('process: '+process.cwd())

    })
    //if (fs.existsSync(process.cwd()+'/output/FungibleToken.out.wasm')) {}
      return 'Initialized'

}

const fetchBlockhash = (transaction_id) => {
  exec(`curl https://api.whatsonchain.com/v1/bsv/main/tx/hash/${transaction_id} | jq '.blockhash'`,
(error, stdout, stderr) => {
      if (error) console.log("#### problem fetching blockhash from on chain", error)
      return stdout;
    })
}


//This may be redundant and waste of time to get Blockheight every time, we may just want to start from a standard blockheight.
const fetchBlockHeight = (blockhash) => {
  exec(`curl --location --request GET "https://api.whatsonchain.com/v1/bsv/main/block/hash/${blockhash}" | jq '.height'`,
(error, stdout, stderr) => {
      if (error) console.log("#### problem fetching blockhash from on chain", error)
      console.log('stdout': +stdout);
      console.log('stdout': +stdout);
      return stdout;
      //console.log(stderr)
    })
}


const fetchConstructor = (transaction_id) => {
exec(`curl https://api.whatsonchain.com/v1/bsv/main/tx/hash/${transaction_id} | jq '.vout[1].scriptPubKey.addresses[0]'`, (error, stdout, stderr) => {
      if (error) console.log("#### problem fetching machine configuration from on chain", error)
      console.log(stdout);
      return stdout
    })
}


//console.log('running integration tests: ')

// console.log(fetchBlueprint(verifyEnv()))

const transaction_id = verifyEnv()
console.log('transaction id: '+transaction_id )

let blockheight = fetchBlockHeight('000000000000000008918bde84f934d87e7df0fa56c2d9b2dd633b4e7cd568bc')
console.log('blockheight: '+blockheight)

let machineConfig = fetchConstructor('73cc7dd4937af750aa824f7b0f297e9fe7cca744379d08be74e738f7aa5d9afb')
console.log('machineConfig: '+machineConfig)




module.exports = {
  initializeMachine,
  fetchBlueprint,
  fetchConstructor,
  verifyEnv
}
