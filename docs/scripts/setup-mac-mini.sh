#!/bin/bash
# setup-mac-mini.sh
# Run this ONCE on the Mac Mini before your holiday.
# Sets up everything needed for autonomous operation.
#
# Usage: bash setup-mac-mini.sh

set -e

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║       gofal.wales — Mac Mini Setup                   ║"
echo "║       Run once before leaving for holiday            ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ─── 1. Check prerequisites ───────────────────────────────────────────────────
echo "Step 1: Checking prerequisites..."

command -v brew >/dev/null 2>&1 || {
  echo "Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
}

command -v node >/dev/null 2>&1 || {
  echo "Installing Node.js..."
  brew install node
}

command -v git >/dev/null 2>&1 || {
  echo "Installing git..."
  brew install git
}

command -v gh >/dev/null 2>&1 || {
  echo "Installing GitHub CLI..."
  brew install gh
}

command -v tmux >/dev/null 2>&1 || {
  echo "Installing tmux..."
  brew install tmux
}

echo "✓ All prerequisites installed"

# ─── 2. Install Claude Code ───────────────────────────────────────────────────
echo ""
echo "Step 2: Installing Claude Code..."
npm install -g @anthropic-ai/claude-code
echo "✓ Claude Code installed: $(claude --version)"

# ─── 3. Prevent Mac Mini from sleeping ───────────────────────────────────────
echo ""
echo "Step 3: Preventing sleep..."
sudo pmset -a sleep 0
sudo pmset -a disksleep 0
sudo pmset -a displaysleep 30
sudo pmset -a powernap 0
sudo systemsetup -setcomputersleep Never 2>/dev/null || true
echo "✓ Sleep disabled (display will sleep after 30min but system stays on)"

# ─── 4. GitHub CLI auth ───────────────────────────────────────────────────────
echo ""
echo "Step 4: GitHub CLI authentication..."
if ! gh auth status >/dev/null 2>&1; then
  echo "You need to authenticate with GitHub CLI."
  gh auth login
else
  echo "✓ Already authenticated: $(gh auth status 2>&1 | grep 'Logged in' | head -1)"
fi

# ─── 5. Clone repo ────────────────────────────────────────────────────────────
echo ""
echo "Step 5: Setting up repo..."
REPO_DIR="$HOME/gofalcymru"

if [ ! -d "$REPO_DIR" ]; then
  echo "Enter your GitHub repo URL (e.g. https://github.com/yourname/gofalcymru):"
  read REPO_URL
  git clone "$REPO_URL" "$REPO_DIR"
  echo "✓ Repo cloned to $REPO_DIR"
else
  echo "✓ Repo already exists at $REPO_DIR"
  cd "$REPO_DIR" && git pull origin main
fi

# ─── 6. Environment variables ────────────────────────────────────────────────
echo ""
echo "Step 6: Setting up environment variables..."
ENV_FILE="$REPO_DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" << 'ENVEOF'
# gofal.wales environment variables
# Fill these in before starting the build

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
RESEND_FROM_EMAIL=agents@gofal.wales

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

UNSPLASH_ACCESS_KEY=

SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

NATHAN_EMAIL=
ENVEOF

  echo ""
  echo "⚠️  IMPORTANT: Fill in $ENV_FILE before starting the build"
  echo "   Open it now: nano $ENV_FILE"
  echo ""
  read -p "Press Enter when you've filled in the env vars..."
else
  echo "✓ .env.local already exists"
fi

# Export for shell scripts
export $(grep -v '^#' "$ENV_FILE" | grep -v '^$' | xargs) 2>/dev/null || true

# ─── 7. Install project dependencies ─────────────────────────────────────────
echo ""
echo "Step 7: Installing project dependencies..."
cd "$REPO_DIR"
if [ -f "package.json" ]; then
  npm install
  echo "✓ Dependencies installed"
else
  echo "Note: No package.json yet — Architect will create the Next.js project"
fi

# ─── 8. Make scripts executable ──────────────────────────────────────────────
echo ""
echo "Step 8: Making scripts executable..."
chmod +x "$REPO_DIR/gofal-build.sh" 2>/dev/null || true
chmod +x "$REPO_DIR/scripts/setup/"*.sh 2>/dev/null || true
echo "✓ Scripts ready"

