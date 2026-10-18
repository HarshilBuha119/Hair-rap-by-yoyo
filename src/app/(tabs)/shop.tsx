import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';

import { ProductCard } from '@/components/cards';
import { Chip, IconButton, Screen, Title } from '@/components/ui';
import { C, F, R, S } from '@/constants/brand';
import { BRAND_TILE } from '@/data/images';
import { BRAND_ORDER, PRODUCTS, PRODUCT_CATEGORIES } from '@/data/products';
import { bagTotals, useApp } from '@/store/app-store';

export default function Shop() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { state, dispatch } = useApp();
  const [brand, setBrand] = useState<string>('All');
  const [cat, setCat] = useState<string>('All');
  const [query, setQuery] = useState('');
  const bag = bagTotals(state.bag);

  const q = query.trim().toLowerCase();
  const list = PRODUCTS.filter(
    (p) => (brand === 'All' || p.brand === brand) && (cat === 'All' || p.category === cat) && (!q || `${p.name} ${p.brand}`.toLowerCase().includes(q)),
  );
  const cardWidth = (width - S.lg * 2 - S.md) / 2;

  return (
    <Screen>
      <Title
        title="Shop"
        subtitle="Professional care from the brands we use in the lounge."
        right={<IconButton icon="shopping-bag" label="Open bag" badge={bag.count} onPress={() => router.push('/bag')} />}
      />

      <View style={styles.search}>
        <Feather name="search" size={18} color={C.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products"
          placeholderTextColor="#A39D92"
          accessibilityLabel="Search products"
          style={styles.searchInput}
        />
        {query ? (
          <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
            <Feather name="x" size={18} color={C.muted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brands}>
        <Pressable onPress={() => setBrand('All')} accessibilityRole="button" accessibilityState={{ selected: brand === 'All' }} style={[styles.allTile, brand === 'All' && styles.tileOn]}>
          <Text style={styles.allText}>All</Text>
        </Pressable>
        {BRAND_ORDER.map((b) => (
          <Pressable key={b} onPress={() => setBrand(b)} accessibilityRole="button" accessibilityLabel={b} accessibilityState={{ selected: brand === b }} style={[styles.tile, brand === b && styles.tileOn]}>
            <Image source={BRAND_TILE[b]} style={styles.tileImg} resizeMode="cover" accessibilityIgnoresInvertColors />
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cats}>
        {['All', ...PRODUCT_CATEGORIES].map((c) => (
          <Chip key={c} label={c} active={c === cat} onPress={() => setCat(c)} />
        ))}
      </ScrollView>

      <Text style={styles.count}>
        {list.length} product{list.length === 1 ? '' : 's'}
      </Text>
      <View style={styles.grid}>
        {list.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            width={cardWidth}
            qty={state.bag[p.id] ?? 0}
            onAdd={() => dispatch({ type: 'bagSet', productId: p.id, qty: (state.bag[p.id] ?? 0) + 1 })}
          />
        ))}
      </View>
      {list.length === 0 ? <Text style={styles.empty}>No products match. Try another brand or search.</Text> : null}
      <Text style={styles.note}>Pay at the salon or on delivery. Online payments arrive in the next phase.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: S.sm, marginHorizontal: S.lg, paddingHorizontal: S.lg, backgroundColor: C.paper, borderRadius: R.pill, borderWidth: 1, borderColor: C.line },
  searchInput: { flex: 1, minHeight: 46, fontSize: 15, color: C.ink },
  brands: { paddingHorizontal: S.lg, paddingVertical: S.lg, gap: S.sm, alignItems: 'center' },
  tile: { width: 64, height: 64, borderRadius: R.md, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent', backgroundColor: '#000' },
  tileImg: { width: '100%', height: '100%' },
  tileOn: { borderColor: C.gold },
  allTile: { width: 64, height: 64, borderRadius: R.md, backgroundColor: C.paper, borderWidth: 2, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  allText: { fontFamily: F.serifBold, fontSize: 16, color: C.ink },
  cats: { paddingHorizontal: S.lg, paddingBottom: S.md, gap: S.sm },
  count: { fontSize: 12, color: C.muted, paddingHorizontal: S.lg, marginBottom: S.md, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.md, paddingHorizontal: S.lg },
  empty: { textAlign: 'center', color: C.muted, marginTop: S.xl, paddingHorizontal: S.xl },
  note: { fontSize: 12, color: C.muted, textAlign: 'center', marginTop: S.xl, paddingHorizontal: S.xl },
});
