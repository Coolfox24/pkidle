export type BuildingId =
  | "clicker"
  | "operator"
  | "onlineCa"
  | "restApi"
  | "scep"
  | "cmpv2"
  | "autoEnrollment"
  | "est"
  | "acme"
  | "cmpv3"
  | "k8sCertManager"
  | "aiCertGen"
  | "sentientCa"
  | "orbitalTrust"
  | "multiverseNotary";

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
  | "pqcMigration"
  | "operatorPayrise"
  | "operatorOvertime"
  | "operatorForcedWork"
  | "clickerFasterFinger"
  | "clickerTwoFinger"
  | "clickerMechanical"
  | "onlineCaBetterHsm"
  | "onlineCaFasterCrypto"
  | "onlineCaBiggerHsm"
  | "restApiMoreEndpoints"
  | "restApiConnectionPooling"
  | "restApiHorizontalScaling"
  | "scepFarm"
  | "scepEverywhere"
  | "cmpv2Batching"
  | "cmpv2ParallelRequests"
  | "cmpv2Accelerator"
  | "autoEnrollmentGpo"
  | "autoEnrollmentAutoRenewal"
  | "autoEnrollmentEverywhere"
  | "estHttps"
  | "estCluster"
  | "estPlusPlus"
  | "acmeWildcardEverything"
  | "cmpv3MoreAsn1"
  | "cmpv3MoreAsn1Again"
  | "cmpv3MoreAsn1AgainAgain"
  | "k8sIngressCertificates"
  | "k8sHasOwnCrds"
  | "rsa1024Ceremony"
  | "rsa2048Ceremony"
  | "rsa3072Ceremony"
  | "rsa4096Ceremony"
  | "pqcCeremony"
  | "clickerInfrastructure"
  | "clickerFleetReview"
  | "operatorPeerReview"
  | "clickCps1"
  | "clickCps2"
  | "clickCps3"
  | "operatorAlgorithmicManagement"
  | "operatorSleepDeprecated"
  | "operatorRootForEveryone"
  | `${BuildingId}Milestone${50 | 100 | 150 | 200}`
  | `${BuildingId}Future${1 | 2 | 3}`
  | `${BuildingId}Synergy`;

export type Building = {
  id: BuildingId;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
  icon: string;
  fictional?: boolean;
};

export type Upgrade = {
  id: UpgradeId;
  category: "general" | BuildingId;
  name: string;
  description: string;
  cost: number;
  tier?: 1 | 2 | 3;
  multiplier?: number;
  buildingMultiplier?: number;
  clickBonus?: number;
  productionBonus?: number;
  legacy?: boolean;
  ceremonyToLevel?: number;
  requiredBuildings?: Partial<Record<BuildingId, number>>;
  requiredUpgrades?: UpgradeId[];
  requiredClicks?: number;
  clickProductionShare?: number;
  clickerPerBuilding?: number;
  fleetBoostPerBuilding?: number;
  synergy?: { partner: BuildingId; perPartner: number; partnerPerBuilding: number };
  rebellionStage?: 1 | 2 | 3;
};

export type CAStage = {
  name: string;
  securityNote: string;
  deadlineSeconds: number | null;
  nextCeremony: UpgradeId | null;
  ceremonyMinimum: number | null;
};

export const CA_STAGES: CAStage[] = [
  { name: "RSA-512", securityNote: "Legacy game tier, far below today's 112-bit security-strength baseline.", deadlineSeconds: 3 * 60, nextCeremony: "rsa1024Ceremony", ceremonyMinimum: 100 },
  { name: "RSA-1024", securityNote: "Legacy tier; below NIST's 112-bit minimum for new RSA signature generation.", deadlineSeconds: 6 * 60, nextCeremony: "rsa2048Ceremony", ceremonyMinimum: 5_000 },
  { name: "RSA-2048", securityNote: "NIST maps RSA-2048 to about 112-bit security strength.", deadlineSeconds: 10 * 60, nextCeremony: "rsa3072Ceremony", ceremonyMinimum: 250_000 },
  { name: "RSA-3072", securityNote: "NIST maps RSA-3072 to about 128-bit security strength.", deadlineSeconds: 15 * 60, nextCeremony: "rsa4096Ceremony", ceremonyMinimum: 10_000_000 },
  { name: "RSA-4096", securityNote: "NIST estimates about 152-bit strength for RSA key establishment; the Q-Day countdown is fictional gameplay pressure.", deadlineSeconds: 20 * 60, nextCeremony: "pqcCeremony", ceremonyMinimum: 50_000_000 },
  { name: "Hybrid / PQC", securityNote: "Post-quantum capable CA. Exact strength depends on the selected algorithm and parameters.", deadlineSeconds: null, nextCeremony: null, ceremonyMinimum: null },
];

