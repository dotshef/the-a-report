import { Icon } from "@/components/design-system/Icon";

// 신청 완료 안내 — 폼 자리 치환(완료 페이지로 이동하기 직전)과
// 완료 페이지(/request/complete)가 같은 화면을 쓰도록 공유한다.
export function DoneMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[16px] bg-kb-fill p-8 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-[16px]"
        style={{ background: "rgba(15,190,108,0.12)" }}
      >
        <Icon name="check" size={28} color="var(--kb-positive)" />
      </div>
      <p className="whitespace-pre-line text-base font-semibold">{message}</p>
    </div>
  );
}
