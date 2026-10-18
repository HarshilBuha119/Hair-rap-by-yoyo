import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BottomBar, Button, Card, EmptyState, Field, Screen } from '@/components/ui';
import { C, F, S, SALON } from '@/constants/brand';
import { levelLabel } from '@/data/menu';
import { duration, inr, prettyDate, prettyTime } from '@/lib/format';
import { draftTotals, makeBooking, useApp } from '@/store/app-store';

export default function Review() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { draft, user } = state;
  const totals = draftTotals(draft);

  if (!totals.lines.length || totals.unavailable.length || !draft.dateISO || !draft.time) {
    return (
      <EmptyState
        icon="clock"
        title="Choose a time first"
        body="Pick your services and a slot, then come back to confirm."
        action="Choose a time"
        onAction={() => router.replace('/book/schedule')}
      />
    );
  }

  const confirm = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const booking = makeBooking({
      lines: totals.lines,
      levelId: draft.levelId,
      dateISO: draft.dateISO!,
      time: draft.time!,
      total: totals.total,
      durationMin: totals.durationMin,
      notes: draft.notes.trim(),
    });
    dispatch({ type: 'confirmBooking', booking });
    router.replace({ pathname: '/book/confirmed', params: { ref: booking.ref } });
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen topInset={false} bottomSpace={140}>
        <Card style={styles.card}>
          <Line icon="calendar" label="When" value={`${prettyDate(draft.dateISO)} · ${prettyTime(draft.time)}`} />
          <Line icon="user" label="Stylist" value={levelLabel(draft.levelId)} />
          <Line icon="map-pin" label="Where" value={`${SALON.name}, Bodakdev`} last />
        </Card>

        <Card style={styles.card}>
          {totals.lines.map((l) => (
            <View key={l.serviceId} style={styles.svcRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.svcName}>{l.name}</Text>
                {l.option ? <Text style={styles.svcOpt}>{l.option}</Text> : null}
              </View>
              <Text style={styles.svcPrice}>{inr(l.price)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total · {duration(totals.durationMin)}</Text>
            <Text style={styles.totalValue}>{inr(totals.total)}</Text>
          </View>
          <Text style={styles.points}>Earn {Math.floor(totals.total / 100)} reward points after your visit.</Text>
        </Card>

        <View style={styles.pad}>
          <Field
            label="Notes for the stylist (optional)"
            value={draft.notes}
            onChangeText={(notes) => dispatch({ type: 'setNotes', notes })}
            placeholder="Allergies, reference look, anything we should know"
            multiline
            maxLength={300}
          />
        </View>

        <Card style={styles.card}>
          <View style={styles.payRow}>
            <Feather name="check-circle" size={20} color={C.success} />
            <View style={{ flex: 1 }}>
              <Text style={styles.payTitle}>Pay at the salon</Text>
              <Text style={styles.payBody}>Cash, card or UPI after your service.</Text>
            </View>
          </View>
          <Text style={styles.policy}>Final price for colour and texture services is confirmed at consultation. Durations are estimates.</Text>
        </Card>
      </Screen>

      <BottomBar>
        <Button label={user ? 'Confirm booking' : 'Sign in to confirm'} icon={user ? 'check' : 'log-in'} variant="gold" onPress={confirm} />
      </BottomBar>
    </View>
  );
}

function Line({ icon, label, value, last }: { icon: 'calendar' | 'user' | 'map-pin'; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.line, !last && styles.lineBorder]}>
      <Feather name={icon} size={18} color={C.gold} />
      <View style={{ flex: 1 }}>
        <Text style={styles.lineLabel}>{label}</Text>
        <Text style={styles.lineValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: S.lg, marginTop: S.md },
  pad: { paddingHorizontal: S.lg, marginTop: S.xl },
  line: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md },
  lineBorder: { borderBottomWidth: 1, borderBottomColor: C.line },
  lineLabel: { fontSize: 12, color: C.muted },
  lineValue: { fontSize: 16, fontWeight: '700', color: C.ink, marginTop: 1 },
  svcRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: S.xs, gap: S.md },
  svcName: { fontSize: 15, color: C.ink },
  svcOpt: { fontSize: 12, color: C.muted, marginTop: 1 },
  svcPrice: { fontSize: 15, fontWeight: '700', color: C.ink },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: C.line, marginTop: S.md, paddingTop: S.md },
  totalLabel: { fontSize: 14, color: C.muted },
  totalValue: { fontFamily: F.serifBold, fontSize: 24, color: C.ink },
  points: { fontSize: 13, color: C.gold, fontWeight: '600', marginTop: S.sm },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  payTitle: { fontSize: 15, fontWeight: '700', color: C.ink },
  payBody: { fontSize: 13, color: C.muted, marginTop: 1 },
  policy: { fontSize: 13, color: C.muted, marginTop: S.md, paddingTop: S.md, borderTopWidth: 1, borderTopColor: C.line, lineHeight: 19 },
});
