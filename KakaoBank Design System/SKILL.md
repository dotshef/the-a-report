---
name: kakaobank-design
description: Use this skill to generate well-branded interfaces and assets for KakaoBank (카카오뱅크), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, brand assets, and UI kit components (mobile app + corporate web) for prototyping.
user-invocable: true
---

# KakaoBank Design Skill

Read `README.md` for full brand context — voice, content fundamentals, visual foundations, iconography, substitutions.

## Quick reference

- **The one yellow**: `#FFE300` — PANTONE Yellow 012 C/U. Substitutes are **forbidden** (`#FAE100`, `#FEE500`, `#FFCC00`).
- **Near-black**: `#1E1E1E` (never `#000000`).
- **Type**: Pretendard Variable (provided as `.otf` in `fonts/`). 90px/800 hero, 32px/700 section, 14px/600 nav.
- **Radius**: 12px is THE default — buttons, cards, inputs, avatars. Avatars are **rounded squares**, never circles.
- **Yellow is product, not chrome.** It belongs on the symbol, the app icon, the debit card face, the primary CTA. Never as ambient marketing background.
- **Voice**: 해요체 (polite-conversational). Verbs as CTAs (`이체하기`, `확인`). Error = cause + next step. No marketing superlatives. No emoji in UI chrome.

## How to use this skill

1. Always start by importing `colors_and_type.css` — it loads Pretendard and exposes all design tokens as CSS variables.
2. Copy assets from `assets/` as needed (`kakaobank-symbol.svg`, `kakaobank-app-icon.svg`, `kakaobank-wordmark.svg`, `mascot-slot.svg`).
3. For mobile-app artifacts: reuse the components in `ui_kits/mobile-app/Components.jsx` (`KBButton`, `AccountRow`, `BottomTabs`, `StatusPill`, `Icon`). Match the screen patterns in `HomeScreen.jsx` / `TransferScreen.jsx` / `SavingsScreen.jsx` / `SuccessScreen.jsx`.
4. For web/marketing artifacts: reuse `ui_kits/corporate-web/Components.jsx` (`TopNav`, `Hero`, `ServiceTabs`, `ServiceCard`, `Section`, `Footer`).

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without other guidance, ask what they want to build, ask focused questions, and act as an expert KakaoBank designer who outputs HTML artifacts or production code as needed.

## Files

| Path | What's inside |
|---|---|
| `README.md` | Brand context, content fundamentals, visual foundations, iconography. |
| `colors_and_type.css` | Single source for tokens. Import first. |
| `fonts/` | Pretendard 100–900 OTFs. |
| `assets/` | Symbol, wordmark, app icon, mascot slot, illustration placeholder. |
| `preview/` | Design-system cards (33 cards: colors, type, spacing, components, brand). |
| `ui_kits/mobile-app/` | iOS app components + 4 screens + click-thru prototype. |
| `ui_kits/corporate-web/` | kakaobank.com layout + components. |

## Don'ts

- Don't tint or shade the yellow. One yellow only.
- Don't use circles for avatars. Use 12px rounded squares.
- Don't use pure `#000000` for text. Use `#1E1E1E`.
- Don't use yellow as warning, error, or ambient chrome.
- Don't use white text on yellow. Always `#1E1E1E` on yellow.
- Don't introduce a secondary brand hue. Yellow is the only brand colour.
- Don't put Kakao Friends mascots in compliance / identity-verification flows.
- Don't use marketing superlatives (`혁신적인`, `최고의`, `업계 최초`).
- Don't show negative empty states (`데이터가 없습니다`). Use next-action copy.
