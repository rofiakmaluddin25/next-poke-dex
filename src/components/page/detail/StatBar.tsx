const STAT_BAR_COLORS = [
  "#EF4444", // HP – red
  "#F97316", // ATK – orange
  "#EAB308", // DEF – yellow
  "#22C55E", // SP.ATK – green
  "#3B82F6", // SP.DEF – blue
  "#EC4899", // SPD – pink
];

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

export default function StatBar({ label, value, max }: StatBarProps) {
  const colorMap: Record<string, string> = {
    HP: STAT_BAR_COLORS[0],
    ATK: STAT_BAR_COLORS[1],
    DEF: STAT_BAR_COLORS[2],
    "SP. ATK": STAT_BAR_COLORS[3],
    "SP. DEF": STAT_BAR_COLORS[4],
    SPD: STAT_BAR_COLORS[5],
  };
  const barColor = colorMap[label] ?? "#6890F0";
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="grid grid-cols-[64px_40px_1fr_44px] items-center gap-3">
      <span className="text-xs font-semibold text-white/50">{label}</span>
      <span className="text-right text-sm font-bold text-white">{value}</span>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-right text-[11px] text-white/30">{max}</span>
    </div>
  );
}
