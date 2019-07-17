const { planarium } = require('neonplanaria')
const L = require('interlevel')

planarium.start({
  name: "TransactionDB",
  port: 3009,
  default: {},
  onstart: async () => {
    return L.client({ host: "127.0.0.1", port: 28335 })
  },
  onquery: (e) => {
    let code = Buffer.from(e.query, 'base64').toString()
    let req = JSON.parse(code)
    if (req.get) {
      e.core.get(req.get, function(err, val) {
        if (err) e.res.json({ error: "txid doesn't exist" })
        else e.res.json({ val: val })
      })
    } else {
      e.res.json({ welcome: "Please try the query format: { \"get\": [txid] } " })
    }
  }
})
