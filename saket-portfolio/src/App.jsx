import { useState, useEffect } from "react";
import { TOKENS } from "./theme";
import GridField from "./components/shared/GridField";
import GlobalStyles from "./sections/GlobalStyles";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import AboutSection from "./sections/AboutSection";
import ExperienceSection from "./sections/ExperienceSection";
import SystemsSection from "./sections/SystemsSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import ContactSection from "./sections/ContactSection";

export default function Portfolio() {
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        background: TOKENS.bg,
        minHeight: "100vh",
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: TOKENS.text,
      }}
    >
      <GridField />
      <GlobalStyles />
      <Nav navSolid={navSolid} />
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <SystemsSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}
