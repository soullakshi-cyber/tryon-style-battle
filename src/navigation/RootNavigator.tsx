import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { LookbookScreen } from '../screens/LookbookScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { UploadPhotoScreen } from '../screens/UploadPhotoScreen';
import { ChooseOutfitsScreen } from '../screens/ChooseOutfitsScreen';
import { GeneratingScreen } from '../screens/GeneratingScreen';
import { YourLooksScreen } from '../screens/YourLooksScreen';
import { CreateBattleScreen } from '../screens/CreateBattleScreen';
import { BattleVotingScreen } from '../screens/BattleVotingScreen';
import { BattleResultsScreen } from '../screens/BattleResultsScreen';
import { CreditsScreen } from '../screens/CreditsScreen';
import {
  HelpScreen,
  HowItWorksScreen,
  LookDetailScreen,
  PrivacyScreen,
  TermsScreen,
} from '../screens/InfoScreens';
import { useApp } from '../store/AppContext';
import { colors, fonts } from '../theme/tokens';
import { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontFamily: focused ? fonts.bodyBold : fonts.body,
        fontSize: 11,
        color: focused ? colors.lime : colors.softGrey,
        marginBottom: 4,
      }}
    >
      {label}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: colors.charcoal,
          height: 64,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.softGrey,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Explore" focused={focused} />,
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="MyLooks"
        component={LookbookScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="My Looks" focused={focused} />,
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.black,
    card: colors.black,
    primary: colors.lime,
    text: colors.ivory,
    border: colors.charcoal,
  },
};

export function RootNavigator() {
  const { ready, hasOnboarded } = useApp();
  if (!ready) return null;

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={hasOnboarded ? 'MainTabs' : 'Welcome'}
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="UploadPhoto" component={UploadPhotoScreen} />
        <Stack.Screen name="ChooseOutfits" component={ChooseOutfitsScreen} />
        <Stack.Screen name="Generating" component={GeneratingScreen} />
        <Stack.Screen name="YourLooks" component={YourLooksScreen} />
        <Stack.Screen name="CreateBattle" component={CreateBattleScreen} />
        <Stack.Screen name="BattleVoting" component={BattleVotingScreen} />
        <Stack.Screen name="BattleResults" component={BattleResultsScreen} />
        <Stack.Screen name="Credits" component={CreditsScreen} />
        <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="LookDetail" component={LookDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
