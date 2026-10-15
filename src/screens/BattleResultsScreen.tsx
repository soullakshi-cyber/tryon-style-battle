import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { DemoBadge, PrimaryButton, Screen } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'BattleResults'>;

export function BattleResultsScreen({ navigation, route }: Props) {
  const { battles, saveLook, resetDraft } = useApp();
  const battle = useMemo(
    () => battles.find((b) => b.id === route.params.battleId),
    [battles, route.params.battleId],
  );
  const pop = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 6 }).start();
  }, [pop]);

  if (!battle) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.title}>Battle not found</Text>
          <PrimaryButton label="Go Home" onPress={() => navigation.navigate('MainTabs')} />
        </View>
      </Screen>
    );
  }

  const total = battle.votesA + battle.votesB;
  const pctA = total === 0 ? 0 : Math.round((battle.votesA / total) * 100);
  const pctB = total === 0 ? 0 : 100 - pctA;
  const tie = battle.votesA === battle.votesB;
  const winner: 'A' | 'B' | null = tie || total === 0 ? null : battle.votesA > battle.votesB ? 'A' : 'B';
  const winnerUri = winner === 'A' ? battle.lookAUri : winner === 'B' ? battle.lookBUri : null;

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.back}>Home</Text>
        </Pressable>
        <DemoBadge compact />
      </View>

      <View style={styles.body}>
        <Text style={styles.kicker}>{tie || total === 0 ? 'IT’S A TIE' : 'WINNER'}</Text>
        <Text style={styles.title}>
          {total === 0 ? 'No votes yet' : tie ? 'Looks are tied' : `Look ${winner} takes it`}
        </Text>

        <Animated.View style={[styles.hero, { transform: [{ scale: pop }] }]}>
          {winnerUri ? (
            <Image source={{ uri: winnerUri }} style={styles.heroImg} contentFit="cover" />
          ) : (
            <View style={styles.tieRow}>
              <Image source={{ uri: battle.lookAUri }} style={styles.tieImg} contentFit="cover" />
              <Image source={{ uri: battle.lookBUri }} style={styles.tieImg} contentFit="cover" />
            </View>
          )}
          {winner ? (
            <View style={styles.winnerBadge}>
              <Text style={styles.winnerBadgeText}>LOOK {winner}</Text>
            </View>
          ) : null}
        </Animated.View>

        <View style={styles.stats}>
          <Stat label="Look A" votes={battle.votesA} pct={pctA} win={winner === 'A'} />
          <Stat label="Look B" votes={battle.votesB} pct={pctB} win={winner === 'B'} />
        </View>

        <View style={styles.actions}>
          {winner && winnerUri ? (
            <PrimaryButton
              label="Save Winning Look"
              onPress={() => saveLook(winner, winnerUri)}
            />
          ) : null}
          <PrimaryButton
            label="Create Another Battle"
            variant="ghost"
            onPress={() => {
              resetDraft();
              navigation.navigate('UploadPhoto');
            }}
          />
          <PrimaryButton
            label="Share Results"
            variant="ghost"
            onPress={() => navigation.navigate('BattleVoting', { battleId: battle.id })}
          />
        </View>
      </View>
    </Screen>
  );
}

function Stat({
  label,
  votes,
  pct,
  win,
}: {
  label: string;
  votes: number;
  pct: number;
  win?: boolean;
}) {
  return (
    <View style={[styles.stat, win && styles.statWin]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statVotes}>
        {votes} votes · {pct}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: { fontFamily: fonts.bodyMedium, color: colors.ivory, fontSize: 16 },
  body: { flex: 1, padding: spacing.lg, gap: spacing.md },
  center: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  kicker: {
    fontFamily: fonts.bodyBold,
    color: colors.lime,
    letterSpacing: 2,
    fontSize: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 38,
    color: colors.ivory,
    lineHeight: 42,
  },
  hero: {
    height: 320,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.charcoal,
  },
  heroImg: { width: '100%', height: '100%' },
  tieRow: { flex: 1, flexDirection: 'row' },
  tieImg: { flex: 1, height: '100%' },
  winnerBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: colors.lime,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  winnerBadgeText: {
    fontFamily: fonts.bodyBold,
    color: colors.black,
    letterSpacing: 1,
  },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: {
    flex: 1,
    backgroundColor: colors.charcoal,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  statWin: { borderWidth: 1, borderColor: colors.lime },
  statLabel: { fontFamily: fonts.bodyBold, color: colors.ivory },
  statVotes: { fontFamily: fonts.body, color: colors.softGrey, marginTop: 4 },
  actions: { gap: spacing.sm, marginTop: 'auto' },
});
