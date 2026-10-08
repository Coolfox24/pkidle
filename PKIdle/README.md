# PKIdle

PKIdle is a self-contained React + TypeScript PKI clicker module.

## Add to a React project

Copy this folder into the project and import the component:

```tsx
import { PKIdle } from "./PKIdle";

export function PKIPage() {
  return <PKIdle />;
}
```

The host project must provide React 18 or newer and `lucide-react`. The module imports its own scoped stylesheet, game logic, and pixel-art assets. Its CSS selectors and animation names are prefixed for embedding alongside other app styles.

The root export is also the default export. Game progress is saved in the browser under the `jellyfish-pki-save` local-storage key.

## Economy and progression

The original infrastructure and upgrades now have additional ownership milestones, building synergies, fleet support from Clickers and Operators, and manual-click upgrades that scale with passive production. Four fictional buildings extend the late game. Optional operator research starts a three-stage Operatocalypse with rogue issuance queues, audit payouts, truces and a reversible safety charter.

See [BALANCE_DESIGN.md](./BALANCE_DESIGN.md) for formulas, initial tuning values and suggestions for the next iteration. Existing saves migrate automatically; original operator upgrades alone do not start the rebellion. From the host repository, run `npm test` to verify the economy and save compatibility, and `npm run build` to type-check and bundle the game.
