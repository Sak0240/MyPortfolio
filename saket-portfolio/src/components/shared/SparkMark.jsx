import { TOKENS } from "../../theme";

export default function SparkMark({ size = 18, color }) {
  const c = color || TOKENS.text;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 L12 22 M2 12 L22 12 M5.5 5.5 L11 11 M18.5 18.5 L15 15" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
