# KakaoBank · Mobile App UI Kit

Hi-fi recreation of the KakaoBank mobile-app surfaces. The mobile app is the **actual product** — the corporate website is the marketing layer.

## Files

| File | Purpose |
|---|---|
| `index.html` | Renders all screens side-by-side + interactive click-thru prototype |
| `ios-frame.jsx` | iOS device chrome (status bar, dynamic island, home indicator) |
| `Components.jsx` | Primitives: `KBButton`, `KBAvatar`, `Icon`, `AccountRow`, `BottomTabs`, `StatusPill`, `KBCard`, `AppHeader`; brand tokens `KB.*` |
| `HomeScreen.jsx` | Account list, quick actions, 26주적금 widget, debit card |
| `TransferScreen.jsx` | Recipient + amount entry with presets |
| `SuccessScreen.jsx` | 이체 완료 — spring-eased green check |
| `SavingsScreen.jsx` | 26주적금 detail — 26-dot progress + recent deposits |

## Interactive flow

The leftmost device on `index.html` is a click-thru prototype:

`홈 → 이체 → 보내기 → 이체 완료 → 홈`
and `홈 → 26주적금 → 뒤로`.

## Component conventions

- **All radius `12`** for actionable elements (buttons, cards, avatars). Avatars are **rounded squares**, never circles — Kakao family rule.
- **Yellow `#FFE300` is product, not chrome**. It appears on the primary CTA, the debit card face, the 26주적금 progress dots.
- **All amounts** use `fontVariantNumeric: 'tabular-nums'` and tabular `,`-grouped Korean formatting (`(1234567).toLocaleString('ko-KR')`).
- **Icons** are minimal-stroke, 24px / 2px stroke, all monochrome `#1E1E1E`. They live inline in `Components.jsx` (`Icon` component) — substitute Kakao's bespoke set for production.

## Substitutions to flag

- **Kakao Friends mascot** on the debit card face — currently a text label `"RYAN"`. Drop real illustration in.
- **Pictogram set** — inline SVG approximations of Lucide-style strokes. Production uses KakaoBank's bespoke pictograms.
