"use client";

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;

  placeholder?: string;
  maxChars?: number;
  minHeight?: number; // px
};

export default function TextareaField({
  label,
  value,
  onChange,
  placeholder = "",
  maxChars,
  minHeight = 120,
}: TextareaFieldProps) {
  const remaining =
    typeof maxChars === "number" ? maxChars - value.length : null;

  return (
    <label className="block space-y-1">
      {/* Label */}
      <div className="text-sm font-medium text-zinc-800">
        {label}
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => {
          if (maxChars && e.target.value.length > maxChars) return;
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black/20"
        style={{ minHeight }}
      />

      {/* Character counter */}
      {maxChars && (
        <div
          className={`text-xs text-right ${
            remaining !== null && remaining < 10
              ? "text-red-500"
              : "text-zinc-500"
          }`}
        >
          {remaining} characters remaining
        </div>
      )}
    </label>
  );
}
