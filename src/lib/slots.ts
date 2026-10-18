import { SALON } from '@/constants/brand';
import { hhmmToMinutes, minutesToHHMM, toISODate } from '@/lib/format';

const STEP_MIN = 30;

export type Slot = { time: string; available: boolean };

// Deterministic pseudo-availability so the demo looks like a real, partly-booked calendar.
// In production this comes from the salon's booking system.
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type Busy = { dateISO: string; time: string; durationMin: number };

export function slotsFor(
  dateISO: string,
  durationMin: number,
  stylistId: string,
  myBookings: Busy[],
  now: Date,
): Slot[] {
  const out: Slot[] = [];
  const isToday = dateISO === toISODate(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const mine = myBookings.filter((b) => b.dateISO === dateISO);

  for (let start = SALON.openMin; start + durationMin <= SALON.closeMin; start += STEP_MIN) {
    const time = minutesToHHMM(start);
    const modulus = stylistId === 'any' ? 7 : 4;
    const salonBusy = hash(`${dateISO}|${time}|${stylistId}`) % modulus === 0;
    const clash = mine.some((b) => {
      const bs = hhmmToMinutes(b.time);
      return start < bs + b.durationMin && bs < start + durationMin;
    });
    const past = isToday && start < nowMin + 60; // need 1h lead time
    out.push({ time, available: !salonBusy && !clash && !past });
  }
  return out;
}

export const period = (time: string): 'Morning' | 'Afternoon' | 'Evening' => {
  const m = hhmmToMinutes(time);
  if (m < 12 * 60) return 'Morning';
  if (m < 16 * 60) return 'Afternoon';
  return 'Evening';
};
