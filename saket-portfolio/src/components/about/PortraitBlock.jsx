import { TOKENS } from "../../theme";
import { PORTRAIT_IMG } from "../../data/assets";
import useInView from "../../hooks/useInView";
import { OrangeSphere, CircleRig, Square } from "../blueprint/Decor";

export default function PortraitBlock() {
  const [ref, inView] = useInView(0.25);
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        aspectRatio: "1 / 1.05",
      }}
    >
      <CircleRig size={560} spin style={{ left: "50%", top: "46%", transform: "translate(-50%,-50%)", maxWidth: "135%" }} />
      <OrangeSphere size={330} style={{ left: "50%", top: "46%", transform: "translate(-50%,-50%)", maxWidth: "78%" }} />
      <Square size={14} style={{ right: "4%", top: "10%" }} />
      <Square size={10} color={TOKENS.ink} style={{ left: "2%", bottom: "22%" }} />
      <img
        src={PORTRAIT_IMG}
        alt="Saket Deshmukh"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: "86%",
          transform: inView ? "translate(-50%, 0)" : "translate(-50%, 26px)",
          opacity: inView ? 1 : 0,
          filter: inView ? "blur(0px)" : "blur(8px)",
          transition: "opacity 1.6s cubic-bezier(0.16,1,0.3,1), transform 1.6s cubic-bezier(0.16,1,0.3,1), filter 1.6s ease",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 6%)",
          maskImage: "linear-gradient(to top, transparent 0%, black 6%)",
          zIndex: 2,
        }}
      />
    </div>
  );
}
