interface LevelColorButtonsProps {
  readonly presets: Array<{
    color: string;
    value: number;
  }>;
  readonly selectedValue: number | null;
  readonly onSelect: (value: number) => void;
}

export function LevelColorButtons({
  presets,
  selectedValue,
  onSelect,
}: LevelColorButtonsProps) {
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {presets.map((preset) => (
        <button
          key={preset.value}
          type="button"
          title={String(preset.value)}
          onClick={() => onSelect(preset.value)}
          style={{
            width: "3rem",
            height: "3rem",
            border:
              selectedValue === preset.value
                ? "3px solid aqua"
                : "1px solid var(--surface-border)",
            backgroundColor: preset.color,
            cursor: "pointer",

            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: "0.35rem",

            transition: "all 0.2s ease",
            boxShadow:
              selectedValue === preset.value
                ? "0 0 10px rgba(0,255,255,0.6)"
                : "0 2px 6px rgba(0,0,0,0.18)",
          }}
        >
          <span
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              textShadow: "0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            {preset.value}
          </span>
        </button>
      ))}
    </div>
  );
}
