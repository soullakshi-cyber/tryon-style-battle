import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Body, DemoBadge, PrimaryButton, Screen } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateBattle'>;

export function CreateBattleScreen({ navigation }: Props) {
  const { draft, createBattle } = useApp();
  const [question, setQuestion] = useState('Which outfit should I wear?');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onShare() {
    if (!consent) {
      setError('Confirm consent before sharing a battle.');
      return;
    }
    const battle = createBattle(question, consent);
    if (!battle) {
      setError('Could not create battle. Generate looks first.');
      return;
    }
    navigation.replace('BattleVoting', { battleId: battle.id });
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
        <Text style={styles.title}>Let the battle begin.</Text>
        <Body muted>
          Private by default. Friends can open a link and vote without downloading TRYON.
          This prototype demonstrates the flow locally — remote voting is not live.
        </Body>

        <View style={styles.pair}>
          <Image source={{ uri: draft.generatedAUri }} style={styles.thumb} contentFit="cover" />
          <View style={styles.vs}>
            <Text style={styles.vsText}>VS</Text>
          </View>
          <Image source={{ uri: draft.generatedBUri }} style={styles.thumb} contentFit="cover" />
        </View>

        <Text style={styles.label}>Your question</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
          placeholder="Which outfit should I wear?"
          placeholderTextColor={colors.softGrey}
        />

        <View style={styles.metaBox}>
          <Text style={styles.metaTitle}>Voting duration</Text>
          <Text style={styles.metaBody}>24 hours from share time</Text>
        </View>

        <View style={styles.consent}>
          <Switch
            value={consent}
            onValueChange={setConsent}
            trackColor={{ true: colors.lime, false: colors.softGrey }}
            thumbColor={colors.white}
          />
          <Text style={styles.consentText}>
            I consent to sharing these generated looks for private voting. Anyone with the link can
            view the images. Links are unlisted, not invitation-gated.
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label="Share My Battle" onPress={onShare} />
        <Text style={styles.demoNote}>
          Demo: sharing opens an in-app voting preview instead of WhatsApp / iMessage.
        </Text>
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
    alignItems: 'center',
  },
  back: { fontFamily: fonts.bodyMedium, color: colors.charcoal, fontSize: 16 },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.black,
    lineHeight: 44,
  },
  pair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  thumb: {
    flex: 1,
    height: 200,
    borderRadius: radii.md,
    backgroundColor: colors.charcoal,
  },
  vs: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: { color: colors.lime, fontFamily: fonts.bodyBold },
  label: {
    fontFamily: fonts.bodyMedium,
    color: colors.charcoal,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(12,13,15,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.black,
  },
  metaBox: {
    backgroundColor: colors.black,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  metaTitle: { fontFamily: fonts.bodyBold, color: colors.lime },
  metaBody: { fontFamily: fonts.body, color: colors.ivory, marginTop: 4 },
  consent: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  consentText: {
    flex: 1,
    fontFamily: fonts.body,
    color: colors.charcoal,
    lineHeight: 21,
  },
  error: { fontFamily: fonts.body, color: colors.danger },
  demoNote: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    textAlign: 'center',
    lineHeight: 20,
  },
});
