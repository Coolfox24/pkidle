import type { CSSProperties } from 'react';
import { BUILDINGS, type BuildingId } from './game';
import { PixelBuildingIcon, PixelCertificate } from './PixelArt';

const residents = new Set<BuildingId>(['clicker', 'autoEnrollment', 'acme']);

export function OceanHabitat({ buildings }: { buildings: Record<BuildingId, number> }) {
  const owned = BUILDINGS.filter((building) => building.id !== 'operator' && buildings[building.id] > 0);
  return (
    <div className="ocean-habitat" aria-hidden="true">
      {owned.flatMap((building, index) => {
        const mobile = residents.has(building.id);
        const count = mobile ? Math.min(3, 1 + Math.floor(Math.log2(buildings[building.id]) / 3)) : 1;
        return Array.from({ length: count }, (_, slot) => (
          <span key={`${building.id}-${slot}`} className={`ocean-resident ${mobile ? 'swimming' : 'reef-station'}`} style={{
            left: `${8 + (index * 29 + slot * 41) % 78}%`,
            top: `${mobile ? 17 + (index * 11 + slot * 23) % 50 : 68 + (index % 3) * 8}%`,
            '--pkidle-resident-delay': `${-(index * 3 + slot * 7)}s`,
            '--pkidle-resident-duration': `${19 + (index % 5) * 4}s`,
          } as CSSProperties}>
            <PixelBuildingIcon id={building.id} />
            <span className="resident-certificate"><PixelCertificate /></span>
          </span>
        ));
      })}
    </div>
  );
}
