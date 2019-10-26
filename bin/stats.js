const util = require('util')
const readFile = util.promisify(require('fs').readFile)
const readDir = util.promisify(require('fs').readdir)

const getStats = async () => {
  // get hash
  const files = await readDir(`${process.cwd()}/bus`)
  const hash = files[0]


  const path = `${process.cwd()}/bus/${hash}`

  // get tape.txt
  const txt = await readFile(`${path}/tape.txt`)
  const tape = txt.toString().split("\n")
  tape.pop() // remove last line break

  // get raw transactions
  const blocks = tape.reduce((acc, cell) => {
    const blockNum = cell.split(' ')[1]
    acc.push(blockNum)
    return acc
  }, [])
  console.log(blocks)

  let txs = []
  let blockStats = {}
  for (i in blocks) {
    const file = await readFile(`${path}/${blocks[i]}.json`)
    const blockTxs = JSON.parse(file)
    blockStats[blocks[i]] = blockTxs
    txs = txs.concat(blockTxs)
  }

  Object.keys(blockStats).forEach(block => {
    console.log(`
#############################################
#
#   Block: ${block}
#   Txs: ${blockStats[block].length}
#
#############################################
    `)
  })

  console.log(`
#############################################
#
#   Total Transactions: ${txs.length}
#
#############################################
  `)
  
  // TODO:
  // get transactions
  // get states

}

module.exports = {
  getStats
}
