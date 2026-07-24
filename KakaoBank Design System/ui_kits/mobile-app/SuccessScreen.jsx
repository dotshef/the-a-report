// Transfer success screen
function SuccessScreen({ onDone, amount = 50000, recipient = '김카뱅' }) {
  const fmt = (n) => n.toLocaleString('ko-KR');
  const [shown, setShown] = React.useState(false);
  React.useEffect(()=>{ const t = setTimeout(()=>setShown(true), 100); return ()=>clearTimeout(t); },[]);

  return (
    <div style={{ background: KB.white, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>

        {/* Spring-eased check icon */}
        <div style={{
          width: 96, height: 96, borderRadius: 9999,
          background: KB.positive,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: shown ? 'scale(1)' : 'scale(0.6)',
          opacity: shown ? 1 : 0,
          transition: 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 350ms ease-out',
        }}>
          <Icon name="check" size={48} color={KB.white} strokeWidth={2.8}/>
        </div>

        <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: KB.black, marginTop: 32, letterSpacing: '-0.01em' }}>
          이체가 완료되었어요
        </div>
        <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 400, color: KB.gray, marginTop: 10, lineHeight: 1.5 }}>
          <span style={{ color: KB.black, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(amount)}원</span>을<br/>
          <span style={{ color: KB.black, fontWeight: 600 }}>{recipient}</span>님에게 보냈어요
        </div>

        {/* Receipt mini */}
        <div style={{ width: '100%', maxWidth: 320, marginTop: 32, background: KB.fill, borderRadius: 12, padding: '16px 18px', textAlign: 'left' }}>
          {[
            ['받는 분', recipient + ' · 카카오뱅크'],
            ['보낸 통장', '민지의 카뱅 통장'],
            ['이체 시각', '2026.05.26 오후 3:14'],
          ].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray }}>{k}</div>
              <div style={{ fontFamily: FONT, fontSize: 13, color: KB.black, fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 20px 28px', background: KB.white, display: 'flex', gap: 10 }}>
        <KBButton variant="outline" fullWidth style={{ minHeight: 56 }} onClick={onDone}>홈으로</KBButton>
        <KBButton variant="primary" fullWidth style={{ minHeight: 56 }} onClick={onDone}>확인</KBButton>
      </div>
    </div>
  );
}

Object.assign(window, { SuccessScreen });
