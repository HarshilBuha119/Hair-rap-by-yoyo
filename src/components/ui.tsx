import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C, F, R, S } from '@/constants/brand';
import { LOGO_MARK } from '@/data/images';

export type IconName = ComponentProps<typeof Feather>['name'];

// ---------- Layout ----------
export function Screen({
  children,
  scroll = true,
  bottomSpace = 24,
  topInset = true,
}: {
  children: ReactNode;
  scroll?: boolean;
  bottomSpace?: number;
  topInset?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: topInset ? insets.top + S.sm : 0 };
  if (!scroll) return <View style={[styles.screen, pad]}>{children}</View>;
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[pad, { paddingBottom: bottomSpace }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Title({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.titleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10} accessibilityRole="link">
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ---------- Controls ----------
type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'gold' | 'outline' | 'ghost';
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', icon, disabled, style }: ButtonProps) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.4 },
        style,
      ]}>
      {icon ? <Feather name={icon} size={18} color={v.fg} /> : null}
      <Text style={[styles.buttonLabel, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

const buttonVariants = {
  primary: { bg: C.ink, fg: C.ivory, border: C.ink },
  gold: { bg: C.gold, fg: C.ink, border: C.gold },
  outline: { bg: 'transparent', fg: C.ink, border: C.ink },
  ghost: { bg: 'transparent', fg: C.muted, border: 'transparent' },
} as const;

export function Chip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  /** MaterialCommunityIcons name. */
  icon?: ComponentProps<typeof MaterialCommunityIcons>['name'];
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[styles.chip, active && styles.chipActive, !!icon && styles.chipWithIcon]}>
      {icon ? <MaterialCommunityIcons name={icon} size={18} color={active ? C.gold : C.ink} /> : null}
      <Text style={[styles.chipText, active && { color: C.ivory }]}>{label}</Text>
    </Pressable>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.segmentItem, active && styles.segmentActive]}>
            <Text style={[styles.segmentText, active && { color: C.ink }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  badge,
  tone = 'dark',
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  badge?: number;
  tone?: 'dark' | 'light';
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.iconButton, tone === 'light' && { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'transparent' }]}>
      <Feather name={icon} size={20} color={tone === 'light' ? C.ivory : C.ink} />
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Stepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <View style={styles.stepper}>
      <Pressable onPress={() => onChange(qty - 1)} hitSlop={8} accessibilityLabel="Decrease quantity" style={styles.stepBtn}>
        <Feather name="minus" size={16} color={C.ink} />
      </Pressable>
      <Text style={styles.stepQty}>{qty}</Text>
      <Pressable onPress={() => onChange(qty + 1)} hitSlop={8} accessibilityLabel="Increase quantity" style={styles.stepBtn}>
        <Feather name="plus" size={16} color={C.ink} />
      </Pressable>
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  multiline,
  prefix,
  autoFocus,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  prefix?: string;
  autoFocus?: boolean;
}) {
  return (
    <View style={{ marginBottom: S.lg }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldBox, multiline && { minHeight: 96, alignItems: 'flex-start' }]}>
        {prefix ? <Text style={styles.fieldPrefix}>{prefix}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A39D92"
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          autoFocus={autoFocus}
          accessibilityLabel={label}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[styles.fieldInput, multiline && { paddingTop: S.md }]}
        />
      </View>
    </View>
  );
}

// ---------- Brand bits ----------
/**
 * A box with a photo that always covers it, with content layered on top.
 * Used instead of ImageBackground because the image is sized explicitly, so it fills the box
 * identically on Android, iOS and web.
 */
export function CoverImage({
  source,
  style,
  children,
}: {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <View style={[{ overflow: 'hidden', backgroundColor: C.ink }, style]}>
      <Image source={source} style={styles.coverFill} resizeMode="cover" accessibilityIgnoresInvertColors />
      {children}
    </View>
  );
}

/** The brand's own logo mark in a gold-ringed circle. */
export function Monogram({ size = 44 }: { size?: number }) {
  return (
    <View style={[styles.mono, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image source={LOGO_MARK} style={{ width: size, height: size }} accessibilityIgnoresInvertColors accessibilityLabel="Hair Rap by Yoyo logo" />
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  onAction,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather name={icon} size={26} color={C.gold} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {action && onAction ? <Button label={action} onPress={onAction} style={{ marginTop: S.lg }} /> : null}
    </View>
  );
}

/** Action bar pinned to the bottom of the screen. Inside tabs the tab bar already covers the safe area. */
export function BottomBar({ children, inTabs = false }: { children: ReactNode; inTabs?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomBar, { paddingBottom: inTabs ? S.md : Math.max(insets.bottom, S.md) }]}>{children}</View>
  );
}

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
} as const;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.ivory },
  titleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.lg, paddingVertical: S.md, gap: S.md },
  title: { fontFamily: F.serifBold, fontSize: 30, color: C.ink },
  subtitle: { fontSize: 14, color: C.muted, marginTop: 2 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.lg, marginTop: S.xl, marginBottom: S.md },
  sectionTitle: { fontFamily: F.serif, fontSize: 21, color: C.ink },
  sectionAction: { fontSize: 14, color: C.gold, fontWeight: '600' },
  card: { backgroundColor: C.paper, borderRadius: R.md, borderWidth: 1, borderColor: C.line, padding: S.lg },
  button: { minHeight: 52, borderRadius: R.pill, borderWidth: 1.5, paddingHorizontal: S.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: S.sm },
  buttonLabel: { fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  chip: { paddingHorizontal: S.lg, paddingVertical: 10, borderRadius: R.pill, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  chipActive: { backgroundColor: C.ink, borderColor: C.ink },
  chipWithIcon: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipText: { fontSize: 14, fontWeight: '600', color: C.ink },
  segment: { flexDirection: 'row', backgroundColor: C.sand, borderRadius: R.pill, padding: 4 },
  segmentItem: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: R.pill },
  segmentActive: { backgroundColor: C.paper },
  segmentText: { fontSize: 14, fontWeight: '700', color: C.muted },
  iconButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: C.paper, borderWidth: 1, borderColor: C.line },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { fontSize: 11, fontWeight: '800', color: C.ink },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.sand, borderRadius: R.pill },
  stepBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  stepQty: { minWidth: 22, textAlign: 'center', fontWeight: '700', color: C.ink },
  coverFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: S.xs },
  fieldBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.paper, borderWidth: 1.5, borderColor: C.line, borderRadius: R.md, paddingHorizontal: S.lg },
  fieldPrefix: { fontSize: 16, color: C.muted, marginRight: S.sm, fontWeight: '600' },
  fieldInput: { flex: 1, minHeight: 52, fontSize: 16, color: C.ink },
  mono: { backgroundColor: '#000', borderWidth: 1.5, borderColor: C.gold, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  empty: { alignItems: 'center', paddingHorizontal: S.xxl, paddingVertical: 56 },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', marginBottom: S.lg },
  emptyTitle: { fontFamily: F.serif, fontSize: 20, color: C.ink, textAlign: 'center' },
  emptyBody: { fontSize: 14, color: C.muted, textAlign: 'center', marginTop: S.sm, lineHeight: 20 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.paper, borderTopWidth: 1, borderTopColor: C.line, paddingHorizontal: S.lg, paddingTop: S.md, elevation: 8 },
});
