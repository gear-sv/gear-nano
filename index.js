const { planaria } = require("neonplanaria")

planaria.start({
  src: {
    from: 566470,
    path: `${process.cwd()}/../gear-bus/bus/87907d460d4823b94bf4458281e161d67a477d26fb1cb42825ee5cf8c0e4fe06/`
  },
  onstart: function(e) {
    console.log("inside onstart listener")
    
    // instantiate wasm module
  },
  onmempool: function(e) {
    console.log("inside onmempool listener")
  },
  onblock: function(e) {
    console.log("inside onblock listener")

    // send transaction in relative order 
  },
})
