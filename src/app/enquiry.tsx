import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Field, Screen, Segmented } from '@/components/ui';
import { C, F, R, S } from '@/constants/brand';
import { PHOTO } from '@/data/images';
import { whatsapp } from '@/lib/contact';
import { useApp } from '@/store/app-store';

type Kind = 'bridal' | 'groom' | 'party';
type Where = 'ahmedabad' | 'destination';

const KIND_LABEL: Record<Kind, string> = { bridal: 'Bridal hair & makeup', groom: 'Groom hair & makeup', party: 'Party / at-home styling' };

// Taken from the makeup lounge terms on the salon's website.
const GOOD_TO_KNOW = [
  'Bridal hair trials are part of the bridal package and happen 2 to 4 weeks before the function.',
  'A half-face makeup trial (bride only) is ₹5,000.',
  'Appointments between 5 AM and 9 AM are chargeable at ₹2,000 per person.',
  'Destination bookings are customised. Please discuss your requirements first.',
  'Please arrive with a clean face and washed hair. Removal charges are extra otherwise.',
  'Groom bookings need full payment in advance and are not cancellable or refundable once booked.',
];

export default function Enquiry() {
  const { state } = useApp();
  const [kind, setKind] = useState<Kind>('bridal');
  const [where, setWhere] = useState<Where>('ahmedabad');
  const [name, setName] = useState(state.user?.name ?? '');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const send = () =>
    whatsapp(
      [
        'Hi Hair Rap by Yoyo,',
        `I would like to enquire about: ${KIND_LABEL[kind]}.`,
        `Location: ${where === 'ahmedabad' ? 'Ahmedabad' : 'Destination'}`,
        `Date: ${date.trim() || 'Not decided yet'}`,
        `Name: ${name.trim() || '-'}`,
        notes.trim() ? `Notes: ${notes.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );

  return (
    <Screen topInset={false} bottomSpace={40}>
      <View style={styles.pad}>
        <Image source={PHOTO.bridal} style={styles.banner} resizeMode="cover" accessibilityIgnoresInvertColors />
        <Text style={styles.intro}>Tell us about the occasion and we will reply on WhatsApp with availability and a quote.</Text>

        <Text style={styles.label}>What do you need?</Text>
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { id: 'bridal', label: 'Bridal' },
            { id: 'groom', label: 'Groom' },
            { id: 'party', label: 'Party' },
          ]}
        />

        <Text style={[styles.label, { marginTop: S.xl }]}>Where?</Text>
        <Segmented
          value={where}
          onChange={setWhere}
          options={[
            { id: 'ahmedabad', label: 'Ahmedabad' },
            { id: 'destination', label: 'Destination' },
          ]}
        />

        <View style={{ marginTop: S.xl }}>
          <Field label="Your name" value={name} onChangeText={setName} placeholder="Full name" />
          <Field label="Event date" value={date} onChangeText={setDate} placeholder="e.g. 14 Feb 2027" />
          <Field label="Anything else?" value={notes} onChangeText={setNotes} placeholder="Number of people, look you want, timings" multiline maxLength={300} />
        </View>

        <Button label="Send on WhatsApp" icon="message-circle" variant="gold" onPress={send} />

        <Card style={styles.know}>
          <Text style={styles.knowTitle}>Good to know</Text>
          <Text style={styles.knowSub}>From the makeup lounge terms</Text>
          {GOOD_TO_KNOW.map((t) => (
            <View key={t} style={styles.knowRow}>
              <Feather name="check" size={16} color={C.gold} style={{ marginTop: 3 }} />
              <Text style={styles.knowText}>{t}</Text>
            </View>
          ))}
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: S.lg },
  banner: { width: '100%', height: 220, borderRadius: R.lg, marginBottom: S.lg, backgroundColor: C.sand },
  intro: { fontSize: 15, lineHeight: 22, color: C.muted, marginBottom: S.xl },
  label: { fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: S.sm },
  know: { marginTop: S.xl },
  knowTitle: { fontFamily: F.serif, fontSize: 19, color: C.ink },
  knowSub: { fontSize: 12, color: C.muted, marginTop: 2, marginBottom: S.md },
  knowRow: { flexDirection: 'row', gap: S.sm, marginBottom: S.sm },
  knowText: { flex: 1, fontSize: 13, lineHeight: 19, color: C.ink },
});
