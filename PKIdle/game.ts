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
  | "k8sCertManager";

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
  | "k8sHasOwnCrds";

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
  category: "general" | BuildingId;
  name: string;
  description: string;
  cost: number;
  tier?: 1 | 2 | 3;
  multiplier?: number;
  buildingMultiplier?: number;
  clickBonus?: number;
  productionBonus?: number;
};

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
];

export const UPGRADES: Upgrade[] = [
  {
    id: "rsa2048",
    category: "general",
    name: "RSA-2048",
    description: "Replace toy crypto with a respectable RSA CA.",
    cost: 50,
    clickBonus: 1,
  },
  {
    id: "longerKeys",
    category: "general",
    name: "Longer Keys",
    description: "Because surely making the key longer solves everything.",
    cost: 500,
    productionBonus: 0.15,
  },
  {
    id: "csrAutomation",
    category: "general",
    name: "CSR Automation",
    description: "Stop typing certificate signing requests by hand.",
    cost: 2_500,
    multiplier: 1.25,
  },
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
  {
    id: "keyRotation",
    category: "general",
    name: "Automated Key Rotation",
    description: "Rotate keys before the harvester gets comfortable.",
    cost: 1_500_000,
    multiplier: 2,
  },
  {
    id: "hybridPqc",
    category: "general",
    name: "Hybrid PQC",
    description: "Start issuing with classical + post-quantum protection.",
    cost: 8_000_000,
    multiplier: 2.5,
  },
  {
    id: "pqcMigration",
    category: "general",
    name: "PQC Migration",
    description: "Migrate the CA hierarchy away from RSA.",
    cost: 50_000_000,
    multiplier: 5,
  },
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
];

export const HARVEST_WINDOW = 20 * 60;

export function buildingCost(building: Building, count: number): number {
  return Math.floor(building.baseCost * Math.pow(1.2, count));
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
