import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BrandMark, DemoBadge } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, spacing } from '../theme/tokens';

const rows: { label: string; route?: keyof RootStackParamList; action?: 'delete' | 'signout' }[] = [
  { label: 'My Credits', route: 'Credits' },
  { label: 'My Battles', route: 'MainTabs' },
  { label: 'Privacy Policy', route: 'Privacy' },
  { label: 'Terms and Conditions', route: 'Terms' },
  { label: 'Help and Support', route: 'Help' },
  { label: 'Delete My Data', action: 'delete' },
  { label: 'Sign Out', action: 'signout' },
];

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { wallet, battles, clearLocalData } = useApp();

  function onPress(row: (typeof rows)[number]) {
    if (row.action === 'delete') {
      Alert.alert(
        'Delete local data?',
        'This clears saved looks, battles and demo credits on this device. Account deletion will be available when authentication is connected.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => clearLocalData(),
          },
        ],
      );
      return;
    }
    if (row.action === 'signout') {
      Alert.alert('Sign Out', 'Authentication is not connected in this demo build.');
      return;
    }
    if (row.route) navigation.navigate(row.route as never);
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <BrandMark light />
          <DemoBadge compact />
        </View>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.sub}>Guest · Demo Mode</Text>

        <View style={styles.stats}>
          <Text style={styles.stat}>{wallet.balance} credits</Text>
          <Text style={styles.stat}>{battles.length} battles</Text>
        </View>

        {rows.map((row) => (
          <Pressable key={row.label} style={styles.row} onPress={() => onPress(row)}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.ivory,
    marginTop: spacing.lg,
  },
  sub: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    marginBottom: spacing.lg,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  stat: {
    fontFamily: fonts.bodyMedium,
    color: colors.lime,
  },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.charcoal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.ivory,
  },
  chevron: {
    color: colors.softGrey,
    fontSize: 22,
  },
});
