# Telegram AIOS Blueprint

A pattern for running your entire business from Telegram, backed by AI + a Supabase database + a Mac Mini that's always on.

Built for gofal.wales. Reusable for any project.

---

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  You on      │────▶│  Telegram Bot    │────▶│  Next.js API │
│  Phone       │◀────│  API (webhook)   │◀────│  (Mac Mini)  │
└──────────────┘     └──────────────────┘     └──────┬───────┘
                                                     │
                              ┌───────────────────────┼───────────────┐
                              │                       │               │
                       ┌──────▼──────┐  ┌─────────────▼─┐  ┌─────────▼──────┐
                       │  Supabase   │  │  OpenRouter    │  │  Code Worker   │
                       │  (Database) │  │  (AI Models)   │  │  (Claude CLI)  │
                       └─────────────┘  └───────────────┘  └────────────────┘
```

**Flow:**
1. You send a message to your Telegram bot
2. Telegram POSTs to your webhook (`/api/telegram/webhook`)
3. Webhook routes the command to the right handler
4. Handler queries Supabase, calls AI via OpenRouter, or queues a code task
5. Result is sent back to you on Telegram

---

## Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| Bot interface | Telegram Bot API | Mobile-first interface |
| Webhook server | Next.js API routes | Receives + routes commands |
| Database | Supabase (Postgres) | All business data |
| AI reasoning | OpenRouter (multi-model) | Briefings, scoring, generation |
| Code execution | Claude CLI on Mac Mini | Edit code from phone |
| Email sending | Nodemailer + Gmail SMTP | Send from your real email |
| Tunnel | Cloudflare Quick Tunnel | Expose localhost to internet |
| Process manager | pm2 (optional) | Keep worker alive |

---

## Setup Steps (for a new project)

### 1. Create the bot
- Message `@BotFather` on Telegram → `/newbot`
- Save the bot token

### 2. Install dependencies
```bash
npm install openai nodemailer @supabase/supabase-js
npm install -D @types/nodemailer
```

### 3. Environment variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# AI (OpenRouter — one key, many models)
OPENROUTER_API_KEY=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=       # Your personal chat ID (lock it down)

# Gmail (for sending from your real email)
GMAIL_ADDRESS=
GMAIL_APP_PASSWORD=     # From myaccount.google.com/apppasswords

# Cron/security
CRON_SECRET=            # Random string for webhook verification
```

### 4. Database tables
```sql
-- Code tasks (for /code command)
CREATE TABLE code_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'done', 'error')),
  result TEXT,
  files_changed TEXT[],
  telegram_chat_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Outreach pipeline (for /send + /pipeline)
CREATE TABLE outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  care_home_id UUID NOT NULL REFERENCES care_homes(id),
  email_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent'
    CHECK (status IN ('sent', 'opened', 'replied', 'claimed', 'upgraded')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  opened_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 5. File structure
```
src/
  lib/
    ai/
      claude.ts        # OpenRouter client (multi-model routing)
      prompts.ts       # All prompt templates
    email/
      gmail.ts         # Gmail SMTP sender
  app/
    api/
      telegram/
        webhook/
          route.ts     # Main bot — all commands live here
      ai/
        briefing/      # AI business briefing
        score-enquiry/ # Lead scoring
        generate-outreach/  # Email generation
        generate-descriptions/ # Content generation
      cron/
        daily-briefing/    # 7am cron → email briefing
        claim-followup/    # 10am cron → reminder emails
scripts/
  code-worker.ts       # Polls Supabase, runs Claude CLI
```

### 6. Register the webhook
```bash
# With Cloudflare tunnel (dev/always-on Mac)
cloudflared tunnel --url http://localhost:3000
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<TUNNEL>.trycloudflare.com/api/telegram/webhook"

# Or with Vercel (production)
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yourdomain.com/api/telegram/webhook"
```

### 7. Start the code worker
```bash
# Foreground (testing)
npx tsx scripts/code-worker.ts

