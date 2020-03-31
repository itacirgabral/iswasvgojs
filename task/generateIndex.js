import fs from 'fs'
import iswasvg from '@iswa/svg'

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

const importListRegular = fileListRegular.map(arr => `import s${
  arr[arr.length -1]
    .split('.')[0]
    .split('-')
    .join('_')
  } from '${[
    '.',
    'src',
    ...arr.slice(0, arr.length - 1),
    `${arr[arr.length -1].split('.')[0]}.js`
  ].join('/')
}'`).join('\n')

const exportListRegular = fileListRegular.map(arr => `  s${
  arr[arr.length -1]
    .split('.')[0]
    .split('-')
    .join('_')
}`).join(',\n')

fs.writeFileSync('./index.js', `${importListRegular}

export {
${exportListRegular}
}`)
