#!/bin/bash
set -e

# Must be run from the repo root
if [ ! -f "backend/BookATrip.Api/BookATrip.Api.csproj" ]; then
  echo "Error: run this script from the repository root (Book-A-Trip/)"
  exit 1
fi

echo "=== Book-A-Trip Setup ==="
echo ""

# ── Config files ──────────────────────────────────────────────────────────────

if [ ! -f backend/BookATrip.Api/appsettings.json ]; then
  cp backend/BookATrip.Api/appsettings.Example.json backend/BookATrip.Api/appsettings.json
  echo "✓ Created backend/BookATrip.Api/appsettings.json"
else
  echo "· appsettings.json already exists, skipping"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "✓ Created frontend/.env"
else
  echo "· frontend/.env already exists, skipping"
fi

echo ""

# ── User secrets ──────────────────────────────────────────────────────────────

PROJECT="backend/BookATrip.Api"

EXISTING_CLIENT_ID=$(dotnet user-secrets list --project "$PROJECT" 2>/dev/null | grep "Google:ClientId" | cut -d= -f2 | xargs)
EXISTING_CLIENT_SECRET=$(dotnet user-secrets list --project "$PROJECT" 2>/dev/null | grep "Google:ClientSecret" | cut -d= -f2 | xargs)
EXISTING_JWT=$(dotnet user-secrets list --project "$PROJECT" 2>/dev/null | grep "Jwt:Secret" | cut -d= -f2 | xargs)
EXISTING_ENC=$(dotnet user-secrets list --project "$PROJECT" 2>/dev/null | grep "Encryption:Key" | cut -d= -f2 | xargs)

echo "=== Google OAuth credentials ==="
echo "Get these from: console.cloud.google.com → APIs & Services → Credentials"
echo "Authorized redirect URI must include: http://localhost:5000/api/auth/google-callback"
echo ""

read -p "Google Client ID${EXISTING_CLIENT_ID:+ (leave blank to keep existing)}: " CLIENT_ID
if [ -n "$CLIENT_ID" ]; then
  dotnet user-secrets set "Google:ClientId" "$CLIENT_ID" --project "$PROJECT"
  echo "✓ Google:ClientId set"
elif [ -n "$EXISTING_CLIENT_ID" ]; then
  echo "· Google:ClientId unchanged"
else
  echo "⚠ Google:ClientId not set — login will not work"
fi

echo ""
read -p "Google Client Secret${EXISTING_CLIENT_SECRET:+ (leave blank to keep existing)}: " CLIENT_SECRET
if [ -n "$CLIENT_SECRET" ]; then
  dotnet user-secrets set "Google:ClientSecret" "$CLIENT_SECRET" --project "$PROJECT"
  echo "✓ Google:ClientSecret set"
elif [ -n "$EXISTING_CLIENT_SECRET" ]; then
  echo "· Google:ClientSecret unchanged"
else
  echo "⚠ Google:ClientSecret not set — login will not work"
fi

echo ""

# ── Auto-generate JWT secret and encryption key if not set ───────────────────

if [ -z "$EXISTING_JWT" ] || [[ "$EXISTING_JWT" == *"placeholder"* ]]; then
  JWT_SECRET=$(openssl rand -base64 48)
  dotnet user-secrets set "Jwt:Secret" "$JWT_SECRET" --project "$PROJECT"
  echo "✓ Jwt:Secret generated"
else
  echo "· Jwt:Secret already set"
fi

if [ -z "$EXISTING_ENC" ] || [[ "$EXISTING_ENC" == "AAAA"* ]]; then
  ENC_KEY=$(openssl rand -base64 32)
  dotnet user-secrets set "Encryption:Key" "$ENC_KEY" --project "$PROJECT"
  echo "✓ Encryption:Key generated"
else
  echo "· Encryption:Key already set"
fi

echo ""

# ── Database ──────────────────────────────────────────────────────────────────

echo "=== Database ==="
dotnet ef database update --project "$PROJECT"
echo "✓ Migrations applied"

echo ""

# ── Frontend dependencies ─────────────────────────────────────────────────────

echo "=== Frontend ==="
(cd frontend && npm install --silent)
echo "✓ npm dependencies installed"

echo ""
echo "=== Done! ==="
echo ""
echo "Start the backend:  dotnet run --project backend/BookATrip.Api"
echo "Start the frontend: cd frontend && npm run dev"
echo ""
echo "Backend:  http://localhost:5000  (Swagger: http://localhost:5000/swagger)"
echo "Frontend: http://localhost:3000"
