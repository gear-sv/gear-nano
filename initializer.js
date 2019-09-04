const { exec } = require("child_process")

let transaction_id = "73cc7dd4937af750aa824f7b0f297e9fe7cca744379d08be74e738f7aa5d9afb"

//const initializeMachine = (transaction_id) => {}

const fetchBlueprint = exec(`curl https://bico.media/${transaction_id} > gear-${transaction_id}.tar.gz && tar -xvzf gear-${transaction_id}.tar.gz`,
(error, stdout, stderr) => {
      if (error) console.log("#### problem fetching machine configuration from on chain", error)
      console.log(stdout)
      console.log(stderr)
      return
    })


const fetchConstructor = exec(`curl https://api.whatsonchain.com/v1/bsv/main/tx/hash/73cc7dd4937af750aa824f7b0f297e9fe7cca744379d08be74e738f7aa5d9afb | jq '.vout[1].scriptPubKey.addresses[0]'`, (error, stdout, stderr) => {
      if (error) console.log("#### problem fetching machine configuration from on chain", error)
      console.log(stdout)
      console.log(stderr)
      const owner = this.stdout
      console.log(this.owner)
    })

// const test = exec(`echo HIT!!`, (error, stdout, stderr) => {
//   console.log(stdout)
// })