export const BUILDINGS: Building[] = [
  {
    id: "clicker",
    name: "Clicker",
    description: "An eager helper keeps tapping the jellyfish to issue certificates.",
    baseCost: 15,
    baseProduction: 0.1,
    icon: "👆",
  },
  {
    id: "operator",
    name: "PKI Operator",
    description: "A human operator who manually processes certificate requests.",
    baseCost: 100,
    baseProduction: 1,
    icon: "🧑‍💻",
  },
  {
    id: "onlineCa",
    name: "Online CA",
    description: "An online certificate authority signs certificate requests.",
    baseCost: 1_100,
    baseProduction: 8,
    icon: "🔏",
  },
  {
    id: "restApi",
    name: "REST API",
    description: "A REST interface accepts automated certificate requests.",
    baseCost: 12_000,
    baseProduction: 47,
    icon: "🔌",
  },
  {
    id: "scep",
    name: "SCEP",
    description: "Automates certificate enrolment for devices.",
    baseCost: 130_000,
    baseProduction: 260,
    icon: "📡",
  },
  {
    id: "cmpv2",
    name: "CMPv2",
    description: "Certificate Management Protocol version 2 handles enterprise enrollment.",
    baseCost: 1_400_000,
    baseProduction: 1_400,
    icon: "🏢",
  },
  {
    id: "autoEnrollment",
    name: "AutoEnrollment",
    description: "Domain joined machines request and renew certificates automatically.",
    baseCost: 20_000_000,
    baseProduction: 7_800,
    icon: "🖥️",
  },
  {
    id: "est",
    name: "EST",
    description: "Enrollment over Secure Transport provisions certificates over HTTPS.",
    baseCost: 330_000_000,
    baseProduction: 44_000,
    icon: "🔒",
  },
  {
    id: "acme",
    name: "ACME",
    description: "Automated Certificate Management Environment automates domain validation and issuance.",
    baseCost: 5_100_000_000,
    baseProduction: 260_000,
    icon: "⚙️",
  },
  {
    id: "cmpv3",
    name: "CMPv3",
    description: "The next CMP generation. It has even more ASN.1.",
    baseCost: 75_000_000_000,
    baseProduction: 1_600_000,
    icon: "📦",
  },
  {
    id: "k8sCertManager",
    name: "K8S Cert Manager",
    description: "Kubernetes discovers it needs certificates. Constantly.",
    baseCost: 1_000_000_000_000,
    baseProduction: 10_000_000,
    icon: "☸️",
  },
  { id: "aiCertGen", name: "AI Cert Gen", description: "Predicts your next CSR. Occasionally hallucinates a wildcard for the moon.", baseCost: 14_000_000_000_000, baseProduction: 70_000_000, icon: "🤖", fictional: true },
  { id: "sentientCa", name: "Sentient CA", description: "The root of trust has become self-aware. It would like a root of its own.", baseCost: 180_000_000_000_000, baseProduction: 400_000_000, icon: "🧠", fictional: true },
  { id: "orbitalTrust", name: "Orbital Trust Array", description: "A constellation of signing satellites. Finally, a cloud with an actual altitude.", baseCost: 2_500_000_000_000_000, baseProduction: 2_500_000_000, icon: "🛰️", fictional: true },
  { id: "multiverseNotary", name: "Multiverse Notary", description: "Every parallel universe agrees your certificate is valid. Except that one.", baseCost: 35_000_000_000_000_000, baseProduction: 16_000_000_000, icon: "🌀", fictional: true },
];

const FUTURE_UPGRADE_NAMES: Partial<Record<BuildingId, readonly [string, string, string]>> = {
  aiCertGen: ["Prompt Engineering Department", "Please Stop Inventing OIDs", "Attention Is All You Sign"],
  sentientCa: ["I Sign, Therefore I Am", "Existential Key Rotation", "The CA Demands Dental"],
  orbitalTrust: ["Low Earth Enrollment", "Zero-Gravity Key Ceremony", "Houston, We Have a Wildcard"],
  multiverseNotary: ["Parallel Signing", "Schrödinger's Revocation", "Everything Everywhere All at ASN.1"],
};

