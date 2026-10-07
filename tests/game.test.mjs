import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Use the project's existing compiler: no test runner dependency or emitted files.
const source = await readFile(new URL("../PKIdle/game.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
const game = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const { BUILDINGS, UPGRADES, calculateEconomy, createInitialState, restoreGame, upgradeUnlocked, marginalProduction, advanceEconomy, auditRogueQueues, truceCost } = game;
const upgrade = (id) => UPGRADES.find((item) => item.id === id);
const scenario = (buildings = {}, upgrades = [], extra = {}) => ({ ...createInitialState(), caLevel: 5, buildings: { ...createInitialState().buildings, ...buildings }, upgrades, ...extra });
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * 1e-10, `${actual} != ${expected}`);

test("catalog has unique identifiers, valid links and positive prices", () => {
  assert.equal(new Set(BUILDINGS.map((item) => item.id)).size, BUILDINGS.length);
  assert.equal(new Set(UPGRADES.map((item) => item.id)).size, UPGRADES.length);
  for (const item of UPGRADES) {
    assert.ok(Number.isFinite(item.cost) && item.cost > 0, item.id);
    assert.ok(item.name && item.description, item.id);
    assert.ok(item.category === "general" || BUILDINGS.some((building) => building.id === item.category));
    for (const id of item.requiredUpgrades ?? []) assert.ok(upgrade(id), id);
    for (const id of Object.keys(item.requiredBuildings ?? {})) assert.ok(BUILDINGS.some((building) => building.id === id));
  }
});

test("original building costs and production stay intact", () => {
  assert.deepEqual(BUILDINGS.slice(0, 11).map(({ baseCost, baseProduction }) => [baseCost, baseProduction]), [
    [15, 0.1], [100, 1], [1100, 8], [12000, 47], [130000, 260], [1400000, 1400], [20000000, 7800], [330000000, 44000], [5100000000, 260000], [75000000000, 1600000], [1000000000000, 10000000],
  ]);
  close(calculateEconomy(scenario({ clicker: 25, operator: 25 }, ["clickerFasterFinger", "clickerTwoFinger", "clickerMechanical", "operatorPayrise", "operatorOvertime", "operatorForcedWork"])).productionPerSecond, 220);
});

test("existing saves gain new fields without triggering a rebellion", () => {
  const saved = { certificates: 1234, totalCertificates: 5678, clicks: 20, caLevel: 3, elapsed: 12, ceremonyProductionBonus: 42, buildings: { operator: 25, clicker: 10 }, upgrades: ["operatorForcedWork"] };
  const restored = restoreGame(saved);
  assert.equal(restored.certificates, 1234);
  assert.equal(restored.ceremonyProductionBonus, 42);
  assert.equal(restored.elapsed, 12);
  assert.equal(restored.buildings.aiCertGen, 0);
  assert.equal(restored.rogueCertificates, 0);
  assert.equal(restored.safetyCharter, false);
  assert.equal(calculateEconomy(restored).rebellionLevel, 0);
  const persisted = { ...restored, rogueCertificates: 321, truceRemaining: 18, safetyCharter: true };
  assert.deepEqual(restoreGame(JSON.parse(JSON.stringify(persisted))), persisted);
});

test("old CA migration rules remain compatible", () => {
  assert.equal(restoreGame({ upgrades: [] }).caLevel, 2);
  assert.equal(restoreGame({ upgrades: ["pqcMigration"] }).caLevel, 5);
  assert.equal(createInitialState().caLevel, 0);
});

test("upgrade gates combine both building counts, clicks and prerequisites", () => {
  assert.equal(upgradeUnlocked(upgrade("operatorAlgorithmicManagement"), scenario({ operator: 25, onlineCa: 5 })), false);
  assert.equal(upgradeUnlocked(upgrade("operatorAlgorithmicManagement"), scenario({ operator: 25, onlineCa: 4 }, ["operatorForcedWork"])), false);
  assert.equal(upgradeUnlocked(upgrade("operatorAlgorithmicManagement"), scenario({ operator: 25, onlineCa: 5 }, ["operatorForcedWork"])), true);
  assert.equal(upgradeUnlocked(upgrade("clickCps2"), scenario({}, ["clickCps1"], { clicks: 499 })), false);
  assert.equal(upgradeUnlocked(upgrade("clickCps2"), scenario({}, ["clickCps1"], { clicks: 500 })), true);
  assert.equal(upgradeUnlocked(upgrade("rsa1024Ceremony"), scenario({}, [], { caLevel: 0 })), true);
  assert.equal(upgradeUnlocked(upgrade("rsa3072Ceremony"), scenario({}, [], { caLevel: 0 })), false);
});

test("ownership milestones unlock exactly at their threshold and double output", () => {
  for (const building of BUILDINGS) {
    for (const count of [50, 100, 150, 200]) {
      const item = upgrade(`${building.id}Milestone${count}`);
      assert.equal(upgradeUnlocked(item, scenario({ [building.id]: count - 1 })), false);
      assert.equal(upgradeUnlocked(item, scenario({ [building.id]: count })), true);
      close(calculateEconomy(scenario({ [building.id]: count }, [item.id])).productionPerSecond, building.baseProduction * count * 2);
    }
  }
});

test("click shares add to 1%, 3%, then 6% without feeding back into passive output", () => {
  const base = scenario({ onlineCa: 125 });
  for (const [ids, share] of [[["clickCps1"], 0.01], [["clickCps1", "clickCps2"], 0.03], [["clickCps1", "clickCps2", "clickCps3"], 0.06]]) {
    const economy = calculateEconomy({ ...base, upgrades: ids });
    close(economy.productionPerSecond, 1000);
    close(economy.clickValue, 1 + 1000 * share);
  }
  assert.equal(calculateEconomy(scenario({}, ["clickCps1", "clickCps2", "clickCps3"])).clickValue, 1);
});

test("each non-clicker improves every clicker before output multipliers", () => {
  const economy = calculateEconomy(scenario({ clicker: 25, operator: 10, onlineCa: 5 }, ["clickerInfrastructure", "clickerFasterFinger"]));
  close(economy.unitProduction.clicker, (0.1 + 15 * 0.5) * 2);
});

test("building links improve both ends and purchase gain includes the partner", () => {
  const state = scenario({ operator: 25, onlineCa: 5 }, ["operatorSynergy"]);
  close(calculateEconomy(state).productionPerSecond, 25 * 1.25 + 40 * 1.25);
  close(marginalProduction(state, "operator"), 1.25 + 40 * 0.01);
  close(marginalProduction(state, "onlineCa"), 8 * 1.25 + 25 * 0.05);
});

test("early clickers and operators improve the newest infrastructure", () => {
  const state = scenario({ clicker: 50, operator: 50, multiverseNotary: 2 }, ["clickerFleetReview", "operatorPeerReview"]);
  assert.ok(marginalProduction(state, "clicker") > 60_000_000);
  assert.ok(marginalProduction(state, "operator") > 60_000_000);
});

test("all three rebellion stages expose the promised boost and diversion", () => {
  const ids = ["operatorAlgorithmicManagement", "operatorSleepDeprecated", "operatorRootForEveryone"];
  for (let stage = 1; stage <= 3; stage++) {
    const economy = calculateEconomy(scenario({ operator: 100, acme: 5 }, ids.slice(0, stage)));
    assert.equal(economy.rebellionLevel, stage);
    close(economy.grossProduction, (100 * 2 ** stage + 5 * 260000) * [1, 1.1, 1.25, 1.5][stage]);
    close(economy.divertedPerSecond, economy.grossProduction * [0, 0.03, 0.06, 0.1][stage]);
  }
});

test("diversion conserves production and audits return a bonus exactly once", () => {
  const state = scenario({ operator: 25, onlineCa: 5 }, ["operatorForcedWork", "operatorAlgorithmicManagement"]);
  const economy = calculateEconomy(state);
  const ticked = advanceEconomy(state, 10);
  close(ticked.certificates + ticked.rogueCertificates, economy.grossProduction * 10);
  const audited = auditRogueQueues(ticked);
  close(audited.certificates, ticked.certificates + ticked.rogueCertificates * 1.1);
  assert.equal(audited.rogueCertificates, 0);
  assert.equal(audited.totalCertificates, audited.certificates);
  assert.deepEqual(auditRogueQueues(audited), audited);
  assert.equal(state.rogueCertificates, 0);
});

test("rebellion clicks use spendable CPS and are never put in rogue queues", () => {
  const economy = calculateEconomy(scenario({ operator: 25 }, ["operatorAlgorithmicManagement", "clickCps1"]));
  close(economy.clickValue, 1 + economy.grossProduction * 0.97 * 0.01);
});

test("the safety charter removes risk and overdrive while preserving operator upgrades", () => {
  const state = scenario({ operator: 25, onlineCa: 5 }, ["operatorForcedWork", "operatorAlgorithmicManagement"], { safetyCharter: true, rogueCertificates: 100 });
  const economy = calculateEconomy(state);
  assert.equal(economy.rebellionActive, false);
  close(economy.grossProduction, 25 * 4 + 5 * 8);
  assert.equal(economy.divertedPerSecond, 0);
  close(auditRogueQueues(state).certificates, 110);
});

test("a tick crossing truce expiry uses both production rates", () => {
  const state = scenario({ operator: 25 }, ["operatorAlgorithmicManagement"], { truceRemaining: 1 });
  const calm = calculateEconomy(state);
  const active = calculateEconomy({ ...state, truceRemaining: 0 });
  const ticked = advanceEconomy(state, 3);
  close(ticked.certificates, calm.productionPerSecond + active.productionPerSecond * 2);
  close(ticked.rogueCertificates, active.divertedPerSecond * 2);
  assert.equal(ticked.truceRemaining, 0);
  assert.equal(truceCost(state), Math.ceil(calm.grossProduction * 30));
});

test("a tick crossing the cryptographic deadline applies the penalty at the boundary", () => {
  const state = scenario({ operator: 100 }, [], { caLevel: 0, elapsed: 179, ceremonyProductionBonus: 20 });
  const ticked = advanceEconomy(state, 2);
  close(ticked.certificates, 120 + 12);
  assert.equal(ticked.elapsed, 180);
  assert.equal(calculateEconomy(ticked).clickValue, 1);
});

test("truce and cryptographic deadline can expire in the same tick", () => {
  const state = scenario({ operator: 100 }, ["operatorAlgorithmicManagement"], { caLevel: 0, elapsed: 179, truceRemaining: 2 });
  const ticked = advanceEconomy(state, 3);
  close(ticked.certificates, 200 + 20 + 200 * 0.1 * 1.1 * 0.97);
  close(ticked.rogueCertificates, 200 * 0.1 * 1.1 * 0.03);
  assert.equal(ticked.truceRemaining, 0);
});

test("ceremony's fixed bonus does not grow with building overdrive", () => {
  const economy = calculateEconomy(scenario({ operator: 1 }, ["operatorAlgorithmicManagement"], { ceremonyProductionBonus: 100 }));
  close(economy.grossProduction, 2.2 + 100);
});
