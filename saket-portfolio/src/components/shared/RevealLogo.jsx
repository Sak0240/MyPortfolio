import useInView from "../../hooks/useInView";

// invert: for logos that are white artwork (they'd vanish on the light paper background)
export default function RevealLogo({ src, alt, invert = false }) {
  const [ref, inView] = useInView(0.5);
  return (
    <span
      ref={ref}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 20,
        marginBottom: 2,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          height: 18,
          display: "block",
          filter: invert ? "brightness(0)" : "none",
          animation: inView ? "logoFlicker 2.4s steps(8, end) 1" : "none",
          opacity: inView ? 1 : 0,
        }}
      />
    </span>
  );
}
