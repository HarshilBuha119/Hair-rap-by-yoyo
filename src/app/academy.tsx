import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button, Card, CoverImage, Screen } from '@/components/ui';
import { C, F, R, S } from '@/constants/brand';
import { PHOTO, photo } from '@/data/images';
import { ACADEMY_COURSES } from '@/data/menu';
import { whatsapp } from '@/lib/contact';

export default function Academy() {
  return (
    <Screen topInset={false}>
      <CoverImage source={PHOTO['academy-class']} style={styles.banner}>
        <LinearGradient colors={['rgba(11,11,13,0.1)', 'rgba(11,11,13,0.88)']} style={StyleSheet.absoluteFill} />
        <Text style={styles.kicker}>BY HAIR RAP BY YOYO</Text>
        <Text style={styles.bannerTitle}>Trendsetter Academy</Text>
      </CoverImage>

      <Text style={styles.intro}>
        Where cutting-edge hairstyling meets fearless creativity. Born from Yoyo&apos;s own journey, the academy passes on expert knowledge, practical skills and industry insight to those who want to become true hair artists.
      </Text>

      {ACADEMY_COURSES.map((c) => (
        <Card key={c.id} style={styles.card}>
          <Image source={photo(c.photo)} style={styles.photo} accessibilityIgnoresInvertColors />
          <View style={styles.body}>
            <Text style={styles.title}>{c.title}</Text>
            <Text style={styles.text}>Course details, dates and fees on request.</Text>
            <Button
              label="Enquire on WhatsApp"
              icon="message-circle"
              variant="outline"
              onPress={() => whatsapp(`Hi Hair Rap by Yoyo, I would like to know about the Trendsetter Academy course: ${c.title}.`)}
              style={{ minHeight: 44, marginTop: S.lg }}
            />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { marginHorizontal: S.lg, height: 200, justifyContent: 'flex-end', padding: S.xl, backgroundColor: C.ink, borderRadius: R.lg, overflow: 'hidden' },
  kicker: { fontSize: 11, letterSpacing: 1.5, fontWeight: '800', color: C.gold },
  bannerTitle: { fontFamily: F.serifBold, fontSize: 28, color: C.ivory, marginTop: S.xs },
  intro: { fontSize: 15, lineHeight: 22, color: C.muted, padding: S.lg },
  card: { marginHorizontal: S.lg, marginBottom: S.md, padding: 0, overflow: 'hidden' },
  photo: { width: '100%', height: 150, backgroundColor: C.sand },
  body: { padding: S.lg },
  title: { fontFamily: F.serif, fontSize: 20, color: C.ink },
  text: { fontSize: 14, lineHeight: 21, color: C.muted, marginTop: S.sm },
});
