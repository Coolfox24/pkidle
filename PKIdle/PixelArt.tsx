/// <reference path="./assets.d.ts" />
import { BUILDINGS, type BuildingId } from './game';
import jellyfishCyan from './assets/jellyfish-cyan-v2.png';
import jellyfishBlue from './assets/jellyfish-blue-v2.png';
import jellyfishOrange from './assets/jellyfish-orange-v2.png';
import jellyfishRed from './assets/jellyfish-red-v2.png';
import clicker from './assets/clicker.png';
import operator from './assets/operator.png';
import onlineCa from './assets/onlineCa.png';
import restApi from './assets/restApi.png';
import scep from './assets/scep.png';
import cmpv2 from './assets/cmpv2.png';
import autoEnrollment from './assets/autoEnrollment.png';
import est from './assets/est.png';
import acme from './assets/acme.png';
import cmpv3 from './assets/cmpv3.png';
import k8sCertManager from './assets/k8sCertManager.png';
import certificate from './assets/certificate.png';
import signingKey from './assets/signing-key.png';

const buildings: Partial<Record<BuildingId, string>> = { clicker, operator, onlineCa, restApi, scep, cmpv2, autoEnrollment, est, acme, cmpv3, k8sCertManager };

export function PixelBuildingIcon({ id }: { id: BuildingId }) {
  if (!buildings[id]) return <span className="future-building-icon" aria-hidden="true">{BUILDINGS.find((building) => building.id === id)?.icon}</span>;
  return <img className="pixel-building-icon" src={buildings[id]} alt="" draggable={false} />;
}
export function PixelOperatorSprite({ className = 'pixel-operator-sprite' }: { className?: string }) {
  return <img className={className} src={operator} alt="" draggable={false} />;
}
export function PixelCertificate() {
  return <img className="pixel-certificate-icon" src={certificate} alt="Certificate" draggable={false} />;
}
const jellyfishPalettes = [jellyfishCyan, jellyfishBlue, jellyfishBlue, jellyfishOrange, jellyfishRed, jellyfishRed];

export function PixelJellyfish({ caLevel = 0 }: { caLevel?: number }) {
  const sprite = jellyfishPalettes[Math.max(0, Math.min(jellyfishPalettes.length - 1, caLevel))];
  return <span className="pixel-jellyfish" role="img" aria-label="Animated pixel art jellyfish" style={{ backgroundImage: `url(${sprite})` }} />;
}
export function PixelUpgradeIcon({ category, tier = 1 }: { category: 'general' | BuildingId; tier?: 1 | 2 | 3 }) {
  if (category !== 'general' && !buildings[category]) return <PixelBuildingIcon id={category} />;
  return <img className={`pixel-upgrade-icon sprite-tier-${tier}`} src={category === 'general' ? signingKey : buildings[category]} alt="" draggable={false} />;
}