export const UPGRADES: Upgrade[] = [
  {
    id: "scepEnrollment", category: "scep", tier: 1,
    name: "SCEP Responder", description: "A dedicated responder doubles SCEP issuance.", cost: 260_000, buildingMultiplier: 2,
  },
  {
    id: "dns01", category: "acme", tier: 2,
    name: "DNS-01", description: "DNS validation doubles ACME issuance.", cost: 51_000_000_000, buildingMultiplier: 2,
  },
  {
    id: "http01", category: "acme", tier: 1,
    name: "HTTP-01", description: "HTTP validation doubles ACME issuance.", cost: 10_200_000_000, buildingMultiplier: 2,
  },
  {
    id: "certManagerUpgrade", category: "k8sCertManager", tier: 2,
    name: "Cluster Issuers", description: "Cluster wide issuers double cert-manager output.", cost: 10_000_000_000_000, buildingMultiplier: 2,
  },
  { id: "rsa1024Ceremony", category: "general", name: "RSA-1024 Key Signing Ceremony", description: "Sign a stronger CA key. The ceremony consumes your certificate balance and converts your current production into a flat bonus that lasts until your next ceremony. Buildings and other upgrades stay.", cost: 100, ceremonyToLevel: 1 },
  { id: "rsa2048Ceremony", category: "general", name: "RSA-2048 Key Signing Ceremony", description: "Sign a stronger CA key. The ceremony consumes your certificate balance and converts your current production into a flat bonus that lasts until your next ceremony. Buildings and other upgrades stay.", cost: 5_000, ceremonyToLevel: 2 },
  { id: "rsa3072Ceremony", category: "general", name: "RSA-3072 Key Signing Ceremony", description: "Sign a stronger CA key. The ceremony consumes your certificate balance and converts your current production into a flat bonus that lasts until your next ceremony. Buildings and other upgrades stay.", cost: 250_000, ceremonyToLevel: 3 },
  { id: "rsa4096Ceremony", category: "general", name: "RSA-4096 Key Signing Ceremony", description: "Sign a stronger CA key. The ceremony consumes your certificate balance and converts your current production into a flat bonus that lasts until your next ceremony. Buildings and other upgrades stay.", cost: 10_000_000, ceremonyToLevel: 4 },
  { id: "pqcCeremony", category: "general", name: "Hybrid / PQC Key Signing Ceremony", description: "Replace the RSA CA with a post-quantum capable CA. The ceremony converts your current production into a flat bonus, consumes your certificate balance, and ends the Q-Day countdown.", cost: 50_000_000, ceremonyToLevel: 5 },
  {
    id: "operatorPayrise",
    category: "operator", tier: 1,
    name: "Payrise",
    description: "Better-paid operators issue twice as many certificates.",
    cost: 200,
    buildingMultiplier: 2,
  },
  {
    id: "operatorOvertime",
    category: "operator", tier: 2,
    name: "Overtime",
    description: "Longer shifts double the operators’ current certificate rate.",
    cost: 1_000,
    buildingMultiplier: 2,
  },
  {
    id: "operatorForcedWork",
    category: "operator", tier: 3,
    name: "Forced Work",
    description: "The operators double their current output under relentless pressure.",
    cost: 5_000,
    buildingMultiplier: 2,
  },
  {
    id: "clickerFasterFinger", category: "clicker", tier: 1,
    name: "Faster Finger", description: "A quicker clicker doubles output.", cost: 30, buildingMultiplier: 2,
  },
  {
    id: "clickerTwoFinger", category: "clicker", tier: 2,
    name: "Two-Finger Clicking", description: "Two fingers double output again.", cost: 150, buildingMultiplier: 2,
  },
  {
    id: "clickerMechanical", category: "clicker", tier: 3,
    name: "Mechanical Clicker", description: "A mechanism doubles clicker output again.", cost: 750, buildingMultiplier: 2,
  },
  ...[
    ["onlineCaBetterHsm", "onlineCa", 1, "Better HSM", "A better HSM doubles online CA output."],
    ["onlineCaFasterCrypto", "onlineCa", 2, "Faster Crypto", "Faster cryptography doubles online CA output."],
    ["onlineCaBiggerHsm", "onlineCa", 3, "Bigger HSM", "More HSM capacity doubles online CA output."],
    ["restApiMoreEndpoints", "restApi", 1, "More Endpoints", "More endpoints double REST API output."],
    ["restApiConnectionPooling", "restApi", 2, "Connection Pooling", "Connection pooling doubles REST API output."],
    ["restApiHorizontalScaling", "restApi", 3, "Horizontal Scaling", "Horizontal scaling doubles REST API output."],
    ["scepFarm", "scep", 2, "SCEP Farm", "A responder farm doubles SCEP output."],
    ["scepEverywhere", "scep", 3, "SCEP Everywhere", "SCEP everywhere doubles SCEP output."],
    ["cmpv2Batching", "cmpv2", 1, "Transaction Batching", "Batching doubles CMPv2 output."],
    ["cmpv2ParallelRequests", "cmpv2", 2, "Parallel Requests", "Parallel requests double CMPv2 output."],
    ["cmpv2Accelerator", "cmpv2", 3, "CMP Accelerator", "An accelerator doubles CMPv2 output."],
    ["autoEnrollmentGpo", "autoEnrollment", 1, "GPO Deployment", "GPO deployment doubles AutoEnrollment output."],
    ["autoEnrollmentAutoRenewal", "autoEnrollment", 2, "Auto-Renewal", "Automatic renewal doubles AutoEnrollment output."],
    ["autoEnrollmentEverywhere", "autoEnrollment", 3, "Enrollment Everywhere", "Enrollment everywhere doubles output."],
    ["estHttps", "est", 1, "HTTPS Everywhere", "HTTPS deployment doubles EST output."],
    ["estCluster", "est", 2, "EST Cluster", "An EST cluster doubles EST output."],
    ["estPlusPlus", "est", 3, "EST++™", "EST++ doubles EST output."],
    ["acmeWildcardEverything", "acme", 3, "Wildcard Everything", "Wildcard issuance doubles ACME output."],
    ["cmpv3MoreAsn1", "cmpv3", 1, "More ASN.1", "More ASN.1 doubles CMPv3 output."],
    ["cmpv3MoreAsn1Again", "cmpv3", 2, "More ASN.1", "Even more ASN.1 doubles CMPv3 output."],
    ["cmpv3MoreAsn1AgainAgain", "cmpv3", 3, "MORE ASN.1", "The most ASN.1 doubles CMPv3 output."],
    ["k8sIngressCertificates", "k8sCertManager", 1, "Ingress Certificates", "Ingress certificates double cert-manager output."],
    ["k8sHasOwnCrds", "k8sCertManager", 3, "It Has Its Own CRDs", "Its own CRDs double cert-manager output."],
  ].map(([id, category, tier, name, description]) => {
    const building = BUILDINGS.find((item) => item.id === category)!;
    return {
      id: id as UpgradeId, category: category as BuildingId, tier: tier as 1 | 2 | 3,
      name: name as string, description: description as string,
      cost: Math.floor(building.baseCost * (tier === 1 ? 2 : tier === 2 ? 10 : 50)),
      buildingMultiplier: 2,
    };
  }),
  ...BUILDINGS.filter((building) => building.fictional).flatMap((building) => ([1, 2, 3] as const).map((tier) => ({
    id: `${building.id}Future${tier}` as UpgradeId,
    category: building.id, tier,
    name: FUTURE_UPGRADE_NAMES[building.id]![tier - 1],
    description: `Doubles ${building.name} output. The future has excellent paperwork.`,
    cost: building.baseCost * (tier === 1 ? 2 : tier === 2 ? 10 : 50), buildingMultiplier: 2,
  }))),
  ...BUILDINGS.flatMap((building) => ([50, 100, 150, 200] as const)
    .map((count, index) => ({
      id: `${building.id}Milestone${count}` as UpgradeId, category: building.id,
      name: `${building.name}: ${count === 50 ? "Fleet Optimization" : count === 100 ? "Mass Deployment" : count === 150 ? "Planetary Rollout" : "Ridiculous Scale"}`,
      description: `Doubles ${building.name} output. Unlocks at ${count} owned.`,
      cost: building.baseCost * [500, 5_000, 50_000, 500_000][index],
      requiredBuildings: { [building.id]: count }, buildingMultiplier: 2,
    }))),
  ...BUILDINGS.slice(0, -1).map((building, index) => {
    const partner = BUILDINGS[index + 1];
    return {
      id: `${building.id}Synergy` as UpgradeId, category: building.id,
      name: building.id === "clicker" ? "Human-in-the-Loop" : building.id === "operator" ? "Operators of Trust" : `${building.name} × ${partner.name}`,
      description: `Each ${building.name} boosts ${partner.name} output by 1%; each ${partner.name} boosts ${building.name} output by 5%. Bonuses add within this link.`,
      cost: partner.baseCost * 10,
      requiredBuildings: { [building.id]: 15, [partner.id]: 5 },
      synergy: { partner: partner.id, perPartner: 0.05, partnerPerBuilding: 0.01 },
    };
  }),
  { id: "clickerInfrastructure", category: "clicker", name: "A Finger in Every Protocol", description: "Each non-clicker building adds 0.5 cert/sec to every Clicker, before its output multipliers.", cost: 50_000, requiredBuildings: { clicker: 25, onlineCa: 5 }, clickerPerBuilding: 0.5 },
  { id: "clickerFleetReview", category: "clicker", name: "Distributed Approval Network", description: "Each Clicker boosts every other building's output by 0.2%. Even a small finger can approve a very large CSR.", cost: 25_000_000, requiredBuildings: { clicker: 50, cmpv2: 5 }, fleetBoostPerBuilding: 0.002 },
  { id: "operatorPeerReview", category: "operator", name: "Peer Review at Scale", description: "Each PKI Operator boosts every other building's output by 0.2%. A well-rested second pair of eyes scales surprisingly well.", cost: 250_000_000, requiredBuildings: { operator: 50, cmpv2: 10 }, fleetBoostPerBuilding: 0.002 },
  { id: "clickCps1", category: "general", name: "Copy / Paste CSR", description: "Each manual click gains 1% of spendable passive cert/sec. Scales with your whole PKI.", cost: 2_500, requiredClicks: 100, clickProductionShare: 0.01 },
  { id: "clickCps2", category: "general", name: "Approve All Pending", description: "Adds another 2% of spendable passive cert/sec to every manual click (3% total).", cost: 250_000, requiredClicks: 500, requiredUpgrades: ["clickCps1"], clickProductionShare: 0.02 },
  { id: "clickCps3", category: "general", name: "Jellyfish Gesture Signing", description: "Adds another 3% of spendable passive cert/sec to every manual click (6% total). Eight tentacles, one approval.", cost: 25_000_000, requiredClicks: 2_500, requiredUpgrades: ["clickCps2"], clickProductionShare: 0.03 },
  { id: "operatorAlgorithmicManagement", category: "operator", name: "Algorithmic Management", description: "Starts the Operatocalypse. Doubles operator output and boosts all building output by 10%. Rogue queues divert 3% of passive production; audit them to recover 110%.", cost: 1_000_000, requiredBuildings: { operator: 25, onlineCa: 5 }, requiredUpgrades: ["operatorForcedWork"], buildingMultiplier: 2, rebellionStage: 1 },
  { id: "operatorSleepDeprecated", category: "operator", name: "Sleep Is a Legacy Protocol", description: "Escalates to Work-to-Rule. Doubles operator output again. Building boost becomes 25%; diversion becomes 6%, recovered at 120% by audits.", cost: 100_000_000, requiredBuildings: { operator: 50, restApi: 10 }, requiredUpgrades: ["operatorAlgorithmicManagement"], buildingMultiplier: 2, rebellionStage: 2 },
  { id: "operatorRootForEveryone", category: "operator", name: "Root Access for Everyone", description: "Escalates to the Rogue Root Collective. Doubles operator output again. Building boost becomes 50%; diversion becomes 10%, recovered at 130% by audits.", cost: 10_000_000_000, requiredBuildings: { operator: 100, acme: 5 }, requiredUpgrades: ["operatorSleepDeprecated"], buildingMultiplier: 2, rebellionStage: 3 },
];