# Background (production)
pm2 start scripts/code-worker.ts --interpreter "npx" --interpreter-args "tsx"
```

---

## Command Reference

### Dashboard
| Command | What it does |
|---------|-------------|
| `/briefing` | AI reads all your data, generates a morning briefing with action items |
| `/stats` | Quick numbers from your database |

### Explore Data
| Command | What it does |
|---------|-------------|
| `/search [query]` | Search your database by keyword |
| `/lookup [name or ID]` | Pull up a full record with all fields |
| `/county [name]` | Group/filter by a category |
| `/data [question]` | AI generates SQL, queries your DB, returns results |

### Take Action
| Command | What it does |
|---------|-------------|
| `/send [target]` | AI generates personalised email + sends from your Gmail |
| `/outreach [target]` | Preview the email without sending |
| `/pipeline` | View your outreach funnel (sent → opened → replied → converted) |

### Content
| Command | What it does |
|---------|-------------|
| `/linkedin [topic]` | AI generates a LinkedIn post with your data baked in |

### Code
| Command | What it does |
|---------|-------------|
| `/code [prompt]` | Queues a Claude Code task on your Mac Mini |
| `/cancel` | Cancel running/pending tasks |

### Chat
| Command | What it does |
|---------|-------------|
| `/ask [question]` | AI answers with your business context |
| Just type anything | Same as /ask — freeform AI Q&A |

---

## Key Patterns

### 1. OpenRouter Multi-Model Routing
One API key, route by task complexity. Saves 80%+ on AI costs.

```typescript
const MODELS = {
  reasoning: "anthropic/claude-sonnet-4-6",   // Briefings, strategy
  standard: "moonshotai/kimi-k2",             // Scoring, emails
  bulk: "google/gemini-2.5-flash",            // Batch operations
};

// Usage
const response = await ask({
  prompt: "...",
  tier: "standard",  // picks the right model
});
```

### 2. Telegram Message Sending
```typescript
async function sendMessage(chatId: number, text: string) {
  // Split into 4000-char chunks (Telegram limit)
  const chunks = splitMessage(text, 4000);
  for (const chunk of chunks) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        parse_mode: "Markdown",
      }),
    });
  }
}
```

### 3. Real-Time Alerts (from any API route)
```typescript
// Export from webhook route
export async function sendTelegramAlert(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
}

// Call from any endpoint (fire-and-forget)
import("@/app/api/telegram/webhook/route").then(({ sendTelegramAlert }) => {
  sendTelegramAlert(`🔔 *New Lead*\n${name} just signed up`).catch(() => {});
}).catch(() => {});
```

### 4. Code Worker Pattern (Claude from phone)
```
Phone → Telegram → Webhook → Insert into code_tasks table
                                        ↓
Mac Mini worker polls table every 3s → picks up task
                                        ↓
Spawns: claude -p "the prompt" --output-format text
                                        ↓
Captures output + git diff → updates code_tasks row
                                        ↓
Sends result back to Telegram with files changed
```

### 5. Gmail SMTP (send from your real address)
```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD,  // App Password, not your real password
  },
});

await transporter.sendMail({
  from: `"Your Name" <${process.env.GMAIL_ADDRESS}>`,
  to: recipient,
  subject: "...",
  html: "...",
});
```

### 6. Auth — Lock to Your Chat ID Only
```typescript
function isAuthorized(chatId: number): boolean {
  const allowed = process.env.TELEGRAM_CHAT_ID;
  if (!allowed) return true;  // Open during setup
  return String(chatId) === allowed;
}
```

### 7. Vercel Crons (scheduled tasks)
```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/daily-briefing", "schedule": "0 7 * * *" },
    { "path": "/api/cron/claim-followup", "schedule": "0 10 * * *" }
  ]
}
```

Protect with `CRON_SECRET`:
```typescript
const authHeader = request.headers.get("authorization");
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## Adapting for Other Projects

The pattern is project-agnostic. To adapt:

1. **Change the database schema** — replace `care_homes`, `enquiries` etc. with your domain tables
2. **Change the prompts** — update `SYSTEM_GOFAL` and prompt templates in `prompts.ts` with your business context
3. **Change the commands** — `/county` becomes `/category`, `/lookup` queries your entities, `/send` emails your leads
4. **Keep the infrastructure** — OpenRouter client, Telegram webhook, Gmail sender, code worker, alert system all stay the same

The shell (AI client, Telegram routing, worker pattern, alert system) is ~500 lines of code. The domain-specific logic (prompts, data queries, command handlers) is what you customise per project.

---

## Running Costs

| Component | Cost |
|-----------|------|
| Telegram Bot API | Free |
| Cloudflare Quick Tunnel | Free |
| Supabase (free tier) | Free |
| OpenRouter — Gemini Flash (bulk) | ~$0.0001/request |
| OpenRouter — Kimi K2 (standard) | ~$0.001/request |
| OpenRouter — Claude Sonnet (reasoning) | ~$0.01/request |
| Gmail SMTP | Free (500 emails/day limit) |
| Daily briefing cost | ~$0.01/day |
| Total monthly (light usage) | ~$1-5 |

---

## What You End Up With

From your phone, you can:
- Get an AI-generated business briefing every morning
- Query your database in natural language
- Search and look up any record
- Generate and send personalised emails from your real Gmail
- Track your outreach pipeline
- Generate social media content
- Get real-time alerts when anything happens
- Write and deploy code to your codebase
- Ask any question and get answers with your business data baked in

All running on a Mac Mini you already own, for ~$2/month in AI costs.
