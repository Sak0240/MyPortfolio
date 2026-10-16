import { TOKENS } from "../../theme";

export default function ScoreBar({ value }) {
  return (
    <div
      style={{
        width: 60,
        height: 4,
        background: "rgba(20,20,20,0.1)",
        borderRadius: 2,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: `${Math.round(value * 100)}%`,
          height: "100%",
          background: TOKENS.teal,
          borderRadius: 2,
        }}
      />
    </div>
  );
}
