# TRYON — Style Battle

Premium fashion try-on + private Style Battle prototype (Expo / React Native).

**Tagline:** Try it on. Battle your looks. Let your friends decide.

This build is a full interactive **Demo Mode** prototype of the master product guide:

- Welcome → Home → Upload photo → Choose Look A/B → Demo generation → Compare → Create battle → Vote → Results
- Lookbook, credits wallet, profile/settings
- Local persistence (AsyncStorage)
- Clearly labelled demo images and demo credits — **not** live AI, remote voting, or real IAP

## Run

```bash
cd tryon-style-battle
npm install
npm run web      # browser preview
npm start       # Expo Go / simulators
```

## Brand

| Token | Value |
| --- | --- |
| Electric lime | `#C9FF43` |
| Luxury black | `#0C0D0F` |
| Ivory | `#F7F6F2` |
| Charcoal | `#28292D` |

Typography: Bodoni Moda (display) + DM Sans (UI).

## Not in this build

- Real TRYON AI gateway connection
- StoreKit / paid credits
- Public social features, messaging, video try-on
- Production App Store publish
