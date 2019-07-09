const { planaria } = require("neonplanaria")
const { promises: fs } = require("fs")
const contractModule = require("./a.out.js")

var kv

const mockState = {
  owner: "sean",
  supply: 1000,
  balances: {
    sean: 500,
    glenn: 300,
    craig: 200
  }
}

planaria.start({
  src: {
    from: 566470,
    path: `${process.cwd()}/../gear-bus/bus/87907d460d4823b94bf4458281e161d67a477d26fb1cb42825ee5cf8c0e4fe06/`
  },
  onstart: async function(e) {
    // 1. instantiate contract
    
    // 2. instantiate db instance
    kv = level("kv", { valueEncoding: "json" })
    L.server({ db: kv, port: 28335 })

  },
  onmempool: function(e) {
    console.log("inside onmempool listener")
  },
  onblock: function(e) {
    console.log("inside onblock listener")

    // 1. send transaction in relative order 
    
    // 2. save state snapshot
  },
})