# ─── 9. Configure Claude Code ────────────────────────────────────────────────
echo ""
echo "Step 9: Configuring Claude Code..."
echo "You need to authenticate Claude Code with your Anthropic API key."
echo ""
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "Enter your Anthropic API key:"
  read -s ANTHROPIC_API_KEY
  export ANTHROPIC_API_KEY

  # Add to .env.local
  echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" >> "$ENV_FILE"
fi
echo "✓ Anthropic API key set"

# ─── 10. Set up tmux config ──────────────────────────────────────────────────
echo ""
echo "Step 10: Setting up tmux..."
cat > "$HOME/.tmux.conf" << 'TMUXEOF'
# gofal.wales tmux config
set -g history-limit 50000
set -g mouse on
set -g default-terminal "screen-256color"
set -g status-right "gofal.wales build | %H:%M %d-%b"
set -g status-style bg=colour54,fg=white
TMUXEOF
echo "✓ tmux configured"

# ─── 11. Set up Tailscale ────────────────────────────────────────────────────
echo ""
echo "Step 11: Tailscale for remote access..."
if ! command -v tailscale >/dev/null 2>&1; then
  echo "Installing Tailscale..."
  brew install tailscale
fi

if ! tailscale status >/dev/null 2>&1; then
  echo "Starting Tailscale — follow the browser auth..."
  sudo tailscale up
else
  TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "unknown")
  echo "✓ Tailscale running — your IP: $TAILSCALE_IP"
fi

# ─── 12. Enable SSH ───────────────────────────────────────────────────────────
echo ""
echo "Step 12: Enabling SSH..."
sudo systemsetup -setremotelogin on 2>/dev/null || true
echo "✓ SSH enabled"

# ─── 13. Test the setup ──────────────────────────────────────────────────────
echo ""
echo "Step 13: Running pre-flight checks..."

ERRORS=0

# Check Claude Code
claude --version >/dev/null 2>&1 && echo "✓ Claude Code" || { echo "✗ Claude Code not working"; ERRORS=$((ERRORS+1)); }

# Check GitHub CLI
gh auth status >/dev/null 2>&1 && echo "✓ GitHub CLI authenticated" || { echo "✗ GitHub CLI not authenticated"; ERRORS=$((ERRORS+1)); }

# Check git
git -C "$REPO_DIR" status >/dev/null 2>&1 && echo "✓ Git repo" || { echo "✗ Git repo issue"; ERRORS=$((ERRORS+1)); }

# Check env vars
[ -n "$RESEND_API_KEY" ] && echo "✓ Resend API key" || { echo "✗ RESEND_API_KEY missing"; ERRORS=$((ERRORS+1)); }
[ -n "$NATHAN_EMAIL" ] && echo "✓ Nathan email" || { echo "✗ NATHAN_EMAIL missing"; ERRORS=$((ERRORS+1)); }
[ -n "$ANTHROPIC_API_KEY" ] && echo "✓ Anthropic API key" || { echo "✗ ANTHROPIC_API_KEY missing"; ERRORS=$((ERRORS+1)); }

# Check Tailscale
TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "")
[ -n "$TAILSCALE_IP" ] && echo "✓ Tailscale: $TAILSCALE_IP" || echo "⚠ Tailscale not connected (optional)"

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ All checks passed — ready to build"
else
  echo "⚠️  $ERRORS issue(s) found — fix before starting"
fi

# ─── 14. Print summary ───────────────────────────────────────────────────────
TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "not connected")
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "unknown")
HOSTNAME=$(hostname)

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║              SETUP COMPLETE                          ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  Mac Mini hostname:  $HOSTNAME"
echo "  Local IP:           $LOCAL_IP"
echo "  Tailscale IP:       $TAILSCALE_IP"
echo "  Repo:               $REPO_DIR"
echo "  Env file:           $ENV_FILE"
echo ""
echo "  TO START THE BUILD:"
echo "  cd $REPO_DIR"
echo "  tmux new-session -d -s gofal './gofal-build.sh'"
echo ""
echo "  TO CHECK IN REMOTELY:"
echo "  ssh $(whoami)@$TAILSCALE_IP"
echo "  tmux attach -t gofal"
echo ""
echo "  TO PAUSE THE BUILD:"
echo "  touch $REPO_DIR/.paused"
echo ""
echo "  TO RESUME:"
echo "  rm $REPO_DIR/.paused"
echo ""
echo "  Morning reports land in: $NATHAN_EMAIL at 7:30am UTC"
echo ""
