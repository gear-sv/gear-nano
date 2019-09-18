const util = require("util")
const readFile = util.promisify(require("fs").readFile)

const getModule = async (contractName) => {
  const code = await readFile(`${process.cwd()}/tmp/${contractName}.out.js`)
  return code.toString()
}

const dynamicRequire = (code) => {
  process.chdir('tmp')
  const m = new module.constructor()
  m.paths = module.paths
  m._compile(code, "testmod.js")
  process.chdir('../')
  return m.exports
}

const fetchABI = async (contractName) => {
  const abi = await readFile(`${process.cwd()}/tmp/${contractName}.json`)
  const { getters } = JSON.parse(abi)
  return getters
}

module.exports = {
  getModule,
  dynamicRequire,
  fetchABI
}
