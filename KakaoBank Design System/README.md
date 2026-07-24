# KakaoBank Design System

> *"내가 중심이 되는 은행"* — the bank with me at the center.

This is a design system reconstruction for **KakaoBank (카카오뱅크)**, Korea's first internet-only bank (launched 2017-07-27, KOSPI ticker **323410**). It captures the brand's visual foundations, content tone, and core UI patterns so design agents can produce on-brand artifacts — mocks, prototypes, slide decks, marketing assets — without re-deriving the system every time.

---

## What is KakaoBank?

KakaoBank is a fully digital retail bank — no branches, no paper, account opening in under 7 minutes from a smartphone. It launched July 27, 2017 as a consortium between **Kakao Corp** and **Korea Investment Holdings**, hit **1M users in 5 days**, and by January 2024 had grown to **23M+ users** — close to half of South Korea's adult population. It went public on KOSPI on **2021-08-06** at ₩39,000.

The brand thesis: banking should feel like a chat thread, not a teller window — warm enough that you'd forward a notification to your group chat, formal enough that the regulatory copy underneath is bulletproof.

### Products represented

- **Mobile app (iOS/Android)** — the actual product. Account list, transfers, savings (`26주적금`, `세이프박스`), shared accounts (`모임통장`), youth account (`mini`), debit cards.
- **Corporate web (kakaobank.com)** — the marketing layer. Near-monochrome, intentionally chrome-light. Hero / service catalog / ESG / IR / 새소식.

---

## Sources

This system was reconstructed from:

- **KakaoBank Brand Identity Guidelines V2.0** (Aug 2024) — `https://www.kakaobank.com/view/about/brand/resource`
- **PDF**: `https://www.kakaobank.com/static/etc/logo/KakaoBank_BrandIdentityGuidelines_V2.0.pdf`
- **Live DOM** (verified 2026-05-08): `https://www.kakaobank.com/` and `https://www.kakaobank.com/view/service`
- **Press**: KED Global, Korea Herald, KoalaGains, MatrixBCG, Wikipedia (KakaoBank entry)
- **Fonts**: Pretendard family provided directly as `.otf` files (uploads).

The mobile app component specs (Yellow Solid CTA, debit card visualization, success screen, etc.) are **inferred** from the canonical V2.0 guideline tokens + Kakao-family conventions — they live inside the iOS/Android client and were not directly DOM-inspected.

---

## Index — what's in this folder

| Path | Purpose |
|---|---|
| `README.md` | This file. Brand context, content fundamentals, visual foundations, iconography. |
| `colors_and_type.css` | Single source of truth for color & type tokens. Import into any artifact. |
| `fonts/` | Pretendard `.otf` weights 100–900. |
| `assets/` | Logo / symbol / app icon placeholders, mascot slot, illustration placeholders. |
| `preview/` | Design-system tab cards (type, color, spacing, components, brand). |
| `ui_kits/mobile-app/` | Hi-fi recreation of the mobile-app product surfaces (home, transfer, 26주적금, success). |
| `ui_kits/corporate-web/` | Hi-fi recreation of the kakaobank.com marketing site. |
| `SKILL.md` | Agent-skill manifest — read this if you're an agent picking up the system. |

---

## CONTENT FUNDAMENTALS

KakaoBank speaks like **a friendly fintech that knows it's still a bank** — warm and colloquial enough that you'd forward a notification to your group chat, formal enough that the regulatory copy underneath is bulletproof. The closest sibling in posture is Toss; in flavor it's Kakao-family.

### Voice rules

