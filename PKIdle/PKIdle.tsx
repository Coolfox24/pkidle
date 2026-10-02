import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Activity,
  Award,
  ChevronRight,
  CircleHelp,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Terminal,
  Waves,
} from "lucide-react";
import {
  BUILDINGS,
  HARVEST_WINDOW,
  UPGRADES,
  buildingCost,
  formatNumber,
  type BuildingId,
  type UpgradeId,
} from "./game";
import { PixelBuildingIcon, PixelCertificate, PixelJellyfish, PixelOperatorSprite, PixelUpgradeIcon } from "./PixelArt";
import "./pkidle.css";

type Tab = "buildings" | "upgrades";

type CertificateEffect = {
  id: number;
  label: string;
  offsetX: number;
  offsetY: number;
  originX: number;
  originY: number;
  kind: "click" | "burst";
};

type OperatorVisit = { id: number; delay: number };

type SaveState = {
  certificates: number;
  totalCertificates: number;
  clicks: number;
  buildings: Record<BuildingId, number>;
  upgrades: UpgradeId[];
  elapsed: number;
};

const initialBuildings = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, 0]),
) as Record<BuildingId, number>;

const initialState: SaveState = {
  certificates: 0,
  totalCertificates: 0,
  clicks: 0,
  buildings: initialBuildings,
  upgrades: [],
  elapsed: 0,
};

function loadGame(): SaveState {
  try {
    const raw = localStorage.getItem("jellyfish-pki-save");
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    return {
      ...initialState,
      ...parsed,
      buildings: { ...initialBuildings, ...(parsed.buildings ?? {}) },
      upgrades: parsed.upgrades ?? [],
    };
  } catch {
    return initialState;
  }
}

