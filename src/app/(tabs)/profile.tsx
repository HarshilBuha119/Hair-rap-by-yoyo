import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Screen, SectionHeader, Title, type IconName } from '@/components/ui';
import { C, F, R, S } from '@/constants/brand';
import { callSalon, directions, whatsapp } from '@/lib/contact';
import { initials, inr, prettyDate, toISODate } from '@/lib/format';
import { TIERS, rewards, useApp } from '@/store/app-store';

export default function Profile() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const user = state.user;
  const r = rewards(state.bookings);
  const progress = r.next ? Math.min(1, (r.earned - r.tier.from) / (r.next.from - r.tier.from)) : 1;

  const signOut = () =>
    Alert.alert('Sign out?', 'Bookings saved on this device will be cleared in this demo build.', [
      { text: 'Stay signed in', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => dispatch({ type: 'logout' }) },
    ]);

  return (
    <Screen>
      <Title title="Profile" />

      {user ? (
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user.name)}</Text>
          </View>
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.phone}>+91 {user.phone}</Text>
          </View>
        </View>
      ) : (
        <Card style={styles.guest}>
          <Text style={styles.guestTitle}>Sign in to book and earn rewards</Text>
          <Text style={styles.guestBody}>Use your mobile number. It takes ten seconds.</Text>
          <Button label="Sign in" onPress={() => router.push('/login')} style={{ marginTop: S.lg }} />
        </Card>
      )}

      {user ? (
        <View style={styles.rewards}>
          <Text style={styles.rKicker}>HAIR RAP REWARDS</Text>
          <View style={styles.rTop}>
            <Text style={styles.rTier}>{r.tier.name}</Text>
            <Text style={styles.rPoints}>{r.earned} pts</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
          <Text style={styles.rNote}>
            {r.next ? `${r.next.from - r.earned} points to ${r.next.name}` : 'You are at the top tier'}
            {r.pending ? `  ·  ${r.pending} pending from upcoming visits` : ''}
          </Text>
          <Text style={styles.rFine}>
            1 point per ₹100 on completed visits. Tiers: {TIERS.map((t) => `${t.name} ${t.from}+`).join(' · ')}
          </Text>
        </View>
      ) : null}

      {user && state.orders.length ? (
        <>
          <SectionHeader title="Shop orders" />
          {state.orders.map((o) => (
            <Card key={o.id} style={styles.order}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderTitle}>
                  {o.lines.reduce((n, l) => n + l.qty, 0)} item(s) · {inr(o.total)}
                </Text>
                <Text style={styles.orderMeta}>{prettyDate(toISODate(new Date(o.createdAt)))} · Pay at salon / on delivery</Text>
              </View>
            </Card>
          ))}
        </>
      ) : null}

      <SectionHeader title="More" />
      <Card style={styles.menu}>
        <Row icon="info" label="About us & team" onPress={() => router.push('/about')} />
        <Row icon="star" label="Lounge memberships" onPress={() => router.push('/memberships')} />
        <Row icon="award" label="Trendsetter Academy" onPress={() => router.push('/academy')} />
        <Row icon="heart" label="Bridal & at-home enquiry" onPress={() => router.push('/enquiry')} />
        <Row icon="phone" label="Call the salon" onPress={callSalon} />
        <Row icon="message-circle" label="Chat on WhatsApp" onPress={() => whatsapp('Hi Hair Rap by Yoyo, I need some help.')} />
        <Row icon="map-pin" label="Get directions" onPress={directions} last={!user} />
        {user ? <Row icon="log-out" label="Sign out" onPress={signOut} danger last /> : null}
      </Card>

      <Text style={styles.footer}>Demo build 0.2 · Menu, prices and products from the public website. Service durations are estimates.</Text>
    </Screen>
  );
}

function Row({ icon, label, onPress, danger, last }: { icon: IconName; label: string; onPress: () => void; danger?: boolean; last?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[styles.row, !last && styles.rowLine]}>
      <Feather name={icon} size={19} color={danger ? C.danger : C.ink} />
      <Text style={[styles.rowLabel, danger && { color: C.danger }]}>{label}</Text>
      <Feather name="chevron-right" size={18} color={C.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  userRow: { flexDirection: 'row', alignItems: 'center', gap: S.lg, paddingHorizontal: S.lg, paddingBottom: S.lg },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.ink, borderWidth: 1.5, borderColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.serifBold, fontSize: 22, color: C.gold },
  name: { fontFamily: F.serif, fontSize: 22, color: C.ink },
  phone: { fontSize: 14, color: C.muted, marginTop: 2 },
  guest: { marginHorizontal: S.lg },
  guestTitle: { fontFamily: F.serif, fontSize: 19, color: C.ink },
  guestBody: { fontSize: 14, color: C.muted, marginTop: S.xs },
  rewards: { backgroundColor: C.ink, borderRadius: R.lg, marginHorizontal: S.lg, padding: S.xl },
  rKicker: { fontSize: 11, letterSpacing: 1.5, fontWeight: '800', color: C.gold },
  rTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: S.sm },
  rTier: { fontFamily: F.serifBold, fontSize: 30, color: C.ivory },
  rPoints: { fontSize: 18, fontWeight: '800', color: C.goldSoft },
  track: { height: 8, borderRadius: 4, backgroundColor: '#3A3A42', marginTop: S.lg, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4, backgroundColor: C.gold },
  rNote: { fontSize: 13, color: C.goldSoft, marginTop: S.md },
  rFine: { fontSize: 12, color: '#A8A196', marginTop: S.sm, lineHeight: 17 },
  order: { marginHorizontal: S.lg, marginBottom: S.sm, flexDirection: 'row' },
  orderTitle: { fontSize: 15, fontWeight: '700', color: C.ink },
  orderMeta: { fontSize: 13, color: C.muted, marginTop: 2 },
  menu: { marginHorizontal: S.lg, paddingVertical: 0, paddingHorizontal: S.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: S.md, minHeight: 54 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: C.line },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: C.ink },
  footer: { fontSize: 12, color: C.muted, textAlign: 'center', marginTop: S.xl, paddingHorizontal: S.xl },
});
