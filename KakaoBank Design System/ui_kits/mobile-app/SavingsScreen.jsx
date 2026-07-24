// 26주적금 detail screen
function SavingsScreen({ onBack }) {
  const week = 13;
  const total = 26;
  const perWeek = 10000;

  return (
    <div style={{ background: KB.fill, minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 12px', minHeight: 52, background: KB.white }}>
        <div onClick={onBack} style={{ padding: 8, cursor: 'pointer' }}>
          <Icon name="back" size={22} color={KB.black}/>
        </div>
        <div style={{ flex: 1, fontFamily: FONT, fontSize: 17, fontWeight: 700, color: KB.black, textAlign: 'center', paddingRight: 38 }}>26주적금</div>
      </div>

      {/* Hero — yellow card with progress */}
      <div style={{ background: KB.white, padding: '24px 20px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <StatusPill tone="positive">진행중</StatusPill>
            <div style={{ fontFamily: FONT, fontSize: 14, color: KB.gray, marginTop: 12 }}>총 모은 금액</div>
            <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: KB.black, marginTop: 4, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              130,000<span style={{ fontSize: 22, fontWeight: 500 }}>원</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray, marginTop: 6 }}>목표 260,000원 · 50%</div>
          </div>
          <div style={{ width: 80, height: 80, background: KB.yellow, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: KB.black }}>26</div>
          </div>
        </div>

        {/* 26-dot progress */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)', gap: 6 }}>
            {Array.from({length: total}).map((_,i)=>(
              <div key={i} style={{
                aspectRatio: '1 / 1', borderRadius: 9999,
                background: i < week ? KB.yellow : KB.lightGray,
                position: 'relative',
              }}>
                {i === week - 1 && (
                  <div style={{
                    position: 'absolute', inset: 0, border: `2px solid ${KB.black}`, borderRadius: 9999,
                  }}/>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: FONT, fontSize: 11, color: KB.gray }}>
            <span>1주차</span>
            <span style={{ color: KB.black, fontWeight: 600 }}>{week}주차 · 진행중</span>
            <span>26주차</span>
          </div>
        </div>
      </div>

      {/* This week */}
      <div style={{ padding: '16px 16px 0' }}>
        <KBCard padding={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray }}>이번 주 자동이체</div>
              <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: KB.black, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{(perWeek * week).toLocaleString()}원</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: KB.gray, marginTop: 2 }}>매주 월요일 · 회당 +{(perWeek).toLocaleString()}원씩</div>
            </div>
            <Icon name="chev" size={18} color={KB.gray}/>
          </div>
        </KBCard>
      </div>

      {/* Recent deposits */}
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: KB.black, marginBottom: 10, padding: '0 4px' }}>최근 입금</div>
        <div style={{ background: KB.white, borderRadius: 12, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${KB.divider}` }}>
          {[
            ['13주차', '5월 26일', '130,000'],
            ['12주차', '5월 19일', '120,000'],
            ['11주차', '5월 12일', '110,000'],
          ].map(([w, d, amt],i,a) => (
            <div key={w} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', minHeight: 56, borderBottom: i<a.length-1 ? `1px solid ${KB.divider}` : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: KB.black }}>{w}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: KB.gray, marginTop: 2 }}>{d}</div>
              </div>
              <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: KB.black, fontVariantNumeric: 'tabular-nums' }}>+{amt}원</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 28px' }}>
        <KBButton variant="primary" fullWidth style={{ minHeight: 56 }}>이번 주 미리 모으기</KBButton>
      </div>
    </div>
  );
}

Object.assign(window, { SavingsScreen });
