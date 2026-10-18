import { useRouter } from 'expo-router';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

import { BottomBar, Button, Card, EmptyState, Screen, Stepper } from '@/components/ui';
import { C, F, S } from '@/constants/brand';
import { productImage } from '@/data/images';
import { brandLabel } from '@/data/products';
import { inr } from '@/lib/format';
import { bagTotals, makeOrder, useApp } from '@/store/app-store';

export default function Bag() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const bag = bagTotals(state.bag);

  if (!bag.lines.length) {
    return (
      <EmptyState icon="shopping-bag" title="Your bag is empty" body="Add some of our professional hair-care picks." action="Browse the shop" onAction={() => router.replace('/shop')} />
    );
  }

  const place = () => {
    if (!state.user) {
      router.push('/login');
      return;
    }
    dispatch({
      type: 'placeOrder',
      order: makeOrder(
        bag.lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
        bag.total,
      ),
    });
    Alert.alert('Order placed', 'We will confirm your order shortly. Pay at the salon or on delivery.', [
      { text: 'OK', onPress: () => router.replace('/profile') },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen topInset={false} bottomSpace={130}>
        {bag.lines.map(({ product, qty }) => {
          const img = productImage(product.id);
          return (
            <Card key={product.id} style={styles.line}>
              {img ? <Image source={img} style={styles.swatch} resizeMode="contain" accessibilityIgnoresInvertColors /> : <View style={styles.swatch} />}
              <View style={{ flex: 1 }}>
                <Text style={styles.brand}>{brandLabel(product.brand)}</Text>
                <Text style={styles.name} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.meta}>
                  {product.size} · {inr(product.price)}
                </Text>
                <View style={styles.stepRow}>
                  <Stepper qty={qty} onChange={(q) => dispatch({ type: 'bagSet', productId: product.id, qty: q })} />
                  <Text style={styles.lineTotal}>{inr(product.price * qty)}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </Screen>
      <BottomBar>
        <View style={styles.barRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.barTop}>Total · {bag.count} item(s)</Text>
            <Text style={styles.barTotal}>{inr(bag.total)}</Text>
          </View>
          <Button label={state.user ? 'Place order' : 'Sign in to order'} variant="gold" onPress={place} />
        </View>
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: 'row', gap: S.md, marginHorizontal: S.lg, marginBottom: S.md },
  swatch: { width: 84, height: 104, borderRadius: 10, backgroundColor: '#fff' },
  brand: { fontSize: 10, letterSpacing: 1.2, fontWeight: '800', color: C.gold },
  name: { fontSize: 15, fontWeight: '700', color: C.ink, marginTop: 2 },
  meta: { fontSize: 13, color: C.muted, marginTop: 2 },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: S.md },
  lineTotal: { fontSize: 16, fontWeight: '800', color: C.ink },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  barTop: { fontSize: 13, color: C.muted },
  barTotal: { fontFamily: F.serifBold, fontSize: 22, color: C.ink },
});
