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
  CA_STAGES,
  UPGRADES,
  buildingCost,
  ceremonyMultiplier,
  calculateEconomy,
  advanceEconomy,
  auditRogueQueues,
  marginalProduction,
  truceCost,
  upgradeUnlocked,
  upgradeRequirements,
  createInitialState,
  restoreGame,
  formatNumber,
  type EconomyState,
  type Upgrade,
  type BuildingId,
  type UpgradeId,
} from "./game";
import { PixelBuildingIcon, PixelCertificate, PixelJellyfish, PixelOperatorSprite, PixelUpgradeIcon } from "./PixelArt";
import "./pkidle.css";
import { OceanHabitat } from './OceanHabitat';

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

type SaveState = EconomyState;

const initialState = createInitialState();

function loadGame(): SaveState {
  try {
    const raw = localStorage.getItem("jellyfish-pki-save");
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    return restoreGame(parsed);
  } catch {
    return initialState;
  }
}

export function PKIdle() {
  const [state, setState] = useState<SaveState>(loadGame);
  const [tab, setTab] = useState<Tab>("buildings");
  const [notice, setNotice] = useState("RSA CA online. Issue some certificates.");
  const [certificateEffects, setCertificateEffects] = useState<CertificateEffect[]>([]);
  const [operatorVisits, setOperatorVisits] = useState<OperatorVisit[]>([]);
  const jellyStageRef = useRef<HTMLDivElement>(null);
  const productionRateRef = useRef(0);
  const clickValueRef = useRef(1);

  const purchased = useMemo(
    () => new Set(state.upgrades),
    [state.upgrades],
  );

  const economy = useMemo(() => calculateEconomy(state), [state]);
  const { productionPerSecond, clickValue } = economy;

  const caStage = CA_STAGES[Math.min(state.caLevel, CA_STAGES.length - 1)];
  const pqcUnlocked = state.caLevel >= CA_STAGES.length - 1;
  const deadlineSeconds = caStage.deadlineSeconds ?? 0;
  const timeRemaining = Math.max(0, deadlineSeconds - state.elapsed);
  const threatExpired = !pqcUnlocked && timeRemaining === 0;
  const harvestProgress = deadlineSeconds > 0 ? Math.min(state.elapsed / deadlineSeconds, 1) : 0;
  productionRateRef.current = productionPerSecond;
  clickValueRef.current = clickValue;

  const caStatus = pqcUnlocked
    ? { label: "PQC CA ACTIVE", className: "safe", icon: "🧬" }
    : threatExpired
      ? { label: "RSA KEY COMPROMISED", className: "critical", icon: "⚠️" }
      : harvestProgress >= 0.85
        ? { label: state.caLevel === 4 ? "QUANTUM THREAT CRITICAL" : "KEY BREAKTHROUGH IMMINENT", className: "critical", icon: "☢️" }
        : harvestProgress >= 0.6
          ? { label: "ATTACK PROGRESSING", className: "warning", icon: "🐢" }
          : { label: `${caStage.name} CA ONLINE`, className: "online", icon: "🔑" };

  useEffect(() => {
    let lastTick = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const delta = Math.max(0, Math.min((now - lastTick) / 1000, 5));
      lastTick = now;
      setState((current) => advanceEconomy(current, delta));
    }, 250);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("jellyfish-pki-save", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (timeRemaining === 0 && !pqcUnlocked) {
      setNotice(state.caLevel === 4
        ? "Q-Day has arrived. Your RSA-4096 CA is compromised; productivity is reduced until you hold the PQC ceremony."
        : `Attackers have broken your ${caStage.name} CA. Productivity is reduced until you hold the next key signing ceremony.`);
    }
  }, [timeRemaining, pqcUnlocked, state.caLevel, caStage.name]);

  const issueCertificate = useCallback(() => {
    setState((current) => {
      const value = calculateEconomy(current).clickValue;
      return { ...current, certificates: current.certificates + value, totalCertificates: current.totalCertificates + value, clicks: current.clicks + 1 };
    });
  }, []);

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

    setState((current) => {
      const currentCost = buildingCost(building, current.buildings[id]);
      if (current.certificates < currentCost) return current;
      return { ...current, certificates: current.certificates - currentCost, buildings: { ...current.buildings, [id]: current.buildings[id] + 1 } };
    });
    setNotice(`${building.name} deployed.`);
  };

  const buyUpgrade = (id: UpgradeId) => {
    const upgrade = UPGRADES.find((u) => u.id === id)!;
    if (purchased.has(id)) return;

    if (!upgradeUnlocked(upgrade, state)) {
      setNotice(`${upgrade.name} is still locked. ${requirementText(upgrade)}`);
      return;
    }

    if (upgrade.ceremonyToLevel !== undefined) {
      if (upgrade.ceremonyToLevel !== state.caLevel + 1) return;
      if (state.certificates < upgrade.cost) {
        setNotice(`The ${upgrade.name} requires at least ${formatNumber(upgrade.cost)} certificates.`);
        return;
      }
      const consumed = state.certificates;
      const ceremonyBonusMultiplier = ceremonyMultiplier(consumed, upgrade.cost);
      const addedProduction = productionPerSecond * ceremonyBonusMultiplier;
      setState((current) => {
        if (current.upgrades.includes(id) || !upgradeUnlocked(upgrade, current) || current.certificates < upgrade.cost) return current;
        return {
          ...current, certificates: 0, caLevel: upgrade.ceremonyToLevel!,
          ceremonyProductionBonus: calculateEconomy(current).productionPerSecond * ceremonyMultiplier(current.certificates, upgrade.cost),
          elapsed: 0, upgrades: [...current.upgrades, id],
        };
      });
      setNotice(`${upgrade.name} complete. ${formatNumber(consumed)} certificates consumed; ×${ceremonyBonusMultiplier} current CPS adds +${formatProductionRate(addedProduction)} cert/sec until the next ceremony. Buildings and upgrades retained.`);
      return;
    }

    if (state.certificates < upgrade.cost) {
      setNotice(`Not enough certificates. ${upgrade.name} costs ${formatNumber(upgrade.cost)}.`);
      return;
    }

    setState((current) => {
      if (current.upgrades.includes(id) || !upgradeUnlocked(upgrade, current) || current.certificates < upgrade.cost) return current;
      return { ...current, certificates: current.certificates - upgrade.cost, upgrades: [...current.upgrades, id] };
    });
    setNotice(upgrade.rebellionStage ? `${upgrade.name} installed. The Operatocalypse has escalated. Audit rogue queues or sign a safety charter in Operator Relations.` : `${upgrade.name} installed.`);
  };

  const audit = () => {
    const recovered = state.rogueCertificates * economy.rebellion.recovery;
    setState((current) => auditRogueQueues(current));
    setNotice(`Security audit recovered ${formatProductionRate(recovered)} certificates, including the reconciliation bonus.`);
  };

  const callTruce = () => {
    setState((current) => {
      const cost = truceCost(current);
      if (current.safetyCharter || current.truceRemaining > 0 || calculateEconomy(current).rebellionLevel === 0 || current.certificates < cost) return current;
      return { ...current, certificates: current.certificates - cost, truceRemaining: 60 };
    });
    setNotice("Pizza-fuelled truce: rogue issuance and the rebellion's fleet boost pause for 60 seconds. Operator upgrades stay installed.");
  };

  const reset = () => {
    if (!window.confirm("Reset the entire PKI? This deletes your local save.")) return;
    localStorage.removeItem("jellyfish-pki-save");
    setState(initialState);
    setNotice("PKI wiped. The jellyfish awaits.");
  };

  const progressText = pqcUnlocked
    ? "Quantum-safe migration complete."
    : state.caLevel === 4
      ? timeRemaining > 0
        ? `${formatDuration(timeRemaining)} until Q-Day harvest`
        : "Q-Day arrived — productivity reduced until PQC migration."
      : timeRemaining > 0
        ? `${formatDuration(timeRemaining)} until hackers break ${caStage.name}`
        : `${caStage.name} is compromised — hold the next signing ceremony.`;

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
            <OceanHabitat buildings={state.buildings} />
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
              <PixelJellyfish caLevel={state.caLevel} />
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
            <div className="click-value">+{formatProductionRate(clickValue)} per click{economy.clickShare > 0 && ` · ${Math.round(economy.clickShare * 100)}% of CPS`}</div>
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
              <strong>{caStage.name}</strong>
            </div>
            <p className="ca-security-note">{caStage.securityNote}</p>
            <div className="metric">
              <span>Ceremony production bonus</span>
              <strong>+{formatProductionRate(state.ceremonyProductionBonus)} / sec</strong>
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

          {economy.rebellionLevel > 0 && (
            <section className={`operator-relations ${economy.rebellionActive ? "rebelling" : "contained"}`}>
              <div className="section-title"><span><ShieldAlert size={16} /> OPERATOR RELATIONS</span><span>STAGE {economy.rebellionLevel}/3</span></div>
              <h2>{state.safetyCharter ? "Safety Charter Active" : state.truceRemaining > 0 ? "Pizza Truce" : economy.rebellion.name}</h2>
              <p>{state.safetyCharter ? "Operators retain their upgrades. Risky fleet overdrive and rogue issuance are suspended until you resume them." : state.truceRemaining > 0 ? `Overdrive and rogue issuance pause for ${formatDuration(state.truceRemaining)}. Operator upgrades remain active.` : economy.rebellion.description}</p>
              <div className="metric"><span>Fleet overdrive</span><strong>+{economy.rebellionActive ? Math.round((economy.rebellion.boost - 1) * 100) : 0}% building output</strong></div>
              <div className="metric"><span>Diverted to rogue queues</span><strong>{formatProductionRate(economy.divertedPerSecond)} / sec ({economy.rebellionActive ? Math.round(economy.rebellion.diversion * 100) : 0}%)</strong></div>
              <div className="metric"><span>Recoverable backlog</span><strong>{formatProductionRate(state.rogueCertificates)}</strong></div>
              <p>Audits return {Math.round(economy.rebellion.recovery * 100)}% of the backlog. Manual clicks are never diverted.</p>
              <div className="relation-actions">
                <button onClick={audit} disabled={state.rogueCertificates <= 0}>Audit queues · +{formatProductionRate(state.rogueCertificates * economy.rebellion.recovery)}</button>
                <button onClick={callTruce} disabled={state.safetyCharter || state.truceRemaining > 0 || state.certificates < truceCost(state)}>60s pizza truce · {formatNumber(truceCost(state))} certs</button>
                <button onClick={() => {
                  setState((current) => ({ ...current, safetyCharter: !current.safetyCharter }));
                  setNotice(state.safetyCharter ? "Risky fleet overdrive resumed. Rogue queues will grow when the truce ends." : "Safety charter signed. Fleet overdrive and rogue issuance suspended; the backlog is still available to audit.");
                }}>{state.safetyCharter ? "Resume risky overdrive" : "Sign safety charter · free"}</button>
              </div>
            </section>
          )}
        </aside>

        <section className="right-panel">
          <div className="threat-card">
            <div className="threat-copy">
              <div className="threat-heading">
                <ShieldAlert size={20} />
                <div>
                  <span className="eyebrow">CRYPTOGRAPHIC THREAT</span>
                  <h2>{pqcUnlocked ? "PQC migration complete" : state.caLevel === 4 ? "Harvest Now, Decrypt Later" : "Hackers vs. Key Length"}</h2>
                </div>
              </div>
              <p>{pqcUnlocked
                ? "The quantum turtle has nothing useful left to harvest. Your buildings and upgrades remain in place."
                : state.caLevel === 4
                  ? "Your RSA-4096 CA has reached the Q-Day threat. Complete the PQC key signing ceremony before the harvest countdown ends."
                  : `Attackers are working on your ${caStage.name} key. Use the next ceremony in Key Signing Ceremonies to advance; the deadline gets longer as your key strengthens.`}</p>
            </div>
            <div className="timer">
              <span>{progressText}</span>
              <div className="progress-track">
                <div className={`progress-fill ${pqcUnlocked ? "pqc" : ""}`} style={{ width: `${harvestProgress * 100}%` }} />
              </div>
              <div className="timer-row">
                <span>{pqcUnlocked ? "PROTECTED" : state.caLevel === 4 ? `${Math.round(harvestProgress * 100)}% HARVESTED` : `${Math.round(harvestProgress * 100)}% KEY ATTACK`}</span>
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
                if (count === 0 && revealProgress < 0.5 && !affordable) return null;
                const nameRevealed = count > 0 || revealProgress >= 0.8 || affordable;
                const infoRevealed = count > 0 || revealProgress >= 1 || affordable;
                const partiallyRevealed = !nameRevealed;
                const gain = marginalProduction(state, building.id);
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
                      {infoRevealed && <small>+{formatProductionRate(gain)} spendable cert/sec on purchase · pays back in {gain > 0 ? formatDuration(cost / gain) : "—"}{building.fictional ? " · FICTIONAL TECH" : ""}</small>}
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
                { id: "ceremonies", title: "Key Signing Ceremonies", upgrades: UPGRADES.filter((upgrade) => upgrade.ceremonyToLevel !== undefined) },
                { id: "general", title: "Manual Issuance", upgrades: UPGRADES.filter((upgrade) => upgrade.category === "general" && upgrade.ceremonyToLevel === undefined) },
                ...BUILDINGS.map((building) => ({
                  id: building.id,
                  title: building.name,
                  upgrades: UPGRADES.filter((upgrade) => upgrade.category === building.id),
                })),
              ].map((category) => ({
                ...category,
                upgrades: category.upgrades.filter((upgrade) => {
                  if (upgrade.legacy) return purchased.has(upgrade.id);
                  if (upgrade.ceremonyToLevel !== undefined) {
                    return purchased.has(upgrade.id) || upgrade.ceremonyToLevel === state.caLevel + 1;
                  }
                  if (purchased.has(upgrade.id) || upgradeUnlocked(upgrade, state)) return true;
                  if (upgrade.category === "general") return state.totalCertificates >= upgrade.cost * 0.5;
                  // Preview new count-based goals halfway there; retain the original tier discovery rules.
                  return upgrade.requiredBuildings !== undefined
                    && Object.entries(upgradeRequirements(upgrade)).every(([id, count]) => state.buildings[id as BuildingId] >= Math.ceil(count! / 2))
                    && (upgrade.requiredUpgrades ?? []).every((id) => purchased.has(id));
                }),
              })).filter((category) => category.upgrades.length > 0).map((category) => (
                <section className="upgrade-category" key={category.id}>
                  <h3>{category.title}</h3>
                  <div className="upgrade-grid">
                    {category.upgrades.map((upgrade) => {
                      const owned = purchased.has(upgrade.id);
                      const unlocked = upgradeUnlocked(upgrade, state);
                      const affordable = unlocked && state.certificates >= upgrade.cost;
                      const revealProgress = state.totalCertificates / upgrade.cost;
                      const ceremonyUpgrade = upgrade.ceremonyToLevel !== undefined;
                      const nameRevealed = ceremonyUpgrade || owned || upgrade.rebellionStage !== undefined || revealProgress >= 0.8 || affordable;
                      const infoRevealed = ceremonyUpgrade || owned || upgrade.rebellionStage !== undefined || revealProgress >= 1 || affordable;
                      const partiallyRevealed = !nameRevealed;
                      const ceremonyPreview = ceremonyUpgrade
                        ? ceremonyMultiplier(state.certificates, upgrade.cost)
                        : 1;
                      const effect = ceremonyUpgrade
                        ? ceremonyPreview > 0
                          ? `Reset certificates · ×${ceremonyPreview} current CPS adds +${formatProductionRate(productionPerSecond * ceremonyPreview)} cert/sec until next ceremony`
                          : `Reach the ${formatNumber(upgrade.cost)} certificate minimum to earn a CPS bonus`
                        : upgrade.clickProductionShare
                        ? `+${Math.round(upgrade.clickProductionShare * 100)}% of spendable cert/sec per click`
                        : upgrade.clickerPerBuilding
                        ? `+${upgrade.clickerPerBuilding} per other building per Clicker, before multipliers`
                        : upgrade.fleetBoostPerBuilding
                        ? `+${upgrade.fleetBoostPerBuilding * 100}% fleet output per ${BUILDINGS.find((building) => building.id === upgrade.category)?.name}`
                        : upgrade.synergy
                        ? `Linked output scales with both building counts`
                        : upgrade.buildingMultiplier
                        ? `×${upgrade.buildingMultiplier} ${BUILDINGS.find((building) => building.id === upgrade.category)?.name ?? "building"} output`
                        : upgrade.multiplier
                          ? `×${upgrade.multiplier} production`
                          : `+${upgrade.clickBonus ?? 0} per click`;
                      return (
                        <button
                          className={`upgrade-tile ${upgrade.rebellionStage ? "risky-upgrade" : ""} ${owned ? "owned" : !unlocked ? "locked" : affordable ? "affordable" : partiallyRevealed ? "partial-reveal" : "near-unlock"}`}
                          key={upgrade.id}
                          onClick={() => buyUpgrade(upgrade.id)}
                          aria-disabled={owned || !unlocked}
                          aria-label={`${nameRevealed ? upgrade.name : "Unknown upgrade"}. ${infoRevealed ? `${upgrade.description} ${effect}. ` : ""}${ceremonyUpgrade ? "Minimum required" : "Cost"}: ${formatNumber(upgrade.cost)} certificates. ${owned ? "Purchased" : !unlocked ? `Locked. ${requirementText(upgrade)}` : affordable ? "Available to purchase" : "Not affordable yet"}.`}
                        >
                          <span className="upgrade-tile-icon">{partiallyRevealed ? "?" : <PixelUpgradeIcon category={upgrade.category} tier={upgrade.tier} />}</span>
                          {owned && <span className="upgrade-tile-check">✓</span>}
                          <span className="upgrade-tooltip" role="tooltip">
                            <strong>{nameRevealed ? upgrade.name : "????"}</strong>
                            {infoRevealed && <span>{upgrade.description}</span>}
                            {infoRevealed && <em>{effect}</em>}
                            {!owned && <span>{requirementText(upgrade)}</span>}
                            {upgrade.rebellionStage && <span className="risk-warning">⚠ {upgrade.rebellionStage === 1 ? "Starts" : "Escalates"} the Operatocalypse</span>}
                            <small>{owned ? "PURCHASED" : `${!unlocked ? "LOCKED · " : ""}${ceremonyUpgrade ? "MINIMUM" : "COST"} · ${formatNumber(upgrade.cost)} CERTS`}</small>
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
  return value > 0 && value < 10 ? Number(value.toFixed(2)).toString() : formatNumber(value);
}

function requirementText(upgrade: Upgrade): string {
  const requirements = Object.entries(upgradeRequirements(upgrade)).map(([id, count]) => `${count} ${BUILDINGS.find((building) => building.id === id)?.name}`);
  if (upgrade.requiredClicks) requirements.push(`${formatNumber(upgrade.requiredClicks)} manual clicks`);
  for (const id of upgrade.requiredUpgrades ?? []) requirements.push(UPGRADES.find((item) => item.id === id)?.name ?? id);
  return requirements.length > 0 ? `Requires: ${requirements.join(" · ")}` : "";
}

export default PKIdle;