- **Default ending**: 해요체 (`-어요` / `-예요`). Conversational, polite. Never 합니다체 for product copy — except in legal/약관 surfaces where regulatory clarity demands it.
- **`나의` is the recurring possessive.** Banking is framed as personal infrastructure. Verified live: *"나의 첫 번째 AI 은행"*, *"나의 일상 속 유용한 금융 서비스를 만듭니다"*.
- **Pun / character > description.** Product names tease rather than label: `세이프박스` (not "secondary holding account"), `26주적금` (not "26-week recurring deposit"), `모임통장` (not "shared group account"), `부가세박스`, `mini`.
- **CTAs are verbs.** `이체하기` · `확인` · `다음` · `보내기` · `통장 만들기`. Single verb or verb+noun, short.
- **No superlatives.** `혁신적인`, `최고의`, `업계 최초` are banned in marketing copy.
- **No raw English.** `Get Started` → `시작하기`.
- **No commands.** Imperative `-해라` form is banned; everything stays in 해요체 polite.
- **Emoji** belong to content (stickers, message cards), **never to UI chrome**. Banking interface text stays emoji-free.

### Tone by context

| Context | Pattern | Example |
|---|---|---|
| CTA | verb or verb+noun, short | `이체하기` · `확인` |
| System message | observational past-tense | `이체가 완료되었어요` |
| Error | cause + one next step | `잔액이 부족해요. 다른 계좌에서 보내볼래요?` |
| Empty state | next action, never "no data" | `친구를 추가하면 이체가 빨라져요` |
| Marketing | 해요체, character welcome | `26주 동안 함께 모아봐요!` |
| Legal / 약관 | 합니다체 — clarity > warmth | — |
| Trust / safety | calm, factual, no fear marketing | `잔액 5,000만 원 이상 이체는 추가 인증이 필요해요` |

### Forbidden phrases

- `불편을 드려 죄송합니다` (apology theater)
- `데이터가 없습니다` (negative empty state)
- `오류가 발생했습니다` alone (no actionable next step)
- Marketing superlatives (`혁신적인`, `최고의`, `업계 최초`)
- Fear marketing (`사기 주의!`)

---

## VISUAL FOUNDATIONS

### Color

The whole system is built on **one warm accent and a near-monochrome base**. KakaoBank Yellow `#FFE300` (PANTONE Yellow 012 C/U) is the singular brand colour — distinct from Kakao parent `#FEE500` and Kakao marketing `#FAE100`. The V2.0 brand guideline **explicitly forbids substituting near-yellows** (`#FAE100` / `#FEE500` / `#FFCC00`). There is one yellow and one yellow only — no tints, no shades, no `yellow-50` / `yellow-100` ladder.

Yellow's role is **product, not chrome**. It appears on the symbol, the app icon, the debit card face, the primary CTA — never as an ambient marketing background. If a surface uses `#FFE300` as a >40% fill, it must be one of: the brand symbol, a card face, or a primary CTA.

The neutrals are full-strength, three-step: `#1E1E1E` body / `#A3A3A3` caption / `#CCCCCC` border. No in-between greys. No warm greys. No off-blacks — pure black `#000000` is banned for text (use `#1E1E1E` to match the Kakao family).

Semantics are utility, not brand: red `#E02000` is error, green `#0FBE6C` is success, blue `#007AFF` is iOS-aligned action affordance. There is **no** "KakaoBank green" or "KakaoBank red".

### Typography

**Pretendard Variable** carries everything — Korean and Latin in one stack with Hangul-tuned metrics. No custom display webfont. Three weights do the work: 400 Regular for body, 600 SemiBold for nav and emphasis, 700/800 Bold/ExtraBold for the hero confidence moment. The corporate hero pushes to **90px / weight 800** — that single line is the brand's loudest typographic gesture.

**No italics.** Emphasis is weight, not slant. Korean line-heights ship with Pretendard — do not override with Latin-tuned values.

### Spacing & layout

4px base unit. The scale tops out at 80px between major sections. Content max-width on web is **1360px**; mobile gutter is **20px**. Header band is **62px** with 14px / weight 600 nav links vertically centered.

**Whitespace philosophy**: banking-formal restraint. Generous gaps say "we have nothing to hide," but every section breathes structurally — nothing sprawls. Lists go dense (6+ rows per viewport); hero and onboarding screens go single-idea-per-viewport.

### Backgrounds

