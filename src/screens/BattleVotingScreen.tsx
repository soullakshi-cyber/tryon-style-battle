import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, DemoBadge, PrimaryButton, Screen } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'BattleVoting'>;

export function BattleVotingScreen({ navigation, route }: Props) {
  const { battles, voteBattle } = useApp();
  const battle = useMemo(
    () => battles.find((b) => b.id === route.params.battleId),
    [battles, route.params.battleId],
  );

  if (!battle) {
    return (
      <Screen ivory>
        <View style={styles.center}>
          <Text style={styles.title}>Battle not found</Text>
          <PrimaryButton label="Go Home" onPress={() => navigation.navigate('MainTabs')} />
        </View>
      </Screen>
    );
  }

  const expired = new Date(battle.expiresAt).getTime() < Date.now();
  const blocked = battle.revoked || expired;

  return (
    <Screen ivory>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.back}>Close</Text>
        </Pressable>
        <DemoBadge compact />
      </View>

      <View style={styles.body}>
        <Text style={styles.kicker}>STYLE BATTLE · PRIVATE LINK</Text>
        <Text style={styles.title}>{battle.question}</Text>
        <Body muted>
          Demo voting preview. Production would be a mobile web page — no app install required.
        </Body>

        {blocked ? (
          <Text style={styles.block}>
            {battle.revoked ? 'This battle link was revoked.' : 'This battle has expired.'}
          </Text>
        ) : null}

        <View style={styles.pair}>
          <VoteCard
            label="Outfit A"
            uri={battle.lookAUri}
            disabled={blocked || !!battle.userVoted}
            selected={battle.userVoted === 'A'}
            onVote={() => voteBattle(battle.id, 'A')}
          />
          <VoteCard
            label="Outfit B"
            uri={battle.lookBUri}
            disabled={blocked || !!battle.userVoted}
            selected={battle.userVoted === 'B'}
            onVote={() => voteBattle(battle.id, 'B')}
          />
        </View>

        {battle.userVoted ? (
          <PrimaryButton
            label="See Results"
            onPress={() => navigation.navigate('BattleResults', { battleId: battle.id })}
          />
        ) : (
          <Text style={styles.hint}>Pick a look. One vote per device in this demo.</Text>
        )}
      </View>
    </Screen>
  );
}

function VoteCard({
  label,
  uri,
  onVote,
  disabled,
  selected,
}: {
  label: string;
  uri: string;
  onVote: () => void;
  disabled?: boolean;
  selected?: boolean;
}) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <Image source={{ uri }} style={styles.img} contentFit="cover" />
      <Text style={styles.cardLabel}>{label}</Text>
      <PrimaryButton
        label={selected ? 'Voted' : `Vote for ${label}`}
        onPress={onVote}
        disabled={disabled}
      />
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
  back: { fontFamily: fonts.bodyMedium, color: colors.charcoal, fontSize: 16 },
  body: { flex: 1, padding: spacing.lg, gap: spacing.md },
  center: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md },
  kicker: {
    fontFamily: fonts.bodyBold,
    letterSpacing: 1.5,
    fontSize: 11,
    color: colors.softGrey,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    color: colors.black,
    lineHeight: 38,
  },
  pair: { flexDirection: 'row', gap: spacing.sm, flex: 1 },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.sm,
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: { borderColor: colors.lime },
  img: {
    flex: 1,
    minHeight: 220,
    borderRadius: radii.md,
    backgroundColor: colors.charcoal,
  },
  cardLabel: {
    fontFamily: fonts.bodyBold,
    color: colors.black,
    textAlign: 'center',
  },
  hint: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    textAlign: 'center',
  },
  block: {
    fontFamily: fonts.bodyMedium,
    color: colors.danger,
  },
});
