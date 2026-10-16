import { TOKENS, FONTS } from "../../theme";

/**
 * Blueprint-style display lettering: every glyph is drawn as an outlined letter that
 * "fills in" with hatching (or solid ink / orange), with drafting guides and
 * measurement nodes around it.
 *
 * words: [{ text: "AI", tone: "orange", pattern: ["hatch", "solid"] }, ...]
 * pattern cycles per letter: "hatch" | "solid" | "outline"
 */
export default function BlueprintTitle({ words, fontSize = "clamp(40px, 8.6vw, 136px)", baseDelay = 0.2 }) {
  let letterIndex = 0;
  return (
    <div
      className="bp-title"
      style={{
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-end",
        columnGap: "0.28em",
        rowGap: "0.12em",
        fontSize,
        lineHeight: 0.9,
        fontFamily: FONTS.display,
        fontWeight: 800,
        fontVariationSettings: '"wdth" 112',
        textTransform: "uppercase",
        letterSpacing: "0.012em",
        color: TOKENS.ink,
      }}
    >
      {words.map((word, wi) => {
        const orange = word.tone === "orange";
        const pattern = word.pattern || ["hatch"];
        return (
          <span key={wi} className="bp-word" style={{ position: "relative", display: "inline-flex" }}>
            {/* drafting guides: cap line + baseline, with end nodes */}
            <span aria-hidden="true" className="bp-guide bp-guide-top" />
            <span aria-hidden="true" className="bp-guide bp-guide-bottom" />
            {word.text.split("").map((ch, ci) => {
              const kind = pattern[ci % pattern.length];
              const delay = baseDelay + letterIndex * 0.09;
              letterIndex += 1;
              return (
                <span
                  key={ci}
                  className="bp-letter"
                  style={{ position: "relative", display: "inline-block", animationDelay: `${delay}s` }}
                >
                  <span
                    className="bp-outline"
                    style={{
                      color: "transparent",
                      WebkitTextStroke: `max(1.5px, 0.012em) ${orange ? TOKENS.amber : TOKENS.ink}`,
                    }}
                  >
                    {ch}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`bp-fill bp-fill-${kind}${orange ? " bp-fill-orange" : ""}`}
                    style={{ animationDelay: `${delay + 0.25}s, ${delay + 1.2}s` }}
                  >
                    {ch}
                  </span>
                  {(kind === "outline" || ci % 3 === 0) && (
                    <>
                      <span aria-hidden="true" className="bp-node bp-node-tl" />
                      <span aria-hidden="true" className="bp-node bp-node-bl" />
                    </>
                  )}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}
