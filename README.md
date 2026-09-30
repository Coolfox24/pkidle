# 🪼 Jellyfish PKI

A Cookie Clicker-style incremental browser game built with React + TypeScript.

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

- `src/game.ts` — game definitions and formulas
- `src/App.tsx` — game state, loop, purchasing and UI
- `src/styles.css` — visual design
- `localStorage` — automatic browser save

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
