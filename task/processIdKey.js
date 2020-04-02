import fs from 'fs'

const iswaidkeytxt = fs.readFileSync('iswa_id_key.txt', 'utf8')

const idkey = iswaidkeytxt
  .split('\n')
  .map(line => line.split(','))

fs.writeFileSync('iswa_id_key.js', `const idkey = ${JSON.stringify(idkey, null, 2)}

export default idkey
`)