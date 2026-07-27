// 랜딩 상단에 노출하는 신청자 수 / 무료 발송 잔여 수.
// DB를 읽지 않고 KST 시각만으로 계산한다 — 실측값이 아니다.

const WEEK_START_REMAINING = 40; // 월요일 초기 잔여
const WEEK_END_REMAINING = 5; // 일요일 무렵 잔여

const DAY_START_APPLICANTS = 3; // 새벽 무렵 신청자
const DAY_END_APPLICANTS = 18; // 자정 무렵 신청자

export interface LandingStats {
  todayApplicants: number;
  weeklyFreeRemaining: number;
}

export function getStats(now = new Date()): LandingStats {
  const kst = new Date(now.getTime() + 9 * 3600_000);
  const minutesOfDay = kst.getUTCHours() * 60 + kst.getUTCMinutes();
  const dayProgress = minutesOfDay / (24 * 60);
  const todayApplicants = Math.round(
    DAY_START_APPLICANTS + (DAY_END_APPLICANTS - DAY_START_APPLICANTS) * dayProgress,
  );

  const dow = kst.getUTCDay(); // 0=일
  const weekProgress = (dow + dayProgress) / 7;
  const weeklyFreeRemaining = Math.round(
    WEEK_START_REMAINING - (WEEK_START_REMAINING - WEEK_END_REMAINING) * weekProgress,
  );

  return { todayApplicants, weeklyFreeRemaining };
}
