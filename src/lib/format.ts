const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Indian digit grouping, e.g. 1234567 -> ₹12,34,567 */
export const inr = (n: number) => '₹' + Math.round(n).toString().replace(/\B(?=(\d{2})*\d{3}(?!\d))/g, ',');

export const duration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};

const pad = (n: number) => String(n).padStart(2, '0');

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromISODate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const dayShort = (d: Date) => DAYS[d.getDay()];
export const monthShort = (d: Date) => MONTHS[d.getMonth()];

export const prettyDate = (iso: string) => {
  const d = fromISODate(iso);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

/** "13:30" -> "1:30 PM" */
export const prettyTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${suffix}`;
};

export const minutesToHHMM = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
export const hhmmToMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Start of a booking as a Date. */
export const bookingStart = (dateISO: string, time: string) => {
  const d = fromISODate(dateISO);
  d.setMinutes(hhmmToMinutes(time));
  return d;
};

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