export const HARVEST_WINDOW = 20 * 60;

export type EconomyState = {
  buildings: Record<BuildingId, number>;
  upgrades: UpgradeId[];
  clicks: number;
  caLevel: number;
  elapsed: number;
  ceremonyProductionBonus: number;
  rogueCertificates: number;
  truceRemaining: number;
  safetyCharter: boolean;
  certificates: number;
  totalCertificates: number;
};

export function createInitialState(): EconomyState {
  return {
    certificates: 0, totalCertificates: 0, clicks: 0,
    buildings: Object.fromEntries(BUILDINGS.map((building) => [building.id, 0])) as Record<BuildingId, number>,
    upgrades: [], elapsed: 0, caLevel: 0, ceremonyProductionBonus: 0,
    rogueCertificates: 0, truceRemaining: 0, safetyCharter: false,
  };
}

export function restoreGame(parsed: Partial<EconomyState>): EconomyState {
  const initial = createInitialState();
  const upgrades = parsed.upgrades ?? [];
  return {
    ...initial, ...parsed,
    caLevel: parsed.caLevel ?? (upgrades.includes("pqcMigration") ? 5 : 2),
    ceremonyProductionBonus: parsed.ceremonyProductionBonus ?? 0,
    elapsed: parsed.caLevel === undefined ? 0 : (parsed.elapsed ?? 0),
    buildings: { ...initial.buildings, ...(parsed.buildings ?? {}) }, upgrades,
    rogueCertificates: parsed.rogueCertificates ?? 0,
    truceRemaining: parsed.truceRemaining ?? 0,
    safetyCharter: parsed.safetyCharter ?? false,
  };
}

