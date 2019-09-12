const axios = require('axios');


axios.get('https://api.whatsonchain.com/v1/bsv/main/tx/hash/73cc7dd4937af750aa824f7b0f297e9fe7cca744379d08be74e738f7aa5d9afb').then(resp => {
const tx = resp.data;
})

console.log(tx)
