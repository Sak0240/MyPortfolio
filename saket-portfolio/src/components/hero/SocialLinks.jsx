import { TOKENS } from "../../theme";
import { GITHUB_REPO_URL } from "../../data/links";
import useInView from "../../hooks/useInView";

const SOCIAL_ICONS = [
  {
    href: GITHUB_REPO_URL,
    external: true,
    label: "GitHub",
    path: (
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.4 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    ),
  },
  {
    href: "https://linkedin.com/in/saket-deshmukh",
    external: true,
    label: "LinkedIn",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-3.5c0-1.4 1-2.5 2.3-2.5s2.2 1 2.2 2.5v3.5M11.5 10.5v6" />
      </>
    ),
  },
  {
    href: "mailto:heyiamsaket@gmail.com",
    external: false,
    label: "Email",
    path: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
];

function SocialIconLink({ s, i, animated, isSequenced }) {
  const [ref, inView] = useInView(0.5);
  const flicker = isSequenced ? animated : inView;
  return (
    <a
      ref={ref}
      href={s.href}
      target={s.external ? "_blank" : undefined}
      rel={s.external ? "noreferrer" : undefined}
      aria-label={s.label}
      className="dock-link"
      style={{
        color: TOKENS.textFaint,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isSequenced ? (animated ? 1 : 0) : 1,
        transform: isSequenced ? (animated ? "translateY(0)" : "translateY(8px)") : "none",
        transition: isSequenced
          ? `color 0.2s ease, opacity 0.5s ease ${1.1 + i * 0.12}s, transform 0.5s ease ${1.1 + i * 0.12}s`
          : "color 0.2s ease",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: flicker ? "logoFlicker 2.4s steps(8, end) 1" : "none" }}
      >
        {s.path}
      </svg>
    </a>
  );
}

export function SocialLinks({ animated }) {
  const isSequenced = animated !== undefined;
  return (
    <>
      {SOCIAL_ICONS.map((s, i) => (
        <SocialIconLink key={s.label} s={s} i={i} animated={animated} isSequenced={isSequenced} />
      ))}
    </>
  );
}

export function MobileSocialDock() {
  return (
    <div className="social-dock" style={{ flexDirection: "row", alignItems: "center", gap: 20, marginTop: 40 }}>
      <SocialLinks />
    </div>
  );
}
