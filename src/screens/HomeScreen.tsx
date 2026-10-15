import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Body,
  BrandMark,
  CreditPill,
  DemoBadge,
  PrimaryButton,
  SectionLabel,
} from '../components/ui';
import { demoHeroImage, demoRecentLooks } from '../data/demoAssets';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { wallet, looks, battles, resetDraft } = useApp();
  const recent = looks.slice(0, 6);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.topRow}>
          <BrandMark light />
          <CreditPill balance={wallet.balance} />
        </View>

        <Text style={styles.greeting}>Hey, ready to find your next look?</Text>

        <View style={styles.hero}>
          <Image
            source={{ uri: demoHeroImage }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            pointerEvents="none"
          />
          <LinearGradient
            colors={['rgba(12,13,15,0.15)', 'rgba(12,13,15,0.88)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.heroCopy} pointerEvents="box-none">
            <DemoBadge compact />
            <Text style={styles.heroTitle}>Can&apos;t decide?{'\n'}Battle it.</Text>
            <Body style={styles.heroBody}>
              Two outfits. One private vote. Let your people choose.
            </Body>
            <PrimaryButton
              label="Create a Style Battle"
              onPress={() => {
                resetDraft();
                navigation.navigate('UploadPhoto');
              }}
            />
          </View>
        </View>

        <Pressable
          style={styles.secondaryCard}
          onPress={() => {
            resetDraft();
            navigation.navigate('UploadPhoto');
          }}
        >
          <Text style={styles.secondaryTitle}>Try On One Outfit</Text>
          <Text style={styles.secondarySub}>Start a draft — battle later if you want.</Text>
        </Pressable>

        <View style={styles.section}>
          <SectionLabel>My Recent Looks</SectionLabel>
          {recent.length === 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
              {demoRecentLooks.map((item) => (
                <View key={item.id} style={styles.lookThumb}>
                  <Image source={{ uri: item.uri }} style={styles.lookImg} contentFit="cover" />
                  <Text style={styles.lookCap}>{item.label}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
              {recent.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.lookThumb}
                  onPress={() => navigation.navigate('LookDetail', { lookId: item.id })}
                >
                  <Image source={{ uri: item.imageUri }} style={styles.lookImg} contentFit="cover" />
                  <Text style={styles.lookCap}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.section}>
          <SectionLabel>My Style Battles</SectionLabel>
          {battles.length === 0 ? (
            <Text style={styles.empty}>No battles yet. Create one from your looks.</Text>
          ) : (
            battles.slice(0, 3).map((b) => (
              <Pressable
                key={b.id}
                style={styles.battleRow}
                onPress={() => {
                  const expired = new Date(b.expiresAt) < new Date();
                  navigation.navigate(
                    expired || b.revoked || !!b.userVoted ? 'BattleResults' : 'BattleVoting',
                    { battleId: b.id },
                  );
                }}
              >
                <Text style={styles.battleQ} numberOfLines={1}>
                  {b.question}
                </Text>
                <Text style={styles.battleMeta}>
                  {b.isDemo ? 'Demo · ' : ''}
                  {b.votesA}:{b.votesB} votes
                </Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.linkRow}>
          <Pressable onPress={() => navigation.navigate('Credits')}>
            <Text style={styles.link}>Credit Balance</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('HowItWorks')}>
            <Text style={styles.link}>How It Works</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  scroll: { paddingBottom: spacing.xxl },
  topRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    fontSize: 16,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  hero: {
    marginHorizontal: spacing.lg,
    minHeight: 420,
    borderRadius: radii.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroCopy: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 48,
    color: colors.ivory,
  },
  heroBody: { color: colors.softGrey, marginBottom: spacing.sm },
  secondaryCard: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.charcoal,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  secondaryTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.ivory,
    fontSize: 18,
  },
  secondarySub: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    marginTop: 4,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  hRow: { gap: spacing.sm },
  lookThumb: { width: 140 },
  lookImg: {
    width: 140,
    height: 180,
    borderRadius: radii.md,
    backgroundColor: colors.charcoal,
  },
  lookCap: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.softGrey,
  },
  empty: {
    fontFamily: fonts.body,
    color: colors.softGrey,
  },
  battleRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.charcoal,
  },
  battleQ: {
    fontFamily: fonts.bodyMedium,
    color: colors.ivory,
    fontSize: 16,
  },
  battleMeta: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    marginTop: 4,
  },
  linkRow: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    fontFamily: fonts.bodyMedium,
    color: colors.lime,
    fontSize: 15,
  },
});
