import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { DemoBadge, PrimaryButton, Screen } from '../components/ui';
import { generationMessages } from '../data/demoAssets';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../store/AppContext';
import { colors, fonts, spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Generating'>;

export function GeneratingScreen({ navigation }: Props) {
  const { runDemoGeneration, cancelGeneration } = useApp();
  const [msgIndex, setMsgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const pulse = useRef(new Animated.Value(0.4)).current;
  const cancelledRef = useRef(false);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.35, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % generationMessages.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const result = await runDemoGeneration();
      if (!alive || cancelledRef.current) return;
      if (result.ok) {
        navigation.replace('YourLooks');
      } else {
        setError(result.reason);
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigation, runDemoGeneration]);

  return (
    <Screen>
      <View style={styles.center}>
        <DemoBadge />
        <Animated.View style={[styles.orb, { opacity: pulse }]} />
        <Text style={styles.message}>{generationMessages[msgIndex]}</Text>
        <Text style={styles.note}>
          Demo Mode — sample fashion images will appear. They are not AI results from your photo.
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton
          label={error ? 'Go Back' : 'Cancel'}
          variant="ghost"
          onPress={() => {
            cancelledRef.current = true;
            cancelGeneration();
            navigation.goBack();
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lime,
    marginVertical: spacing.lg,
  },
  message: {
    fontFamily: fonts.displayItalic,
    fontSize: 28,
    color: colors.ivory,
    textAlign: 'center',
  },
  note: {
    fontFamily: fonts.body,
    color: colors.softGrey,
    textAlign: 'center',
    lineHeight: 22,
  },
  error: {
    fontFamily: fonts.body,
    color: colors.danger,
    textAlign: 'center',
  },
});
