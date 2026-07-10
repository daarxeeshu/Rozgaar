# 🍂 Rozgaar — روزگار
### Kashmir's own platform for workers, artists & daily earners

---

## What's included

| Feature | Tech |
|---|---|
| SMS OTP login | Twilio Verify |
| Aadhaar-based profile | UIDAI last-4 + name |
| Real-time chat | Pusher (ap2 Mumbai) |
| UPI payment | Razorpay |
| Cash on service | Built-in |
| Database | Neon (PostgreSQL serverless) |
| ORM | Prisma |
| Deployment | Vercel (bom1 Mumbai) |
| UI | Next.js 14 + Tailwind |

---

## STEP 1 — Set up Neon Database

1. Go to **https://console.neon.tech** → Sign up free
2. Click **New Project** → Name it `rozgaar` → Region: **AWS ap-south-1 (Mumbai)**
3. Go to **Connection Details** tab
4. Copy two URLs:
   - **Pooled connection** → paste as `DATABASE_URL` (has `pgbouncer=true`)
   - **Direct connection** → paste as `DIRECT_URL` (no pgbouncer)

```env
DATABASE_URL="postgresql://USER:PASS@ep-xxx.ap-south-1.aws.neon.tech/rozgaar?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://USER:PASS@ep-xxx.ap-south-1.aws.neon.tech/rozgaar?sslmode=require"
```

---

## STEP 2 — Set up Twilio SMS OTP

1. Go to **https://console.twilio.com** → Sign up free (gets $15 credit ≈ 600 OTPs)
2. Copy **Account SID** and **Auth Token** from dashboard
3. Go to **Verify** → **Services** → Create new → Name: `rozgaar`
4. Copy the **Service SID** (starts with `VA...`)

```env
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_VERIFY_SID="VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

> **Note:** For Indian numbers (+91), Twilio needs your business name to be registered with DLT (Distributed Ledger Technology) for production. For testing/development, trial accounts work fine.

---

## STEP 3 — Set up Pusher (Real-time Chat)

1. Go to **https://pusher.com** → Sign up free
2. **Create App** → Name: `rozgaar` → Cluster: **ap2 (Mumbai)**
3. Go to **App Keys** tab, copy all 4 values:

```env
PUSHER_APP_ID="1234567"
PUSHER_KEY="abcdef1234567890"
PUSHER_SECRET="your_pusher_secret"
PUSHER_CLUSTER="ap2"
NEXT_PUBLIC_PUSHER_KEY="abcdef1234567890"
NEXT_PUBLIC_PUSHER_CLUSTER="ap2"
```

---

## STEP 4 — Set up Razorpay (UPI Payments)

1. Go to **https://dashboard.razorpay.com** → Sign up
2. For testing, use **Test Mode** (no documents needed)
3. Go to **Settings** → **API Keys** → **Generate Test Key**
4. Copy Key ID (starts with `rzp_test_`) and Key Secret

```env
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxxxxxxxxx"
```

> For production (real money), complete KYC on Razorpay dashboard (takes 1-2 days).

---

## STEP 5 — Session Secret

Generate a random 32+ character string:

```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

```env
SESSION_SECRET="paste-your-32-char-random-string-here"
```

---

## STEP 6 — Local Development

```bash
# Clone / unzip the project
cd rozgaar

# Install dependencies
npm install

# Create .env.local with all variables from above
cp .env.example .env.local
# Edit .env.local with your actual values

# Push schema to Neon
npx prisma db push

# Seed demo workers
npx prisma db seed

# Run locally
npm run dev
# Open: http://localhost:3000
```

---

## STEP 7 — Deploy to Vercel

### Option A: Via Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: rozgaar
# - Framework: Next.js (auto-detected)

# Set environment variables
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add SESSION_SECRET
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_VERIFY_SID
vercel env add PUSHER_APP_ID
vercel env add PUSHER_KEY
vercel env add PUSHER_SECRET
vercel env add PUSHER_CLUSTER
vercel env add NEXT_PUBLIC_PUSHER_KEY
vercel env add NEXT_PUBLIC_PUSHER_CLUSTER
vercel env add RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID

