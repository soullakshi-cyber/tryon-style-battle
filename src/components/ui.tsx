import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii, spacing } from '../theme/tokens';

export function Screen({
  children,
  style,
  ivory = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  ivory?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
          backgroundColor: ivory ? colors.ivory : colors.black,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Text style={[styles.brand, light && { color: colors.ivory }]}>TRYON</Text>
  );
}

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.demoBadge, compact && styles.demoBadgeCompact]}>
      <Text style={styles.demoBadgeText}>DEMO MODE</Text>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'lime',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'lime' | 'ivory' | 'ghost' | 'outline';
}) {
  const bg =
    variant === 'lime'
      ? colors.lime
      : variant === 'ivory'
        ? colors.ivory
        : 'transparent';
  const fg =
    variant === 'ghost'
      ? colors.ivory
      : variant === 'outline'
        ? colors.black
        : colors.black;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryBtn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.88 : 1 },
        variant === 'ghost' && styles.ghostBtn,
        variant === 'outline' && styles.outlineBtn,
        Platform.OS === 'web' ? styles.webClickable : null,
      ]}
    >
      <Text style={[styles.primaryBtnText, { color: fg }]} pointerEvents="none">
        {label}
      </Text>
    </Pressable>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Body({
  children,
  muted,
  center,
  style,
}: {
  children: React.ReactNode;
  muted?: boolean;
  center?: boolean;
  style?: object;
}) {
  return (
    <Text
      style={[
        styles.body,
        muted && { color: colors.softGrey },
        center && { textAlign: 'center' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function DisplayTitle({
  children,
  ivory = false,
  style,
}: {
  children: React.ReactNode;
  ivory?: boolean;
  style?: object;
}) {
  return (
    <Text
      style={[
        styles.display,
        { color: ivory ? colors.ivory : colors.black },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function FashionImage({
  uri,
  style,
  demoLabel,
}: {
  uri: string;
  style?: object;
  demoLabel?: boolean;
}) {
  return (
    <View style={[styles.imageWrap, style]}>
      <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(12,13,15,0.55)']}
        style={styles.imageGrad}
      />
      {demoLabel ? (
        <View style={styles.imageDemoTag}>
          <Text style={styles.imageDemoTagText}>DEMO SAMPLE</Text>
        </View>
      ) : null}
    </View>
  );
}

export function LoadingBlock({ message }: { message: string }) {
  return (
    <View style={styles.loadingBlock}>
      <ActivityIndicator color={colors.lime} size="large" />
      <Text style={styles.loadingText}>{message}</Text>
      <DemoBadge />
    </View>
  );
}

export function CreditPill({ balance }: { balance: number }) {
  return (
    <View style={styles.creditPill}>
      <Text style={styles.creditPillText}>{balance} credits · demo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 4,
    color: colors.black,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.limeMuted,
    borderColor: colors.lime,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  demoBadgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  demoBadgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.lime,
  },
  primaryBtn: {
    minHeight: 56,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  ghostBtn: {
    borderWidth: 1,
    borderColor: 'rgba(247,246,242,0.35)',
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: 'rgba(12,13,15,0.2)',
  },
  primaryBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  sectionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.softGrey,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.charcoal,
  },
  display: {
    fontFamily: fonts.display,
    fontSize: 42,
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  imageWrap: {
    overflow: 'hidden',
    borderRadius: radii.md,
    backgroundColor: colors.charcoal,
  },
  imageGrad: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  imageDemoTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.black,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageDemoTagText: {
    color: colors.lime,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  loadingBlock: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  loadingText: {
    fontFamily: fonts.displayItalic,
    fontSize: 26,
    color: colors.ivory,
    textAlign: 'center',
  },
  creditPill: {
    backgroundColor: colors.charcoal,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  creditPillText: {
    color: colors.lime,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  webClickable: {
    cursor: 'pointer' as unknown as undefined,
    userSelect: 'none' as unknown as undefined,
  },
});
