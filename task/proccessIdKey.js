import fs from 'fs'

const iswaidkeytxt = fs.readFileSync('iswa_id_key.txt', 'utf8')

const idkey = iswaidkeytxt
  .split('\n')
  .map(line => line.split(','))
  .map(([filename, idkey]) => {
    const arrayName = filename.split('-')
    const arrayidkey = idkey.split('')
    return [
      arrayName.slice(0, arrayName.length - 1).join('-'),
      arrayidkey.slice(0, arrayidkey.length - 1).join('')
    ]
  })
  .reduce((acc, [filename, idkey]) => {
    acc[filename] = idkey
    return acc
  }, {})

fs.writeFileSync('iswa_id_key.js', `const idkey = ${JSON.stringify(idkey, null, 2)}

export default idkey
`)