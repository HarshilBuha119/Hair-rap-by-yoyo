import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Screen, SectionHeader } from '@/components/ui';
import { C, F, R, S } from '@/constants/brand';
import { PHOTO } from '@/data/images';
import { MEMBERSHIPS } from '@/data/menu';
import { whatsapp } from '@/lib/contact';

const PERKS = ['Valid for 1 year', 'All salon services', 'VIP lounge access'];

export default function Memberships() {
  return (
    <Screen topInset={false}>
      <Text style={styles.intro}>
        Experience the lounge the way it is meant to be enjoyed. Choose a plan for you and your family, a group, or your company. Price ranges below are as published by the salon.
      </Text>

      {MEMBERSHIPS.map((m) => (
        <View key={m.id} style={styles.plan}>
          <View style={styles.planTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.planName}>{m.name}</Text>
              <Text style={styles.planType}>{m.type}</Text>
            </View>
            <Text style={styles.planPrice}>{m.price}</Text>
          </View>
          <View style={styles.perks}>
            <Perk text={m.users} />
            {PERKS.map((p) => (
              <Perk key={p} text={p} />
            ))}
          </View>
          <Button
            label="Enquire on WhatsApp"
            icon="message-circle"
            variant="gold"
            onPress={() => whatsapp(`Hi Hair Rap by Yoyo, I am interested in the ${m.name} membership (${m.type}, ${m.price}). Please share the details.`)}
            style={{ minHeight: 46, marginTop: S.lg }}
          />
        </View>
      ))}

      <SectionHeader title="Gift vouchers" />
      <Card style={styles.voucher}>
        <Image source={PHOTO.voucher} style={styles.voucherImg} resizeMode="cover" accessibilityIgnoresInvertColors />
        <View style={{ padding: S.lg }}>
          <Text style={styles.voucherTitle}>The easiest way to gift a great look</Text>
          <Text style={styles.voucherBody}>Vouchers that every friend of yours will love.</Text>
          <Button
            label="Ask about vouchers"
            icon="gift"
            variant="outline"
            onPress={() => whatsapp('Hi Hair Rap by Yoyo, I would like to buy a gift voucher.')}
            style={{ minHeight: 44, marginTop: S.md }}
          />
        </View>
      </Card>
    </Screen>
  );
}

function Perk({ text }: { text: string }) {
  return (
    <View style={styles.perk}>
      <Feather name="check" size={14} color={C.gold} />
      <Text style={styles.perkText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 15, lineHeight: 22, color: C.muted, paddingHorizontal: S.lg, paddingBottom: S.lg },
  plan: { marginHorizontal: S.lg, marginBottom: S.md, backgroundColor: C.ink, borderRadius: R.lg, borderWidth: 1, borderColor: '#3A3328', padding: S.xl },
  planTop: { flexDirection: 'row', alignItems: 'flex-start', gap: S.md },
  planName: { fontFamily: F.serifBold, fontSize: 26, color: C.ivory },
  planType: { fontSize: 11, letterSpacing: 1.2, color: C.gold, fontWeight: '800', marginTop: 2, textTransform: 'uppercase' },
  planPrice: { fontFamily: F.serif, fontSize: 20, color: C.goldSoft },
  perks: { marginTop: S.lg, gap: 6 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  perkText: { fontSize: 14, color: '#D6CFC2' },
  voucher: { marginHorizontal: S.lg, padding: 0, overflow: 'hidden' },
  voucherImg: { width: '100%', height: 190, backgroundColor: C.sand },
  voucherTitle: { fontFamily: F.serif, fontSize: 18, color: C.ink },
  voucherBody: { fontSize: 14, color: C.muted, marginTop: S.xs },
});
