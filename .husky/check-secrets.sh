#!/usr/bin/env bash
# Detects secrets and sensitive data in staged files before commit.
# Blocks commit if any pattern is found.

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

FOUND=0

for FILE in $STAGED_FILES; do
  # Skip binary files and lock files
  if [[ "$FILE" == *.png || "$FILE" == *.jpg || "$FILE" == *.ico || \
        "$FILE" == *.woff || "$FILE" == *.woff2 || \
        "$FILE" == package-lock.json || "$FILE" == yarn.lock ]]; then
    continue
  fi

  # Skip .env.example (it's meant to be committed with empty values)
  if [[ "$FILE" == ".env.example" ]]; then
    continue
  fi

  CONTENT=$(git show ":$FILE" 2>/dev/null)

  # 1. Block any .env.local from being staged
  if [[ "$FILE" == ".env.local" || "$FILE" == ".env" ]]; then
    echo -e "${RED}[SECRETS] BLOQUEADO: arquivo de ambiente sensível staged: $FILE${NC}"
    FOUND=1
    continue
  fi

  # 2. Detect common secret key prefixes
  if echo "$CONTENT" | grep -qE '(sk-[a-zA-Z0-9]{20,}|pk_live_[a-zA-Z0-9]{20,}|pk_test_[a-zA-Z0-9]{20,}|whsec_[a-zA-Z0-9]{20,}|xoxb-[0-9]+-[a-zA-Z0-9-]+|ghp_[a-zA-Z0-9]{36}|eyJ[a-zA-Z0-9_-]{30,})'; then
    echo -e "${RED}[SECRETS] BLOQUEADO: padrão de API key detectado em: $FILE${NC}"
    echo -e "${YELLOW}  Padrões detectados: sk-, pk_live_, pk_test_, whsec_, xoxb-, ghp_, JWT${NC}"
    FOUND=1
  fi

  # 3. Detect URLs with embedded credentials (postgres://user:pass@host)
  if echo "$CONTENT" | grep -qE '[a-zA-Z]+://[^:@/\s]+:[^@/\s]{3,}@'; then
    echo -e "${RED}[SECRETS] BLOQUEADO: URL com credenciais embutidas detectada em: $FILE${NC}"
    FOUND=1
  fi

  # 4. Detect high-entropy strings assigned to common secret variable names
  if echo "$CONTENT" | grep -qE '(API_KEY|SECRET|PASSWORD|TOKEN|PRIVATE_KEY)\s*=\s*["\x27]?[a-zA-Z0-9+/]{30,}["\x27]?'; then
    echo -e "${RED}[SECRETS] BLOQUEADO: variável sensível com valor real detectada em: $FILE${NC}"
    echo -e "${YELLOW}  Use variáveis de ambiente (.env.local) — nunca hardcode secrets no código.${NC}"
    FOUND=1
  fi
done

if [ "$FOUND" -eq 1 ]; then
  echo ""
  echo -e "${RED}============================================================${NC}"
  echo -e "${RED}  COMMIT BLOQUEADO: secrets detectados nos arquivos staged.${NC}"
  echo -e "${RED}  Remova os valores sensíveis antes de commitar.${NC}"
  echo -e "${RED}  Secrets devem estar APENAS no .env.local (nunca commitado).${NC}"
  echo -e "${RED}============================================================${NC}"
  exit 1
fi

exit 0
