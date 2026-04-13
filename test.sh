#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GRAY='\033[0;90m'
NC='\033[0m'

BASE_GATEWAY="http://localhost:3000"
EMAIL="test_$(date +%s)@test.com"
PASSWORD="1234"
USERNAME="testuser"

print_section() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}  $1${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

check() {
  local response="$1"
  local key="${2:-id}"
  if echo "$response" | grep -q "\"$key\""; then
    echo -e "${GREEN}  ✔ OK${NC}"
  else
    echo -e "${RED}  ✘ FAILED${NC}"
  fi
  echo -e "${GRAY}  $response${NC}"
}

check_fail() {
  local response="$1"
  local key="${2:-statusCode}"
  if echo "$response" | grep -q "\"$key\""; then
    echo -e "${GREEN}  ✔ OK (expected error)${NC}"
  else
    echo -e "${RED}  ✘ FAILED (should have returned error)${NC}"
  fi
  echo -e "${GRAY}  $response${NC}"
}

# ── HAPPY PATH ────────────────────────────────────────────

print_section "HEALTH  →  GET /health"
HEALTH=$(curl -s $BASE_GATEWAY/health)
check "$HEALTH" "status"

print_section "REGISTER  →  POST /auth/register (gateway)"
REGISTER=$(curl -s -X POST $BASE_GATEWAY/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "$REGISTER"

print_section "LOGIN  →  POST /auth/login (gateway)"
LOGIN=$(curl -s -X POST $BASE_GATEWAY/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "$LOGIN" "accessToken"
TOKEN=$(echo $LOGIN | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

print_section "PROFILE  →  GET /users/me (gateway)"
ME=$(curl -s $BASE_GATEWAY/users/me \
  -H "Authorization: Bearer $TOKEN")
check "$ME"

# ── ERROR CASES ───────────────────────────────────────────

print_section "LOGIN con contraseña incorrecta  →  debe fallar"
BAD_LOGIN=$(curl -s -X POST $BASE_GATEWAY/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"wrongpassword\"}")
check_fail "$BAD_LOGIN"

print_section "PROFILE sin token  →  debe fallar"
NO_TOKEN=$(curl -s $BASE_GATEWAY/users/me)
check_fail "$NO_TOKEN"

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
