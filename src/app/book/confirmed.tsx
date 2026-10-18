import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Screen } from '@/components/ui';
import { C, F, S, SALON } from '@/constants/brand';
import { PHOTO } from '@/data/images';
import { levelLabel } from '@/data/menu';
import { directions } from '@/lib/contact';
import { inr, prettyDate, prettyTime } from '@/lib/format';
import { useApp } from '@/store/app-store';

export default function Confirmed() {
  const router = useRouter();
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const { state } = useApp();
  const booking = state.bookings.find((b) => b.ref === ref);

  return (
    <Screen topInset={false}>
      <View>
        <Image source={PHOTO['lounge-reception']} style={styles.banner} accessibilityIgnoresInvertColors />
        <View style={styles.tickWrap}>
          <View style={styles.tick}>
            <Feather name="check" size={34} color={C.ink} />
          </View>
        </View>
      </View>
      <View style={styles.hero}>
        <Text style={styles.title}>You are booked in</Text>
        <Text style={styles.sub}>We will see you at {SALON.name}.</Text>
      </View>

      {booking ? (
        <Card style={styles.card}>
          <Text style={styles.ref}>Booking ref · {booking.ref}</Text>
          <Text style={styles.when}>
            {prettyDate(booking.dateISO)} · {prettyTime(booking.time)}
          </Text>
          <Text style={styles.line}>{booking.lines.map((l) => l.name + (l.option ? ` (${l.option})` : '')).join(' + ')}</Text>
          <Text style={styles.line}>
            {levelLabel(booking.levelId)} · {inr(booking.total)} · pay at salon
          </Text>
          <Text style={styles.addr}>{SALON.address}</Text>
        </Card>
      ) : null}

      <View style={styles.actions}>
        <Button label="Get directions" icon="map-pin" variant="outline" onPress={directions} />
        <Button label="View my bookings" variant="primary" onPress={() => router.replace('/bookings')} />
        <Button label="Back to home" variant="ghost" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { width: '100%', height: 230, backgroundColor: C.sand },
  tickWrap: { position: 'absolute', left: 0, right: 0, bottom: -42, alignItems: 'center' },
  tick: { width: 84, height: 84, borderRadius: 42, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: C.ivory },
  hero: { alignItems: 'center', paddingTop: 56, paddingHorizontal: S.lg },
  title: { fontFamily: F.serifBold, fontSize: 30, color: C.ink },
  sub: { fontSize: 15, color: C.muted, marginTop: S.xs },
  card: { marginHorizontal: S.lg, marginTop: S.xl },
  ref: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: C.gold },
  when: { fontFamily: F.serif, fontSize: 22, color: C.ink, marginTop: S.sm },
  line: { fontSize: 14, color: C.ink, marginTop: S.xs, lineHeight: 20 },
  addr: { fontSize: 13, color: C.muted, marginTop: S.md, lineHeight: 19 },
  actions: { paddingHorizontal: S.lg, gap: S.md, marginTop: S.xl },
});
