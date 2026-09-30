export type BuildingId =
  | "operator"
  | "scep"
  | "acme"
  | "cmp"
  | "certManager"
  | "hsm"
  | "offlineRoot"
  | "pqcLab";

export type UpgradeId =
  | "rsa2048"
  | "longerKeys"
  | "csrAutomation"
  | "scepEnrollment"
  | "dns01"
  | "http01"
  | "certManagerUpgrade"
  | "keyRotation"
  | "hybridPqc"
  | "pqcMigration";

export type Building = {
  id: BuildingId;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
  icon: string;
};

export type Upgrade = {
  id: UpgradeId;
  name: string;
  description: string;
  cost: number;
  multiplier?: number;
  clickBonus?: number;
  productionBonus?: number;
};

export const BUILDINGS: Building[] = [
  {
    id: "operator",
    name: "PKI Operator",
    description: "A human operator who manually processes certificate requests.",
    baseCost: 15,
    baseProduction: 0.4,
    icon: "🧑‍💻",
  },
  {
    id: "scep",
    name: "SCEP Server",
    description: "Automates certificate enrolment for devices.",
    baseCost: 100,
    baseProduction: 2.5,
    icon: "📡",
  },
  {
    id: "acme",
    name: "ACME Server",
    description: "Turns certificate issuance into an automated workflow.",
    baseCost: 650,
    baseProduction: 12,
    icon: "⚙️",
  },
  {
    id: "cmp",
    name: "CMP Server",
    description: "Enterprise-grade certificate management at scale.",
    baseCost: 4_000,
    baseProduction: 70,
    icon: "🏢",
  },
  {
    id: "certManager",
    name: "cert-manager",
    description: "Kubernetes discovers it needs certificates. Constantly.",
    baseCost: 25_000,
    baseProduction: 400,
    icon: "☸️",
  },
  {
    id: "hsm",
    name: "HSM Cluster",
    description: "Protects the CA private keys behind expensive hardware.",
    baseCost: 150_000,
    baseProduction: 2_200,
    icon: "🔐",
  },
  {
    id: "offlineRoot",
    name: "Offline Root CA",
    description: "Offline security, online inconvenience.",
    baseCost: 1_000_000,
    baseProduction: 12_000,
    icon: "🏛️",
  },
  {
    id: "pqcLab",
    name: "PQC Research Lab",
    description: "Builds a cryptographically agile future before the quantum tide arrives.",
    baseCost: 7_500_000,
    baseProduction: 75_000,
    icon: "🧬",
  },
];

export const UPGRADES: Upgrade[] = [
  {
    id: "rsa2048",
    name: "RSA-2048",
    description: "Replace toy crypto with a respectable RSA CA.",
    cost: 50,
    clickBonus: 1,
  },
  {
    id: "longerKeys",
    name: "Longer Keys",
    description: "Because surely making the key longer solves everything.",
    cost: 500,
    productionBonus: 0.15,
  },
  {
    id: "csrAutomation",
    name: "CSR Automation",
    description: "Stop typing certificate signing requests by hand.",
    cost: 2_500,
    multiplier: 1.25,
  },
  {
    id: "scepEnrollment",
    name: "Automated Enrolment",
    description: "Let devices request certificates without human intervention.",
    cost: 12_000,
    multiplier: 1.35,
  },
  {
    id: "dns01",
    name: "DNS-01 Challenge",
    description: "ACME proves control using DNS.",
    cost: 45_000,
    multiplier: 1.5,
  },
  {
    id: "http01",
    name: "HTTP-01 Challenge",
    description: "Because sometimes putting a file on a web server is enough.",
    cost: 100_000,
    multiplier: 1.4,
  },
  {
    id: "certManagerUpgrade",
    name: "Cluster Issuer",
    description: "One issuer to provision certificates across the cluster.",
    cost: 400_000,
    multiplier: 1.75,
  },
  {
    id: "keyRotation",
    name: "Automated Key Rotation",
    description: "Rotate keys before the harvester gets comfortable.",
    cost: 1_500_000,
    multiplier: 2,
  },
  {
    id: "hybridPqc",
    name: "Hybrid PQC",
    description: "Start issuing with classical + post-quantum protection.",
    cost: 8_000_000,
    multiplier: 2.5,
  },
  {
    id: "pqcMigration",
    name: "PQC Migration",
    description: "Migrate the CA hierarchy away from RSA.",
    cost: 50_000_000,
    multiplier: 5,
  },
];

export const HARVEST_WINDOW = 20 * 60;

export function buildingCost(building: Building, count: number): number {
  return Math.floor(building.baseCost * Math.pow(1.15, count));
}

export function formatNumber(value: number): string {
  if (value < 1000) return Math.floor(value).toString();
  const units = ["K", "M", "B", "T", "Qa", "Qi"];
  let n = value;
  let i = -1;
  while (n >= 1000 && i < units.length - 1) {
    n /= 1000;
    i++;
  }
  return `${n.toFixed(n >= 100 ? 0 : n >= 10 ? 1 : 2)}${units[i]}`;
}