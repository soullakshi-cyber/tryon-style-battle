import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DemoBadge, PrimaryButton } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, radii, spacing } from '../theme/tokens';

export function LookbookScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { looks, deleteLook, resetDraft } = useApp();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My Looks</Text>
        <DemoBadge compact />
      </View>
      <Text style={styles.sub}>Your private digital wardrobe — saved on this device.</Text>

      {looks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No saved looks yet</Text>
          <Text style={styles.emptyBody}>
            Generate a Style Battle and tap Save Look to build your lookbook.
          </Text>
          <PrimaryButton
            label="Create a Style Battle"
            onPress={() => {
              resetDraft();
              navigation.navigate('UploadPhoto');
            }}
          />
        </View>
      ) : (
        <FlatList
          data={looks}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('LookDetail', { lookId: item.id })}
              onLongPress={() => deleteLook(item.id)}
            >
              <Image source={{ uri: item.imageUri }} style={styles.img} contentFit="cover" />
              <Text style={styles.cap}>{item.label}</Text>
              <Text style={styles.meta}>Long-press to delete</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black, paddingTop: spacing.md },
  header: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.ivory,
  },
  sub: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  row: { gap: spacing.sm },
  card: { flex: 1, marginBottom: spacing.md },
  img: {
    width: '100%',
    height: 210,
    borderRadius: radii.md,
    backgroundColor: colors.charcoal,
  },
  cap: {
    marginTop: 8,
    fontFamily: fonts.bodyMedium,
    color: colors.ivory,
  },
  meta: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    fontSize: 12,
  },
  empty: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.ivory,
  },
  emptyBody: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    lineHeight: 22,
  },
});
