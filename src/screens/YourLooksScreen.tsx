import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Body, DemoBadge, PrimaryButton, Screen } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'YourLooks'>;

export function YourLooksScreen({ navigation }: Props) {
  const { draft, saveLook, resetDraft } = useApp();
  const [zoomUri, setZoomUri] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const a = draft.generatedAUri;
  const b = draft.generatedBUri;

  async function shareLocal(uri?: string) {
    if (!uri) return;
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      setToast('Sharing is not available on this device.');
      return;
    }
    await Sharing.shareAsync(uri);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.back}>Home</Text>
        </Pressable>
        <DemoBadge compact />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.kicker}>LOOK A vs LOOK B</Text>
        <Text style={styles.title}>Your looks</Text>
        <Body muted style={{ color: colors.softGrey }}>
          Demonstration images for preview only — not generated from your photo.
        </Body>

        <View style={styles.pair}>
          <LookPanel
            label="LOOK A"
            uri={a}
            onZoom={() => setZoomUri(a ?? null)}
            onSave={() => {
              saveLook('A');
              setToast('Look A saved to My Looks.');
            }}
          />
          <LookPanel
            label="LOOK B"
            uri={b}
            onZoom={() => setZoomUri(b ?? null)}
            onSave={() => {
              saveLook('B');
              setToast('Look B saved to My Looks.');
            }}
          />
        </View>

        {toast ? <Text style={styles.toast}>{toast}</Text> : null}

        <View style={styles.actions}>
          <PrimaryButton
            label="Create Style Battle"
            onPress={() => navigation.navigate('CreateBattle')}
            disabled={!a || !b}
          />
          <PrimaryButton
            label="Try Another Outfit"
            variant="ghost"
            onPress={() => {
              resetDraft();
              navigation.navigate('UploadPhoto');
            }}
          />
          <PrimaryButton
            label="Share Look A Card"
            variant="ghost"
            onPress={() => shareLocal(a)}
          />
        </View>
      </ScrollView>

      <Modal visible={!!zoomUri} transparent animationType="fade">
        <Pressable style={styles.zoom} onPress={() => setZoomUri(null)}>
          {zoomUri ? (
            <Image source={{ uri: zoomUri }} style={styles.zoomImg} contentFit="contain" />
          ) : null}
          <Text style={styles.zoomHint}>Tap to close · DEMO SAMPLE</Text>
        </Pressable>
      </Modal>
    </Screen>
  );
}

function LookPanel({
  label,
  uri,
  onZoom,
  onSave,
}: {
  label: string;
  uri?: string;
  onZoom: () => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelLabel}>{label}</Text>
      <Pressable onPress={onZoom} style={styles.panelImgWrap}>
        {uri ? (
          <Image source={{ uri }} style={styles.panelImg} contentFit="cover" />
        ) : (
          <Text style={styles.missing}>Missing</Text>
        )}
        <View style={styles.demoTag}>
          <Text style={styles.demoTagText}>DEMO SAMPLE</Text>
        </View>
      </Pressable>
      <Pressable onPress={onSave}>
        <Text style={styles.saveLink}>Save Look</Text>
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
  back: { fontFamily: fonts.bodyMedium, color: colors.ivory, fontSize: 16 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  kicker: {
    fontFamily: fonts.bodyBold,
    color: colors.lime,
    letterSpacing: 2,
    fontSize: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.ivory,
    marginVertical: spacing.sm,
  },
  pair: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  panel: { flex: 1 },
  panelLabel: {
    fontFamily: fonts.bodyBold,
    color: colors.softGrey,
    marginBottom: 8,
    letterSpacing: 1,
  },
  panelImgWrap: {
    height: 280,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.charcoal,
  },
  panelImg: { width: '100%', height: '100%' },
  missing: {
    color: colors.softGrey,
    textAlign: 'center',
    marginTop: 120,
    fontFamily: fonts.body,
  },
  demoTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.black,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  demoTagText: {
    color: colors.lime,
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1,
  },
  saveLink: {
    marginTop: 10,
    fontFamily: fonts.bodyMedium,
    color: colors.lime,
  },
  actions: { marginTop: spacing.xl, gap: spacing.sm },
  toast: {
    marginTop: spacing.md,
    fontFamily: fonts.body,
    color: colors.lime,
  },
  zoom: {
    flex: 1,
    backgroundColor: 'rgba(12,13,15,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  zoomImg: { width: '100%', height: '80%' },
  zoomHint: {
    marginTop: spacing.md,
    color: colors.softGrey,
    fontFamily: fonts.body,
  },
});
