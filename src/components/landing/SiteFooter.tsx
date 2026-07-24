// 랜딩·신청 페이지 공통 하단 고지 (투자 유의사항·개인정보·사업자 정보).
export function SiteFooter() {
  return (
    <footer className="mt-4 flex flex-col gap-3 px-5 text-xs leading-relaxed text-kb-gray">
      <div className="rounded-[12px] bg-kb-fill p-4">
        <p>
          <span className="font-semibold text-kb-black">[투자 유의사항]</span>{" "}
          본 서비스는 자본시장법에 따라 신고된 유사투자자문업자가 불특정 다수를
          대상으로 제공하는 투자 참고 정보입니다. 제공 리포트는 참고용이며
          매매를 권유하거나 수익을 보장하지 않습니다. 금융투자상품은 원금 손실이
          발생할 수 있고, 투자 판단과 책임은 투자자 본인에게 있습니다.
        </p>
        <p className="mt-2">
          <span className="font-semibold text-kb-black">
            [개인정보 수집·이용]
          </span>{" "}
          수집항목: 이름·전화번호·관심종목 / 목적: 리포트 발송 및 투자정보 안내
          / 보유기간: 수집일로부터 1년 또는 동의 철회 시까지. 동의를 거부할 수
          있으며 거부 시 신청이 제한됩니다.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <span>
          <span className="font-semibold text-kb-black">상호</span> 에이주식
          연구소
        </span>
        <span>
          <span className="font-semibold text-kb-black">대표</span> 박지환
        </span>
        <span>
          <span className="font-semibold text-kb-black">
            유사투자자문업 신고
          </span>{" "}
          [제0000-00호]
        </span>
        <span>
          <span className="font-semibold text-kb-black">사업자</span>{" "}
          [000-00-00000]
        </span>
        <span>
          <span className="font-semibold text-kb-black">문의</span> 1544-0705
        </span>
      </div>
    </footer>
  );
}
