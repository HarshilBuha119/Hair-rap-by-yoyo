import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { bookingStart } from '@/lib/format';
import { levelIndex, optionLabel, priceOf, serviceById, type LevelId } from '@/data/menu';
import { productById } from '@/data/products';

// ---------- Types ----------
export type User = { name: string; phone: string };

export type BookingLine = {
  serviceId: string;
  name: string;
  option?: string;
  choice: number;
  price: number;
  durationMin: number;
};

export type Booking = {
  id: string;
  ref: string;
  lines: BookingLine[];
  levelId: LevelId;
  dateISO: string;
  time: string;
  total: number;
  durationMin: number;
  notes: string;
  status: 'confirmed' | 'cancelled';
  createdAt: number;
};

export type Order = {
  id: string;
  lines: { productId: number; qty: number }[];
  total: number;
  createdAt: number;
};

export type DraftItem = { serviceId: string; choice: number };

export type Draft = {
  items: DraftItem[];
  levelId: LevelId;
  dateISO: string | null;
  time: string | null;
  notes: string;
};

type Persisted = {
  user: User | null;
  draft: Draft;
  bag: Record<number, number>;
  bookings: Booking[];
  orders: Order[];
};

type State = Persisted & { ready: boolean };

type Action =
  | { type: 'hydrate'; data: Partial<Persisted> | null }
  | { type: 'login'; user: User }
  | { type: 'logout' }
  | { type: 'toggleItem'; serviceId: string; choice: number }
  | { type: 'setItems'; items: DraftItem[]; levelId?: LevelId }
  | { type: 'setLevel'; levelId: LevelId }
  | { type: 'setSlot'; dateISO: string; time: string | null }
  | { type: 'setNotes'; notes: string }
  | { type: 'confirmBooking'; booking: Booking }
  | { type: 'cancelBooking'; id: string }
  | { type: 'bagSet'; productId: number; qty: number }
  | { type: 'placeOrder'; order: Order };

const emptyDraft: Draft = { items: [], levelId: 'stylist', dateISO: null, time: null, notes: '' };

const initial: State = { ready: false, user: null, draft: emptyDraft, bag: {}, bookings: [], orders: [] };

const STORAGE_KEY = 'hairrap.mvp.v2';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...(action.data ?? {}), ready: true };
    case 'login':
      return { ...state, user: action.user };
    case 'logout':
      return { ...initial, ready: true };
    case 'toggleItem': {
      const existing = state.draft.items.find((i) => i.serviceId === action.serviceId);
      let items: DraftItem[];
      if (!existing) items = [...state.draft.items, { serviceId: action.serviceId, choice: action.choice }];
      else if (existing.choice === action.choice) items = state.draft.items.filter((i) => i.serviceId !== action.serviceId);
      else items = state.draft.items.map((i) => (i.serviceId === action.serviceId ? { ...i, choice: action.choice } : i));
      // Duration changed, so the previously picked slot may no longer fit.
      return { ...state, draft: { ...state.draft, items, time: null } };
    }
    case 'setItems':
      return { ...state, draft: { ...emptyDraft, items: action.items, levelId: action.levelId ?? state.draft.levelId } };
    case 'setLevel':
      return { ...state, draft: { ...state.draft, levelId: action.levelId, time: null } };
    case 'setSlot':
      return { ...state, draft: { ...state.draft, dateISO: action.dateISO, time: action.time } };
    case 'setNotes':
      return { ...state, draft: { ...state.draft, notes: action.notes } };
    case 'confirmBooking':
      return { ...state, bookings: [action.booking, ...state.bookings], draft: { ...emptyDraft, levelId: state.draft.levelId } };
    case 'cancelBooking':
      return {
        ...state,
        bookings: state.bookings.map((b) => (b.id === action.id ? { ...b, status: 'cancelled' } : b)),
      };
    case 'bagSet': {
      const bag = { ...state.bag };
      if (action.qty <= 0) delete bag[action.productId];
      else bag[action.productId] = action.qty;
      return { ...state, bag };
    }
    case 'placeOrder':
      return { ...state, orders: [action.order, ...state.orders], bag: {} };
  }
}

// ---------- Context ----------
const Ctx = createContext<{ state: State; dispatch: (a: Action) => void } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => dispatch({ type: 'hydrate', data: raw ? JSON.parse(raw) : null }))
      .catch(() => dispatch({ type: 'hydrate', data: null }));
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    const { ready: _ready, ...persisted } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)).catch(() => {});
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}

// ---------- Derived helpers ----------
/** Price the chosen services at a given stylist level. Items not offered at that level are listed in `unavailable`. */
export function priceItems(items: DraftItem[], levelId: LevelId) {
  const level = levelIndex(levelId);
  const lines: BookingLine[] = [];
  const unavailable: string[] = [];
  for (const it of items) {
    const s = serviceById(it.serviceId);
    if (!s) continue;
    const price = priceOf(s, it.choice, level);
    if (price == null) {
      unavailable.push(s.name);
      continue;
    }
    lines.push({ serviceId: s.id, name: s.name, option: optionLabel(s, it.choice), choice: it.choice, price, durationMin: s.durationMin });
  }
  return {
    lines,
    unavailable,
    count: items.length,
    total: lines.reduce((sum, l) => sum + l.price, 0),
    durationMin: lines.reduce((sum, l) => sum + l.durationMin, 0),
  };
}

export const draftTotals = (draft: Draft) => priceItems(draft.items, draft.levelId);

export function bagTotals(bag: Record<number, number>) {
  const lines = Object.entries(bag)
    .map(([productId, qty]) => ({ product: productById(Number(productId)), qty }))
    .filter((l): l is { product: NonNullable<typeof l.product>; qty: number } => !!l.product);
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    total: lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
  };
}

export type BookingPhase = 'cancelled' | 'upcoming' | 'completed';

export function bookingPhase(b: Booking, now = new Date()): BookingPhase {
  if (b.status === 'cancelled') return 'cancelled';
  const end = bookingStart(b.dateISO, b.time).getTime() + b.durationMin * 60_000;
  return end < now.getTime() ? 'completed' : 'upcoming';
}

/** Hair Rap Rewards: 1 point per ₹100 spent on completed visits, plus a welcome bonus. */
export const WELCOME_POINTS = 100;
export const TIERS = [
  { name: 'Silver', from: 0 },
  { name: 'Gold', from: 500 },
  { name: 'Black', from: 1500 },
] as const;

export function rewards(bookings: Booking[], now = new Date()) {
  let earned = WELCOME_POINTS;
  let pending = 0;
  for (const b of bookings) {
    const pts = Math.floor(b.total / 100);
    const phase = bookingPhase(b, now);
    if (phase === 'completed') earned += pts;
    else if (phase === 'upcoming') pending += pts;
  }
  const tierIndex = TIERS.reduce((acc, t, i) => (earned >= t.from ? i : acc), 0);
  const next = TIERS[tierIndex + 1] ?? null;
  return { earned, pending, tier: TIERS[tierIndex], next };
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const newRef = () => 'HR-' + Math.random().toString(36).slice(2, 7).toUpperCase();

// Factories live outside components so ids and timestamps are never created during render.
export function makeBooking(input: Pick<Booking, 'lines' | 'levelId' | 'dateISO' | 'time' | 'total' | 'durationMin' | 'notes'>): Booking {
  return { ...input, id: newId(), ref: newRef(), status: 'confirmed', createdAt: Date.now() };
}

export function makeOrder(lines: Order['lines'], total: number): Order {
  return { id: newId(), lines, total, createdAt: Date.now() };
}
