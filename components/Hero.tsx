"use client";

import { motion } from "framer-motion";
import DataField from "@/components/DataField";

export default function Hero() {
  return (
    <section className="hero relative overflow-hidden pt-24">
      {/* Background: data constellation + glow */}
      <DataField />
      <div className="hero-glow" aria-hidden="true" />

      <div className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-14 px-6 py-16 sm:py-20 lg:grid-cols-[1.25fr_0.85fr] lg:gap-12">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="status-row mb-6 sm:mb-7">
            <span className="dot-live" />

            <span className="hero-kicker">
              Analytics Specialist | Bridging Technology & Data Insights
            </span>
          </div>

          <h1 className="h1 max-w-3xl">
            Transforming chaotic variables,
            <br />
            <span className="grad">into predictable growth.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-[var(--muted)] sm:mt-8 sm:text-lg sm:leading-8">
            I&apos;m Kuldeep Yadav, an Analyst operating at the convergence of
            advanced software engineering and data intelligence.
          </p>

          <div className="mt-8 sm:mt-9">
            <div className="hero-note">
              <span className="dot-solid" />
              Open to project-based roles and strategic data partnerships.
            </div>
          </div>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:ml-auto"
        >
          <div className="orbit" aria-hidden="true">
            <span className="ring" />
            <span className="ring r2" />
          </div>

          <div className="term-wrap">
            <div className="term">
              {/* Terminal header */}
              <div className="term-head">
                <span
                  className="term-dot"
                  style={{ background: "rgba(255,95,86,.85)" }}
                />
                <span
                  className="term-dot"
                  style={{ background: "rgba(255,189,46,.85)" }}
                />
                <span
                  className="term-dot"
                  style={{ background: "rgba(39,201,63,.85)" }}
                />

                <span className="term-title">kuldeep@portfolio ~</span>
              </div>

              {/* Terminal content */}
              <div className="term-body space-y-6">
                <div className="t-line" style={{ "--i": 0 } as React.CSSProperties}>
                  <p className="t-prompt">$ whoami</p>
                  <p className="mt-1">kuldeep@analyst</p>
                </div>

                <div className="t-line" style={{ "--i": 1 } as React.CSSProperties}>
                  <p className="t-prompt">$ stack</p>

                  <div className="mt-3 space-y-3">
                    {[
                      ["SQL", "██████████"],
                      ["PowerBI", "█████████░"],
                      ["DaxStudio", "████████░░"],
                      ["Python", "█████████░"],
                    ].map(([name, bar], i) => (
                      <div
                        key={name}
                        className="flex items-center justify-between gap-4"
                      >
                        <span>{name}</span>
                        <span
                          className="t-bar"
                          style={{ "--i": i + 2 } as React.CSSProperties}
                        >
                          {bar}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="t-line" style={{ "--i": 4 } as React.CSSProperties}>
                  <p className="t-prompt">$ status</p>

                  <p className="mt-1">
                    <span className="t-ok">OPEN_TO_WORK</span>
                    <span className="t-prompt">=</span>
                    <span>true</span>
                  </p>
                </div>

                <div className="t-line" style={{ "--i": 5 } as React.CSSProperties}>
                  <span className="caret">▋</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="scroll-cue hidden sm:block" aria-hidden="true" />
    </section>
  );
}
