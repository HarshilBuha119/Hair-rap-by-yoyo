import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CartBar, ServiceRow } from '@/components/cards';
import { Chip, Screen, Segmented, Title } from '@/components/ui';
import { C, F, S } from '@/constants/brand';
import { CATEGORIES, GROUP_NOTES, SERVICES, hasChoice, type CategoryId, type Service } from '@/data/menu';
import { draftTotals, useApp } from '@/store/app-store';

type Who = 'women' | 'men';

export default function Services() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [who, setWho] = useState<Who>('women');
  const [cat, setCat] = useState<CategoryId>('hair');
  const [open, setOpen] = useState<string | null>(null);

  const matches = (s: Service) => s.gender === who || s.gender === 'both';
  const cats = CATEGORIES.filter((c) => SERVICES.some((s) => matches(s) && s.category === c.id));
  const activeCat = cats.some((c) => c.id === cat) ? cat : cats[0].id;
  const list = SERVICES.filter((s) => matches(s) && s.category === activeCat);
  const groups = Array.from(new Set(list.map((s) => s.group)));
  const totals = draftTotals(state.draft);

  const chosen = (id: string) => state.draft.items.find((i) => i.serviceId === id)?.choice ?? null;

  const press = (s: Service) => {
    if (hasChoice(s)) setOpen(open === s.id ? null : s.id);
    else dispatch({ type: 'toggleItem', serviceId: s.id, choice: 0 });
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen bottomSpace={totals.count ? 130 : 24}>
        <Title title="Services" subtitle="Our full menu. Pick one or more, then choose a time." />
        <View style={styles.pad}>
          <Segmented
            value={who}
            onChange={setWho}
            options={[
              { id: 'women', label: 'Women' },
              { id: 'men', label: 'Men' },
            ]}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {cats.map((c) => (
            <Chip key={c.id} label={c.label} icon={c.icon as never} active={c.id === activeCat} onPress={() => setCat(c.id)} />
          ))}
        </ScrollView>

        {groups.map((g) => (
          <View key={g}>
            <View style={styles.groupHead}>
              <Text style={styles.groupTitle} accessibilityRole="header">
                {g}
              </Text>
              {GROUP_NOTES[g] ? <Text style={styles.groupNote}>{GROUP_NOTES[g]}</Text> : null}
            </View>
            {list
              .filter((s) => s.group === g)
              .map((s) => (
                <ServiceRow
                  key={s.id}
                  service={s}
                  selected={chosen(s.id)}
                  expanded={open === s.id}
                  onPress={() => press(s)}
                  onChoose={(choice) => dispatch({ type: 'toggleItem', serviceId: s.id, choice })}
                />
              ))}
          </View>
        ))}
      </Screen>
      <CartBar
        inTabs
        count={totals.count}
        total={totals.total}
        durationMin={totals.durationMin}
        onContinue={() => router.push('/book/schedule')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: S.lg },
  chips: { paddingHorizontal: S.lg, paddingVertical: S.lg, gap: S.sm },
  groupHead: { paddingHorizontal: S.lg, marginTop: S.md, marginBottom: S.md },
  groupTitle: { fontFamily: F.serif, fontSize: 20, color: C.ink },
  groupNote: { fontSize: 12, color: C.muted, marginTop: 2 },
});
