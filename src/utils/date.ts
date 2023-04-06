const SECOND = 1000;
const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export const formatDistanceToNow = (targetDate: Date, baseDate: Date = new Date()) => {
  const distance = targetDate.getTime();
  const base = baseDate.getTime();
  const diff = base - distance;

  if (diff < 0) {
    return `${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일`;
  } else if (diff < MINUTE) {
    return '방금 전';
  } else if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)}분 전`;
  } else if (diff < DAY) {
    return `${Math.floor(diff / HOUR)}시간 전`;
  } else if (diff < WEEK) {
    return `${Math.floor(diff / DAY)}일 전`;
  } else {
    return `${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일`;
  }
};