export function PKIdle() {
  const [state, setState] = useState<SaveState>(loadGame);
  const [tab, setTab] = useState<Tab>("buildings");
  const [notice, setNotice] = useState("RSA CA online. Issue some certificates.");
  const [lastTick, setLastTick] = useState(Date.now());
  const [certificateEffects, setCertificateEffects] = useState<CertificateEffect[]>([]);
  const [operatorVisits, setOperatorVisits] = useState<OperatorVisit[]>([]);
  const jellyStageRef = useRef<HTMLDivElement>(null);
  const productionRateRef = useRef(0);
  const clickValueRef = useRef(1);

  const purchased = useMemo(
    () => new Set(state.upgrades),
    [state.upgrades],
  );

  const productionMultiplier = useMemo(() => {
    let multiplier = 1;
    for (const upgrade of UPGRADES) {
      if (purchased.has(upgrade.id)) multiplier *= upgrade.multiplier ?? (1 + (upgrade.productionBonus ?? 0));
    }
    return multiplier;
  }, [purchased]);

  const buildingProductionMultipliers = useMemo(
    () => Object.fromEntries(BUILDINGS.map((building) => [
      building.id,
      UPGRADES.filter((upgrade) => upgrade.category === building.id && purchased.has(upgrade.id))
        .reduce((multiplier, upgrade) => multiplier * (upgrade.buildingMultiplier ?? 1), 1),
    ])) as Record<BuildingId, number>,
    [purchased],
  );

  const baseProduction = useMemo(
    () =>
      BUILDINGS.reduce(
        (total, building) =>
          total + building.baseProduction * state.buildings[building.id] * buildingProductionMultipliers[building.id],
        0,
      ),
    [state.buildings, buildingProductionMultipliers],
  );

  const clickValue =
    1 +
    UPGRADES.filter((u) => purchased.has(u.id)).reduce(
      (sum, u) => sum + (u.clickBonus ?? 0),
      0,
    );

  const productionPerSecond = baseProduction * productionMultiplier;
  productionRateRef.current = productionPerSecond;
  clickValueRef.current = clickValue;
  const harvestProgress = Math.min(state.elapsed / HARVEST_WINDOW, 1);
  const timeRemaining = Math.max(0, HARVEST_WINDOW - state.elapsed);
  const pqcUnlocked = purchased.has("pqcMigration");

  const caStatus = pqcUnlocked
    ? { label: "PQC CA ACTIVE", className: "safe", icon: "🧬" }
    : harvestProgress >= 0.85
      ? { label: "QUANTUM THREAT CRITICAL", className: "critical", icon: "☢️" }
      : harvestProgress >= 0.6
        ? { label: "HARVESTING DETECTED", className: "warning", icon: "🐢" }
        : { label: "RSA CA ONLINE", className: "online", icon: "🔑" };

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = Math.min((now - lastTick) / 1000, 5);
      setLastTick(now);
      setState((current) => {
        const gain = productionPerSecond * delta;
        return {
          ...current,
          certificates: current.certificates + gain,
          totalCertificates: current.totalCertificates + gain,
          elapsed: pqcUnlocked
            ? current.elapsed
            : Math.min(current.elapsed + delta, HARVEST_WINDOW),
        };
      });
    }, 250);

    return () => window.clearInterval(timer);
  }, [lastTick, productionPerSecond, pqcUnlocked]);

  useEffect(() => {
    localStorage.setItem("jellyfish-pki-save", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (timeRemaining === 0 && !pqcUnlocked) {
      setNotice("The harvester has arrived. Your RSA CA is exposed.");
    }
  }, [timeRemaining, pqcUnlocked]);

  const issueCertificate = useCallback(() => {
    setState((current) => ({
      ...current,
      certificates: current.certificates + clickValue,
      totalCertificates: current.totalCertificates + clickValue,
      clicks: current.clicks + 1,
    }));
  }, [clickValue]);

  const emitCertificates = useCallback((count: number, kind: CertificateEffect["kind"], clickPoint?: { x: number; y: number }) => {
    const amount = Math.max(1, Math.min(40, Math.ceil(count)));
    const now = Date.now();
    const stage = jellyStageRef.current;
    const originX = clickPoint?.x ?? (stage?.clientWidth ?? 0) / 2;
    const originY = clickPoint?.y ?? (stage?.clientHeight ?? 0) * 0.46;
    const effects = Array.from({ length: amount }, (_, index) => ({
      id: now + index + Math.random(),
      label: kind === "click" && index === 0 ? `+${formatNumber(clickValueRef.current)}` : "▤",
      offsetX: kind === "click" ? (index - (amount - 1) / 2) * 24 : Math.cos((2 * Math.PI * index) / amount) * 118,
      offsetY: kind === "click" ? -42 : Math.sin((2 * Math.PI * index) / amount) * 118,
      originX,
      originY,
      kind,
    }));
    setCertificateEffects((current) => [...current.slice(-100), ...effects]);
    window.setTimeout(() => {
      const ids = new Set(effects.map((effect) => effect.id));
      setCertificateEffects((current) => current.filter((effect) => !ids.has(effect.id)));
    }, 1300);
  }, []);

  useEffect(() => {
    const interval = 30_000;
    const timer = window.setInterval(() => {
      const production = productionRateRef.current;
      if (production > 0) {
        emitCertificates(Math.floor(Math.log2(production)) + 1, "burst");
      }
    }, interval);
    return () => window.clearInterval(timer);
  }, [emitCertificates]);

  useEffect(() => {
    const operators = state.buildings.operator;
    if (operators <= 0) return;

    let timer = 0;
    const scheduleVisit = () => {
      const delay = 30_000 + Math.random() * 30_000;
      timer = window.setTimeout(() => {
        const visitorCount = Math.min(8, Math.floor(Math.log2(operators)) + 1);
        const visits = Array.from({ length: visitorCount }, (_, index) => ({
          id: Date.now() + index + Math.random(),
          delay: index * 450,
        }));
        setOperatorVisits((current) => [...current, ...visits]);
        window.setTimeout(() => {
          const ids = new Set(visits.map((visit) => visit.id));
          setOperatorVisits((current) => current.filter((visit) => !ids.has(visit.id)));
        }, 12_000);
        scheduleVisit();
      }, delay);
    };

    scheduleVisit();
    return () => window.clearTimeout(timer);
  }, [state.buildings.operator]);

  const buyBuilding = (id: BuildingId) => {
    const building = BUILDINGS.find((b) => b.id === id)!;
    const count = state.buildings[id];
    const cost = buildingCost(building, count);

    if (state.certificates < cost) {
      setNotice(`Not enough certificates. ${building.name} costs ${formatNumber(cost)}.`);
      return;
    }

    setState((current) => ({
      ...current,
      certificates: current.certificates - cost,
      buildings: {
        ...current.buildings,
        [id]: current.buildings[id] + 1,
      },
    }));
    setNotice(`${building.name} deployed.`);
  };

  const buyUpgrade = (id: UpgradeId) => {
    const upgrade = UPGRADES.find((u) => u.id === id)!;
    if (purchased.has(id)) return;

    if (upgrade.category !== "general" && upgrade.tier) {
      const requiredBuildings = upgrade.tier === 1 ? 1 : upgrade.tier === 2 ? 5 : 25;
      const ownedBuildings = state.buildings[upgrade.category];
      if (ownedBuildings < requiredBuildings) {
        setNotice(`${upgrade.name} unlocks at ${requiredBuildings} ${BUILDINGS.find((building) => building.id === upgrade.category)?.name} buildings.`);
        return;
      }
    }

    if (state.certificates < upgrade.cost) {
      setNotice(`Not enough certificates. ${upgrade.name} costs ${formatNumber(upgrade.cost)}.`);
      return;
    }

    setState((current) => ({
      ...current,
      certificates: current.certificates - upgrade.cost,
      upgrades: [...current.upgrades, id],
    }));
    setNotice(`${upgrade.name} installed.`);
  };

  const reset = () => {
    if (!window.confirm("Reset the entire PKI? This deletes your local save.")) return;
    localStorage.removeItem("jellyfish-pki-save");
    setState(initialState);
    setNotice("PKI wiped. The jellyfish awaits.");
  };

  const progressText =
    pqcUnlocked
      ? "Quantum-safe migration complete."
      : timeRemaining > 0
        ? `${formatDuration(timeRemaining)} until the RSA harvesting deadline`
        : "RSA CA deadline reached — migrate immediately.";

  return (
    <div className="pkidle">
      <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Waves size={22} /></div>
          <div>
            <strong>Jellyfish PKI</strong>
            <span>Certificate Authority Simulator</span>
          </div>
        </div>
        <div className={`ca-pill ${caStatus.className}`}>
          <span>{caStatus.icon}</span>
          {caStatus.label}
        </div>
      </header>

      <section className="dashboard">
        <aside className="left-panel">
          <div className="resource-card">
            <span className="eyebrow">CERTIFICATES ISSUED</span>
            <div className="resource-value">{formatNumber(state.certificates)}</div>
            <div className="resource-rate">
              <Activity size={14} />
              {formatProductionRate(productionPerSecond)} / sec
            </div>
          </div>

            <div className="jelly-stage" ref={jellyStageRef}>
            <div className="ocean-haze" />
            <div className="pixel-fish fish-one" />
            <div className="pixel-fish fish-two" />
            <div className="ocean-plant plant-left" />
            <div className="ocean-plant plant-right" />
            <div className="bubble b1" />
            <div className="bubble b2" />
            <div className="bubble b3" />
            <button
              className="jellyfish-button"
              onClick={(event) => {
                issueCertificate();
                const stageBounds = event.currentTarget.parentElement!.getBoundingClientRect();
                emitCertificates(1, "click", {
                  x: event.clientX - stageBounds.left,
                  y: event.clientY - stageBounds.top,
                });
              }}
              aria-label="Issue a certificate"
            >
              <div className="jelly-glow" />
              <PixelJellyfish />
            </button>
            <div className="operator-visits" aria-hidden="true">
              {operatorVisits.map((visit) => (
                <span
                  className="operator-visitor"
                  key={visit.id}
                  style={{ "--pkidle-swim-delay": `${visit.delay}ms` } as CSSProperties}
                >
                  <PixelOperatorSprite />
                  <span className="operator-bubbles"><i /><i /><i /></span>
                  <span className="operator-generated-certificate"><PixelCertificate /></span>
                </span>
              ))}
            </div>
            <div className="certificate-effects" aria-hidden="true">
              {certificateEffects.map((effect) => (
                <span
                  className={`certificate-effect ${effect.kind}`}
                  key={effect.id}
                  style={{
                    "--pkidle-effect-x": `${effect.offsetX}px`,
                    "--pkidle-effect-y": `${effect.offsetY}px`,
                    "--pkidle-origin-x": `${effect.originX}px`,
                    "--pkidle-origin-y": `${effect.originY}px`,
                  } as CSSProperties}
                >
                  <PixelCertificate />
                  {effect.kind === "click" && <strong>{effect.label}</strong>}
                </span>
              ))}
            </div>
            <div className="click-hint">ISSUE CERTIFICATE</div>
            <div className="click-value">+{formatNumber(clickValue)}</div>
          </div>

          <div className="notice">
            <Terminal size={15} />
            <span>{notice}</span>
          </div>

          <div className="ca-card">
            <div className="section-title">
              <span><KeyRound size={16} /> CA TELEMETRY</span>
              <span className="live-dot" />
            </div>
            <div className="metric">
              <span>Architecture</span>
              <strong>{pqcUnlocked ? "Hybrid / PQC" : "RSA-2048"}</strong>
            </div>
            <div className="metric">
              <span>Certificates</span>
              <strong>{formatNumber(state.totalCertificates)}</strong>
            </div>
            <div className="metric">
              <span>Human clicks</span>
              <strong>{formatNumber(state.clicks)}</strong>
            </div>
          </div>
        </aside>

        <section className="right-panel">
          <div className="threat-card">
            <div className="threat-copy">
              <div className="threat-heading">
                <ShieldAlert size={20} />
                <div>
                  <span className="eyebrow">CRYPTOGRAPHIC THREAT</span>
                  <h2>{pqcUnlocked ? "PQC migration complete" : "Harvest Now, Decrypt Later"}</h2>
                </div>
              </div>
              <p>{pqcUnlocked ? "The quantum turtle has nothing useful left to harvest." : "A certificate harvester is collecting your RSA certificates. Migrate to PQC before the quantum tide arrives."}</p>
            </div>
            <div className="timer">
              <span>{progressText}</span>
              <div className="progress-track">
                <div className={`progress-fill ${pqcUnlocked ? "pqc" : ""}`} style={{ width: `${harvestProgress * 100}%` }} />
              </div>
              <div className="timer-row">
                <span>{pqcUnlocked ? "PROTECTED" : `${Math.round(harvestProgress * 100)}% HARVESTED`}</span>
                <strong>{pqcUnlocked ? "✓" : formatDuration(timeRemaining)}</strong>
              </div>
            </div>
          </div>

          <div className="tabs">
            <button className={tab === "buildings" ? "active" : ""} onClick={() => setTab("buildings")}>
              <LockKeyhole size={17} /> PKI Infrastructure
            </button>
            <button className={tab === "upgrades" ? "active" : ""} onClick={() => setTab("upgrades")}>
              <Sparkles size={17} /> Cryptographic Upgrades
            </button>
          </div>

          {tab === "buildings" ? (
            <div className="item-list">
              {BUILDINGS.map((building) => {
                const count = state.buildings[building.id];
                const cost = buildingCost(building, count);
                const affordable = state.certificates >= cost;
                const revealProgress = state.totalCertificates / cost;
                if (revealProgress < 0.5 && !affordable) return null;
                const nameRevealed = revealProgress >= 0.8 || affordable;
                const infoRevealed = revealProgress >= 1 || affordable;
                const partiallyRevealed = !nameRevealed;
                return (
                  <button
                    className={`item-card ${affordable ? "affordable" : partiallyRevealed ? "partial-reveal" : "near-unlock"}`}
                    key={building.id}
                    onClick={() => buyBuilding(building.id)}
                  >
                    <div className="item-icon">{partiallyRevealed ? "?" : <PixelBuildingIcon id={building.id} />}</div>
                    <div className="item-info">
                      <div className="item-title">
                        <strong>{nameRevealed ? building.name : "????"}</strong>
                        <span>x{count}</span>
                      </div>
                      {infoRevealed && <p>{building.description}</p>}
                      {infoRevealed && <small>+{formatProductionRate(building.baseProduction * productionMultiplier * buildingProductionMultipliers[building.id])} cert/sec each</small>}
                    </div>
                    <div className="item-buy">
                      <span>DEPLOY</span>
                      <strong>{formatNumber(cost)}</strong>
                      <ChevronRight size={16} />
                    </div>
                  </button>
                );
              })}
              {!BUILDINGS.some((building) => {
                const cost = buildingCost(building, state.buildings[building.id]);
                return state.certificates >= cost || state.totalCertificates / cost >= 0.5;
              }) && <p className="discovery-hint">More PKI infrastructure will be discovered as you issue certificates.</p>}
            </div>
          ) : (
            <div className="upgrade-categories">
              {[
                { id: "general", title: "General", upgrades: UPGRADES.filter((upgrade) => upgrade.category === "general") },
                ...BUILDINGS.map((building) => ({
                  id: building.id,
                  title: building.name,
                  upgrades: UPGRADES.filter((upgrade) => upgrade.category === building.id),
                })),
              ].map((category) => ({
                ...category,
                upgrades: category.upgrades.filter((upgrade) =>
                  purchased.has(upgrade.id) || (upgrade.category === "general"
                    ? state.totalCertificates / upgrade.cost >= 0.5
                    : !upgrade.tier || state.buildings[upgrade.category] >= (upgrade.tier === 1 ? 1 : upgrade.tier === 2 ? 5 : 25)),
                ),
              })).filter((category) => category.upgrades.length > 0).map((category) => (
                <section className="upgrade-category" key={category.id}>
                  <h3>{category.title}</h3>
                  <div className="upgrade-grid">
                    {category.upgrades.map((upgrade) => {
                      const owned = purchased.has(upgrade.id);
                      const affordable = state.certificates >= upgrade.cost;
                      const revealProgress = state.totalCertificates / upgrade.cost;
                      const nameRevealed = owned || revealProgress >= 0.8 || affordable;
                      const infoRevealed = owned || revealProgress >= 1 || affordable;
                      const partiallyRevealed = !nameRevealed;
                      const effect = upgrade.buildingMultiplier
                        ? `×${upgrade.buildingMultiplier} ${BUILDINGS.find((building) => building.id === upgrade.category)?.name ?? "building"} output`
                        : upgrade.multiplier
                          ? `×${upgrade.multiplier} production`
                          : `+${upgrade.clickBonus} per click`;
                      return (
                        <button
                          className={`upgrade-tile ${owned ? "owned" : affordable ? "affordable" : partiallyRevealed ? "partial-reveal" : "near-unlock"}`}
                          key={upgrade.id}
                          onClick={() => buyUpgrade(upgrade.id)}
                          aria-disabled={owned}
                          aria-label={`${nameRevealed ? upgrade.name : "Unknown upgrade"}. ${infoRevealed ? `${upgrade.description} ${effect}. ` : ""}Cost: ${formatNumber(upgrade.cost)} certificates. ${owned ? "Purchased" : affordable ? "Available to purchase" : "Not affordable yet"}.`}
                        >
                          <span className="upgrade-tile-icon">{partiallyRevealed ? "?" : <PixelUpgradeIcon category={upgrade.category} tier={upgrade.tier} />}</span>
                          {owned && <span className="upgrade-tile-check">✓</span>}
                          <span className="upgrade-tooltip" role="tooltip">
                            <strong>{nameRevealed ? upgrade.name : "????"}</strong>
                            {infoRevealed && <span>{upgrade.description}</span>}
                            {infoRevealed && <em>{effect}</em>}
                            <small>{owned ? "PURCHASED" : `COST · ${formatNumber(upgrade.cost)} CERTS`}</small>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
              {!UPGRADES.some((upgrade) =>
                purchased.has(upgrade.id) || state.totalCertificates / upgrade.cost >= 0.5,
              ) && <p className="discovery-hint">More upgrades will be discovered as you issue certificates.</p>}
            </div>
          )}

          <div className="bottom-grid">
            <div className="achievement">
              <Award size={20} />
              <div>
                <strong>PKI Progress</strong>
                <span>{state.upgrades.length}/{UPGRADES.length} upgrades • {Object.values(state.buildings).reduce((a, b) => a + b, 0)} infrastructure units</span>
              </div>
            </div>
            <button className="reset-button" onClick={reset}>
              <RotateCcw size={15} /> Reset PKI
            </button>
          </div>
        </section>
      </section>

      <footer>
        <CircleHelp size={14} />
        <span>Educational simulation — real PKI concepts, deliberately silly sea life.</span>
        <span className="footer-spacer" />
        <span>Jellyfish PKI v0.1</span>
      </footer>
      </main>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.ceil(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  return `${minutes}m ${secs.toString().padStart(2, "0")}s`;
}

function formatProductionRate(value: number): string {
  return value > 0 && value < 1 ? value.toFixed(1) : formatNumber(value);
}

export default PKIdle;
