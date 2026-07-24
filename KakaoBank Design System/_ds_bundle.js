/* @ds-bundle: {"format":4,"namespace":"KakaoBankDesignSystem_1443a0","components":[],"sourceHashes":{"ui_kits/corporate-web/Components.jsx":"a3d9f39afa1d","ui_kits/mobile-app/Components.jsx":"120059101362","ui_kits/mobile-app/HomeScreen.jsx":"cce2678e20c9","ui_kits/mobile-app/SavingsScreen.jsx":"ff65484d9c77","ui_kits/mobile-app/SuccessScreen.jsx":"220aeab680c6","ui_kits/mobile-app/TransferScreen.jsx":"cfe8c8187064","ui_kits/mobile-app/ios-frame.jsx":"d67eb3ffe562"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KakaoBankDesignSystem_1443a0 = window.KakaoBankDesignSystem_1443a0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/corporate-web/Components.jsx
try { (() => {
// Corporate site components — header, hero, service grid, footer
const KB = {
  yellow: '#FFE300',
  black: '#1E1E1E',
  white: '#FFFFFF',
  gray: '#A3A3A3',
  lightGray: '#CCCCCC',
  coolGray: '#888888',
  fill: '#F7F7F7',
  subtle: '#F9F9F9',
  divider: '#E6E6E6',
  critical: '#E02000',
  positive: '#0FBE6C'
};
const FONT = '"Pretendard", system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';

// ----- Top nav (62px) -----
function TopNav({
  active = 'home',
  onChange
}) {
  const items = [{
    id: 'about',
    label: '소개'
  }, {
    id: 'service',
    label: '서비스'
  }, {
    id: 'esg',
    label: 'ESG'
  }, {
    id: 'ir',
    label: '투자정보'
  }, {
    id: 'support',
    label: '고객센터'
  }, {
    id: 'careers',
    label: '인재영입'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: KB.white,
      height: 62,
      borderBottom: `1px solid ${KB.divider}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onChange && onChange('home'),
    style: {
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 22,
      color: KB.black,
      letterSpacing: '-0.03em',
      marginRight: 32,
      cursor: 'pointer'
    }
  }, "kakaobank"), items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    onClick: () => onChange && onChange(it.id),
    style: {
      padding: '0 20px',
      height: 62,
      display: 'flex',
      alignItems: 'center',
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 600,
      color: KB.black,
      cursor: 'pointer'
    }
  }, it.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px',
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 600,
      color: KB.coolGray,
      cursor: 'pointer'
    }
  }, "KR / EN")));
}

// ----- Sub nav -----
function SubNav({
  items,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.white,
      borderBottom: `1px solid ${KB.divider}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      gap: 0
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    onClick: () => onChange && onChange(it.id),
    style: {
      padding: '20px 0',
      marginRight: 32,
      fontFamily: FONT,
      fontSize: 14,
      color: active === it.id ? KB.black : KB.coolGray,
      fontWeight: active === it.id ? 700 : 400,
      position: 'relative',
      cursor: 'pointer'
    }
  }, it.label, active === it.id && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -1,
      height: 2,
      background: KB.black
    }
  })))));
}

// ----- Hero (90px confidence moment) -----
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: KB.white,
      padding: '120px 0 140px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: FONT,
      fontSize: 90,
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      color: KB.black,
      margin: 0
    }
  }, "\uB098\uC758 \uCCAB \uBC88\uC9F8", /*#__PURE__*/React.createElement("br", null), "AI \uC740\uD589"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: FONT,
      fontSize: 32,
      fontWeight: 700,
      color: KB.black,
      marginTop: 32,
      lineHeight: 1.4,
      letterSpacing: '-0.01em'
    }
  }, "\uB098\uC758 \uC77C\uC0C1 \uC18D \uC720\uC6A9\uD55C \uAE08\uC735 \uC11C\uBE44\uC2A4\uB97C \uB9CC\uB4ED\uB2C8\uB2E4"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 56,
      marginTop: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 140,
      height: 140,
      background: KB.yellow,
      borderRadius: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 64,
      fontWeight: 900,
      color: KB.black,
      letterSpacing: '-0.06em'
    }
  }, "kb")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 48
    }
  }, [['23M+', '누적 고객'], ['44.5조', 'FY24 대출잔액'], ['1599-3333', '고객센터']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 32,
      fontWeight: 800,
      color: KB.black,
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 14,
      color: KB.gray,
      marginTop: 6
    }
  }, l)))))));
}