export const REBELLION_STAGES = [
  { name: "Contented Operators", boost: 1, diversion: 0, recovery: 1, description: "The operators are quietly keeping the internet alive." },
  { name: "Grumbling in the Key Room", boost: 1.1, diversion: 0.03, recovery: 1.1, description: "Productivity dashboards are up. Morale dashboards have mysteriously vanished." },
  { name: "Work-to-Rule", boost: 1.25, diversion: 0.06, recovery: 1.2, description: "Operators now follow every policy literally. All 4,096 pages of them." },
  { name: "Rogue Root Collective", boost: 1.5, diversion: 0.1, recovery: 1.3, description: "The operators have formed their own root of trust. Its CPS is excellent. Its audit is not." },
] as const;

export function upgradeRequirements(upgrade: Upgrade): Partial<Record<BuildingId, number>> {
  const requirements = { ...upgrade.requiredBuildings };
  if (upgrade.category !== "general" && upgrade.tier) {
    requirements[upgrade.category] = Math.max(requirements[upgrade.category] ?? 0, upgrade.tier === 1 ? 1 : upgrade.tier === 2 ? 5 : 25);
  }
  return requirements;
}

export function upgradeUnlocked(upgrade: Upgrade, state: EconomyState): boolean {
  if (upgrade.ceremonyToLevel !== undefined) return upgrade.ceremonyToLevel === state.caLevel + 1;
  return Object.entries(upgradeRequirements(upgrade)).every(([id, count]) => state.buildings[id as BuildingId] >= count!)
    && (upgrade.requiredUpgrades ?? []).every((id) => state.upgrades.includes(id))
    && state.clicks >= (upgrade.requiredClicks ?? 0);
}