Backgrounds are **flat surfaces, not images**. The corporate site steps through three near-whites — `#FFFFFF` page, `#F7F7F7` section fill, `#F9F9F9` footer. No hero photography, no full-bleed photos, no repeating patterns, no gradients, no texture, no grain. Depth is communicated through **background step + 1px dividers**, never via shadow on the corporate side.

When imagery does appear, it's:
- **Kakao Friends mascot illustrations** (Ryan / Apeach / Tube / Muzi) on product cards and 26주적금 challenge screens
- **Yellow rounded-square card faces** representing physical debit cards
- **Illustrative onboarding spots** — character-led, never photographic

Imagery is **never warm-tinted, cool-tinted, grainy, or b&w-filtered**. Mascot art comes through as-is from the Kakao IP team.

### Border radius

12px is the family default — buttons, cards, inputs, **avatars** (Kakao family uses 12px rounded squares, not circles). 8px for tight chips; 16px for section-fill cards and debit-card visualizations; 20px for bottom-sheet top corners; pill for status badges and notification dots.

**Avatars are rounded squares.** Circles are out-of-family.

### Shadows & elevation

The corporate site has **zero shadows**. The mobile app uses them sparingly. Four levels exist; most surfaces sit at Level 0 (flat). Yellow surfaces never cast yellow-tinted shadows — shadows stay neutral so yellow remains the only warmth in the system.

| Level | Treatment | Use |
|---|---|---|
| 0 Flat | none | Default — most surfaces |
| 1 Whisper | `0 1px 2px rgba(0,0,0,0.04)` | Active segmented pip |
| 2 Subtle | `0 2px 8px rgba(0,0,0,0.06)` | FAB, tooltip |
| 3 Sheet | `0 -2px 16px rgba(0,0,0,0.08)` | Bottom sheets, modals |

### Borders

**1px `#CCCCCC`** for card outlines and input borders. **1px `#E6E6E6`** for in-list dividers. No 2px chunky borders, no inset/outset, no double borders. Focus state on inputs is 1.5px `#1E1E1E` — **not** yellow (yellow is brand, not state).

### Animation & motion

Banking is serious work. Motion is **subdued by default**, with one signature exception. Durations live in 150 / 250 / 300 / 350 ms tokens; the standard ease is `cubic-bezier(0.4, 0, 0.2, 1)`.

**Spring overshoot is restricted to success confirmation only** — the transfer-complete check icon, the savings-goal-met card. Everywhere else, motion is curve-eased without bounce. Banks must feel composed.

Specific motion rules:

