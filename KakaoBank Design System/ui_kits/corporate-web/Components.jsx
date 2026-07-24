// Corporate site components — header, hero, service grid, footer
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
};
const FONT = '"Pretendard", system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';

// ----- Top nav (62px) -----
function TopNav({ active = 'home', onChange }) {
  const items = [
    { id: 'about',    label: '소개' },
    { id: 'service',  label: '서비스' },
    { id: 'esg',      label: 'ESG' },
    { id: 'ir',       label: '투자정보' },
    { id: 'support',  label: '고객센터' },
    { id: 'careers',  label: '인재영입' },
  ];
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: KB.white, height: 62,
      borderBottom: `1px solid ${KB.divider}`,
    }}>
      <div style={{
        maxWidth: 1360, margin: '0 auto', height: '100%',
        display: 'flex', alignItems: 'center', padding: '0 24px',
      }}>
        <div onClick={()=>onChange&&onChange('home')} style={{
          fontFamily: FONT, fontWeight: 800, fontSize: 22,
          color: KB.black, letterSpacing: '-0.03em', marginRight: 32, cursor: 'pointer',
        }}>kakaobank</div>
        {items.map(it => (
          <div key={it.id} onClick={()=>onChange&&onChange(it.id)} style={{
            padding: '0 20px', height: 62,
            display: 'flex', alignItems: 'center',
            fontFamily: FONT, fontSize: 14, fontWeight: 600,
            color: KB.black, cursor: 'pointer',
          }}>{it.label}</div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{
          padding: '0 20px', fontFamily: FONT, fontSize: 14, fontWeight: 600, color: KB.coolGray, cursor: 'pointer',
        }}>KR / EN</div>
      </div>
    </div>
  );
}

