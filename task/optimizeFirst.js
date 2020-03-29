import fs from 'fs'
import iswasvg from '@iswa/svg'
import SVGO from 'svgo'

let notYet = true
let entrie0
let tree = iswasvg
const path = []

do {
  entrie0 = Object.entries(tree)[0]
  path.push(entrie0[0])
  if(Array.isArray(entrie0[1])) {
    notYet = false
    path.push(entrie0[1][0])
  } else {
    tree = entrie0[1]
  }
} while (notYet)

const svgo = new SVGO()

fs.readFile(path.join('/'), 'utf8', (err, file) => {
  if (!err) {
    svgo.optimize(file).then(svg => {
      const newNameExtension = `${path[path.length - 1].split('.')[0]}.js`
      const newPath = ['./src', ...path.slice(1, path.length -1), newNameExtension].join('/')
      console.log(newPath)

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


