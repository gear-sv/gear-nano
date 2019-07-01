// producer.js
const zmq = require('zeromq')
  , socket = zmq.socket('push')

const { planaria } = require("neonplanaria")

class BlockHandler {
  startServer() {
    socket.bindSync('tcp://127.0.0.1:3000')
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
        socket.send("some work")
      }.bind(this),
      onblock: function(e) {
        console.log("inside onblock listener")
        socket.send("test transaction")
      },
    })
  }
}


const blockHandler = new BlockHandler()
blockHandler.startServer()
blockHandler.startPlanaria()