// ----- Sub nav -----
function SubNav({ items, active, onChange }) {
  return (
    <div style={{ background: KB.white, borderBottom: `1px solid ${KB.divider}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0 }}>
        {items.map(it => (
          <div key={it.id} onClick={()=>onChange&&onChange(it.id)} style={{
            padding: '20px 0', marginRight: 32,
            fontFamily: FONT, fontSize: 14,
            color: active === it.id ? KB.black : KB.coolGray,
            fontWeight: active === it.id ? 700 : 400,
            position: 'relative', cursor: 'pointer',
          }}>{it.label}
            {active === it.id && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, background: KB.black }}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ----- Hero (90px confidence moment) -----
function Hero() {
  return (
    <section style={{ background: KB.white, padding: '120px 0 140px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{
          fontFamily: FONT, fontSize: 90, fontWeight: 800,
          lineHeight: 1.1, letterSpacing: '-0.025em',
          color: KB.black, margin: 0,
        }}>
          나의 첫 번째<br/>AI 은행
        </h1>
        <p style={{
          fontFamily: FONT, fontSize: 32, fontWeight: 700,
          color: KB.black, marginTop: 32, lineHeight: 1.4, letterSpacing: '-0.01em',
        }}>
          나의 일상 속 유용한 금융 서비스를 만듭니다
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 56, marginTop: 64 }}>
          <div style={{
            width: 140, height: 140, background: KB.yellow, borderRadius: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontFamily: FONT, fontSize: 64, fontWeight: 900, color: KB.black, letterSpacing: '-0.06em' }}>kb</div>
          </div>
          <div style={{ display: 'flex', gap: 48 }}>
            {[
              ['23M+', '누적 고객'],
              ['44.5조', 'FY24 대출잔액'],
              ['1599-3333', '고객센터'],
            ].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: KB.black, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{n}</div>
                <div style={{ fontFamily: FONT, fontSize: 14, color: KB.gray, marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ----- Service category tabs -----
function ServiceTabs({ active, onChange }) {
  const tabs = [
    { id: '통장' }, { id: '저축' }, { id: '대출' }, { id: '투자' },
    { id: '외환' }, { id: '카드' }, { id: '사업자' },
  ];
  return (
    <div style={{ background: KB.white, borderBottom: `1px solid ${KB.divider}` }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px', display: 'flex' }}>
        {tabs.map(t => (
          <div key={t.id} onClick={()=>onChange&&onChange(t.id)} style={{
            padding: '20px 22px', height: 61, boxSizing: 'border-box',
            fontFamily: FONT, fontSize: 16,
            color: KB.black,
            fontWeight: active === t.id ? 700 : 400,
            position: 'relative', cursor: 'pointer',
          }}>{t.id}
            {active === t.id && (
              <div style={{ position: 'absolute', left: 22, right: 22, bottom: -1, height: 2, background: KB.black }}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ----- Service card -----
function ServiceCard({ title, blurb, accent, badge }) {
  return (
    <div style={{
      background: accent || KB.white, borderRadius: 12,
      padding: 28,
      boxShadow: accent ? 'none' : `inset 0 0 0 1px ${KB.divider}`,
      minHeight: 220, display: 'flex', flexDirection: 'column',
      cursor: 'pointer',
    }}>
      {badge && (
        <div style={{
          display: 'inline-block', alignSelf: 'flex-start',
          background: KB.black, color: KB.white,
          padding: '4px 10px', borderRadius: 9999,
          fontFamily: FONT, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.04em', marginBottom: 12,
        }}>{badge}</div>
      )}
      <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: KB.black, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontFamily: FONT, fontSize: 15, color: KB.black, opacity: 0.7, marginTop: 10, lineHeight: 1.5, flex: 1 }}>{blurb}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, fontFamily: FONT, fontSize: 14, fontWeight: 600, color: KB.black }}>
        자세히 보기
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </div>
    </div>
  );
}

// ----- Section -----
function Section({ eyebrow, title, children, bg = KB.white, pad = '120px 0' }) {
  return (
    <section style={{ background: bg, padding: pad }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px' }}>
        {eyebrow && (
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: KB.gray, letterSpacing: '0.04em', marginBottom: 16 }}>{eyebrow}</div>
        )}
        <h2 style={{
          fontFamily: FONT, fontSize: 32, fontWeight: 700,
          lineHeight: 1.4, color: KB.black, margin: 0,
          letterSpacing: '-0.01em', maxWidth: 720,
        }}>{title}</h2>
        <div style={{ marginTop: 48 }}>{children}</div>
      </div>
    </section>
  );
}

// ----- Footer -----
function Footer() {
  const cols = [
    { h: '소개',     items: ['회사소개','경영진','연혁','보도자료'] },
    { h: '서비스',   items: ['상품 안내','수수료 안내','이용약관','새소식'] },
    { h: 'ESG',      items: ['ESG 경영','지속가능경영보고서','사회공헌'] },
    { h: '투자정보', items: ['공시정보','주가정보','재무정보','IR 자료'] },
  ];
  return (
    <footer style={{ background: KB.subtle, padding: '80px 0 56px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) 1.2fr', gap: 40, paddingBottom: 56, borderBottom: `1px solid ${KB.divider}` }}>
          {cols.map(c => (
            <div key={c.h}>
              <h3 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, color: KB.black, margin: '0 0 16px' }}>{c.h}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.items.map(it => (
                  <li key={it} style={{ fontFamily: FONT, fontSize: 14, color: KB.gray, cursor: 'pointer' }}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 600, color: KB.black, margin: '0 0 16px' }}>고객센터</h3>
            <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: KB.black, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>1599-3333</div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray, marginTop: 8, lineHeight: 1.6 }}>
              평일 09:00–18:00<br/>주말·공휴일 휴무
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 32 }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 20, color: KB.black, letterSpacing: '-0.03em' }}>kakaobank</div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: KB.gray, marginTop: 16, lineHeight: 1.7, maxWidth: 880 }}>
            (주)카카오뱅크 · 대표이사 윤호영 · 서울특별시 중구 명동길<br/>
            사업자등록번호 375-88-00197 · 통신판매업신고 제2020-서울중구-2436호<br/>
            예금자보호법에 따라 5천만 원까지 보호됩니다.
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 24, fontFamily: FONT, fontSize: 12, color: KB.gray }}>
            <span>이용약관</span>
            <span style={{ color: KB.black, fontWeight: 600 }}>개인정보처리방침</span>
            <span>윤리경영</span>
            <span>전자공시</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { KB, FONT, TopNav, SubNav, Hero, ServiceTabs, ServiceCard, Section, Footer });
