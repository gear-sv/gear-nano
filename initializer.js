const { exec } = require("child_process")

let transaction_id = "73cc7dd4937af750aa824f7b0f297e9fe7cca744379d08be74e738f7aa5d9afb"

const initializeMachine = (transaction_id) => {
  fetchBlueprint(transaction_id)
  fetchConstructor(transaction_id)
}

const fetchBlueprint = (transaction_id) => {
  exec(`curl https://bico.media/${transaction_id} > gear-${transaction_id}.tar.gz && tar -xvzf gear-${transaction_id}.tar.gz`,
(error, stdout, stderr) => {
      if (error) console.log("#### problem fetching machine configuration from on chain", error)
      console.log(stdout)
      console.log(stderr)
    })
}


const fetchConstructor = (transaction_id) => {
exec(`curl https://api.whatsonchain.com/v1/bsv/main/tx/hash/${transaction_id} | jq '.vout[1].scriptPubKey.addresses[0]'`, (error, stdout, stderr) => {
      if (error) console.log("#### problem fetching machine configuration from on chain", error)
      console.log(stdout)
      console.log(stderr)
      // const owner = this.stdout
      // console.log(this.owner)
    })
}


module.exports = {
  initializeMachine,
  fetchBlueprint,
  fetchConstructor
}
