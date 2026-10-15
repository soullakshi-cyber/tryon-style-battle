import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { Body, BrandMark, PrimaryButton } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, spacing } from '../theme/tokens';
import { demoWelcomeImage } from '../data/demoAssets';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const { completeOnboarding } = useApp();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const native = Platform.OS !== 'web';
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: native }),
      Animated.timing(rise, { toValue: 0, duration: 900, useNativeDriver: native }),
    ]).start();
  }, [fade, rise]);

  return (
    <View style={styles.root}>
      <Image
        source={{ uri: demoWelcomeImage }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(12,13,15,0.25)', 'rgba(12,13,15,0.45)', 'rgba(12,13,15,0.96)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Animated.View
        style={[styles.content, { opacity: fade, transform: [{ translateY: rise }] }]}
        pointerEvents="box-none"
      >
        <BrandMark light />
        <Text style={styles.headline}>Your style. Your rules.</Text>
        <Body muted center style={styles.sub}>
          Try on anything. Compare your looks. Let your friends decide.
        </Body>
        <PrimaryButton
          label="Start Trying On"
          onPress={() => {
            completeOnboarding();
            navigation.replace('MainTabs');
          }}
        />
        <Text style={styles.legal}>
          For adults 18+. Photos stay private until you choose to share. AI try-on connects later —
          this build uses clearly labelled Demo Mode.
        </Text>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Privacy')}
        >
          Privacy summary
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black, justifyContent: 'flex-end' },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 52,
    color: colors.ivory,
    marginTop: spacing.sm,
  },
  sub: { color: colors.softGrey, marginBottom: spacing.sm },
  legal: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.softGrey,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  link: {
    fontFamily: fonts.bodyMedium,
    color: colors.lime,
    textAlign: 'center',
    fontSize: 14,
  },
});
