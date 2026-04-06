# Pre-Holiday Checklist
## Do everything on this list before you leave

---

## On your Mac Mini (in person)

- [ ] Run `bash scripts/setup/setup-mac-mini.sh`
- [ ] Fill in all values in `.env.local`
- [ ] Run `npm install` in the repo
- [ ] Authenticate Claude Code: `claude` and follow prompts
- [ ] Authenticate GitHub CLI: `gh auth login`
- [ ] Test Claude Code works: `claude --print "Say hello"`
- [ ] Test git push works: make a test commit and push
- [ ] Start the build in tmux: `tmux new-session -d -s gofal './gofal-build.sh'`
- [ ] Attach and watch for 5 minutes: `tmux attach -t gofal`
- [ ] Detach: `Ctrl+B then D`
- [ ] Verify Tailscale is running: `tailscale status`
- [ ] Note your Tailscale IP: `tailscale ip -4`
- [ ] Verify SSH works from another device on your network

## On GitHub

- [ ] Add all secrets (see GITHUB_SECRETS.md)
- [ ] Enable GitHub Actions in repo settings
- [ ] Add `.github/workflows/standup-morning.yml`
- [ ] Add `.github/workflows/standup-afternoon.yml`
- [ ] Add `.github/workflows/morning-report.yml`
- [ ] Run morning report manually to test email delivery
- [ ] Set Anthropic API spend limit to $50/month

## On your phone

- [ ] Install Tailscale app and sign in
- [ ] Install Termius (SSH client) or similar
- [ ] Test SSH to Mac Mini via Tailscale: `ssh you@[tailscale-ip]`
- [ ] Test `tmux attach -t gofal` works from phone
- [ ] Whitelist gofal.wales morning report email in case it goes to spam

## Final checks

- [ ] Morning report lands in your inbox (trigger manually)
- [ ] Mac Mini not sleeping: System Settings → Battery → sleep = Never
- [ ] Router is stable (consider smart plug reboot schedule)
- [ ] Mac Mini is plugged in and not on battery
- [ ] `.paused` file does NOT exist in repo: `ls gofalcymru/.paused`

---

## While you're away

**Every morning:**
Read the report email. Takes 2 minutes.

**If something looks wrong:**
```bash
# SSH in via Tailscale
ssh you@[tailscale-ip]

# Check the build session
tmux attach -t gofal

# Pause if needed
touch gofalcymru/.paused

# Resume when ready
rm gofalcymru/.paused
```

**If the Mac Mini crashed or rebooted:**
```bash
ssh you@[tailscale-ip]
cd gofalcymru
tmux new-session -d -s gofal './gofal-build.sh'
```

**Check progress anytime:**
```bash
ssh you@[tailscale-ip]
cd gofalcymru
npx ts-node scripts/standups/check-completion.ts
```

---

## Emergency contacts

- Anthropic API issues: console.anthropic.com
- Vercel deployment issues: vercel.com/dashboard
- Supabase issues: app.supabase.com
- GitHub Actions: github.com/[your-repo]/actions

---

Enjoy your holiday. The Mac Mini is building gofal.wales.
