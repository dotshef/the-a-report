// KakaoBank mobile-app primitive components
// Note: components reference window globals (React) and export to window.

const KB = {
  yellow:    '#FFE300',
  black:     '#1E1E1E',
  white:     '#FFFFFF',
  gray:      '#A3A3A3',
  lightGray: '#CCCCCC',
  coolGray:  '#888888',
  fill:      '#F7F7F7',
  subtle:    '#F9F9F9',
  divider:   '#E6E6E6',
  critical:  '#E02000',
  positive:  '#0FBE6C',
  link:      '#007AFF',
};

const FONT = '"Pretendard", system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';

// ----- Button -----
function KBButton({ variant = 'primary', children, fullWidth, onClick, disabled, style }) {
  const variants = {
    primary:   { bg: KB.yellow,    fg: KB.black, border: 'none' },
    secondary: { bg: KB.black,     fg: KB.white, border: 'none' },
    outline:   { bg: 'transparent',fg: KB.black, border: `1px solid ${KB.lightGray}` },
    critical:  { bg: KB.critical,  fg: KB.white, border: 'none' },
  };
  const v = disabled ? { bg: KB.fill, fg: KB.lightGray, border: 'none' } : variants[variant];
  return (
    <button onClick={disabled?undefined:onClick} disabled={disabled} style={{
      background: v.bg, color: v.fg, border: v.border,
      borderRadius: 12, padding: '14px 20px',
      fontFamily: FONT, fontSize: 16, fontWeight: 600,
      width: fullWidth ? '100%' : 'auto',
      minHeight: 48, cursor: disabled ? 'default' : 'pointer',
      transition: 'opacity 150ms cubic-bezier(0.4,0,0.2,1)',
      ...style,
    }}
    onMouseDown={(e)=>{ if(!disabled) e.currentTarget.style.opacity='0.85'; }}
    onMouseUp={(e)=>{ e.currentTarget.style.opacity='1'; }}
    onMouseLeave={(e)=>{ e.currentTarget.style.opacity='1'; }}
    >{children}</button>
  );
}

// ----- Avatar (rounded square, never circle) -----
function KBAvatar({ bg = KB.yellow, size = 40, children }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: 12, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{children}</div>
  );
}

// ----- Icon (Lucide-style minimal stroke icons) -----
function Icon({ name, size = 24, color = KB.black, strokeWidth = 2 }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'wallet':   return <svg {...props}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.2" fill={color} stroke="none"/></svg>;
    case 'send':     return <svg {...props}><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>;
    case 'piggy':    return <svg {...props}><path d="M5 11a7 7 0 0 1 14 0v3a3 3 0 0 1-3 3h-1l-1 3h-4l-1-3H8a3 3 0 0 1-3-3z"/><circle cx="15.5" cy="11" r="0.8" fill={color} stroke="none"/></svg>;
    case 'card':     return <svg {...props}><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/></svg>;
    case 'home':     return <svg {...props}><path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>;
    case 'chat':     return <svg {...props}><path d="M21 12a8 8 0 1 1-3-6.2L21 4l-1 4.2A8 8 0 0 1 21 12z"/></svg>;
    case 'menu':     return <svg {...props}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case 'profile':  return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case 'plus':     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'chev':     return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case 'check':    return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'close':    return <svg {...props}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'back':     return <svg {...props}><path d="m15 6-6 6 6 6"/></svg>;
    case 'search':   return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'bell':     return <svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'qr':       return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v3M14 21h3M21 18v3"/></svg>;
    case 'group':    return <svg {...props}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19a6 6 0 0 1 12 0M15 19a4 4 0 0 1 7 0"/></svg>;
    case 'shield':   return <svg {...props}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/></svg>;
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'sparkle':  return <svg {...props}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2"/></svg>;
    default: return <svg {...props}><circle cx="12" cy="12" r="8"/></svg>;
  }
}

// ----- AccountRow -----
function AccountRow({ name, sub, amount, negative, icon = 'wallet', avatarBg = KB.yellow, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '14px 20px', minHeight: 64, boxSizing: 'border-box',
      borderBottom: last ? 'none' : `1px solid ${KB.divider}`,
      background: KB.white,
    }}>
      <KBAvatar bg={avatarBg}><Icon name={icon} size={20}/></KBAvatar>
      <div style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: KB.black, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 400, color: KB.gray, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: negative ? KB.critical : KB.black, fontVariantNumeric: 'tabular-nums' }}>{amount}원</div>
    </div>
  );
}

// ----- Bottom Tab Bar -----
function BottomTabs({ active = 'home', onChange }) {
  const tabs = [
    { id: 'home',     label: '홈',     icon: 'home' },
    { id: 'product',  label: '상품',   icon: 'piggy' },
    { id: 'benefit',  label: '혜택',   icon: 'sparkle' },
    { id: 'menu',     label: '전체',   icon: 'menu' },
  ];
  return (
    <div style={{
      display: 'flex', height: 56, background: KB.white,
      borderTop: `1px solid ${KB.divider}`,
    }}>
      {tabs.map(t => (
        <div key={t.id} onClick={()=>onChange&&onChange(t.id)} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 3,
          color: active === t.id ? KB.black : KB.gray,
          cursor: 'pointer',
        }}>
          <Icon name={t.icon} size={22} color={active===t.id?KB.black:KB.gray} strokeWidth={active===t.id?2.4:2}/>
          <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: active===t.id?700:500 }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

// ----- StatusPill -----
function StatusPill({ tone = 'positive', children }) {
  const tones = {
    positive: { bg: 'rgba(15,190,108,0.12)', fg: KB.positive },
    critical: { bg: 'rgba(224,32,0,0.12)', fg: KB.critical },
    neutral:  { bg: KB.fill, fg: KB.black },
  };
  const t = tones[tone];
  return (
    <span style={{
      background: t.bg, color: t.fg,
      padding: '4px 10px', borderRadius: 9999,
      fontFamily: FONT, fontSize: 12, fontWeight: 600,
    }}>{children}</span>
  );
}

// ----- Card container -----
function KBCard({ children, padding = 20, style = {}, bordered = true }) {
  return (
    <div style={{
      background: KB.white, borderRadius: 12, padding,
      boxShadow: bordered ? `inset 0 0 0 1px ${KB.divider}` : 'none',
      ...style,
    }}>{children}</div>
  );
}

// ----- App header (mobile) -----
function AppHeader({ title, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 20px', minHeight: 52, background: KB.white,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: KB.black, letterSpacing: '-0.02em' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>{right}</div>
    </div>
  );
}

Object.assign(window, { KB, FONT, KBButton, KBAvatar, Icon, AccountRow, BottomTabs, StatusPill, KBCard, AppHeader });
