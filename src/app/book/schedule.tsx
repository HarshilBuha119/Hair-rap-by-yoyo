import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomBar, Button, Card, EmptyState, Screen } from '@/components/ui';
import { C, F, R, S } from '@/constants/brand';
import { PHOTO } from '@/data/images';
import { LEVELS, serviceById } from '@/data/menu';
import { dayShort, duration, inr, monthShort, prettyDate, prettyTime, toISODate } from '@/lib/format';
import { period, slotsFor } from '@/lib/slots';
import { draftTotals, priceItems, useApp } from '@/store/app-store';

const PERIODS = ['Morning', 'Afternoon', 'Evening'] as const;

export default function Schedule() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [now] = useState(() => new Date());
  const { draft } = state;
  const totals = draftTotals(draft);

  if (!draft.items.length) {
    return (
      <EmptyState
        icon="scissors"
        title="Pick a service first"
        body="Choose what you would like done, then we will find a time."
        action="Browse services"
        onAction={() => router.replace('/services')}
      />
    );
  }

  const tiered = draft.items.some((i) => serviceById(i.serviceId)?.pricing.kind === 'tier');

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    return { iso: toISODate(d), day: dayShort(d), date: d.getDate(), month: monthShort(d) };
  });
  const dateISO = draft.dateISO ?? days[0].iso;

  const mine = state.bookings
    .filter((b) => b.status === 'confirmed')
    .map((b) => ({ dateISO: b.dateISO, time: b.time, durationMin: b.durationMin }));
  const slots = slotsFor(dateISO, Math.max(totals.durationMin, 15), draft.levelId, mine, now);
  const blocked = totals.unavailable.length > 0;

  return (
    <View style={{ flex: 1 }}>
      <Screen topInset={false} bottomSpace={140}>
        <Card style={styles.summary}>
          {totals.lines.map((l) => (
            <Text key={l.serviceId} style={styles.sumLine} numberOfLines={1}>
              {l.name}
              {l.option ? ` · ${l.option}` : ''}
            </Text>
          ))}
          <Text style={styles.sumMeta}>
            {inr(totals.total)} · {duration(totals.durationMin)}
          </Text>
        </Card>

        <Text style={styles.label}>Stylist level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {LEVELS.map((l) => {
            const on = l.id === draft.levelId;
            const t = priceItems(draft.items, l.id);
            const off = t.unavailable.length > 0;
            return (
              <Pressable
                key={l.id}
                onPress={() => dispatch({ type: 'setLevel', levelId: l.id })}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                style={[styles.level, on && styles.levelOn]}>
                <View style={styles.levelTop}>
                  {l.id === 'cd' ? (
                    <Image source={PHOTO['team-yoyo']} style={styles.avatar} accessibilityIgnoresInvertColors />
                  ) : (
                    <View style={[styles.avatar, styles.avatarIcon, on && { backgroundColor: '#2A2A30' }]}>
                      <Feather name="scissors" size={16} color={C.gold} />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.levelName, on && { color: C.ivory }]}>{l.name}</Text>
                    <Text style={[styles.levelRole, on && { color: C.goldSoft }]}>{l.role}</Text>
                  </View>
                </View>
                {tiered ? (
                  <Text style={[styles.levelPrice, on && { color: C.goldSoft }, off && { color: C.danger }]}>
                    {off ? 'Not offered for all' : inr(t.total)}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
        {blocked ? (
          <Text style={styles.warn}>
            {totals.unavailable.join(', ')} {totals.unavailable.length > 1 ? 'are' : 'is'} not offered at this level. Please choose another level.
          </Text>
        ) : null}

        <Text style={styles.label}>Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {days.map((d) => {
            const on = d.iso === dateISO;
            return (
              <Pressable
                key={d.iso}
                onPress={() => dispatch({ type: 'setSlot', dateISO: d.iso, time: null })}
                accessibilityRole="button"
                accessibilityLabel={prettyDate(d.iso)}
                accessibilityState={{ selected: on }}
                style={[styles.day, on && styles.dayOn]}>
                <Text style={[styles.dayTop, on && { color: C.goldSoft }]}>{d.day}</Text>
                <Text style={[styles.dayNum, on && { color: C.ivory }]}>{d.date}</Text>
                <Text style={[styles.dayTop, on && { color: C.goldSoft }]}>{d.month}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {PERIODS.map((p) => {
          const group = slots.filter((s) => period(s.time) === p);
          if (!group.length) return null;
          return (
            <View key={p}>
              <Text style={styles.label}>{p}</Text>
              <View style={styles.slotGrid}>
                {group.map((s) => {
                  const on = s.time === draft.time && dateISO === draft.dateISO;
                  return (
                    <Pressable
                      key={s.time}
                      disabled={!s.available}
                      onPress={() => dispatch({ type: 'setSlot', dateISO, time: s.time })}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on, disabled: !s.available }}
                      style={[styles.slot, on && styles.slotOn, !s.available && styles.slotOff]}>
                      <Text style={[styles.slotText, on && { color: C.ivory }, !s.available && styles.slotTextOff]}>
                        {prettyTime(s.time)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
        {slots.every((s) => !s.available) ? (
          <Text style={styles.none}>No free slots on this day for your services. Try another date or level.</Text>
        ) : null}
      </Screen>

      <BottomBar>
        <View style={styles.barRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.barTop}>{draft.time && draft.dateISO ? 'Your slot' : 'Select a time'}</Text>
            <Text style={styles.barWhen}>
              {draft.time && draft.dateISO ? `${prettyDate(draft.dateISO)} · ${prettyTime(draft.time)}` : '—'}
            </Text>
          </View>
          <Button label="Continue" icon="arrow-right" disabled={!draft.time || blocked} onPress={() => router.push('/book/review')} />
        </View>
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { marginHorizontal: S.lg, marginTop: S.sm },
  sumLine: { fontFamily: F.serif, fontSize: 15, color: C.ink, marginBottom: 2 },
  sumMeta: { fontSize: 13, color: C.muted, marginTop: S.xs },
  label: { fontFamily: F.serif, fontSize: 18, color: C.ink, marginTop: S.xl, marginBottom: S.md, paddingHorizontal: S.lg },
  hList: { paddingHorizontal: S.lg, gap: S.sm },
  level: { width: 200, padding: S.md, borderRadius: R.md, borderWidth: 1.5, borderColor: C.line, backgroundColor: C.paper },
  levelOn: { backgroundColor: C.ink, borderColor: C.ink },
  levelTop: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.sand },
  avatarIcon: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.ink },
  levelName: { fontSize: 15, fontWeight: '700', color: C.ink },
  levelRole: { fontSize: 12, color: C.muted, marginTop: 1 },
  levelPrice: { fontFamily: F.serifBold, fontSize: 18, color: C.ink, marginTop: S.sm },
  warn: { color: C.danger, fontSize: 13, fontWeight: '600', paddingHorizontal: S.lg, marginTop: S.sm, lineHeight: 18 },
  day: { width: 60, paddingVertical: S.md, alignItems: 'center', borderRadius: R.md, borderWidth: 1.5, borderColor: C.line, backgroundColor: C.paper },
  dayOn: { backgroundColor: C.ink, borderColor: C.ink },
  dayTop: { fontSize: 12, color: C.muted, fontWeight: '600' },
  dayNum: { fontFamily: F.serifBold, fontSize: 22, color: C.ink, marginVertical: 2 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, paddingHorizontal: S.lg },
  slot: { width: '31%', minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: R.pill, borderWidth: 1.5, borderColor: C.line, backgroundColor: C.paper },
  slotOn: { backgroundColor: C.ink, borderColor: C.ink },
  slotOff: { backgroundColor: C.sand, borderColor: C.sand },
  slotText: { fontSize: 14, fontWeight: '700', color: C.ink },
  slotTextOff: { color: '#A39D92', textDecorationLine: 'line-through', fontWeight: '500' },
  none: { textAlign: 'center', color: C.muted, marginTop: S.xl, paddingHorizontal: S.xl, lineHeight: 20 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  barTop: { fontSize: 12, color: C.muted },
  barWhen: { fontFamily: F.serifBold, fontSize: 17, color: C.ink },
});
