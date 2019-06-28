const { planaria } = require("neonplanaria")
const { promises: fs } = require("fs")
const contractModule = require("./a.out.js")
const zeromq = require("zeromq")

class BlockHandler {
  startServer() {
    this.socket = zeromq.socket("push")
    this.socket.bindSync=("tcp://127.0.0.1:3000")
  }
  
  startPlanaria() {
    planaria.start({
      src: {
        from: 566470,
        path: `${process.cwd()}/../gear-bus/bus/87907d460d4823b94bf4458281e161d67a477d26fb1cb42825ee5cf8c0e4fe06/`
      },
      onstart: async function(e) {
        console.log("inside onstart listener")
      },
      onmempool: function(e) {
        console.log("inside onmempool listener")
        this.socket.send("some work")
        console.logK("socket", socket)
        console.log("after socket send")
      }.bind(this),
      onblock: function(e) {
        console.log("inside onblock listener")

        // console.log("example tx", e.tx[0])
        // this.processBlock(e.tx)
      },
    })
  }

  processBlock(transactions) {
    console.log("processing block", transactions)
    transactions.map(transaction => {
      this.socket.send("transaction here")
    })
  }

}

const blockHandler = new BlockHandler()
blockHandler.startServer()
setTimeout(() => {
  blockHandler.startPlanaria()
}, 500)

