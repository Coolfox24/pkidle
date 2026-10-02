import type { BuildingId } from "./game";

const buildingSprites: Record<BuildingId, string[]> = {
  clicker: ["c.......", "cc......", "cwc.....", "cwwc....", "cwwwc...", "cwwwwc..", ".cwwwwc.", "..cccc.."],
  operator: ["................", ".......wwww.....", "......wwwwww....", "......wwkkww....", ".......wkkw.....", ".......cccc.....", "....ccccccccc...", "...cccccccccc...", "..cc.cccccccc...", ".cc...cccccc....", "cc.....cc.......", "........cc......", ".......cc.......", "......cc........", "....cc..cc......", "...cc....cc....."],
  onlineCa: ["..kkkk..", ".k....k.", ".k.ww.k.", ".kkkkkk.", ".k.ww.k.", ".k....k.", ".kkkkkk.", "........"],
  restApi: ["...bbbb.", "..b...b.", ".bbbbbb.", ".b....b.", ".bbbbbb.", "..b..b..", "..b..b..", "........"],
  scep: ["...c....", "..ccc...", ".c.c.c..", "...c....", "...c....", "..ccc...", ".ccccc..", "........"],
  cmpv2: ["..pppp..", ".p....p.", ".p.ww.p.", ".p....p.", ".pppppp.", ".p.ww.p.", ".pppppp.", "........"],
  autoEnrollment: ["..gggg..", ".g....g.", ".g.ww.g.", ".g....g.", ".gggggg.", "..g..g..", "..gggg..", "........"],
  est: ["...bbbb.", "..b...b.", ".b.....b", ".bbbbbb.", "..b..b..", "..b..b..", "...bb...", "........"],
  acme: ["..gggg..", ".g....g.", "g..ss..g", "g.ss..g.", "g..ss..g", ".g....g.", "..gggg..", "........"],
  cmpv3: ["..pppp..", ".p....p.", ".p.pp.p.", ".p.pp.p.", ".p....p.", ".p.pp.p.", ".pppppp.", "........"],
  k8sCertManager: ["...pp...", "..p..p..", ".p.pp.p.", "..p..p..", "...pp...", "..p..p..", ".p....p.", "........"],
};

const colors: Record<string, string> = {
  c: "#55d9cd",
  k: "#e7bf5c",
  s: "#75b8ce",
  b: "#5795db",
  g: "#70d0a0",
  p: "#b69af4",
  r: "#dc7777",
  w: "#d8f2e8",
};

export function PixelBuildingIcon({ id }: { id: BuildingId }) {
  if (id === "operator") {
    return <PixelOperatorSprite className="pixel-building-icon" />;
  }
  return (
    <svg className="pixel-building-icon" viewBox="0 0 8 8" aria-hidden="true">
      {buildingSprites[id].flatMap((row, y) => Array.from(row).flatMap((pixel, x) =>
        pixel === "." ? [] : [<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={colors[pixel]} />],
      ))}
    </svg>
  );
}

export function PixelOperatorSprite({ className = "pixel-operator-sprite" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      {buildingSprites.operator.flatMap((row, y) => Array.from(row).flatMap((pixel, x) =>
        pixel === "." ? [] : [<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={colors[pixel]} />],
      ))}
    </svg>
  );
}

export function PixelCertificate() {
  const rows = [
    "..bbbbbb..",
    ".bwwwwwwb.",
    ".bwwwwwwb.",
    ".b..bbbwb.",
    ".bwwwwwwb.",
    ".b.wwwwwb.",
    ".bwwwwwwb.",
    "..bbbbbb..",
    "....yy....",
    "...yyyy...",
    "....rr....",
    "....rr....",
  ];
  const palette: Record<string, string> = { b: "#428bd0", w: "#e7f2ee", y: "#f2c95f", r: "#e8756b" };
  return (
    <svg className="pixel-certificate-icon" viewBox="0 0 10 12" aria-label="Certificate">
      {rows.flatMap((row, y) => Array.from(row).flatMap((pixel, x) =>
        pixel === "." ? [] : [<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[pixel]} />],
      ))}
      <rect x="2" y="3" width="5" height="1" fill="#6da8d5" />
      <rect x="2" y="5" width="4" height="1" fill="#91b9d5" />
    </svg>
  );
}

export function PixelJellyfish() {
  const rows = [
    "................",
    "......tttt......",
    "....tttttttt....",
    "...tttttttttt...",
    "..tttttttttttt..",
    ".tttttttttttttt.",
    ".tttttttttttttt.",
    "..tttttttttttt..",
    "...tttttttttt...",
    "....tttttttt....",
    "....e......e....",
    "......mm........",
    "....ll..ll..ll..",
    "...ll....ll.....",
    ".....ll....ll...",
    "................",
  ];
  const jellyColors: Record<string, string> = { t: "#56d8d0", e: "#073143", m: "#073143", l: "#31aeb8" };

  return (
    <svg className="pixel-jellyfish" viewBox="0 0 16 16" role="img" aria-label="Pixel art jellyfish">
      {rows.flatMap((row, y) => Array.from(row).flatMap((pixel, x) =>
        pixel === "." ? [] : [<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={jellyColors[pixel]} />],
      ))}
      <rect x="4" y="4" width="8" height="1" fill="#a3fff0" opacity=".7" />
      <rect x="3" y="6" width="10" height="1" fill="#86f6e8" opacity=".45" />
    </svg>
  );
}

export function PixelUpgradeIcon({ category, tier = 1 }: { category: "general" | BuildingId; tier?: 1 | 2 | 3 }) {
  const rows = category === "general"
    ? ["...ww...", "..wbbw..", ".wbbbbw.", "wbbwwbbw", "wbbwwbbw", ".wbbbbw.", "..wbbw..", "...ww..."]
    : buildingSprites[category];
  const viewSize = rows.length;
  const tone = ["#e9f1ed", "#61afe9", "#f2a15b"][tier - 1];
  return (
    <svg className="pixel-upgrade-icon" viewBox={`0 0 ${viewSize} ${viewSize}`} aria-hidden="true">
      {rows.flatMap((row, y) => Array.from(row).flatMap((pixel, x) =>
        pixel === "." ? [] : [<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={pixel === "w" ? "#fff4c4" : tone} />],
      ))}
    </svg>
  );
}
