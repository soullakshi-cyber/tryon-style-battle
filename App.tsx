import {
  BodoniModa_700Bold,
  BodoniModa_700Bold_Italic,
  useFonts as useBodoni,
} from '@expo-google-fonts/bodoni-moda';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts as useDMSans,
} from '@expo-google-fonts/dm-sans';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AppProvider } from './src/store/AppContext';
import { colors } from './src/theme/tokens';

export default function App() {
  const [bodoniLoaded] = useBodoni({
    BodoniModa_700Bold,
    BodoniModa_700Bold_Italic,
  });
  const [sansLoaded] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!bodoniLoaded || !sansLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.black,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.lime} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
