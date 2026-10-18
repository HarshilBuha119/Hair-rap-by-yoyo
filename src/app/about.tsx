import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button, CoverImage, Screen, SectionHeader } from '@/components/ui';
import { C, F, R, S, SALON, STATS } from '@/constants/brand';
import { BRAND_TILE, PHOTO, photo } from '@/data/images';
import { TEAM } from '@/data/menu';
import { directions } from '@/lib/contact';

export default function About() {
  return (
    <Screen topInset={false}>
      <CoverImage source={PHOTO['lounge-arch']} style={styles.hero}>
        <LinearGradient colors={['rgba(11,11,13,0.05)', 'rgba(11,11,13,0.9)']} style={StyleSheet.absoluteFill} />
        <Text style={styles.kicker}>ABOUT US</Text>
        <Text style={styles.heroTitle}>Where artistry meets empowerment</Text>
      </CoverImage>

      <Text style={styles.body}>
        We don&apos;t just style hair. We craft transformative experiences, blending innovation, luxury and personalised artistry. Every service is a celebration of individuality, where technique meets precision and hair becomes a canvas for self-expression.
      </Text>

      <View style={styles.stats}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="The journey of Yoyo" />
      <View style={styles.journey}>
        <Image source={PHOTO['portrait-yoyo']} style={styles.journeyImg} accessibilityIgnoresInvertColors />
        <Text style={styles.body2}>
          Back from the UK and at a crossroads, Yoyo watched a barber teach haircutting and realised hairdressing was a skill that could travel anywhere. He began by cutting hair in people&apos;s homes, trained with mentors in India and Dubai, and went on to earn a place at a world-renowned salon.
        </Text>
        <Text style={styles.body2}>Today the brand has served clients from India to the USA and the UK, with a team led by Yoyo himself.</Text>
      </View>

      <SectionHeader title="Our creative team" />
      <View style={styles.team}>
        {TEAM.map((m) => (
          <View key={m.id} style={styles.member}>
            <Image source={photo(m.photo)} style={styles.memberImg} accessibilityIgnoresInvertColors />
            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{m.name}</Text>
              <Text style={styles.memberRole}>{m.role}</Text>
              <Text style={styles.memberBio}>{m.bio}</Text>
            </View>
          </View>
        ))}
      </View>

      <SectionHeader title="Trusted partners" />
      <View style={styles.partners}>
        <Image source={BRAND_TILE.pH} style={styles.partner} accessibilityIgnoresInvertColors />
        <Image source={BRAND_TILE.Olaplex} style={styles.partner} accessibilityIgnoresInvertColors />
        <Image source={BRAND_TILE.Biotop} style={styles.partner} accessibilityIgnoresInvertColors />
        <Image source={BRAND_TILE.Schwarzkopf} style={styles.partner} accessibilityIgnoresInvertColors />
      </View>
      <Text style={styles.partnerNote}>Collaborations with global partners including Dyson, Dermalogica and KEUNE.</Text>

      <View style={styles.visit}>
        <Text style={styles.visitTitle}>Visit us</Text>
        <Text style={styles.visitBody}>{SALON.address}</Text>
        <Text style={styles.visitHours}>{SALON.hours}</Text>
        <Button label="Get directions" icon="map-pin" variant="outline" onPress={directions} style={{ marginTop: S.md }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: S.lg, height: 240, justifyContent: 'flex-end', padding: S.xl, backgroundColor: C.ink, borderRadius: R.lg, overflow: 'hidden' },
  kicker: { fontSize: 11, letterSpacing: 1.5, fontWeight: '800', color: C.gold },
  heroTitle: { fontFamily: F.serifBold, fontSize: 28, lineHeight: 34, color: C.ivory, marginTop: S.xs },
  body: { fontSize: 15, lineHeight: 23, color: C.muted, padding: S.lg },
  stats: { flexDirection: 'row', marginHorizontal: S.lg, backgroundColor: C.ink, borderRadius: R.lg, paddingVertical: S.xl },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: F.serifBold, fontSize: 22, color: C.gold },
  statLabel: { fontSize: 11, color: '#CFC8BB', marginTop: 2, textAlign: 'center' },
  journey: { marginHorizontal: S.lg },
  journeyImg: { width: '100%', height: 260, borderRadius: R.lg, backgroundColor: C.sand, marginBottom: S.lg },
  body2: { fontSize: 15, lineHeight: 23, color: C.muted, marginBottom: S.md },
  team: { marginHorizontal: S.lg, gap: S.md },
  member: { flexDirection: 'row', gap: S.md, backgroundColor: C.paper, borderRadius: R.md, borderWidth: 1, borderColor: C.line, padding: S.md },
  memberImg: { width: 84, height: 104, borderRadius: R.sm, backgroundColor: C.sand },
  memberName: { fontFamily: F.serif, fontSize: 18, color: C.ink },
  memberRole: { fontSize: 12, fontWeight: '700', color: C.gold, marginTop: 1 },
  memberBio: { fontSize: 13, lineHeight: 19, color: C.muted, marginTop: S.xs },
  partners: { flexDirection: 'row', gap: S.sm, paddingHorizontal: S.lg },
  partner: { flex: 1, aspectRatio: 1, borderRadius: R.md, backgroundColor: '#000' },
  partnerNote: { fontSize: 13, color: C.muted, paddingHorizontal: S.lg, marginTop: S.md, lineHeight: 19 },
  visit: { margin: S.lg, marginTop: S.xl, padding: S.lg, borderRadius: R.md, backgroundColor: C.sand },
  visitTitle: { fontFamily: F.serif, fontSize: 18, color: C.ink },
  visitBody: { fontSize: 13, lineHeight: 19, color: C.muted, marginTop: S.xs },
  visitHours: { fontSize: 13, color: C.ink, fontWeight: '600', marginTop: S.xs },
});
