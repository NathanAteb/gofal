#!/bin/bash
# gofal-build.sh
# Keeps Claude Code running continuously on the Mac Mini.
# Run inside tmux so it survives SSH disconnection.
#
# Usage:
#   tmux new-session -d -s gofal './gofal-build.sh'
#   tmux attach -t gofal   # to check in
#   Ctrl+B then D           # to detach without stopping

set -e

REPO_DIR="$HOME/gofalcymru"
PROMPT_FILE="$REPO_DIR/.claude-prompt.md"
LOG_DIR="$REPO_DIR/logs/sessions"
KILL_SWITCH="$REPO_DIR/.paused"

mkdir -p "$LOG_DIR"

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║          gofal.wales autonomous build            ║"
echo "║          Started: $(date '+%Y-%m-%d %H:%M:%S')          ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

SESSION=0

while true; do
  SESSION=$((SESSION + 1))
  TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
  LOG_FILE="$LOG_DIR/session-$TIMESTAMP.log"

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Session $SESSION — $TIMESTAMP"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Check kill switch
  if [ -f "$KILL_SWITCH" ]; then
    echo "  ⏸  PAUSED — remove .paused file to resume"
    sleep 30
    continue
  fi

  # Check completion
  if [ -f "$REPO_DIR/DEFINITION_OF_DONE.md" ]; then
    TOTAL=$(grep -c '^\- \[' "$REPO_DIR/DEFINITION_OF_DONE.md" 2>/dev/null || echo 0)
    DONE=$(grep -c '^\- \[x\]' "$REPO_DIR/DEFINITION_OF_DONE.md" 2>/dev/null || echo 0)
    echo "  📊 Progress: $DONE/$TOTAL items complete"

    if [ "$TOTAL" -gt 0 ] && [ "$DONE" -eq "$TOTAL" ]; then
      echo ""
      echo "  🎉 DEFINITION OF DONE COMPLETE!"
      echo "  gofal.wales is fully built."
      echo ""
      # Send completion notification
      if [ -n "$RESEND_API_KEY" ] && [ -n "$NATHAN_EMAIL" ]; then
        curl -s -X POST 'https://api.resend.com/emails' \
          -H "Authorization: Bearer $RESEND_API_KEY" \
          -H 'Content-Type: application/json' \
          -d "{\"from\":\"agents@gofal.wales\",\"to\":\"$NATHAN_EMAIL\",\"subject\":\"🎉 gofal.wales is fully built!\",\"text\":\"All $TOTAL items in DEFINITION_OF_DONE.md are complete. gofal.wales is live and production-ready.\"}"
      fi
      break
    fi
  fi

  # Pull latest
  echo "  ↓  Pulling latest main..."
  cd "$REPO_DIR"
  git pull --rebase origin main 2>&1 | tail -2

  # Run Claude Code
  echo "  ▶  Starting Claude Code session..."
  echo ""

  claude --print "$(cat $PROMPT_FILE)" 2>&1 | tee "$LOG_FILE"

  EXIT_CODE=${PIPESTATUS[0]}

  echo ""
  echo "  Session ended (exit: $EXIT_CODE)"
  echo "  Log: $LOG_FILE"

  # Show last task completed
  if [ -d "$REPO_DIR/tasks/done" ]; then
    LAST_DONE=$(ls -t "$REPO_DIR/tasks/done/" 2>/dev/null | head -1)
    if [ -n "$LAST_DONE" ]; then
      echo "  Last completed: $LAST_DONE"
    fi
  fi

  echo ""
  echo "  Restarting in 30 seconds... (Ctrl+C to stop)"
  echo ""
  sleep 30
done
