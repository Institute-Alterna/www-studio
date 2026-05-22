import {readdirSync, readFileSync} from 'node:fs'
import {join, relative, resolve} from 'node:path'
import {describe, it, expect} from 'vitest'

const schemaDir = resolve(process.cwd(), 'schemaTypes')

/** Recursively collect all .ts files, excluding index.ts and test files */
function collectSchemaFiles(dir: string): string[] {
  const entries = readdirSync(dir, {withFileTypes: true})
  const files: string[] = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectSchemaFiles(full))
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.ts') &&
      entry.name !== 'index.ts' &&
      !entry.name.includes('.test.')
    ) {
      files.push(full)
    }
  }
  return files
}

const rawIndexSource = readFileSync(join(schemaDir, 'index.ts'), 'utf-8')

// Strip single-line comments so commented-out imports don't fool the checks
const indexSource = rawIndexSource
  .split('\n')
  .filter((line) => !line.trimStart().startsWith('//'))
  .join('\n')

// Extract all imported names: import {name} from '...'
const importedNames = [
  ...indexSource.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"][^'"]+['"]/g),
].map(([, name]) => name.trim())

// Extract the schemaTypes array contents: export const schemaTypes = [...]
const arrayMatch = indexSource.match(/export\s+const\s+schemaTypes\s*=\s*\[([^\]]+)\]/)
const arraySource = arrayMatch?.[1] ?? ''

const schemaFiles = collectSchemaFiles(schemaDir)

describe('Schema registry', () => {
  describe('every schema file is imported in index.ts', () => {
    for (const file of schemaFiles) {
      const importPath = './' + relative(schemaDir, file).replace(/\.ts$/, '').replaceAll('\\', '/')
      it(importPath, () => {
        expect(indexSource, `"${importPath}" is not imported in schemaTypes/index.ts`).toContain(
          `from '${importPath}'`,
        )
      })
    }
  })

  describe('every imported schema is included in the schemaTypes array', () => {
    for (const name of importedNames) {
      it(name, () => {
        expect(arraySource, `"${name}" is imported but missing from the schemaTypes array`).toMatch(
          new RegExp(`\\b${name}\\b`),
        )
      })
    }
  })
})
