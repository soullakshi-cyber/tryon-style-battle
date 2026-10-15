import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { demoLookA, demoLookB } from '../data/demoAssets';
import {
  CREDIT_COST_BATTLE,
  CREDIT_PACKS,
  CreditTxn,
  DraftSession,
  GarmentCategory,
  LookSide,
  SavedLook,
  StyleBattle,
  TRIAL_CREDITS,
  WalletState,
} from '../types/models';

const STORAGE_KEY = 'tryon.styleBattle.v1';

type PersistShape = {
  hasOnboarded: boolean;
  looks: SavedLook[];
  battles: StyleBattle[];
  wallet: WalletState;
};

const defaultDraft = (): DraftSession => ({
  lookACategory: 'dress',
  lookBCategory: 'jacket',
  generationIsDemo: true,
});

const defaultWallet = (): WalletState => ({
  balance: TRIAL_CREDITS,
  trialCreditsGranted: true,
  history: [
    {
      id: 'txn-trial',
      label: 'Free trial credits',
      delta: TRIAL_CREDITS,
      createdAt: new Date().toISOString(),
      isDemo: true,
    },
  ],
});

type AppContextValue = {
  ready: boolean;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  draft: DraftSession;
  setUserPhoto: (uri?: string) => void;
  setGarment: (side: LookSide, uri?: string, category?: GarmentCategory) => void;
  resetDraft: () => void;
  looks: SavedLook[];
  battles: StyleBattle[];
  wallet: WalletState;
  runDemoGeneration: () => Promise<{ ok: true } | { ok: false; reason: string }>;
  cancelGeneration: () => void;
  saveLook: (side: LookSide, imageUri?: string) => void;
  deleteLook: (id: string) => void;
  createBattle: (question: string, consentAccepted: boolean) => StyleBattle | null;
  voteBattle: (battleId: string, side: LookSide) => void;
  revokeBattle: (battleId: string) => void;
  purchaseDemoPack: (packId: string) => { ok: boolean; reason?: string };
  clearLocalData: () => Promise<void>;
  canAffordGeneration: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [draft, setDraft] = useState<DraftSession>(defaultDraft);
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [battles, setBattles] = useState<StyleBattle[]>([]);
  const [wallet, setWallet] = useState<WalletState>(defaultWallet);
  const cancelRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PersistShape;
          setHasOnboarded(!!parsed.hasOnboarded);
          setLooks(parsed.looks ?? []);
          setBattles(parsed.battles ?? []);
          setWallet(parsed.wallet ?? defaultWallet());
        }
      } catch {
        // Fresh install / corrupt cache — start clean.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: PersistShape = { hasOnboarded, looks, battles, wallet };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
  }, [ready, hasOnboarded, looks, battles, wallet]);

  const completeOnboarding = useCallback(() => setHasOnboarded(true), []);

  const setUserPhoto = useCallback((uri?: string) => {
    setDraft((d) => ({ ...d, userPhotoUri: uri }));
  }, []);

  const setGarment = useCallback(
    (side: LookSide, uri?: string, category?: GarmentCategory) => {
      setDraft((d) =>
        side === 'A'
          ? {
              ...d,
              lookAUri: uri,
              lookACategory: category ?? d.lookACategory,
              generatedAUri: undefined,
            }
          : {
              ...d,
              lookBUri: uri,
              lookBCategory: category ?? d.lookBCategory,
              generatedBUri: undefined,
            },
      );
    },
    [],
  );

  const resetDraft = useCallback(() => setDraft(defaultDraft()), []);

  const canAffordGeneration = wallet.balance >= CREDIT_COST_BATTLE;

  const runDemoGeneration = useCallback(async () => {
    cancelRef.current = false;
    if (!draft.userPhotoUri) {
      return { ok: false as const, reason: 'Add your photo first.' };
    }
    if (!draft.lookAUri || !draft.lookBUri) {
      return { ok: false as const, reason: 'Upload both Look A and Look B.' };
    }
    if (wallet.balance < CREDIT_COST_BATTLE) {
      return { ok: false as const, reason: 'Not enough demo credits.' };
    }

    // Simulate two generation jobs. Credits settle only on success.
    await new Promise((r) => setTimeout(r, 3200));
    if (cancelRef.current) {
      return { ok: false as const, reason: 'Generation cancelled.' };
    }

    setDraft((d) => ({
      ...d,
      generatedAUri: demoLookA,
      generatedBUri: demoLookB,
      generationIsDemo: true,
    }));

    const txn: CreditTxn = {
      id: uid('txn'),
      label: 'Demo generation — Look A + Look B',
      delta: -CREDIT_COST_BATTLE,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    setWallet((w) => ({
      ...w,
      balance: Math.max(0, w.balance - CREDIT_COST_BATTLE),
      history: [txn, ...w.history],
    }));

    return { ok: true as const };
  }, [draft, wallet.balance]);

  const cancelGeneration = useCallback(() => {
    cancelRef.current = true;
  }, []);

  const saveLook = useCallback(
    (side: LookSide, imageUri?: string) => {
      const uri = imageUri ?? (side === 'A' ? draft.generatedAUri : draft.generatedBUri);
      const garmentUri = side === 'A' ? draft.lookAUri : draft.lookBUri;
      const category = side === 'A' ? draft.lookACategory : draft.lookBCategory;
      if (!uri) return;
      const look: SavedLook = {
        id: uid('look'),
        side,
        imageUri: uri,
        garmentUri,
        garmentCategory: category,
        createdAt: new Date().toISOString(),
        isDemo: true,
        label: `Look ${side} — Demo`,
      };
      setLooks((prev) => [look, ...prev]);
    },
    [draft],
  );

  const deleteLook = useCallback((id: string) => {
    setLooks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const createBattle = useCallback(
    (question: string, consentAccepted: boolean) => {
      if (!consentAccepted || !draft.generatedAUri || !draft.generatedBUri) return null;
      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      const battle: StyleBattle = {
        id: uid('battle'),
        question: question.trim() || 'Which outfit should I wear?',
        lookAUri: draft.generatedAUri,
        lookBUri: draft.generatedBUri,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        votesA: 0,
        votesB: 0,
        revoked: false,
        isDemo: true,
        consentAccepted: true,
      };
      setBattles((prev) => [battle, ...prev]);
      return battle;
    },
    [draft.generatedAUri, draft.generatedBUri],
  );

  const voteBattle = useCallback((battleId: string, side: LookSide) => {
    setBattles((prev) =>
      prev.map((b) => {
        if (b.id !== battleId) return b;
        if (b.revoked || b.userVoted) return b;
        if (new Date(b.expiresAt).getTime() < Date.now()) return b;
        return {
          ...b,
          userVoted: side,
          votesA: b.votesA + (side === 'A' ? 1 : 0),
          votesB: b.votesB + (side === 'B' ? 1 : 0),
        };
      }),
    );
  }, []);

  const revokeBattle = useCallback((battleId: string) => {
    setBattles((prev) =>
      prev.map((b) => (b.id === battleId ? { ...b, revoked: true } : b)),
    );
  }, []);

  const purchaseDemoPack = useCallback((packId: string) => {
    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack) return { ok: false, reason: 'Unknown pack.' };
    const txn: CreditTxn = {
      id: uid('txn'),
      label: `Demo credit pack — ${pack.credits} credits`,
      delta: pack.credits,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    setWallet((w) => ({
      ...w,
      balance: w.balance + pack.credits,
      history: [txn, ...w.history],
    }));
    return { ok: true };
  }, []);

  const clearLocalData = useCallback(async () => {
    setLooks([]);
    setBattles([]);
    setWallet(defaultWallet());
    setDraft(defaultDraft());
    setHasOnboarded(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      hasOnboarded,
      completeOnboarding,
      draft,
      setUserPhoto,
      setGarment,
      resetDraft,
      looks,
      battles,
      wallet,
      runDemoGeneration,
      cancelGeneration,
      saveLook,
      deleteLook,
      createBattle,
      voteBattle,
      revokeBattle,
      purchaseDemoPack,
      clearLocalData,
      canAffordGeneration,
    }),
    [
      ready,
      hasOnboarded,
      completeOnboarding,
      draft,
      setUserPhoto,
      setGarment,
      resetDraft,
      looks,
      battles,
      wallet,
      runDemoGeneration,
      cancelGeneration,
      saveLook,
      deleteLook,
      createBattle,
      voteBattle,
      revokeBattle,
      purchaseDemoPack,
      clearLocalData,
      canAffordGeneration,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
