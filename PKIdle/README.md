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
