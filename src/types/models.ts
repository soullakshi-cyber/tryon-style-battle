export type GarmentCategory = 'dress' | 'top' | 'jacket' | 'saree' | 'jewellery' | 'handbag';

export type LookSide = 'A' | 'B';

export interface SavedLook {
  id: string;
  side: LookSide;
  imageUri: string;
  garmentUri?: string;
  garmentCategory: GarmentCategory;
  createdAt: string;
  isDemo: boolean;
  label: string;
}

export interface DraftSession {
  userPhotoUri?: string;
  lookAUri?: string;
  lookBUri?: string;
  lookACategory: GarmentCategory;
  lookBCategory: GarmentCategory;
  generatedAUri?: string;
  generatedBUri?: string;
  generationIsDemo: boolean;
}

export interface StyleBattle {
  id: string;
  question: string;
  lookAUri: string;
  lookBUri: string;
  createdAt: string;
  expiresAt: string;
  votesA: number;
  votesB: number;
  userVoted?: LookSide;
  revoked: boolean;
  isDemo: boolean;
  consentAccepted: boolean;
}

export interface CreditTxn {
  id: string;
  label: string;
  delta: number;
  createdAt: string;
  isDemo: boolean;
}

export interface WalletState {
  balance: number;
  trialCreditsGranted: boolean;
  history: CreditTxn[];
}

export const CREDIT_COST_PER_LOOK = 1;
export const CREDIT_COST_BATTLE = 2;
export const TRIAL_CREDITS = 2;

export const CREDIT_PACKS = [
  { id: 'pack10', credits: 10, priceLabel: '$3.99', demoOnly: true },
  { id: 'pack30', credits: 30, priceLabel: '$9.99', demoOnly: true },
  { id: 'pack75', credits: 75, priceLabel: '$19.99', demoOnly: true },
] as const;
