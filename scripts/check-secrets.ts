#!/usr/bin/env tsx
/**
 * Full codebase secret scanner — versão completa do pre-commit hook.
 * Escaneia todos os arquivos rastreados pelo git em busca de padrões
 * de API keys e credenciais.
 *
 * Uso:
 *   npm run check:secrets
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import path from 'path'

// ─── Padrões de detecção ──────────────────────────────────────────────────────

const SECRET_PATTERNS: Array<{ name: string; regex: RegExp }> = [
  { name: 'Anthropic API key (sk-ant-)',    regex: /sk-ant-[a-zA-Z0-9\-_]{20,}/ },
  { name: 'OpenAI API key (sk-)',           regex: /sk-[a-zA-Z0-9]{20,}/ },
  { name: 'Stripe live publishable key',   regex: /pk_live_[a-zA-Z0-9]{20,}/ },
  { name: 'Stripe test publishable key',   regex: /pk_test_[a-zA-Z0-9]{20,}/ },
  { name: 'Stripe secret key',             regex: /sk_live_[a-zA-Z0-9]{20,}/ },
  { name: 'Stripe webhook secret',         regex: /whsec_[a-zA-Z0-9]{20,}/ },
  { name: 'Slack bot token',               regex: /xoxb-[0-9]+-[a-zA-Z0-9-]+/ },
  { name: 'GitHub personal access token',  regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: 'JWT token (eyJ...)',            regex: /eyJ[a-zA-Z0-9_-]{30,}\.[a-zA-Z0-9_-]{10,}/ },
  { name: 'URL com credenciais embutidas', regex: /[a-zA-Z]+:\/\/[^:@\s/]+:[^@\s/]{3,}@/ },
  {
    name: 'Variável sensível com valor hardcoded',
    regex: /(API_KEY|SECRET_KEY|PASSWORD|PRIVATE_KEY|ACCESS_TOKEN)\s*[=:]\s*['"`][a-zA-Z0-9+/\-_]{30,}['"`]/i,
  },
]

// ─── Arquivos e diretórios a ignorar ──────────────────────────────────────────

const SKIP_FILENAMES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.env.example',          // template com valores vazios
  'check-secrets.ts',      // este próprio script
  'check-secrets.sh',      // hook do husky
])

const SKIP_EXTENSIONS = new Set([
  '.ico', '.woff', '.woff2', '.png', '.jpg', '.jpeg',
  '.gif', '.webp', '.svg', '.pdf', '.zip',
])

const SKIP_DIR_PREFIXES = [
  'node_modules/',
  '.next/',
  '.git/',
  'dist/',
  'build/',
  'out/',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RED    = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN  = '\x1b[32m'
const RESET  = '\x1b[0m'

function getTrackedFiles(): string[] {
  try {
    const output = execSync('git ls-files', { encoding: 'utf8' })
    return output.trim().split('\n').filter(Boolean)
  } catch {
    console.error(`${RED}Erro: não foi possível listar arquivos git.${RESET}`)
    process.exit(1)
  }
}

function shouldSkip(file: string): boolean {
  if (SKIP_FILENAMES.has(path.basename(file))) return true
  if (SKIP_EXTENSIONS.has(path.extname(file))) return true
  if (SKIP_DIR_PREFIXES.some((prefix) => file.startsWith(prefix))) return true
  // Nunca escanear arquivos .env com dados reais (não deveriam ser commitados,
  // mas se estiverem, o próprio conteúdo pode dar falso positivo no scan)
  if (file === '.env' || file === '.env.local') return true
  return false
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const files = getTrackedFiles()
let totalFindings = 0

console.log(`\nEscaneando ${files.length} arquivo(s) rastreados pelo git...\n`)

for (const file of files) {
  if (shouldSkip(file)) continue
  if (!existsSync(file)) continue

  let content: string
  try {
    content = readFileSync(file, 'utf8')
  } catch {
    continue // Arquivo binário ou sem permissão de leitura
  }

  const lines = content.split('\n')

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]

    for (const { name, regex } of SECRET_PATTERNS) {
      if (regex.test(line)) {
        const lineNum  = lineIndex + 1
        const preview  = line.trim().substring(0, 100)
        console.error(`${RED}[FINDING] ${file}:${lineNum}${RESET}`)
        console.error(`${YELLOW}  Padrão: ${name}${RESET}`)
        console.error(`  Linha:  ${preview}${preview.length === 100 ? '...' : ''}\n`)
        totalFindings++
        break // Um achado por linha é suficiente
      }
    }
  }
}

if (totalFindings > 0) {
  console.error(`${RED}${'─'.repeat(60)}`)
  console.error(`  ${totalFindings} secret(s) detectado(s) no código.`)
  console.error(`  Remova-os e nunca comite credenciais reais.`)
  console.error(`  Use variáveis de ambiente (.env.local) — nunca hardcode.`)
  console.error(`${'─'.repeat(60)}${RESET}\n`)
  process.exit(1)
} else {
  console.log(`${GREEN}✅  Nenhum secret detectado nos ${files.length} arquivo(s) escaneados.${RESET}\n`)
}
