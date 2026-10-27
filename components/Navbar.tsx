"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const ids = navItems.map((item) => item.href.slice(1));
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = id;
      }
      setActive(current);
      setScrolled(window.scrollY > 20);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="nav-wrap">
      <nav className="nav-pill" data-scrolled={scrolled}>
        {/* Logo */}
        <a href="#" onClick={handleNavClick} className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span>
            Kuldeep<span className="text-violet-500"> </span>Yadav
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="nav-link"
              data-active={active === item.href.slice(1)}
            >
              {item.name}
            </a>
          ))}

          <span className="ml-2">
            <ThemeToggle />
          </span>

          {/* <a
            href="/Vivek_Namdev_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:border-violet-500 hover:bg-violet-50 dark:border-zinc-700 dark:text-white dark:hover:bg-violet-500/10"
          >
            Resume ↗
          </a> */}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            className="icon-btn"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
          >
            <span className="text-xl leading-none">{isOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="mobile-menu md:hidden" data-open={isOpen}>
        <div className="flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={handleNavClick}
              className="m-link"
            >
              {item.name}
            </a>
          ))}

          <a
            href="/Vivek_Namdev_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavClick}
            className="m-cta"
          >
            Resume ↗
          </a>
        </div>
      </div>
    </header>
  );
}
