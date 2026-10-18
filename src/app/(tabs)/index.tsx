import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/cards';
import { FocusedStatusBar } from '@/components/status-bar';
import { Button, Card, CoverImage, IconButton, Monogram, Screen, SectionHeader, shadow, type IconName } from '@/components/ui';
import { C, F, R, S, SALON } from '@/constants/brand';
import { LOUNGE, PHOTO, serviceImage } from '@/data/images';
import { SIGNATURE_IDS, firstOffered, levelLabel, serviceById, startingPrice, type Service } from '@/data/menu';
import { PRODUCTS } from '@/data/products';
import { callSalon, directions, whatsapp } from '@/lib/contact';
import { bookingStart, duration, inr, prettyDate, prettyTime } from '@/lib/format';
import { bagTotals, bookingPhase, useApp } from '@/store/app-store';

const signature = SIGNATURE_IDS.map(serviceById).filter((s): s is Service => !!s);
const FEATURED = [7343, 7535, 7697, 7455, 5615, 7339];
const featured = FEATURED.map((id) => PRODUCTS.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
const YOYO_TITLES = ['Fade expert', 'Hair magician', 'Bob specialist', 'Cool colourist'];

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const bag = bagTotals(state.bag);

  const next = state.bookings
    .filter((b) => bookingPhase(b) === 'upcoming')
    .sort((a, b) => bookingStart(a.dateISO, a.time).getTime() - bookingStart(b.dateISO, b.time).getTime())[0];

  const bookNow = (s: Service) => {
    dispatch({ type: 'setItems', items: [{ serviceId: s.id, choice: firstOffered(s) }] });
    router.push('/book/schedule');
  };

  return (
    <Screen topInset={false}>
      {/* The hero is a dark photo, so the status bar gets light icons while Home is focused. */}
      <FocusedStatusBar light />

      <CoverImage source={PHOTO['hero-silhouette']} style={[styles.hero, { paddingTop: insets.top + S.md }]}>
        <LinearGradient
          colors={['rgba(11,11,13,0.78)', 'rgba(11,11,13,0.45)', 'rgba(11,11,13,0.92)']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroTop}>
          <Monogram size={46} />
          <View style={{ flex: 1 }}>
            <Text style={styles.heroBrand}>{SALON.name}</Text>
            <Text style={styles.heroCity}>Bodakdev, Ahmedabad</Text>
          </View>
          <IconButton icon="shopping-bag" label="Open bag" tone="light" badge={bag.count} onPress={() => router.push('/bag')} />
        </View>
        <Text style={styles.heroHeadline}>{SALON.tagline}</Text>
        <Text style={styles.heroSub}>
          {state.user ? `Welcome back, ${state.user.name.split(' ')[0]}.` : 'Experience luxury. Redefine your style.'}
        </Text>
        <View style={styles.heroCtas}>
          <Button label="Book appointment" icon="calendar" variant="gold" onPress={() => router.push('/services')} style={{ flex: 1 }} />
        </View>
      </CoverImage>

      {next ? (
        <Pressable onPress={() => router.push('/bookings')} accessibilityRole="button" style={{ marginHorizontal: S.lg, marginTop: -S.xl }}>
          <Card style={[styles.nextCard, shadow]}>
            <View style={styles.nextIcon}>
              <Feather name="clock" size={20} color={C.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextLabel}>Your next appointment</Text>
              <Text style={styles.nextWhen}>
                {prettyDate(next.dateISO)} · {prettyTime(next.time)}
              </Text>
              <Text style={styles.nextWhat} numberOfLines={1}>
                {next.lines.map((l) => l.name).join(', ')} · {levelLabel(next.levelId)}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={C.muted} />
          </Card>
        </Pressable>
      ) : null}

      <View style={styles.quickRow}>
        <Quick icon="phone" label="Call" onPress={callSalon} />
        <Quick icon="message-circle" label="WhatsApp" onPress={() => whatsapp('Hi Hair Rap by Yoyo, I would like to know more.')} />
        <Quick icon="map-pin" label="Directions" onPress={directions} />
        <Quick icon="heart" label="Bridal" onPress={() => router.push('/enquiry')} />
      </View>

      <SectionHeader title="Signature services" action="Full menu" onAction={() => router.push('/services')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
        {signature.map((s) => (
          <Card key={s.id} style={styles.sigCard}>
            <Image source={serviceImage(s)} style={styles.sigImg} accessibilityIgnoresInvertColors />
            <View style={styles.sigBody}>
              <Text style={styles.sigGender}>{s.gender === 'men' ? "MEN'S" : s.gender === 'women' ? "WOMEN'S" : 'UNISEX'}</Text>
              <Text style={styles.sigName} numberOfLines={2}>
                {s.name}
              </Text>
              <Text style={styles.sigMeta}>
                from {inr(startingPrice(s))} · {duration(s.durationMin)}
              </Text>
              <Button label="Book" variant="outline" onPress={() => bookNow(s)} style={{ minHeight: 42, marginTop: S.md }} />
            </View>
          </Card>
        ))}
      </ScrollView>

      <SectionHeader title="Inside the lounge" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
        {LOUNGE.map((l) => (
          <CoverImage key={l.key} source={PHOTO[l.key]} style={styles.loungeCard}>
            <LinearGradient colors={['transparent', 'rgba(11,11,13,0.82)']} style={styles.loungeShade} />
            <Text style={styles.loungeCap}>{l.caption}</Text>
          </CoverImage>
        ))}
      </ScrollView>

      <CoverImage source={PHOTO.founder} style={styles.yoyo}>
        <LinearGradient colors={['rgba(11,11,13,0.15)', 'rgba(11,11,13,0.55)', 'rgba(11,11,13,0.96)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
        <Text style={styles.yoyoKicker}>MEET THE FOUNDER</Text>
        <Text style={styles.yoyoName}>Yoyo</Text>
        <Text style={styles.yoyoBody}>Founder and creative director. Book Yoyo directly for cuts, colour and styling.</Text>
        <View style={styles.tagRow}>
          {YOYO_TITLES.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
        <Button label="Our story & team" variant="gold" onPress={() => router.push('/about')} style={{ marginTop: S.lg, minHeight: 46 }} />
      </CoverImage>

      <Pressable onPress={() => router.push('/memberships')} accessibilityRole="button" style={{ marginHorizontal: S.lg, marginTop: S.lg }}>
        <View style={styles.member}>
          <View style={{ flex: 1 }}>
            <Text style={styles.memberKicker}>LOUNGE MEMBERSHIPS</Text>
            <Text style={styles.memberTitle}>VIP lounge access, for you and your family</Text>
            <Text style={styles.memberBody}>HNI family, group and corporate plans, valid for a year across all salon services.</Text>
          </View>
          <Feather name="arrow-right" size={22} color={C.gold} />
        </View>
      </Pressable>

      <Pressable onPress={() => router.push('/academy')} accessibilityRole="button" style={{ marginHorizontal: S.lg, marginTop: S.md }}>
        <Card style={styles.academy}>
          <Image source={PHOTO['academy-team']} style={styles.acadImg} accessibilityIgnoresInvertColors />
          <View style={{ flex: 1 }}>
            <Text style={styles.academyTitle}>Trendsetter Academy</Text>
            <Text style={styles.nextWhat}>Courses and masterclasses for aspiring hair artists.</Text>
          </View>
          <Feather name="chevron-right" size={20} color={C.muted} />
        </Card>
      </Pressable>

      <SectionHeader title="From our shelf" action="Shop all" onAction={() => router.push('/shop')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
        {featured.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            width={160}
            qty={state.bag[p.id] ?? 0}
            onAdd={() => dispatch({ type: 'bagSet', productId: p.id, qty: (state.bag[p.id] ?? 0) + 1 })}
          />
        ))}
      </ScrollView>

      <CoverImage source={PHOTO['lounge-reception']} style={styles.visit}>
        <LinearGradient colors={['rgba(11,11,13,0.05)', 'rgba(11,11,13,0.95)']} locations={[0.15, 0.8]} style={StyleSheet.absoluteFill} />
        <Text style={styles.visitTitle}>Visit us</Text>
        <Text style={styles.visitBody}>{SALON.address}</Text>
        <Text style={styles.visitHours}>{SALON.hours}</Text>
        <Button label="Get directions" icon="map-pin" variant="gold" onPress={directions} style={{ marginTop: S.md, minHeight: 46 }} />
      </CoverImage>
    </Screen>
  );
}

function Quick({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.quick}>
      <View style={styles.quickIcon}>
        <Feather name={icon} size={20} color={C.ink} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: S.lg, paddingBottom: S.xxl + S.lg, borderBottomLeftRadius: R.lg, borderBottomRightRadius: R.lg, overflow: 'hidden', backgroundColor: C.ink },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  heroBrand: { fontFamily: F.serif, fontSize: 18, color: C.ivory },
  heroCity: { fontSize: 12, color: C.goldSoft, marginTop: 1 },
  heroHeadline: { fontFamily: F.serifBold, fontSize: 34, lineHeight: 42, color: C.ivory, marginTop: S.xxl },
  heroSub: { fontSize: 15, color: C.goldSoft, marginTop: S.sm },
  heroCtas: { flexDirection: 'row', marginTop: S.xl },
  nextCard: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  nextIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  nextLabel: { fontSize: 12, color: C.muted, fontWeight: '600' },
  nextWhen: { fontFamily: F.serif, fontSize: 17, color: C.ink, marginTop: 1 },
  nextWhat: { fontSize: 13, color: C.muted, marginTop: 2 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: S.lg, marginTop: S.xl },
  quick: { alignItems: 'center', gap: 6, width: 72 },
  quickIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 12, fontWeight: '600', color: C.ink },
  hList: { paddingHorizontal: S.lg, gap: S.md },
  sigCard: { width: 215, padding: 0, overflow: 'hidden' },
  sigImg: { width: '100%', height: 130, backgroundColor: C.sand },
  sigBody: { padding: S.lg },
  sigGender: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: C.gold },
  sigName: { fontFamily: F.serif, fontSize: 18, lineHeight: 24, color: C.ink, marginTop: S.xs, height: 50 },
  sigMeta: { fontSize: 13, color: C.muted, marginTop: S.xs },
  loungeCard: { width: 230, height: 300, justifyContent: 'flex-end', backgroundColor: C.sand, borderRadius: R.lg },
  loungeShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 110, borderBottomLeftRadius: R.lg, borderBottomRightRadius: R.lg },
  loungeCap: { fontFamily: F.serif, fontSize: 17, color: C.ivory, padding: S.lg },
  yoyo: { marginHorizontal: S.lg, marginTop: S.xl, borderRadius: R.lg, padding: S.xl, paddingTop: 300, overflow: 'hidden', backgroundColor: C.ink },
  yoyoKicker: { fontSize: 11, letterSpacing: 1.5, color: C.gold, fontWeight: '800' },
  yoyoName: { fontFamily: F.serifBold, fontSize: 34, color: C.ivory, marginTop: S.xs },
  yoyoBody: { fontSize: 14, lineHeight: 21, color: '#D6CFC2', marginTop: S.sm },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, marginTop: S.lg },
  tag: { borderWidth: 1, borderColor: C.gold, borderRadius: R.pill, paddingHorizontal: S.md, paddingVertical: 6 },
  tagText: { color: C.goldSoft, fontSize: 12, fontWeight: '600' },
  member: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.ink, borderRadius: R.lg, borderWidth: 1, borderColor: C.gold, padding: S.xl },
  memberKicker: { fontSize: 11, letterSpacing: 1.5, color: C.gold, fontWeight: '800' },
  memberTitle: { fontFamily: F.serif, fontSize: 19, lineHeight: 26, color: C.ivory, marginTop: S.xs },
  memberBody: { fontSize: 13, lineHeight: 19, color: '#B9B2A4', marginTop: S.sm },
  academy: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  academyTitle: { fontFamily: F.serif, fontSize: 18, color: C.ink },
  acadImg: { width: 56, height: 56, borderRadius: R.sm, backgroundColor: C.sand },
  visit: { marginHorizontal: S.lg, marginTop: S.xl, padding: S.xl, paddingTop: 210, borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.ink },
  visitTitle: { fontFamily: F.serifBold, fontSize: 26, color: C.ivory },
  visitBody: { fontSize: 13, lineHeight: 19, color: '#D6CFC2', marginTop: S.sm },
  visitHours: { fontSize: 13, color: C.goldSoft, marginTop: S.xs, fontWeight: '600' },
});
