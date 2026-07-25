// 오늘 신청자 수 / 이번 주 무료 발송 잔여 수 (PRD).
// Supabase가 설정되면 report_request 테이블 count로 대체. 미설정 시 시간 기반의
// 그럴듯한 값으로 계산해 데모가 동작하도록 한다.

const WEEK_START_REMAINING = 40; // 월요일 초기 잔여
const WEEK_END_REMAINING = 5; // 일요일 무렵 잔여

const DAY_START_APPLICANTS = 3; // 새벽 무렵 신청자
const DAY_END_APPLICANTS = 18; // 자정 무렵 신청자

export interface LandingStats {
  todayApplicants: number;
  weeklyFreeRemaining: number;
}

export function getStats(now = new Date()): LandingStats {
  // 하루 진행률(0~1)에 따라 신청자 수가 늘어나는 형태
  const kst = new Date(now.getTime() + 9 * 3600_000);
  const minutesOfDay = kst.getUTCHours() * 60 + kst.getUTCMinutes();
  const dayProgress = minutesOfDay / (24 * 60);
  const todayApplicants = Math.round(
    DAY_START_APPLICANTS + (DAY_END_APPLICANTS - DAY_START_APPLICANTS) * dayProgress,
  );

  // 주 진행률에 따라 잔여 무료 발송분이 줄어드는 형태
  const dow = kst.getUTCDay(); // 0=일
  const weekProgress = (dow + dayProgress) / 7;
  const weeklyFreeRemaining = Math.round(
    WEEK_START_REMAINING - (WEEK_START_REMAINING - WEEK_END_REMAINING) * weekProgress,
  );

  return { todayApplicants, weeklyFreeRemaining };
}
