const { planarium } = require('neonplanaria')
const L = require('interlevel')

planarium.start({
  name: process.GEARIA_NAME,
  port: process.GEARIA_SERVER_PORT,
  default: {}, // empty default
  onstart: () => {
    return L.client({ host: "127.0.0.1", port: process.GEARIA_CLIENT_PORT})
  },
  onquery: () => {
    let code = Buffer.from(e.query, 'base64').toString()
    let req = JSON.parse(code)
    if (req.get) {
      e.core.get(req.get, function(err, val) {
        if (err) e.res.json({ error: "key does not exist" })
        else e.res.json({ val: val })
      })
    } else {
      e.res.json({ welcome: "Please try the query format: { \"get\": [key] } " })
    }
  }
})