- **Yellow has no color transition.** `#FFE300` is binary on/off — fading through tinted yellow tints damages brand-color recognition. Yellow surfaces appear via fade-in or slide-in, never via color animation.
- **Balance updates slide in, never count up.** Account amounts replace with an 8px slide + opacity fade. Counter-ticker animation is banned (it implies the amount isn't certain yet).
- **`prefers-reduced-motion: reduce`** is fully honored — spring becomes fade, all `motion-*` tokens collapse to instant.

### Interaction states

- **Hover (web only — banking apps don't have hover)**: text links stay `#1E1E1E` (no colour change); only opacity or underline applies.
- **Pressed / active**: opacity 0.85 on yellow / black solid buttons. Outline buttons darken background to `#F7F7F7`.
- **Card tap**: 98% scale during press, release before route transition.
- **Disabled**: background `#F7F7F7`, text `#CCCCCC`. Geometry doesn't change — re-enabling stays frame-stable.
- **Focus (inputs)**: 1.5px `#1E1E1E` border, not yellow. Yellow is brand; it is never a state.

### Transparency & blur

Used sparingly. Modal scrims are `rgba(0,0,0,0.4)` — lighter than most banks, keeping context visible. Status-pill backgrounds use 12% alpha of their text colour (e.g. positive pill: `rgba(15,190,108,0.12)`). No backdrop-blur on the corporate site; mobile-app sheets may use a light backdrop-blur on iOS — sparingly.

### Cards

The dominant surface unit. Default product card on the corporate site: white background, **no shadow**, optional 1px `#E6E6E6` border, **12px radius**, 24px padding. Section-fill cards (mid-page promotion blocks) use `#F7F7F7` background, **16px radius**, 32px padding. Debit / savings card visualizations are **`#FFE300` faces, 16px radius, ~1.586:1 (CR-80 aspect)** — they sit flat on white, no shadow, no float.

**Cards over forms**. When the bank wants to show you a savings goal, a recent transfer, or a 모임 settlement, it shows a card — not a row in a table. Dense rows are reserved for searchable history (transactions, statements).

### Layout rules

- Web content centers in a **1360px max** column.
- Mobile is **375px primary**, full-width with **20px gutter**.
- The top nav (62px tall) is the only fixed element on the corporate site; mobile-app surfaces use sticky bottom CTAs with safe-area insets.
- Card grid: 4-column desktop → 2-column tablet → single-column mobile.
- Account / transaction lists are single-column, full-width rows, **64px tall** by default.

---

## ICONOGRAPHY

KakaoBank does **not** publish an official open icon set. The mobile-app product uses bespoke pictograms in the Kakao family style — soft, slightly-rounded, **2px stroke**, monochrome `#1E1E1E` at default size 24px, **never coloured by default**. They appear in: bottom tab bar, list-row leading positions, and small action affordances inside cards.

### What's used

- **Bespoke 24px stroked SVGs** (in the mobile app) — flat, rounded line-caps, single-colour. No filled-solid variant.
- **OS-native glyphs** for system surfaces (SF Symbols on iOS, Material on Android) — never for branded product chrome.
- **No icon font** — the system is sprite-based / inline-SVG.
- **No emoji in UI chrome.** Emoji belong inside chat-style content (message cards, sticker picks), never as nav or status glyphs.
- **No Unicode arrows** (→, ←) as button accents — use proper SVG glyphs.

### What this kit ships

Because the official KakaoBank icon set is proprietary and not redistributable, **this kit substitutes [Lucide](https://lucide.dev)** (`https://cdn.jsdelivr.net/npm/lucide@latest`) wherever an icon is needed. Lucide's **24px / 2px stroke / rounded-cap** geometry is the closest open match to the Kakao-family pictogram style. All icons are rendered in `#1E1E1E` by default.

**This is a substitution — flag for the user.** Real production work should swap in KakaoBank's actual icon assets from the iOS/Android codebase.

### When to use what

| Surface | Icon system |
|---|---|
| Bottom tab bar | Bespoke 24px stroke (Lucide substitute in this kit) |
| List row leading | Bespoke 24px stroke |
| Inline button accent (e.g. `→` in a row) | Bespoke 16px stroke, `#A3A3A3` |
| Notification badge | Solid red dot — no glyph |
| Mascot moments (debit card face, 26주적금 character) | Kakao Friends illustration (drop in real artwork) |
| Brand symbol | `assets/kakaobank-symbol.svg` (replace with official) |

---

## SUBSTITUTIONS & GAPS — please review

| Asset | What's shipped | What it should be |
|---|---|---|
| Brand symbol (`assets/kakaobank-symbol.svg`) | Placeholder reconstruction of the 'B' + 'I' mark, yellow rounded square | Official asset from `kakaobank.com/view/about/brand/resource` |
| Wordmark (`assets/kakaobank-wordmark.svg`) | Pretendard ExtraBold text rendering | Official drawn wordmark per Kakao 공동체 CI rules |
| App icon (`assets/kakaobank-app-icon.svg`) | Reconstruction | Official app icon export |
| Kakao Friends mascots | `assets/mascot-slot.svg` neutral placeholder | Real Ryan / Apeach / Tube / Muzi artwork from the IP team |
| Icon set | Lucide CDN (24px / 2px stroke) | KakaoBank's bespoke pictogram set |
| Mobile-app component specs | Inferred from V2.0 guideline + Kakao family conventions | Direct DOM inspection of the iOS/Android client (not accessible to web tools) |

---

**See `SKILL.md` for the agent-skill manifest.**