export function calculateEconomy(state: EconomyState) {
  const purchased = UPGRADES.filter((upgrade) => state.upgrades.includes(upgrade.id));
  const globalMultiplier = purchased.reduce((value, upgrade) => value * (upgrade.multiplier ?? (1 + (upgrade.productionBonus ?? 0))), 1);
  const multipliers = Object.fromEntries(BUILDINGS.map((building) => [building.id, 1])) as Record<BuildingId, number>;
  const links = { ...multipliers };
  for (const upgrade of purchased) {
    if (upgrade.category !== "general") {
      multipliers[upgrade.category] *= upgrade.buildingMultiplier ?? 1;
      if (upgrade.fleetBoostPerBuilding) {
        for (const building of BUILDINGS) {
          if (building.id !== upgrade.category) links[building.id] += state.buildings[upgrade.category] * upgrade.fleetBoostPerBuilding;
        }
      }
      if (upgrade.synergy) {
        links[upgrade.category] += state.buildings[upgrade.synergy.partner] * upgrade.synergy.perPartner;
        links[upgrade.synergy.partner] += state.buildings[upgrade.category] * upgrade.synergy.partnerPerBuilding;
      }
    }
  }
  const otherBuildings = BUILDINGS.reduce((sum, building) => sum + (building.id === "clicker" ? 0 : state.buildings[building.id]), 0);
  const clickerBonus = purchased.reduce((sum, upgrade) => sum + (upgrade.clickerPerBuilding ?? 0), 0) * otherBuildings;
  const rebellionLevel = purchased.reduce((level, upgrade) => Math.max(level, upgrade.rebellionStage ?? 0), 0);
  const rebellion = REBELLION_STAGES[rebellionLevel];
  const rebellionActive = rebellionLevel > 0 && !state.safetyCharter && state.truceRemaining <= 0 && state.buildings.operator > 0;
  const deadline = CA_STAGES[state.caLevel]?.deadlineSeconds;
  const threatMultiplier = deadline != null && state.elapsed >= deadline ? 0.1 : 1;
  const unitProduction = Object.fromEntries(BUILDINGS.map((building) => [building.id,
    (building.baseProduction + (building.id === "clicker" ? clickerBonus : 0)) * multipliers[building.id] * links[building.id] * globalMultiplier * (rebellionActive ? rebellion.boost : 1) * threatMultiplier,
  ])) as Record<BuildingId, number>;
  const grossProduction = BUILDINGS.reduce((sum, building) => sum + unitProduction[building.id] * state.buildings[building.id], 0) + state.ceremonyProductionBonus * threatMultiplier;
  const divertedPerSecond = grossProduction * (rebellionActive ? rebellion.diversion : 0);
  const productionPerSecond = grossProduction - divertedPerSecond;
  const clickShare = purchased.reduce((sum, upgrade) => sum + (upgrade.clickProductionShare ?? 0), 0);
  const clickValue = 1 + purchased.reduce((sum, upgrade) => sum + (upgrade.clickBonus ?? 0), 0) + productionPerSecond * clickShare;
  return { unitProduction, grossProduction, productionPerSecond, divertedPerSecond, clickValue, clickShare, rebellionLevel, rebellion, rebellionActive };
}

