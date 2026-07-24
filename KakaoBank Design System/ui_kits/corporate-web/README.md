# KakaoBank · Corporate Web UI Kit

Hi-fi recreation of `kakaobank.com` — the marketing layer. Near-monochrome, intentionally chrome-light. Yellow only appears in the hero rounded-square moment and as the featured service card. The product (mobile app) lives in `../mobile-app/`.

## Files

| File | Purpose |
|---|---|
| `index.html` | Full homepage layout |
| `Components.jsx` | `TopNav`, `SubNav`, `Hero`, `ServiceTabs`, `ServiceCard`, `Section`, `Footer` |

## Verified specs

- **Hero**: 90px / weight 800 / line-height 1.1 / letter-spacing -0.025em
- **Section h2**: 32px / weight 700
- **Top nav**: 62px tall, 14px / 600 nav links
- **Service tabs**: 61px tall, 16px / 400 (700 when active), 통장 / 저축 / 대출 / 투자 / 외환 / 카드 / 사업자
- **Cards**: 12px radius, no shadow, optional 1px `#E6E6E6` border
- **Content max**: 1360px centered
- **Footer**: 80px top padding, four h3 columns + 고객센터 (`1599-3333` verified)
