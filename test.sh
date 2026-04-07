#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GRAY='\033[0;90m'
NC='\033[0m'

BASE_AUTH="http://localhost:3001"
BASE_USER="http://localhost:3002"
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

print_section "REGISTER  →  POST /auth/register"
REGISTER=$(curl -s -X POST $BASE_AUTH/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "$REGISTER"

print_section "LOGIN  →  POST /auth/login"
LOGIN=$(curl -s -X POST $BASE_AUTH/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
check "$LOGIN" "accesstoken"
TOKEN=$(echo $LOGIN | grep -o '"accesstoken":"[^"]*"' | cut -d'"' -f4)

print_section "PROFILE  →  GET /users/me"
ME=$(curl -s $BASE_USER/users/me \
  -H "Authorization: Bearer $TOKEN")
check "$ME"

# ── ERROR CASES ───────────────────────────────────────────

print_section "LOGIN con contraseña incorrecta  →  debe fallar"
BAD_LOGIN=$(curl -s -X POST $BASE_AUTH/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"wrongpassword\"}")
check_fail "$BAD_LOGIN"

print_section "PROFILE sin token  →  debe fallar"
NO_TOKEN=$(curl -s $BASE_USER/users/me)
check_fail "$NO_TOKEN"

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
