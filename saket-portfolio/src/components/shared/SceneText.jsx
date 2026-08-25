import useInView from "../../hooks/useInView";

export default function SceneText({ children, delay = 0, y = 26, style }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        filter: inView ? "blur(0px)" : "blur(8px)",
        transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 1s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