# Deploy to production
vercel --prod
```

### Option B: Via Vercel Dashboard (GUI)

1. Go to **https://vercel.com** → New Project
2. Import from GitHub (push your code first) or upload zip
3. Framework: **Next.js** (auto-detected)
4. Go to **Settings → Environment Variables**
5. Add ALL variables from `.env.example` with real values
6. Click **Deploy**

> **Region**: Vercel `bom1` (Mumbai) is pre-configured in `vercel.json` for best Kashmir latency.

---

## STEP 8 — After Deployment

```bash
# Run migrations on production Neon DB
# (Vercel build command already runs prisma generate)
# Run seed once manually via Vercel CLI:
vercel env pull .env.production.local
DATABASE_URL=$(cat .env.production.local | grep DATABASE_URL | cut -d= -f2) npx prisma db seed

# Or connect to Neon directly and run seed
```

---

## Project Structure

```
rozgaar/
├── prisma/
│   ├── schema.prisma          # Full DB schema
│   └── seed.ts                # 8 demo Kashmiri workers
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── send-otp/  # Twilio OTP send
│   │   │   │   ├── verify-otp/# OTP verify + session
│   │   │   │   ├── setup-profile/ # Aadhaar + profile
│   │   │   │   └── me/        # Current user
│   │   │   ├── workers/
│   │   │   │   ├── route.ts   # List workers
│   │   │   │   ├── [id]/      # Worker detail
│   │   │   │   └── services/  # Post a service
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts   # Create/list bookings
│   │   │   │   └── [id]/cash-confirm/
│   │   │   ├── chat/
│   │   │   │   ├── route.ts   # Send/fetch messages
│   │   │   │   └── rooms/     # Chat room list
│   │   │   ├── payment/
│   │   │   │   ├── create-order/ # Razorpay order
│   │   │   │   └── verify/    # Payment verify
│   │   │   └── pusher/auth/   # Pusher auth
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx           # Entry point
│   ├── components/
│   │   ├── auth/
│   │   │   ├── OtpLogin.tsx   # SMS OTP UI
│   │   │   └── AadhaarSetup.tsx # Profile setup
│   │   ├── chat/
│   │   │   └── ChatWindow.tsx # Real-time chat
│   │   ├── payment/
│   │   │   └── PaymentSheet.tsx # UPI + Cash
│   │   ├── tabs/
│   │   │   ├── HomeTab.tsx    # Browse workers
│   │   │   ├── WorkerDetailTab.tsx
│   │   │   ├── PostAdTab.tsx  # Post a service
│   │   │   ├── BookingsTab.tsx
│   │   │   ├── ChatListTab.tsx
│   │   │   └── ProfileTab.tsx
│   │   ├── ui/BottomNav.tsx
│   │   ├── worker/WorkerCard.tsx
│   │   └── MainApp.tsx
│   ├── lib/
│   │   ├── prisma.ts          # DB singleton
│   │   ├── session.ts         # iron-session
│   │   ├── sms.ts             # Twilio OTP
│   │   ├── pusher.ts          # Real-time
│   │   ├── payment.ts         # Razorpay
│   │   └── store.ts           # Zustand state
│   └── types/index.ts
├── .env.example               # All variables template
├── vercel.json                # Vercel config (bom1)
├── next.config.js
└── README.md
```

---

## Cost Estimate (Monthly)

| Service | Free Tier | After free tier |
|---|---|---|
| Neon DB | 0.5 GB storage, 3 GB transfer | $19/mo |
| Vercel | 100 GB bandwidth, hobby | $20/mo pro |
| Twilio Verify | $0.05/OTP | Pay per OTP |
| Pusher | 200k messages/day | $49/mo |
| Razorpay | 2% per transaction | 2% |

**For MVP/early stage: completely free** (all services have generous free tiers)

---

## Next features to build

- [ ] Worker availability calendar
- [ ] Push notifications (FCM)
- [ ] Review & rating system
- [ ] Worker earnings dashboard
- [ ] Kashmiri / Urdu full UI translation
- [ ] WhatsApp OTP as fallback
- [ ] Admin panel for moderation
- [ ] UIDAI AUA integration (official Aadhaar OTP)

---

*Built with ❤️ for Kashmir — Rozgaar v1.0*
