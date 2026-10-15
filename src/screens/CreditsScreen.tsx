import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DemoBadge, PrimaryButton, Screen } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';
import { CREDIT_PACKS } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'Credits'>;

export function CreditsScreen({ navigation }: Props) {
  const { wallet, purchaseDemoPack } = useApp();
  const [note, setNote] = useState<string | null>(null);

  function buy(packId: string, label: string) {
    Alert.alert(
      'Demo purchase only',
      `${label} adds demo credits locally. No real money is charged. StoreKit is not connected.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Demo Credits',
          onPress: () => {
            const result = purchaseDemoPack(packId);
            setNote(
              result.ok
                ? 'Demo credits added to your local wallet.'
                : result.reason ?? 'Could not add credits.',
            );
          },
        },
      ],
    );
  }

  return (
    <Screen ivory>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <DemoBadge compact />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Credits</Text>
        <View style={styles.wallet}>
          <Text style={styles.balanceLabel}>Available credits</Text>
          <Text style={styles.balance}>{wallet.balance}</Text>
          <Text style={styles.trial}>
            {wallet.trialCreditsGranted ? 'Free trial credits included · Demo wallet' : 'Demo wallet'}
          </Text>
        </View>

        <Text style={styles.section}>Purchase options (demo)</Text>
        {CREDIT_PACKS.map((pack) => (
          <Pressable
            key={pack.id}
            style={styles.pack}
            onPress={() => buy(pack.id, `${pack.credits} credits — ${pack.priceLabel}`)}
          >
            <View>
              <Text style={styles.packTitle}>{pack.credits} credits</Text>
              <Text style={styles.packSub}>{pack.priceLabel} · demo only</Text>
            </View>
            <Text style={styles.packCta}>Add</Text>
          </Pressable>
        ))}

        <Text style={styles.section}>Usage history</Text>
        {wallet.history.map((txn) => (
          <View key={txn.id} style={styles.txn}>
            <View style={{ flex: 1 }}>
              <Text style={styles.txnLabel}>{txn.label}</Text>
              <Text style={styles.txnDate}>
                {new Date(txn.createdAt).toLocaleString()} · {txn.isDemo ? 'Demo' : 'Live'}
              </Text>
            </View>
            <Text style={[styles.txnDelta, txn.delta < 0 && { color: colors.danger }]}>
              {txn.delta > 0 ? `+${txn.delta}` : txn.delta}
            </Text>
          </View>
        ))}

        {note ? <Text style={styles.note}>{note}</Text> : null}
        <PrimaryButton label="Done" onPress={() => navigation.goBack()} />
      </ScrollView>
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
  back: { fontFamily: fonts.bodyMedium, color: colors.charcoal, fontSize: 16 },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: { fontFamily: fonts.display, fontSize: 40, color: colors.black },
  wallet: {
    backgroundColor: colors.black,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  balanceLabel: { fontFamily: fonts.body, color: colors.softGrey },
  balance: {
    fontFamily: fonts.display,
    fontSize: 56,
    color: colors.lime,
    marginVertical: 4,
  },
  trial: { fontFamily: fonts.body, color: colors.ivory },
  section: {
    fontFamily: fonts.bodyBold,
    color: colors.charcoal,
    marginTop: spacing.sm,
    letterSpacing: 0.5,
  },
  pack: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(12,13,15,0.08)',
  },
  packTitle: { fontFamily: fonts.bodyBold, color: colors.black, fontSize: 18 },
  packSub: { fontFamily: fonts.body, color: colors.softGrey, marginTop: 2 },
  packCta: { fontFamily: fonts.bodyBold, color: colors.black },
  txn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(12,13,15,0.12)',
  },
  txnLabel: { fontFamily: fonts.bodyMedium, color: colors.black },
  txnDate: { fontFamily: fonts.body, color: colors.softGrey, fontSize: 12, marginTop: 2 },
  txnDelta: { fontFamily: fonts.bodyBold, color: colors.black, fontSize: 16 },
  note: { fontFamily: fonts.body, color: colors.charcoal },
});
