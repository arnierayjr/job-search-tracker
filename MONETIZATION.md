# JobTracer — Monetization Plan

> Internal document. Not published to the site. This outlines the strategy for turning JobTracer into a profitable product.

---

## Where JobTracer Stands

**Strengths:**
- Clean, professional UI that looks polished and trustworthy
- Archer AI + the Aim Assessment are genuinely differentiated — most trackers are just spreadsheets
- The archery theme is memorable and marketable
- Good feature breadth: application tracking, contacts, follow-ups, documents, AI coaching

**What needs to happen before charging users:**

1. **Real backend** — all data currently lives in `localStorage`. If a user clears their browser or switches devices, everything is gone. That's a dealbreaker for a paid product. Migrate to cloud storage (Supabase or Firebase recommended).
2. **Archer API live** — the AI is the main draw. It currently falls back to a mock response. Get the Render deployment funded and live.
3. **Real auth** — current auth is also `localStorage`-based. A database-backed auth system (Supabase Auth is free to start) is required for paying users.

---

## Monetization Model: Freemium

| Tier | Price | What's Included |
|---|---|---|
| **Free** | $0 | Up to 10 applications, basic tracking, 5 Archer messages/month |
| **Hunter** | $7–9/mo | Unlimited applications, unlimited Archer, Aim Assessment, contacts |
| **Pro** | $15–19/mo | Everything + resume storage, analytics, priority support |

The Aim Assessment is the primary upsell hook — gate it behind the Hunter tier.

---

## Marketing Strategy

**Where job seekers actually are:**

- **TikTok / Instagram Reels** — "watch Archer analyze my resume" style content. Show the Aim Assessment in action. Job search content performs extremely well. The visual target + arrows result is highly shareable.
- **LinkedIn** — post Aim Assessment results as shareable content. "Archer gave me a 7.8/10 — here's what I'm working on." People will want to try it.
- **Reddit** — r/jobs, r/careerguidance, r/resumes, r/cscareerquestions. Add value first, mention the tool organically.
- **Product Hunt** — a well-timed launch can drive thousands of signups in a single day.
- **SEO** — target "job application tracker", "AI job search tool", "job search organizer" — relatively low competition right now.

**The Aim Assessment is the marketing asset** — it's visual, shareable, and emotional. Lead every campaign with it.

---

## Technical Roadmap to Monetization

### Phase 1 — Infrastructure
- [ ] Deploy Archer API on Render (unblock the AI)
- [ ] Migrate data layer from `localStorage` to Supabase (PostgreSQL + Row Level Security)
- [ ] Migrate auth from `localStorage` to Supabase Auth (email/password + OAuth)
- [ ] Keep the frontend static — Supabase JS client works directly from the browser

### Phase 2 — Billing
- [ ] Integrate Stripe for subscription billing
- [ ] Build a simple billing/upgrade page within the app
- [ ] Implement feature gating (free tier limits enforced server-side via Supabase RLS)

### Phase 3 — Beta
- [ ] Soft launch to 50–100 beta users for free
- [ ] Collect feedback, fix friction points
- [ ] Gather 20–30 testimonials / positive reviews

### Phase 4 — Public Launch
- [ ] Product Hunt launch
- [ ] TikTok/LinkedIn content campaign featuring Aim Assessment
- [ ] Enable paid tiers

---

## Revenue Projections (Conservative)

| Users | Conversion | MRR |
|---|---|---|
| 1,000 free | 5% → 50 paid @ $9 | $450/mo |
| 5,000 free | 5% → 250 paid @ $9 | $2,250/mo |
| 20,000 free | 5% → 1,000 paid @ $9 | $9,000/mo |

---

## Notes
- Supabase free tier supports up to 50,000 MAU — no infrastructure cost until meaningful scale
- Render free tier for the Archer API has cold starts; upgrade to a paid instance ($7/mo) before launch
- Stripe takes 2.9% + $0.30 per transaction
