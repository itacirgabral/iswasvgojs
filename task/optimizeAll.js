import fs from 'fs'
import iswasvg from '@iswa/svg'
import SVGO from 'svgo'

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

const svgo = new SVGO()

fileList.forEach(path => {
  fs.readFile([iswaPath, ...path].join('/'), 'utf8', (err, file) => {
    if (!err) {
      const newNameExtension = `${path[path.length - 1].split('.')[0]}.js`
      const newPath = ['./src', ...path.slice(0, path.length -1), newNameExtension].join('/')

      svgo.optimize(file).then(svg => {
        const esmjs = `const svg = \`${svg.data}\`
  
export default svg
`
        fs.writeFile(newPath, esmjs, err => {
          if (err) {
            console.error(err)
          }
        })
      })
  
    }
  })
})