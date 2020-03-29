import iswasvg from '@iswa/svg'
import shelljs from 'shelljs'

const iswaTree = iswasvg[Object.keys(iswasvg)[0]]

const recursiveMkdir = (tree, here) => {
  shelljs.mkdir(here)
  Object.entries(tree).forEach(([key, value]) => {
    const dirName = `${here}${key}/`
    if (Array.isArray(value)) {
      shelljs.mkdir(dirName)
    } else {
      recursiveMkdir(value, dirName)
    }
  })
}

recursiveMkdir(iswaTree, './src/')