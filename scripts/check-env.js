#!/usr/bin/env node
// Simple env checker to find potentially leaked server-only envs that are prefixed with NEXT_PUBLIC_
// Run: node ./scripts/check-env.js

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')

function findInFiles(dir, pattern) {
    const results = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
        const p = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.git') continue
            results.push(...findInFiles(p, pattern))
        } else {
            try {
                const txt = fs.readFileSync(p, 'utf8')
                if (pattern.test(txt)) results.push(p)
            } catch {
                // ignore unreadable files
            }
        }
    }
    return results
}

console.log('Checking for environment variable usage patterns...')

const publicUsage = findInFiles(root, /process\.env\.(NEXT_PUBLIC_[A-Z0-9_]+)/g)
const anyProcessEnv = findInFiles(root, /process\.env\.[A-Z0-9_]+/g)

console.log('\nFiles referencing NEXT_PUBLIC_ envs:')
publicUsage.forEach(f => console.log(' -', path.relative(root, f)))

console.log('\nFiles referencing process.env.*:')
anyProcessEnv.forEach(f => console.log(' -', path.relative(root, f)))

console.log('\nTip: Ensure only non-sensitive values are prefixed with NEXT_PUBLIC_.')
console.log('Use server-only envs (no NEXT_PUBLIC_ prefix) for secrets like API keys.')
