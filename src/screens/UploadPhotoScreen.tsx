import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, DemoBadge, PrimaryButton, Screen, SectionLabel } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadPhoto'>;

export function UploadPhotoScreen({ navigation }: Props) {
  const { draft, setUserPhoto } = useApp();
  const [error, setError] = useState<string | null>(null);

  async function pick(fromCamera: boolean) {
    setError(null);
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      const msg = fromCamera
        ? 'Camera access was denied. You can enable it in Settings or choose from your library.'
        : 'Photo library access was denied. Enable it in Settings to continue.';
      setError(msg);
      if (Platform.OS !== 'web') Alert.alert('Permission needed', msg);
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0.9,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0.9,
        });

    if (!result.canceled && result.assets[0]?.uri) {
      setUserPhoto(result.assets[0].uri);
    }
  }

  return (
    <Screen ivory>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <DemoBadge compact />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Upload your photo</Text>
        <Body muted>Use a clear, front-facing photo with good light. Full body works best for dresses and jackets.</Body>

        <View style={styles.preview}>
          {draft.userPhotoUri ? (
            <Image source={{ uri: draft.userPhotoUri }} style={styles.previewImg} contentFit="cover" />
          ) : (
            <Text style={styles.placeholder}>Your photo preview</Text>
          )}
        </View>

        <SectionLabel>Tips for best results</SectionLabel>
        <Text style={styles.tip}>• Stand straight, arms slightly away from your body</Text>
        <Text style={styles.tip}>• Plain background, even lighting</Text>
        <Text style={styles.tip}>• Avoid heavy filters or cropped faces-only shots</Text>

        <View style={styles.actions}>
          <PrimaryButton label="Choose from Library" onPress={() => pick(false)} />
          <PrimaryButton label="Take a Photo" variant="outline" onPress={() => pick(true)} />
          {draft.userPhotoUri ? (
            <Pressable onPress={() => setUserPhoto(undefined)}>
              <Text style={styles.replace}>Replace selected photo</Text>
            </Pressable>
          ) : null}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Continue to Outfits"
          disabled={!draft.userPhotoUri}
          onPress={() => navigation.navigate('ChooseOutfits')}
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
    alignItems: 'center',
  },
  back: { fontFamily: fonts.bodyMedium, color: colors.charcoal, fontSize: 16 },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.black,
    marginBottom: spacing.xs,
  },
  preview: {
    marginVertical: spacing.md,
    height: 280,
    borderRadius: radii.lg,
    backgroundColor: colors.charcoal,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImg: { width: '100%', height: '100%' },
  placeholder: { fontFamily: fonts.body, color: colors.softGrey },
  tip: { fontFamily: fonts.body, color: colors.charcoal, fontSize: 15, marginBottom: 4 },
  actions: { gap: spacing.sm, marginTop: spacing.md },
  replace: {
    textAlign: 'center',
    fontFamily: fonts.bodyMedium,
    color: colors.charcoal,
    marginTop: spacing.sm,
  },
  error: {
    fontFamily: fonts.body,
    color: colors.danger,
    marginTop: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.ivory,
  },
});
