# PKIdle

A Cookie Clicker-style incremental browser game built with React + TypeScript. The game module is packaged in the self-contained `PKIdle/` folder.

The cookie is a jellyfish. Clicking it issues certificates. Buildings automate PKI operations, upgrades improve the cryptographic infrastructure, and an RSA certificate harvester creates pressure to migrate to post-quantum cryptography.

## Run locally

Requirements:

- Node.js 20+ recommended
- npm

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Current game loop

1. Click the jellyfish to issue certificates.
2. Buy PKI infrastructure for passive certificate production.
3. Purchase cryptographic upgrades.
4. Watch the RSA harvesting timer.
5. Unlock **PQC Migration** to stop the harvesting clock.
6. Continue expanding your post-quantum PKI.

## Architecture

- `PKIdle/PKIdle.tsx` — game state, loop, purchasing and UI
- `PKIdle/game.ts` — game definitions and formulas
- `PKIdle/PixelArt.tsx` — pixel-art assets
- `PKIdle/pkidle.css` — scoped visual design
- `PKIdle/index.ts` — component exports
- `localStorage` — automatic browser save

To embed the module in another React project, copy `PKIdle/` and import `PKIdle` from its `index.ts`. The host project must provide React 18+ and `lucide-react`.

## Good next additions

- Prestige / CA generation system
- Certificate expiry and renewal
- CRL and OCSP mechanics
- HSM key protection
- CA hierarchy / root + intermediate CAs
- SCEP / ACME / CMP-specific mechanics
- random incidents
- achievements
- offline progress
- sound and animations
- actual certificate visualisation
- PQC algorithm selection (ML-KEM / ML-DSA / SLH-DSA)
- a proper "Quantum Turtle" boss event
