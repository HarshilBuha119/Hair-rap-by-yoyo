import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button, Card, EmptyState, Screen, Segmented, Title } from '@/components/ui';
import { C, F, R, S } from '@/constants/brand';
import { levelLabel } from '@/data/menu';
import { bookingStart, duration, inr, prettyDate, prettyTime } from '@/lib/format';
import { bookingPhase, useApp, type Booking, type BookingPhase } from '@/store/app-store';

const PHASE_STYLE: Record<BookingPhase, { label: string; color: string }> = {
  upcoming: { label: 'Confirmed', color: C.success },
  completed: { label: 'Completed', color: C.muted },
  cancelled: { label: 'Cancelled', color: C.danger },
};

export default function Bookings() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const now = new Date();
  const startOf = (b: Booking) => bookingStart(b.dateISO, b.time).getTime();
  const upcoming = state.bookings.filter((b) => bookingPhase(b, now) === 'upcoming').sort((a, b) => startOf(a) - startOf(b));
  const past = state.bookings.filter((b) => bookingPhase(b, now) !== 'upcoming').sort((a, b) => startOf(b) - startOf(a));
  const list = tab === 'upcoming' ? upcoming : past;

  const cancel = (b: Booking) =>
    Alert.alert('Cancel this appointment?', `${prettyDate(b.dateISO)} at ${prettyTime(b.time)}`, [
      { text: 'Keep it', style: 'cancel' },
      { text: 'Cancel booking', style: 'destructive', onPress: () => dispatch({ type: 'cancelBooking', id: b.id }) },
    ]);

  const rebook = (b: Booking) => {
    dispatch({ type: 'setItems', items: b.lines.map((l) => ({ serviceId: l.serviceId, choice: l.choice })), levelId: b.levelId });
    router.push('/book/schedule');
  };

  return (
    <Screen>
      <Title title="My bookings" />
      <View style={styles.pad}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { id: 'upcoming', label: `Upcoming (${upcoming.length})` },
            { id: 'past', label: `Past (${past.length})` },
          ]}
        />
      </View>

      {list.length === 0 ? (
        <EmptyState
          icon="calendar"
          title={tab === 'upcoming' ? 'No upcoming appointments' : 'No past visits yet'}
          body={tab === 'upcoming' ? 'Pick a service and a time that suits you. It takes under a minute.' : 'Your completed and cancelled visits will show up here.'}
          action={tab === 'upcoming' ? 'Book now' : undefined}
          onAction={() => router.push('/services')}
        />
      ) : (
        list.map((b) => {
          const phase = bookingPhase(b, now);
          const meta = PHASE_STYLE[phase];
          return (
            <Card key={b.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.when}>
                  {prettyDate(b.dateISO)} · {prettyTime(b.time)}
                </Text>
                <Text style={[styles.status, { color: meta.color }]}>{meta.label}</Text>
              </View>
              <Text style={styles.services}>{b.lines.map((l) => l.name + (l.option ? ` (${l.option})` : '')).join(' + ')}</Text>
              <Text style={styles.meta}>
                {levelLabel(b.levelId)} · {duration(b.durationMin)} · {inr(b.total)} · Ref {b.ref}
              </Text>
              <View style={styles.actions}>
                {phase === 'upcoming' ? (
                  <Button label="Cancel" variant="outline" onPress={() => cancel(b)} style={styles.actionBtn} />
                ) : (
                  <Button label="Book again" variant="outline" icon="rotate-cw" onPress={() => rebook(b)} style={styles.actionBtn} />
                )}
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: S.lg, marginBottom: S.lg },
  card: { marginHorizontal: S.lg, marginBottom: S.md, borderRadius: R.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  when: { fontFamily: F.serif, fontSize: 18, color: C.ink },
  status: { fontSize: 12, fontWeight: '800', letterSpacing: 0.4 },
  services: { fontSize: 15, fontWeight: '600', color: C.ink, marginTop: S.sm },
  meta: { fontSize: 13, color: C.muted, marginTop: S.xs, lineHeight: 19 },
  actions: { flexDirection: 'row', marginTop: S.lg },
  actionBtn: { minHeight: 44, flex: 1 },
});
