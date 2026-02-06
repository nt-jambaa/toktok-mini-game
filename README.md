# TokTok Farm — Mini-Game for Food Delivery

A Tamagotchi-style idle growth game embedded inside the TokTok food delivery app. Users raise a virtual farm animal, keep it alive by feeding it, and speed up its growth by placing real food orders. When the animal is fully grown, the user earns a category-specific food coupon.

---

## How the Game Works

### 1. Pick an Animal

The user chooses one of five animals, each tied to a food category and reward tier:

| Animal | Growth Time | Reward Category | Coupon Value |
|--------|-------------|-----------------|--------------|
| Chicken | 3 days | Chicken & Wings | 5,000 MNT |
| Sheep | 5 days | Mongolian / Traditional | 8,000 MNT |
| Pig | 5 days | Asian / Korean / BBQ | 8,000 MNT |
| Cow | 7 days | Burgers / Steaks / Pizza | 15,000 MNT |
| Horse | 10 days | Coffee / Bakery / Desserts | 25,000 MNT |

Longer growth time = higher reward. This creates a risk/reward trade-off.

### 2. Feed It (Hunger Bar)

- The animal has a **72-hour hunger timer**. If the user doesn't open the app and tap "Feed" within 72 hours, the animal runs away and progress is lost.
- This mechanic drives **daily app opens** — users come back to feed their animal even when they don't plan to order food.

### 3. Speed Up Growth with Real Orders

- Each real food order placed on TokTok **reduces the growth timer by 24 hours**.
- A 3-day Chicken can be completed in just 3 orders instead of waiting 3 days.
- This is the core monetization loop: the game directly incentivizes ordering food.

### 4. Harvest the Reward

- When the growth bar hits 100%, the user "harvests" the animal and receives a coupon for the matching food category.
- Celebration animation plays, XP is earned, and they can start again with a new animal.

### 5. Leaderboard

- Users earn **Farm XP** for each harvest. A monthly leaderboard ranks the top farmers.
- Top 10 players earn a **Golden Harvest** bonus reward (100,000+ MNT in coupons).
- Creates social competition and long-term retention.

---

## What's the Profit?

### For Users

| Benefit | How |
|---------|-----|
| Free food coupons | Earn 5,000–25,000 MNT coupons just by playing |
| Fun daily habit | Tamagotchi-style engagement without spending money |
| Discover new restaurants | Coupons push users to try new food categories |
| Competitive rewards | Top leaderboard players earn big bonus prizes |

**Bottom line:** Users get a fun reason to open the app daily and earn real food discounts.

### For Restaurants

| Benefit | How |
|---------|-----|
| Increased order volume | Users place more orders to speed up their animal's growth |
| Category-targeted traffic | Each animal maps to a food category — restaurants in that category see direct coupon-driven orders |
| New customer acquisition | Coupon rewards push users to try restaurants they wouldn't normally visit |
| Higher order frequency | The 72-hour feeding mechanic ensures users are in the app every 1–3 days |

**Bottom line:** Restaurants get more orders and new customers, funded by a small coupon cost that's far cheaper than traditional advertising.

### For the Food Delivery Platform (TokTok)

| Benefit | How |
|---------|-----|
| Daily Active Users (DAU) increase | Hunger timer forces daily app opens even without intent to order |
| Order frequency boost | Each "speed up" is a real paid order — game directly drives GMV |
| Retention & stickiness | Losing progress creates emotional investment; users don't want to switch to competitors |
| Viral potential | Leaderboard + social sharing (e.g., "I raised a Horse!") creates organic word-of-mouth |
| Category steering | Platform can steer demand to underperforming food categories by adjusting coupon values |
| Low coupon cost vs. high LTV | A 5,000 MNT coupon can generate 3+ orders at 15,000–30,000 MNT each — massive ROI |
| Data & insights | Animal choice and order patterns reveal user food preferences for personalization |

**Bottom line:** The game is a retention and monetization engine disguised as entertainment. It increases DAU, order frequency, and platform GMV at a fraction of traditional marketing costs.

### Revenue Impact Estimate

Assuming 10,000 active game players per month:

| Metric | Conservative Estimate |
|--------|-----------------------|
| Extra orders per user/month | +2 to +4 orders |
| Total extra orders | 20,000–40,000/month |
| Avg order value | 20,000 MNT |
| Extra GMV generated | 400M–800M MNT/month |
| Coupon cost (avg 10,000 MNT × 10K users) | 100M MNT/month |
| Net GMV uplift | 300M–700M MNT/month |

Even conservative numbers show a **3x–7x return** on coupon investment.

---

## Can We Build This in 1 Month?

**Yes.** Here's the 4-week sprint plan:

### Week 1 — Core Game Engine

- [ ] Phaser.js game setup with WebView-compatible architecture
- [ ] Animal selection screen (5 animals with configs)
- [ ] Growth timer system with progress bar
- [ ] Hunger bar (72-hour depletion + feed reset)
- [ ] localStorage state persistence
- [ ] Matter.js leaf-drop feed animation

> Status: **Done** (this prototype covers Week 1)

### Week 2 — Backend & Order Integration

- [ ] Node.js backend with user authentication
- [ ] MongoDB/PostgreSQL database for game state
- [ ] TokTok order webhook integration (real orders trigger speed-up)
- [ ] Server-side progress validation (anti-cheat)
- [ ] Push notifications ("Your animal is hungry!")

### Week 3 — Rewards & Leaderboard

- [ ] Coupon generation system (auto-create vouchers on harvest)
- [ ] Coupon redemption flow integrated with TokTok checkout
- [ ] Live leaderboard with real XP rankings
- [ ] Monthly reset & Golden Harvest reward distribution
- [ ] Admin dashboard for coupon/game analytics

### Week 4 — Polish & Launch

- [ ] WebView integration into TokTok mobile app (iOS + Android)
- [ ] Performance optimization & loading speed
- [ ] QA testing across devices
- [ ] A/B test: game users vs. control group (measure order lift)
- [ ] Soft launch to 5% of users, then full rollout

### Team Required

| Role | People | Weeks |
|------|--------|-------|
| Frontend game dev (Phaser.js) | 1 | 4 weeks |
| Backend dev (Node.js + webhooks) | 1 | 3 weeks |
| Mobile dev (WebView integration) | 1 | 1 week |
| Designer (animal sprites + UI) | 1 | 2 weeks |
| PM / QA | 1 | 4 weeks |

**Total: 3–5 people for 4 weeks.** The prototype is already built — the remaining work is backend integration, real asset design, and mobile embedding.

---

## Running the Prototype

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Opens at `http://localhost:3000`. The prototype runs in **demo mode** by default (360x speed) so you can experience the full game loop in minutes. Click the "DEMO: Fast" toggle in the game screen to switch to real time.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Game Engine | Phaser 3 |
| Physics | Matter.js (bundled with Phaser) |
| Bundler | Vite |
| State | localStorage (prototype) / DB in production |
| Target | WebView inside TokTok mobile app |
