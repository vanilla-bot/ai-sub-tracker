import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const distDir = process.argv[2] || './dist'

function getAllJsFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      getAllJsFiles(full, files)
    } else if (full.endsWith('.js')) {
      files.push(full)
    }
  }
  return files
}

function fixFile(file) {
  let content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')
  let changed = false
  const fixed = lines.map(line => {
    // Match: from './path' or from '../path' where path has no extension
    // We look for the pattern: from './something' where something has no dot extension
    const match = line.match(/^(.+?\s+from\s+['"])(\.\.?\/[^'"]+)(['"])/)
    if (match) {
      const [full, prefix, path, suffix] = match
      // Only fix if path doesn't already end with .js or .json or similar
      const pathExt = extname(path)
      if (pathExt === '' || pathExt === '.ts' || pathExt === '.tsx') {
        changed = true
        return prefix + path + '.js' + suffix
      }
    }
    return line
  })
  if (changed) {
    writeFileSync(file, fixed.join('\n'), 'utf-8')
    console.log('Fixed:', file)
  }
}

getAllJsFiles(distDir).forEach(fixFile)
console.log('Done.')
