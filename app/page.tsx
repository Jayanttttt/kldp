import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import BackToTop from "@/components/BackToTop";
import Ambient from "@/components/Ambient";
import { AnimatedIntro } from "@/intro";
import CursorTrail from "./CursorTrail";

/* Intro recoloured to match the neon theme (text/timing stay at the defaults). */
const introTheme = {
  colors: {
    background: "#05060f",
    primary: "#8b5cf6", // violet petals
    secondary: "#22d3ee", // cyan petals
    text: "#eef1ff",
    accent: "#f472b6",
  },
  typography: { fontFamily: "inherit" },
  animation: { accentRatio: 0.12 },
};

export default function Home() {
  return (
    <main className="site">
      <Ambient />
      <CursorTrail />
      <AnimatedIntro config={introTheme} />
      <Navbar />
      <Hero />
      {/* <FeaturedProjects /> */}
      <Skills />
      <About />
      <Achievements />
      {/* <GithubSection /> */}
      <Contact />
      <BackToTop />
    </main>
  );
}
