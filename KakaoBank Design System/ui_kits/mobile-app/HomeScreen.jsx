// Home screen — account list, quick actions, 26주적금 widget
function HomeScreen({ onTransfer, onSavings }) {
  const accounts = [
    { name: '민지의 카뱅 통장', sub: '입출금 · 3333-01-1234567', amount: '1,234,567', icon: 'wallet', bg: KB.yellow },
    { name: '월급 통장',        sub: '입출금 · 3333-02-9876543', amount: '2,500,000', icon: 'wallet', bg: KB.fill },
    { name: '세이프박스',       sub: '비상금 보관함',             amount: '800,000',   icon: 'shield', bg: KB.fill },
    { name: '모임통장 · 제주여행',sub: '6명 참여',                amount: '430,000',   icon: 'group',  bg: KB.fill },
  ];

  const actions = [
    { id: 'send',   label: '이체',     icon: 'send' },
    { id: 'qr',     label: 'QR결제',   icon: 'qr' },
    { id: 'card',   label: '카드',     icon: 'card' },
    { id: 'plus',   label: '상품가입', icon: 'plus' },
  ];

  return (
    <div style={{ background: KB.fill, paddingBottom: 32 }}>
      <AppHeader title="홈" right={<>
        <Icon name="search" size={22} color={KB.black}/>
        <Icon name="bell"   size={22} color={KB.black}/>
      </>}/>

      {/* Greeting */}
      <div style={{ padding: '4px 20px 16px' }}>
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: KB.black, lineHeight: 1.3 }}>
          민지님, 안녕하세요<br/>
          <span style={{ color: KB.gray, fontWeight: 500, fontSize: 14 }}>오늘도 카카오뱅크와 함께해요</span>
        </div>
      </div>

      {/* Account list card */}
      <div style={{ margin: '0 16px 16px', background: KB.white, borderRadius: 16, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${KB.divider}` }}>
        {accounts.map((a,i) => (
          <AccountRow key={a.name} {...a} avatarBg={a.bg} last={i===accounts.length-1}/>
        ))}
      </div>

      {/* Quick action grid */}
      <div style={{ margin: '0 16px 16px', background: KB.white, borderRadius: 16, padding: '20px 0', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, boxShadow: `inset 0 0 0 1px ${KB.divider}` }}>
        {actions.map(a => (
          <div key={a.id} onClick={a.id==='send'?onTransfer:undefined} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: KB.fill, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={a.icon} size={22} color={KB.black}/>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: KB.black }}>{a.label}</div>
          </div>
        ))}
      </div>

      {/* 26주적금 widget */}
      <div onClick={onSavings} style={{ margin: '0 16px 16px', background: KB.white, borderRadius: 16, padding: 20, boxShadow: `inset 0 0 0 1px ${KB.divider}`, cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: KB.black }}>26주적금</div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray, marginTop: 4 }}>13주차 진행중 · 매주 월요일</div>
          </div>
          <Icon name="chev" size={18} color={KB.gray} strokeWidth={2}/>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 14 }}>
          {Array.from({length:26}).map((_,i)=>(
            <div key={i} style={{ width: 12, height: 12, borderRadius: 9999, background: i<13 ? KB.yellow : KB.lightGray }}/>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
          <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray }}>목표 260,000원</div>
          <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: KB.black, fontVariantNumeric: 'tabular-nums' }}>130,000<span style={{ fontSize: 14, fontWeight: 500, marginLeft: 2 }}>원</span></div>
        </div>
      </div>

      {/* Debit card teaser */}
      <div style={{ margin: '0 16px 8px', display: 'flex', gap: 12 }}>
        <div style={{
          flex: 1, aspectRatio: '1.586 / 1',
          background: KB.yellow, borderRadius: 16, padding: 16,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: KB.black }}>카카오뱅크 체크카드</div>
            <div style={{ fontFamily: FONT, fontSize: 10, color: KB.black, opacity: 0.6, marginTop: 2 }}>FRIENDS · RYAN</div>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: KB.black, letterSpacing: '0.1em', fontVariantNumeric: 'tabular-nums' }}>•••• 1234</div>
        </div>
        <div style={{ flex: 1, background: KB.white, borderRadius: 16, padding: 16, boxShadow: `inset 0 0 0 1px ${KB.divider}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: KB.black }}>이번 달 캐시백</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: KB.gray, marginTop: 4 }}>편의점 · 카페</div>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: KB.black, fontVariantNumeric: 'tabular-nums' }}>3,240원</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen });
