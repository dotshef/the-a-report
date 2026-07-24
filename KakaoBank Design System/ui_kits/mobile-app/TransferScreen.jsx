// Transfer screen — recipient select + amount entry
function TransferScreen({ onBack, onConfirm }) {
  const [amount, setAmount] = React.useState(50000);
  const recipient = { name: '김카뱅', bank: '카카오뱅크 3333-22-1029384' };
  const balance = 1234567;

  const fmt = (n) => n.toLocaleString('ko-KR');
  const presets = [10000, 50000, 100000, 500000];

  return (
    <div style={{ background: KB.white, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Custom header with back */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 12px', minHeight: 52 }}>
        <div onClick={onBack} style={{ padding: 8, cursor: 'pointer' }}>
          <Icon name="back" size={22} color={KB.black}/>
        </div>
        <div style={{ flex: 1, fontFamily: FONT, fontSize: 17, fontWeight: 700, color: KB.black, textAlign: 'center', paddingRight: 38 }}>이체</div>
      </div>

      {/* Recipient */}
      <div style={{ padding: '8px 20px 24px' }}>
        <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray, marginBottom: 8 }}>받는 분</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <KBAvatar bg={KB.fill}><Icon name="profile" size={20} color={KB.black}/></KBAvatar>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: KB.black }}>{recipient.name}</div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray, marginTop: 2 }}>{recipient.bank}</div>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div style={{ padding: '8px 20px 16px' }}>
        <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray, marginBottom: 12 }}>얼마를 보낼까요?</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 6,
          borderBottom: `2px solid ${KB.black}`,
          paddingBottom: 10,
        }}>
          <span style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: KB.black, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{fmt(amount)}</span>
          <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 500, color: KB.black }}>원</span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray, marginTop: 10 }}>출금 가능 <span style={{ color: KB.black, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(balance)}원</span></div>
      </div>

      {/* Amount presets */}
      <div style={{ padding: '8px 20px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {presets.map(p => (
          <div key={p} onClick={()=>setAmount(amount+p)} style={{
            padding: '8px 14px', borderRadius: 9999,
            background: KB.fill, color: KB.black,
            fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>+{fmt(p)}</div>
        ))}
        <div onClick={()=>setAmount(0)} style={{
          padding: '8px 14px', borderRadius: 9999,
          background: KB.fill, color: KB.gray,
          fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>지우기</div>
      </div>

      {/* From account info */}
      <div style={{ margin: '16px 20px', background: KB.fill, borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: KB.gray }}>내 통장에서</div>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: KB.black, marginTop: 2 }}>민지의 카뱅 통장</div>
          </div>
          <Icon name="chev" size={18} color={KB.gray}/>
        </div>
      </div>

      <div style={{ flex: 1 }}/>

      {/* Sticky CTA */}
      <div style={{ padding: '12px 20px 28px', background: KB.white }}>
        <KBButton variant="primary" fullWidth disabled={amount<=0} onClick={onConfirm} style={{ minHeight: 56, fontSize: 17 }}>
          {amount > 0 ? `${fmt(amount)}원 보내기` : '금액을 입력하세요'}
        </KBButton>
      </div>
    </div>
  );
}

Object.assign(window, { TransferScreen });
