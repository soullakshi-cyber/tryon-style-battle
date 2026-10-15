export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  UploadPhoto: undefined;
  ChooseOutfits: undefined;
  Generating: undefined;
  YourLooks: undefined;
  CreateBattle: undefined;
  BattleVoting: { battleId: string };
  BattleResults: { battleId: string };
  Credits: undefined;
  HowItWorks: undefined;
  Privacy: undefined;
  Terms: undefined;
  Help: undefined;
  LookDetail: { lookId: string };
};

export type MainTabParamList = {
  Explore: undefined;
  MyLooks: undefined;
  Profile: undefined;
};
