import fs from 'fs'
import iswasvg from '@iswa/svg'
import symbolkey from '@iswa/symbolkey'

const iswaPath = Object.keys(iswasvg)[0]
const iswaTree = iswasvg[iswaPath]

const fileList = []

const recursiveList = (tree, path = []) => {
  const entries = Object.entries(tree)
  entries.forEach(([key, value]) => {
    if(Array.isArray(value)) {
      value.forEach(fileName => {
        fileList.push([...path, key, fileName])
      })
    } else {
      recursiveList(tree[key], [...path, key])
    }
  })
}
recursiveList(iswaTree)

const fileListRegular = fileList.filter(([str]) => !str.includes('Thinner'))

const importListRegular = fileListRegular.map(arr => {
  const file = arr[arr.length - 1].split('.')[0]
  const symbol = symbolkey.find(el => el[0].includes(file))[1]
  const path = [
    '.',
    'src',
    ...arr.slice(0, arr.length - 1),
    `${file}.js`
  ].join('/')

  return `import s${symbol} from '${path}'`
}).join('\n')

const exportListRegular = fileListRegular.map(arr => {
  const file = arr[arr.length - 1].split('.')[0]
  const symbol = symbolkey.find(el => el[0].includes(file))[1]

  return `  s${symbol}`
}).join(',\n')

fs.writeFileSync('./index.js', `${importListRegular}

export {
${exportListRegular}
}`)
