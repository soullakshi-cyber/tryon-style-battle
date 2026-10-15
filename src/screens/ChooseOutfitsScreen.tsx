import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, CreditPill, DemoBadge, PrimaryButton, Screen, SectionLabel } from '../components/ui';
import { demoGarmentA, demoGarmentB } from '../data/demoAssets';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';
import { CREDIT_COST_BATTLE, GarmentCategory } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseOutfits'>;

const ACTIVE: GarmentCategory[] = ['dress', 'top', 'jacket'];
const LATER: GarmentCategory[] = ['saree', 'jewellery', 'handbag'];

export function ChooseOutfitsScreen({ navigation }: Props) {
  const { draft, setGarment, wallet, canAffordGeneration } = useApp();
  const [message, setMessage] = useState<string | null>(null);

  async function pickSide(side: 'A' | 'B') {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setGarment(side, result.assets[0].uri);
      setMessage(null);
    }
  }

  function useSample(side: 'A' | 'B') {
    setGarment(side, side === 'A' ? demoGarmentA : demoGarmentB, side === 'A' ? 'dress' : 'jacket');
    setMessage('Sample garment loaded for Demo Mode.');
  }

  function onGenerate() {
    if (!draft.lookAUri || !draft.lookBUri) {
      setMessage('Upload both Look A and Look B before generating.');
      return;
    }
    if (!canAffordGeneration) {
      setMessage('Not enough demo credits. Add a demo pack in Credits.');
      return;
    }
    navigation.navigate('Generating');
  }

  return (
    <Screen ivory>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <CreditPill balance={wallet.balance} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <DemoBadge />
        <Text style={styles.title}>Choose your outfits</Text>
        <Body muted>Upload product shots or screenshots. Focus on dresses, tops and jackets first.</Body>

        <View style={styles.pair}>
          <OutfitCard
            title="LOOK A"
            subtitle="Upload your first outfit"
            uri={draft.lookAUri}
            category={draft.lookACategory}
            onUpload={() => pickSide('A')}
            onSample={() => useSample('A')}
            onCategory={(c) => setGarment('A', draft.lookAUri, c)}
          />
          <OutfitCard
            title="LOOK B"
            subtitle="Upload your second outfit"
            uri={draft.lookBUri}
            category={draft.lookBCategory}
            onUpload={() => pickSide('B')}
            onSample={() => useSample('B')}
            onCategory={(c) => setGarment('B', draft.lookBUri, c)}
          />
        </View>

        <SectionLabel>Coming later</SectionLabel>
        <View style={styles.chips}>
          {LATER.map((c) => (
            <View key={c} style={[styles.chip, styles.chipDisabled]}>
              <Text style={styles.chipDisabledText}>{c}</Text>
            </View>
          ))}
        </View>

        <View style={styles.costBox}>
          <Text style={styles.costTitle}>Credit cost</Text>
          <Text style={styles.costBody}>
            {CREDIT_COST_BATTLE} demo credits for two successful generations (1 per look).
          </Text>
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Generate My Looks" onPress={onGenerate} />
      </View>
    </Screen>
  );
}

function OutfitCard({
  title,
  subtitle,
  uri,
  category,
  onUpload,
  onSample,
  onCategory,
}: {
  title: string;
  subtitle: string;
  uri?: string;
  category: GarmentCategory;
  onUpload: () => void;
  onSample: () => void;
  onCategory: (c: GarmentCategory) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{subtitle}</Text>
      <Pressable style={styles.cardPreview} onPress={onUpload}>
        {uri ? (
          <Image source={{ uri }} style={styles.cardImg} contentFit="cover" />
        ) : (
          <Text style={styles.cardPlaceholder}>Tap to upload</Text>
        )}
      </Pressable>
      <View style={styles.chips}>
        {ACTIVE.map((c) => (
          <Pressable
            key={c}
            onPress={() => onCategory(c)}
            style={[styles.chip, category === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={onSample}>
        <Text style={styles.sampleLink}>Use demo sample</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: { fontFamily: fonts.bodyMedium, color: colors.charcoal, fontSize: 16 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.black,
    marginTop: spacing.sm,
  },
  pair: { gap: spacing.md, marginTop: spacing.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(12,13,15,0.08)',
  },
  cardTitle: {
    fontFamily: fonts.bodyBold,
    letterSpacing: 1.5,
    color: colors.black,
  },
  cardSub: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    marginBottom: spacing.sm,
  },
  cardPreview: {
    height: 180,
    borderRadius: radii.md,
    backgroundColor: colors.charcoal,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImg: { width: '100%', height: '100%' },
  cardPlaceholder: { color: colors.softGrey, fontFamily: fonts.body },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.sm },
  chip: {
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: 'rgba(12,13,15,0.12)',
  },
  chipActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  chipDisabled: { opacity: 0.55 },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.charcoal,
    textTransform: 'capitalize',
  },
  chipTextActive: { color: colors.black },
  chipDisabledText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.softGrey,
    textTransform: 'capitalize',
  },
  sampleLink: {
    marginTop: spacing.sm,
    fontFamily: fonts.bodyMedium,
    color: colors.charcoal,
  },
  costBox: {
    marginTop: spacing.md,
    backgroundColor: colors.black,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  costTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.lime,
    marginBottom: 4,
  },
  costBody: { fontFamily: fonts.body, color: colors.ivory, lineHeight: 22 },
  message: {
    marginTop: spacing.sm,
    fontFamily: fonts.body,
    color: colors.danger,
  },
  footer: { padding: spacing.lg },
});
