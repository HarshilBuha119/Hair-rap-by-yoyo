import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomBar, Button, shadow } from '@/components/ui';
import { C, F, R, S } from '@/constants/brand';
import { productImage, serviceImage } from '@/data/images';
import { hasChoice, startingPrice, type Service } from '@/data/menu';
import { brandLabel, type Product } from '@/data/products';
import { duration, inr } from '@/lib/format';

type RowProps = {
  service: Service;
  /** Index of the chosen option, or null when the service is not in the cart. */
  selected: number | null;
  expanded: boolean;
  onPress: () => void;
  onChoose: (choice: number) => void;
};

export function ServiceRow({ service, selected, expanded, onPress, onChoose }: RowProps) {
  const isSelected = selected !== null;
  const p = service.pricing;
  const price =
    p.kind === 'flat'
      ? inr(p.price)
      : isSelected && p.kind === 'choice' && p.prices[selected!] != null
        ? `${p.labels[selected!]} · ${inr(p.prices[selected!]!)}`
        : `from ${inr(startingPrice(service))}`;

  return (
    <View style={[styles.serviceRow, isSelected && styles.serviceRowOn]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected, expanded: hasChoice(service) ? expanded : undefined }}
        accessibilityLabel={`${service.name}, ${price}, ${duration(service.durationMin)}`}
        style={styles.serviceTop}>
        <Image source={serviceImage(service)} style={styles.thumb} accessibilityIgnoresInvertColors />
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceName}>{service.name}</Text>
          {service.blurb ? <Text style={styles.serviceBlurb}>{service.blurb}</Text> : null}
          <Text style={styles.serviceMeta}>
            <Text style={styles.servicePrice}>{price}</Text>
            {'  ·  '}
            {duration(service.durationMin)}
          </Text>
          {p.kind === 'tier' ? <Text style={styles.tierNote}>Price depends on stylist level</Text> : null}
        </View>
        <View style={[styles.check, isSelected && styles.checkOn]}>
          <Feather
            name={isSelected ? 'check' : hasChoice(service) ? (expanded ? 'chevron-up' : 'chevron-down') : 'plus'}
            size={18}
            color={isSelected ? C.ink : C.muted}
          />
        </View>
      </Pressable>

      {hasChoice(service) && expanded && p.kind === 'choice' ? (
        <View style={styles.options}>
          {p.labels.map((label, i) => {
            const price = p.prices[i];
            const on = selected === i;
            return (
              <Pressable
                key={label}
                disabled={price == null}
                onPress={() => onChoose(i)}
                accessibilityRole="button"
                accessibilityState={{ selected: on, disabled: price == null }}
                style={[styles.option, on && styles.optionOn, price == null && styles.optionOff]}>
                <Text style={[styles.optionLabel, on && { color: C.ivory }]}>{label}</Text>
                <Text style={[styles.optionPrice, on && { color: C.goldSoft }]}>{price == null ? 'On consultation' : inr(price)}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

export function ProductCard({
  product,
  qty,
  onAdd,
  width,
}: {
  product: Product;
  qty: number;
  onAdd: () => void;
  width?: number;
}) {
  const img = productImage(product.id);
  return (
    <View style={[styles.product, width ? { width } : { flex: 1 }]}>
      <View style={styles.productArt}>
        {img ? <Image source={img} style={styles.productImg} resizeMode="contain" accessibilityIgnoresInvertColors /> : null}
      </View>
      <Text style={styles.productBrand}>{brandLabel(product.brand)}</Text>
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.productSize}>{product.size}</Text>
      <View style={styles.productFoot}>
        <Text style={styles.productPrice}>{inr(product.price)}</Text>
        <Pressable
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name} to bag`}
          style={styles.addBtn}>
          {qty > 0 ? <Text style={styles.addQty}>{qty}</Text> : <Feather name="plus" size={18} color={C.ivory} />}
        </Pressable>
      </View>
    </View>
  );
}

/** Sticky summary shown while the customer is picking services. */
export function CartBar({
  count,
  total,
  durationMin,
  onContinue,
  inTabs,
}: {
  count: number;
  total: number;
  durationMin: number;
  onContinue: () => void;
  inTabs?: boolean;
}) {
  if (!count) return null;
  return (
    <BottomBar inTabs={inTabs}>
      <View style={styles.cartRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cartTop}>
            {count} service{count > 1 ? 's' : ''} · {duration(durationMin)}
          </Text>
          <Text style={styles.cartTotal}>{inr(total)}</Text>
        </View>
        <Button label="Choose time" icon="arrow-right" onPress={onContinue} variant="primary" />
      </View>
    </BottomBar>
  );
}

const styles = StyleSheet.create({
  serviceRow: { backgroundColor: C.paper, borderRadius: R.md, borderWidth: 1.5, borderColor: C.line, marginHorizontal: S.lg, marginBottom: S.md, overflow: 'hidden' },
  serviceRowOn: { borderColor: C.gold, backgroundColor: '#FFFBF3' },
  serviceTop: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.md },
  thumb: { width: 64, height: 64, borderRadius: R.sm, backgroundColor: C.sand },
  serviceName: { fontSize: 15, fontWeight: '700', color: C.ink },
  serviceBlurb: { fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 17 },
  serviceMeta: { fontSize: 13, color: C.muted, marginTop: S.xs },
  servicePrice: { fontWeight: '800', color: C.ink },
  tierNote: { fontSize: 11, color: C.gold, fontWeight: '700', marginTop: 3 },
  check: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: C.gold, borderColor: C.gold },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, paddingHorizontal: S.md, paddingBottom: S.md },
  option: { flexGrow: 1, minWidth: '30%', paddingVertical: S.sm, paddingHorizontal: S.md, borderRadius: R.sm, borderWidth: 1.5, borderColor: C.line, backgroundColor: C.ivory },
  optionOn: { backgroundColor: C.ink, borderColor: C.ink },
  optionOff: { opacity: 0.45 },
  optionLabel: { fontSize: 12, fontWeight: '700', color: C.ink },
  optionPrice: { fontSize: 13, fontWeight: '800', color: C.ink, marginTop: 2 },
  product: { backgroundColor: C.paper, borderRadius: R.md, borderWidth: 1, borderColor: C.line, padding: S.sm, ...shadow },
  productArt: { height: 150, borderRadius: R.sm, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  productImg: { width: '88%', height: '92%' },
  productBrand: { fontSize: 10, letterSpacing: 1.2, fontWeight: '800', color: C.gold, marginTop: S.sm, marginHorizontal: S.xs },
  productName: { fontSize: 13, fontWeight: '700', color: C.ink, marginTop: 2, marginHorizontal: S.xs, minHeight: 34, lineHeight: 17 },
  productSize: { fontSize: 11, color: C.muted, marginHorizontal: S.xs, marginTop: 1 },
  productFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: S.xs, marginHorizontal: S.xs },
  productPrice: { fontSize: 15, fontWeight: '800', color: C.ink },
  addBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  addQty: { color: C.gold, fontWeight: '800' },
  cartRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  cartTop: { fontSize: 13, color: C.muted },
  cartTotal: { fontFamily: F.serifBold, fontSize: 22, color: C.ink },
});
