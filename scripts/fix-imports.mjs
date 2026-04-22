#!/usr/bin/env node
// Post-build script: adds .js extensions to ESM imports in dist/
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { execSync } from 'child_process'

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
  // Match import/export from relative paths without extension
  const fixed = content.replace(
    /^(import\s+(?:(?:[\w*{}\s,]+\s+from\s+)?['"])(\.\.[^'"]+)(['"])/gm,
    (_, before, path, after) => {
      // Only add .js if it doesn't already have an extension
      if (!extname(path)) return `${before}${path}.js${after}`
      return `${before}${path}${after}`
    }
  )
  if (fixed !== content) {
    writeFileSync(file, fixed, 'utf-8')
    console.log(`Fixed: ${file}`)
  }
}

const files = getAllJsFiles(distDir)
files.forEach(fixFile)
console.log(`Done. Fixed ${files.length} files.`)
