import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, DemoBadge, PrimaryButton, Screen } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';

type InfoKey = 'HowItWorks' | 'Privacy' | 'Terms' | 'Help';

function InfoShell({
  title,
  children,
  navigation,
}: {
  title: string;
  children: React.ReactNode;
  navigation: { goBack: () => void };
}) {
  return (
    <Screen ivory>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <DemoBadge compact />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{title}</Text>
        {children}
      </ScrollView>
    </Screen>
  );
}

export function HowItWorksScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'HowItWorks'>) {
  const steps = [
    'Upload a clear photo of yourself',
    'Choose two outfits — Look A and Look B',
    'Generate demo try-on looks (real AI later)',
    'Share a private Style Battle for 24 hours',
    'Friends vote. You keep the winner.',
  ];
  return (
    <InfoShell title="How it works" navigation={navigation}>
      {steps.map((s, i) => (
        <View key={s} style={styles.step}>
          <Text style={styles.stepNum}>0{i + 1}</Text>
          <Text style={styles.stepText}>{s}</Text>
        </View>
      ))}
      <PrimaryButton label="Start a Battle" onPress={() => navigation.navigate('UploadPhoto')} />
    </InfoShell>
  );
}

export function PrivacyScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Privacy'>) {
  return (
    <InfoShell title="Privacy" navigation={navigation}>
      <Body>
        TRYON is for adults 18+. Your photos stay on-device in this demo. Future AI generation will
        require explicit consent before upload. Style Battles are private by default — sharing is
        opt-in. Anyone with a forwarded link can view shared images. No beauty ratings, public feeds
        or open comments.
      </Body>
    </InfoShell>
  );
}

export function TermsScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Terms'>) {
  return (
    <InfoShell title="Terms" navigation={navigation}>
      <Body>
        This is a non-production prototype. Demo credits are not purchasable currency. Do not rely
        on sample images as personal AI outputs. Production terms will accompany App Store release
        after human approval.
      </Body>
    </InfoShell>
  );
}

export function HelpScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Help'>) {
  return (
    <InfoShell title="Help & Support" navigation={navigation}>
      <Body>
        Need help with TRYON Style Battle? Contact the product owner for staging access, API
        gateway questions or privacy requests. For demo issues: confirm photo permissions, credit
        balance and that both outfits are uploaded before Generate.
      </Body>
    </InfoShell>
  );
}

export function LookDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'LookDetail'>) {
  const { looks, deleteLook } = useApp();
  const look = looks.find((l) => l.id === route.params.lookId);

  if (!look) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.lightTitle}>Look not found</Text>
          <PrimaryButton label="Back" onPress={() => navigation.goBack()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.headerDark}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLight}>Back</Text>
        </Pressable>
        <DemoBadge compact />
      </View>
      <Image source={{ uri: look.imageUri }} style={styles.detailImg} contentFit="cover" />
      <View style={styles.detailBody}>
        <Text style={styles.lightTitle}>{look.label}</Text>
        <Text style={styles.meta}>
          {look.garmentCategory} · saved {new Date(look.createdAt).toLocaleDateString()}
        </Text>
        <PrimaryButton
          label="Delete Look"
          variant="ghost"
          onPress={() => {
            deleteLook(look.id);
            navigation.goBack();
          }}
        />
        <PrimaryButton
          label="Create Style Battle"
          onPress={() => navigation.navigate('UploadPhoto')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerDark: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: { fontFamily: fonts.bodyMedium, color: colors.charcoal, fontSize: 16 },
  backLight: { fontFamily: fonts.bodyMedium, color: colors.ivory, fontSize: 16 },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: { fontFamily: fonts.display, fontSize: 40, color: colors.black },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepNum: { fontFamily: fonts.display, fontSize: 24, color: colors.lime },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.charcoal,
    lineHeight: 24,
  },
  center: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  detailImg: {
    marginHorizontal: spacing.lg,
    height: 420,
    borderRadius: radii.lg,
    backgroundColor: colors.charcoal,
  },
  detailBody: { padding: spacing.lg, gap: spacing.md },
  lightTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.ivory,
  },
  meta: { fontFamily: fonts.body, color: colors.softGrey },
});