// ----- Service category tabs -----
function ServiceTabs({
  active,
  onChange
}) {
  const tabs = [{
    id: '통장'
  }, {
    id: '저축'
  }, {
    id: '대출'
  }, {
    id: '투자'
  }, {
    id: '외환'
  }, {
    id: '카드'
  }, {
    id: '사업자'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.white,
      borderBottom: `1px solid ${KB.divider}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex'
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    onClick: () => onChange && onChange(t.id),
    style: {
      padding: '20px 22px',
      height: 61,
      boxSizing: 'border-box',
      fontFamily: FONT,
      fontSize: 16,
      color: KB.black,
      fontWeight: active === t.id ? 700 : 400,
      position: 'relative',
      cursor: 'pointer'
    }
  }, t.id, active === t.id && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 22,
      right: 22,
      bottom: -1,
      height: 2,
      background: KB.black
    }
  })))));
}

// ----- Service card -----
function ServiceCard({
  title,
  blurb,
  accent,
  badge
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: accent || KB.white,
      borderRadius: 12,
      padding: 28,
      boxShadow: accent ? 'none' : `inset 0 0 0 1px ${KB.divider}`,
      minHeight: 220,
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer'
    }
  }, badge && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      alignSelf: 'flex-start',
      background: KB.black,
      color: KB.white,
      padding: '4px 10px',
      borderRadius: 9999,
      fontFamily: FONT,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      marginBottom: 12
    }
  }, badge), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 22,
      fontWeight: 700,
      color: KB.black,
      letterSpacing: '-0.01em'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 15,
      color: KB.black,
      opacity: 0.7,
      marginTop: 10,
      lineHeight: 1.5,
      flex: 1
    }
  }, blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 16,
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 600,
      color: KB.black
    }
  }, "\uC790\uC138\uD788 \uBCF4\uAE30", /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6"
  }))));
}

// ----- Section -----
function Section({
  eyebrow,
  title,
  children,
  bg = KB.white,
  pad = '120px 0'
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: bg,
      padding: pad
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: '0 24px'
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 700,
      color: KB.gray,
      letterSpacing: '0.04em',
      marginBottom: 16
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: FONT,
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 1.4,
      color: KB.black,
      margin: 0,
      letterSpacing: '-0.01em',
      maxWidth: 720
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, children)));
}

// ----- Footer -----
function Footer() {
  const cols = [{
    h: '소개',
    items: ['회사소개', '경영진', '연혁', '보도자료']
  }, {
    h: '서비스',
    items: ['상품 안내', '수수료 안내', '이용약관', '새소식']
  }, {
    h: 'ESG',
    items: ['ESG 경영', '지속가능경영보고서', '사회공헌']
  }, {
    h: '투자정보',
    items: ['공시정보', '주가정보', '재무정보', 'IR 자료']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: KB.subtle,
      padding: '80px 0 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1360,
      margin: '0 auto',
      padding: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr) 1.2fr',
      gap: 40,
      paddingBottom: 56,
      borderBottom: `1px solid ${KB.divider}`
    }
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: FONT,
      fontSize: 20,
      fontWeight: 600,
      color: KB.black,
      margin: '0 0 16px'
    }
  }, c.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, c.items.map(it => /*#__PURE__*/React.createElement("li", {
    key: it,
    style: {
      fontFamily: FONT,
      fontSize: 14,
      color: KB.gray,
      cursor: 'pointer'
    }
  }, it))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: FONT,
      fontSize: 20,
      fontWeight: 600,
      color: KB.black,
      margin: '0 0 16px'
    }
  }, "\uACE0\uAC1D\uC13C\uD130"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 28,
      fontWeight: 700,
      color: KB.black,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em'
    }
  }, "1599-3333"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray,
      marginTop: 8,
      lineHeight: 1.6
    }
  }, "\uD3C9\uC77C 09:00\u201318:00", /*#__PURE__*/React.createElement("br", null), "\uC8FC\uB9D0\xB7\uACF5\uD734\uC77C \uD734\uBB34"))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 20,
      color: KB.black,
      letterSpacing: '-0.03em'
    }
  }, "kakaobank"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 12,
      color: KB.gray,
      marginTop: 16,
      lineHeight: 1.7,
      maxWidth: 880
    }
  }, "(\uC8FC)\uCE74\uCE74\uC624\uBC45\uD06C \xB7 \uB300\uD45C\uC774\uC0AC \uC724\uD638\uC601 \xB7 \uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uC911\uAD6C \uBA85\uB3D9\uAE38", /*#__PURE__*/React.createElement("br", null), "\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638 375-88-00197 \xB7 \uD1B5\uC2E0\uD310\uB9E4\uC5C5\uC2E0\uACE0 \uC81C2020-\uC11C\uC6B8\uC911\uAD6C-2436\uD638", /*#__PURE__*/React.createElement("br", null), "\uC608\uAE08\uC790\uBCF4\uD638\uBC95\uC5D0 \uB530\uB77C 5\uCC9C\uB9CC \uC6D0\uAE4C\uC9C0 \uBCF4\uD638\uB429\uB2C8\uB2E4."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      marginTop: 24,
      fontFamily: FONT,
      fontSize: 12,
      color: KB.gray
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uC774\uC6A9\uC57D\uAD00"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: KB.black,
      fontWeight: 600
    }
  }, "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68"), /*#__PURE__*/React.createElement("span", null, "\uC724\uB9AC\uACBD\uC601"), /*#__PURE__*/React.createElement("span", null, "\uC804\uC790\uACF5\uC2DC")))));
}
Object.assign(window, {
  KB,
  FONT,
  TopNav,
  SubNav,
  Hero,
  ServiceTabs,
  ServiceCard,
  Section,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/corporate-web/Components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/Components.jsx
try { (() => {
// KakaoBank mobile-app primitive components
// Note: components reference window globals (React) and export to window.

const KB = {
  yellow: '#FFE300',
  black: '#1E1E1E',
  white: '#FFFFFF',
  gray: '#A3A3A3',
  lightGray: '#CCCCCC',
  coolGray: '#888888',
  fill: '#F7F7F7',
  subtle: '#F9F9F9',
  divider: '#E6E6E6',
  critical: '#E02000',
  positive: '#0FBE6C',
  link: '#007AFF'
};
const FONT = '"Pretendard", system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';

// ----- Button -----
function KBButton({
  variant = 'primary',
  children,
  fullWidth,
  onClick,
  disabled,
  style
}) {
  const variants = {
    primary: {
      bg: KB.yellow,
      fg: KB.black,
      border: 'none'
    },
    secondary: {
      bg: KB.black,
      fg: KB.white,
      border: 'none'
    },
    outline: {
      bg: 'transparent',
      fg: KB.black,
      border: `1px solid ${KB.lightGray}`
    },
    critical: {
      bg: KB.critical,
      fg: KB.white,
      border: 'none'
    }
  };
  const v = disabled ? {
    bg: KB.fill,
    fg: KB.lightGray,
    border: 'none'
  } : variants[variant];
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    disabled: disabled,
    style: {
      background: v.bg,
      color: v.fg,
      border: v.border,
      borderRadius: 12,
      padding: '14px 20px',
      fontFamily: FONT,
      fontSize: 16,
      fontWeight: 600,
      width: fullWidth ? '100%' : 'auto',
      minHeight: 48,
      cursor: disabled ? 'default' : 'pointer',
      transition: 'opacity 150ms cubic-bezier(0.4,0,0.2,1)',
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.opacity = '0.85';
    },
    onMouseUp: e => {
      e.currentTarget.style.opacity = '1';
    },
    onMouseLeave: e => {
      e.currentTarget.style.opacity = '1';
    }
  }, children);
}

// ----- Avatar (rounded square, never circle) -----
function KBAvatar({
  bg = KB.yellow,
  size = 40,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 12,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, children);
}

// ----- Icon (Lucide-style minimal stroke icons) -----
function Icon({
  name,
  size = 24,
  color = KB.black,
  strokeWidth = 2
}) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  switch (name) {
    case 'wallet':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "6",
        width: "18",
        height: "13",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 10h18"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17",
        cy: "14.5",
        r: "1.2",
        fill: color,
        stroke: "none"
      }));
    case 'send':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M22 2 11 13"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 2 15 22l-4-9-9-4z"
      }));
    case 'piggy':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M5 11a7 7 0 0 1 14 0v3a3 3 0 0 1-3 3h-1l-1 3h-4l-1-3H8a3 3 0 0 1-3-3z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15.5",
        cy: "11",
        r: "0.8",
        fill: color,
        stroke: "none"
      }));
    case 'card':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "5",
        width: "20",
        height: "14",
        rx: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2 10h20"
      }));
    case 'home':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"
      }));
    case 'chat':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M21 12a8 8 0 1 1-3-6.2L21 4l-1 4.2A8 8 0 0 1 21 12z"
      }));
    case 'menu':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M4 6h16M4 12h16M4 18h16"
      }));
    case 'profile':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "8",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 21a8 8 0 0 1 16 0"
      }));
    case 'plus':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M12 5v14M5 12h14"
      }));
    case 'chev':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "m9 6 6 6-6 6"
      }));
    case 'check':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M5 12l5 5L20 7"
      }));
    case 'close':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M6 6l12 12M18 6L6 18"
      }));
    case 'back':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "m15 6-6 6 6 6"
      }));
    case 'search':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m20 20-3.5-3.5"
      }));
    case 'bell':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 21a2 2 0 0 0 4 0"
      }));
    case 'qr':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "7",
        height: "7",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "3",
        width: "7",
        height: "7",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "14",
        width: "7",
        height: "7",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 14h3v3M21 14v3M14 21h3M21 18v3"
      }));
    case 'group':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "8",
        r: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17",
        cy: "9",
        r: "2.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 19a6 6 0 0 1 12 0M15 19a4 4 0 0 1 7 0"
      }));
    case 'shield':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"
      }));
    case 'arrow-right':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M5 12h14M13 6l6 6-6 6"
      }));
    case 'sparkle':
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2"
      }));
    default:
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "8"
      }));
  }
}

// ----- AccountRow -----
function AccountRow({
  name,
  sub,
  amount,
  negative,
  icon = 'wallet',
  avatarBg = KB.yellow,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 20px',
      minHeight: 64,
      boxSizing: 'border-box',
      borderBottom: last ? 'none' : `1px solid ${KB.divider}`,
      background: KB.white
    }
  }, /*#__PURE__*/React.createElement(KBAvatar, {
    bg: avatarBg
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 16,
      fontWeight: 600,
      color: KB.black,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      fontWeight: 400,
      color: KB.gray,
      marginTop: 2
    }
  }, sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 16,
      fontWeight: 700,
      color: negative ? KB.critical : KB.black,
      fontVariantNumeric: 'tabular-nums'
    }
  }, amount, "\uC6D0"));
}

// ----- Bottom Tab Bar -----
function BottomTabs({
  active = 'home',
  onChange
}) {
  const tabs = [{
    id: 'home',
    label: '홈',
    icon: 'home'
  }, {
    id: 'product',
    label: '상품',
    icon: 'piggy'
  }, {
    id: 'benefit',
    label: '혜택',
    icon: 'sparkle'
  }, {
    id: 'menu',
    label: '전체',
    icon: 'menu'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: 56,
      background: KB.white,
      borderTop: `1px solid ${KB.divider}`
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    onClick: () => onChange && onChange(t.id),
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      color: active === t.id ? KB.black : KB.gray,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 22,
    color: active === t.id ? KB.black : KB.gray,
    strokeWidth: active === t.id ? 2.4 : 2
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 11,
      fontWeight: active === t.id ? 700 : 500
    }
  }, t.label))));
}

// ----- StatusPill -----
function StatusPill({
  tone = 'positive',
  children
}) {
  const tones = {
    positive: {
      bg: 'rgba(15,190,108,0.12)',
      fg: KB.positive
    },
    critical: {
      bg: 'rgba(224,32,0,0.12)',
      fg: KB.critical
    },
    neutral: {
      bg: KB.fill,
      fg: KB.black
    }
  };
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      background: t.bg,
      color: t.fg,
      padding: '4px 10px',
      borderRadius: 9999,
      fontFamily: FONT,
      fontSize: 12,
      fontWeight: 600
    }
  }, children);
}

// ----- Card container -----
function KBCard({
  children,
  padding = 20,
  style = {},
  bordered = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.white,
      borderRadius: 12,
      padding,
      boxShadow: bordered ? `inset 0 0 0 1px ${KB.divider}` : 'none',
      ...style
    }
  }, children);
}

// ----- App header (mobile) -----
function AppHeader({
  title,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      minHeight: 52,
      background: KB.white
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: FONT,
      fontSize: 22,
      fontWeight: 700,
      color: KB.black,
      letterSpacing: '-0.02em'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, right));
}
Object.assign(window, {
  KB,
  FONT,
  KBButton,
  KBAvatar,
  Icon,
  AccountRow,
  BottomTabs,
  StatusPill,
  KBCard,
  AppHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/Components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Home screen — account list, quick actions, 26주적금 widget
function HomeScreen({
  onTransfer,
  onSavings
}) {
  const accounts = [{
    name: '민지의 카뱅 통장',
    sub: '입출금 · 3333-01-1234567',
    amount: '1,234,567',
    icon: 'wallet',
    bg: KB.yellow
  }, {
    name: '월급 통장',
    sub: '입출금 · 3333-02-9876543',
    amount: '2,500,000',
    icon: 'wallet',
    bg: KB.fill
  }, {
    name: '세이프박스',
    sub: '비상금 보관함',
    amount: '800,000',
    icon: 'shield',
    bg: KB.fill
  }, {
    name: '모임통장 · 제주여행',
    sub: '6명 참여',
    amount: '430,000',
    icon: 'group',
    bg: KB.fill
  }];
  const actions = [{
    id: 'send',
    label: '이체',
    icon: 'send'
  }, {
    id: 'qr',
    label: 'QR결제',
    icon: 'qr'
  }, {
    id: 'card',
    label: '카드',
    icon: 'card'
  }, {
    id: 'plus',
    label: '상품가입',
    icon: 'plus'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.fill,
      paddingBottom: 32
    }
  }, /*#__PURE__*/React.createElement(AppHeader, {
    title: "\uD648",
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 22,
      color: KB.black
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 22,
      color: KB.black
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 20px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 22,
      fontWeight: 700,
      color: KB.black,
      lineHeight: 1.3
    }
  }, "\uBBFC\uC9C0\uB2D8, \uC548\uB155\uD558\uC138\uC694", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: KB.gray,
      fontWeight: 500,
      fontSize: 14
    }
  }, "\uC624\uB298\uB3C4 \uCE74\uCE74\uC624\uBC45\uD06C\uC640 \uD568\uAED8\uD574\uC694"))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 16px 16px',
      background: KB.white,
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: `inset 0 0 0 1px ${KB.divider}`
    }
  }, accounts.map((a, i) => /*#__PURE__*/React.createElement(AccountRow, _extends({
    key: a.name
  }, a, {
    avatarBg: a.bg,
    last: i === accounts.length - 1
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 16px 16px',
      background: KB.white,
      borderRadius: 16,
      padding: '20px 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 4,
      boxShadow: `inset 0 0 0 1px ${KB.divider}`
    }
  }, actions.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    onClick: a.id === 'send' ? onTransfer : undefined,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      background: KB.fill,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a.icon,
    size: 22,
    color: KB.black
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      fontWeight: 600,
      color: KB.black
    }
  }, a.label)))), /*#__PURE__*/React.createElement("div", {
    onClick: onSavings,
    style: {
      margin: '0 16px 16px',
      background: KB.white,
      borderRadius: 16,
      padding: 20,
      boxShadow: `inset 0 0 0 1px ${KB.divider}`,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 18,
      fontWeight: 700,
      color: KB.black
    }
  }, "26\uC8FC\uC801\uAE08"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray,
      marginTop: 4
    }
  }, "13\uC8FC\uCC28 \uC9C4\uD589\uC911 \xB7 \uB9E4\uC8FC \uC6D4\uC694\uC77C")), /*#__PURE__*/React.createElement(Icon, {
    name: "chev",
    size: 18,
    color: KB.gray,
    strokeWidth: 2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 5,
      marginTop: 14
    }
  }, Array.from({
    length: 26
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 12,
      height: 12,
      borderRadius: 9999,
      background: i < 13 ? KB.yellow : KB.lightGray
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray
    }
  }, "\uBAA9\uD45C 260,000\uC6D0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 18,
      fontWeight: 700,
      color: KB.black,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "130,000", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      marginLeft: 2
    }
  }, "\uC6D0")))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 16px 8px',
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      aspectRatio: '1.586 / 1',
      background: KB.yellow,
      borderRadius: 16,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 12,
      fontWeight: 600,
      color: KB.black
    }
  }, "\uCE74\uCE74\uC624\uBC45\uD06C \uCCB4\uD06C\uCE74\uB4DC"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 10,
      color: KB.black,
      opacity: 0.6,
      marginTop: 2
    }
  }, "FRIENDS \xB7 RYAN")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      fontWeight: 600,
      color: KB.black,
      letterSpacing: '0.1em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "\u2022\u2022\u2022\u2022 1234")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: KB.white,
      borderRadius: 16,
      padding: 16,
      boxShadow: `inset 0 0 0 1px ${KB.divider}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 700,
      color: KB.black
    }
  }, "\uC774\uBC88 \uB2EC \uCE90\uC2DC\uBC31"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 12,
      color: KB.gray,
      marginTop: 4
    }
  }, "\uD3B8\uC758\uC810 \xB7 \uCE74\uD398")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 20,
      fontWeight: 700,
      color: KB.black,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "3,240\uC6D0"))));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/SavingsScreen.jsx
