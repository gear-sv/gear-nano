const { planarium } = require('neonplanaria')
const L = require('interlevel')
console.log("ENV (name,server,client): ", process.env.GEARIA_NAME, process.env.GEARIA_SERVER_PORT, process.env.GEARIA_CLIENT_PORT)
const level = require('level')

planarium.start({
  name: process.env.GEARIA_NAME,
  port: process.env.GEARIA_SERVER_PORT,

  default: {}, // empty default
  onstart: () => {
    return L.client({ host: "127.0.0.1", port: process.env.GEARIA_CLIENT_PORT})
  },
  onquery: (e) => {
    let code = Buffer.from(e.query, 'base64').toString()
    let req = JSON.parse(code)
    if (req.get) {
      console.log(req.get)
      console.log(JSON.stringify(e.core))
      e.core.get(req.get, function(err, val) {
        if (err) e.res.json({ error: "key does not exist" })
        else e.res.json({ val: val })
      })
    } else {
      e.res.json({ welcome: "Please try the query format: { \"get\": [key] } " })
    }
  }
})
