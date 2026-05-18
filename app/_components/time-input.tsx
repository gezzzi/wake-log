"use client";

export function TimeInput({
  value,
  onChange,
  disabled,
  className,
  maxHour = 29,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  className?: string;
  maxHour?: number;
}) {
  const [hPart = "", mPart = ""] = value.split(":");

  function update(newH: string, newM: string) {
    const trimH = newH.trim();
    const trimM = newM.trim();
    if (trimH === "" && trimM === "") {
      onChange("");
      return;
    }
    const hClamped = Math.max(0, Math.min(maxHour, Number(trimH || 0)));
    const mClamped = Math.max(0, Math.min(59, Number(trimM || 0)));
    onChange(
      `${String(hClamped).padStart(2, "0")}:${String(mClamped).padStart(2, "0")}`
    );
  }

  return (
    <div
      className={`flex items-center gap-1 bg-background border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
    >
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={maxHour}
        value={hPart}
        onChange={(e) => update(e.target.value, mPart)}
        disabled={disabled}
        placeholder="--"
        className="w-12 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <span className="text-muted-light">:</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={59}
        value={mPart}
        onChange={(e) => update(hPart, e.target.value)}
        disabled={disabled}
        placeholder="--"
        className="w-12 text-center bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}