try { (() => {
// 26주적금 detail screen
function SavingsScreen({
  onBack
}) {
  const week = 13;
  const total = 26;
  const perWeek = 10000;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.fill,
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 12px',
      minHeight: 52,
      background: KB.white
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onBack,
    style: {
      padding: 8,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 22,
    color: KB.black
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: FONT,
      fontSize: 17,
      fontWeight: 700,
      color: KB.black,
      textAlign: 'center',
      paddingRight: 38
    }
  }, "26\uC8FC\uC801\uAE08")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.white,
      padding: '24px 20px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StatusPill, {
    tone: "positive"
  }, "\uC9C4\uD589\uC911"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 14,
      color: KB.gray,
      marginTop: 12
    }
  }, "\uCD1D \uBAA8\uC740 \uAE08\uC561"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 36,
      fontWeight: 700,
      color: KB.black,
      marginTop: 4,
      letterSpacing: '-0.02em',
      fontVariantNumeric: 'tabular-nums'
    }
  }, "130,000", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 500
    }
  }, "\uC6D0")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray,
      marginTop: 6
    }
  }, "\uBAA9\uD45C 260,000\uC6D0 \xB7 50%")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 80,
      height: 80,
      background: KB.yellow,
      borderRadius: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 22,
      fontWeight: 800,
      color: KB.black
    }
  }, "26"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(13, 1fr)',
      gap: 6
    }
  }, Array.from({
    length: total
  }).map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      aspectRatio: '1 / 1',
      borderRadius: 9999,
      background: i < week ? KB.yellow : KB.lightGray,
      position: 'relative'
    }
  }, i === week - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      border: `2px solid ${KB.black}`,
      borderRadius: 9999
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 8,
      fontFamily: FONT,
      fontSize: 11,
      color: KB.gray
    }
  }, /*#__PURE__*/React.createElement("span", null, "1\uC8FC\uCC28"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: KB.black,
      fontWeight: 600
    }
  }, week, "\uC8FC\uCC28 \xB7 \uC9C4\uD589\uC911"), /*#__PURE__*/React.createElement("span", null, "26\uC8FC\uCC28")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 16px 0'
    }
  }, /*#__PURE__*/React.createElement(KBCard, {
    padding: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray
    }
  }, "\uC774\uBC88 \uC8FC \uC790\uB3D9\uC774\uCCB4"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 18,
      fontWeight: 700,
      color: KB.black,
      marginTop: 4,
      fontVariantNumeric: 'tabular-nums'
    }
  }, (perWeek * week).toLocaleString(), "\uC6D0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 12,
      color: KB.gray,
      marginTop: 2
    }
  }, "\uB9E4\uC8FC \uC6D4\uC694\uC77C \xB7 \uD68C\uB2F9 +", perWeek.toLocaleString(), "\uC6D0\uC529")), /*#__PURE__*/React.createElement(Icon, {
    name: "chev",
    size: 18,
    color: KB.gray
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 600,
      color: KB.black,
      marginBottom: 10,
      padding: '0 4px'
    }
  }, "\uCD5C\uADFC \uC785\uAE08"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.white,
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: `inset 0 0 0 1px ${KB.divider}`
    }
  }, [['13주차', '5월 26일', '130,000'], ['12주차', '5월 19일', '120,000'], ['11주차', '5월 12일', '110,000']].map(([w, d, amt], i, a) => /*#__PURE__*/React.createElement("div", {
    key: w,
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 20px',
      minHeight: 56,
      borderBottom: i < a.length - 1 ? `1px solid ${KB.divider}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 15,
      fontWeight: 600,
      color: KB.black
    }
  }, w), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 12,
      color: KB.gray,
      marginTop: 2
    }
  }, d)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 15,
      fontWeight: 700,
      color: KB.black,
      fontVariantNumeric: 'tabular-nums'
    }
  }, "+", amt, "\uC6D0"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px 28px'
    }
  }, /*#__PURE__*/React.createElement(KBButton, {
    variant: "primary",
    fullWidth: true,
    style: {
      minHeight: 56
    }
  }, "\uC774\uBC88 \uC8FC \uBBF8\uB9AC \uBAA8\uC73C\uAE30")));
}
Object.assign(window, {
  SavingsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/SavingsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/SuccessScreen.jsx
try { (() => {
// Transfer success screen
function SuccessScreen({
  onDone,
  amount = 50000,
  recipient = '김카뱅'
}) {
  const fmt = n => n.toLocaleString('ko-KR');
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShown(true), 100);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.white,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 32px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 96,
      height: 96,
      borderRadius: 9999,
      background: KB.positive,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: shown ? 'scale(1)' : 'scale(0.6)',
      opacity: shown ? 1 : 0,
      transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 350ms ease-out'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 48,
    color: KB.white,
    strokeWidth: 2.8
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 26,
      fontWeight: 700,
      color: KB.black,
      marginTop: 32,
      letterSpacing: '-0.01em'
    }
  }, "\uC774\uCCB4\uAC00 \uC644\uB8CC\uB418\uC5C8\uC5B4\uC694"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 16,
      fontWeight: 400,
      color: KB.gray,
      marginTop: 10,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: KB.black,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, fmt(amount), "\uC6D0"), "\uC744", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: KB.black,
      fontWeight: 600
    }
  }, recipient), "\uB2D8\uC5D0\uAC8C \uBCF4\uB0C8\uC5B4\uC694"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 320,
      marginTop: 32,
      background: KB.fill,
      borderRadius: 12,
      padding: '16px 18px',
      textAlign: 'left'
    }
  }, [['받는 분', recipient + ' · 카카오뱅크'], ['보낸 통장', '민지의 카뱅 통장'], ['이체 시각', '2026.05.26 오후 3:14']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.black,
      fontWeight: 500
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px 28px',
      background: KB.white,
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(KBButton, {
    variant: "outline",
    fullWidth: true,
    style: {
      minHeight: 56
    },
    onClick: onDone
  }, "\uD648\uC73C\uB85C"), /*#__PURE__*/React.createElement(KBButton, {
    variant: "primary",
    fullWidth: true,
    style: {
      minHeight: 56
    },
    onClick: onDone
  }, "\uD655\uC778")));
}
Object.assign(window, {
  SuccessScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/SuccessScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/TransferScreen.jsx
try { (() => {
// Transfer screen — recipient select + amount entry
function TransferScreen({
  onBack,
  onConfirm
}) {
  const [amount, setAmount] = React.useState(50000);
  const recipient = {
    name: '김카뱅',
    bank: '카카오뱅크 3333-22-1029384'
  };
  const balance = 1234567;
  const fmt = n => n.toLocaleString('ko-KR');
  const presets = [10000, 50000, 100000, 500000];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: KB.white,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 12px',
      minHeight: 52
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onBack,
    style: {
      padding: 8,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back",
    size: 22,
    color: KB.black
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontFamily: FONT,
      fontSize: 17,
      fontWeight: 700,
      color: KB.black,
      textAlign: 'center',
      paddingRight: 38
    }
  }, "\uC774\uCCB4")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray,
      marginBottom: 8
    }
  }, "\uBC1B\uB294 \uBD84"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(KBAvatar, {
    bg: KB.fill
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "profile",
    size: 20,
    color: KB.black
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 16,
      fontWeight: 600,
      color: KB.black
    }
  }, recipient.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray,
      marginTop: 2
    }
  }, recipient.bank)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray,
      marginBottom: 12
    }
  }, "\uC5BC\uB9C8\uB97C \uBCF4\uB0BC\uAE4C\uC694?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      borderBottom: `2px solid ${KB.black}`,
      paddingBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: FONT,
      fontSize: 36,
      fontWeight: 700,
      color: KB.black,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em'
    }
  }, fmt(amount)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: FONT,
      fontSize: 22,
      fontWeight: 500,
      color: KB.black
    }
  }, "\uC6D0")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray,
      marginTop: 10
    }
  }, "\uCD9C\uAE08 \uAC00\uB2A5 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: KB.black,
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, fmt(balance), "\uC6D0"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 20px 16px',
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, presets.map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    onClick: () => setAmount(amount + p),
    style: {
      padding: '8px 14px',
      borderRadius: 9999,
      background: KB.fill,
      color: KB.black,
      fontFamily: FONT,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "+", fmt(p))), /*#__PURE__*/React.createElement("div", {
    onClick: () => setAmount(0),
    style: {
      padding: '8px 14px',
      borderRadius: 9999,
      background: KB.fill,
      color: KB.gray,
      fontFamily: FONT,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "\uC9C0\uC6B0\uAE30")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 20px',
      background: KB.fill,
      borderRadius: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 13,
      color: KB.gray
    }
  }, "\uB0B4 \uD1B5\uC7A5\uC5D0\uC11C"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: FONT,
      fontSize: 15,
      fontWeight: 600,
      color: KB.black,
      marginTop: 2
    }
  }, "\uBBFC\uC9C0\uC758 \uCE74\uBC45 \uD1B5\uC7A5")), /*#__PURE__*/React.createElement(Icon, {
    name: "chev",
    size: 18,
    color: KB.gray
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px 28px',
      background: KB.white
    }
  }, /*#__PURE__*/React.createElement(KBButton, {
    variant: "primary",
    fullWidth: true,
    disabled: amount <= 0,
    onClick: onConfirm,
    style: {
      minHeight: 56,
      fontSize: 17
    }
  }, amount > 0 ? `${fmt(amount)}원 보내기` : '금액을 입력하세요')));
}
Object.assign(window, {
  TransferScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/TransferScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/ios-frame.jsx
try { (() => {
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

})();