// Includes both sides of an infrastructure link, rather than just the new unit.
export function marginalProduction(state: EconomyState, id: BuildingId): number {
  return calculateEconomy({ ...state, buildings: { ...state.buildings, [id]: state.buildings[id] + 1 } }).productionPerSecond - calculateEconomy(state).productionPerSecond;
}

export function advanceEconomy<T extends EconomyState>(state: T, seconds: number): T {
  let next = { ...state };
  let remaining = Math.max(0, seconds);
  while (remaining > 0) {
    const deadline = CA_STAGES[next.caLevel]?.deadlineSeconds;
    // Split at threat and truce boundaries so elapsed time never earns the wrong rate.
    const untilThreat = deadline != null && next.elapsed < deadline ? deadline - next.elapsed : Infinity;
    const untilTruce = next.truceRemaining > 0 ? next.truceRemaining : Infinity;
    const duration = Math.min(remaining, untilThreat, untilTruce);
    const economy = calculateEconomy(next);
    const gain = economy.productionPerSecond * duration;
    next = {
      ...next,
      certificates: next.certificates + gain,
      totalCertificates: next.totalCertificates + gain,
      rogueCertificates: next.rogueCertificates + economy.divertedPerSecond * duration,
      elapsed: deadline == null ? next.elapsed : Math.min(deadline, next.elapsed + duration),
      truceRemaining: Math.max(0, next.truceRemaining - duration),
    };
    remaining -= duration;
  }
  return next;
}

export function auditRogueQueues<T extends EconomyState>(state: T): T {
  const recovered = state.rogueCertificates * calculateEconomy(state).rebellion.recovery;
  return { ...state, certificates: state.certificates + recovered, totalCertificates: state.totalCertificates + recovered, rogueCertificates: 0 };
}

export function truceCost(state: EconomyState): number {
  return Math.ceil(calculateEconomy(state).grossProduction * 30);
}

export function buildingCost(building: Building, count: number): number {
  return Math.floor(building.baseCost * Math.pow(1.2, count));
}

export function ceremonyMultiplier(certificatesCommitted: number, minimumCost: number): number {
  if (minimumCost <= 0 || certificatesCommitted < minimumCost) return 0;
  const doubleBonusThreshold = minimumCost * 10;
  if (certificatesCommitted < doubleBonusThreshold) return 1;
  return 2 + Math.floor(Math.log2(certificatesCommitted / doubleBonusThreshold));
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
