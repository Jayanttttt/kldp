"use client";

import Reveal from "@/components/Reveal";

const achievements = [
  {
    number: "01",
    icon: "🏆",
    tone: "tone-cyan",
    category: "BUSINESS INTELLIGENCE",
    title: "Local Business KPI Dashboards",
    subtitle: "Independent Project Creator",
    description:
      "Engineered interactive reporting dashboards for local establishments (a bakery, a cafe, and a restaurant) to monitor financial health. Cleaned messy transactional records, mapped out seasonal sales trends, and calculated key metrics like average ticket size, customer retention rates, and peak operating hours to optimize inventory waste.",
  },

  {
    number: "02",
    icon: "💻",
    tone: "tone-violet",
    category: "DATA MODELING",
    title: "School Operations Dataset Analysis",
    subtitle: "Predictive Analytics Project",
    description:
      "Compiled, structured, and analyzed an education dataset focusing on student performance and administrative metrics. Built data models to track student attendance patterns, forecast resource allocation needs, and isolate early warning metrics for academic risk intervention.",
    // type: "leetcode",
    // link: "https://leetcode.com/u/viveknamdev03/",
    // linkText: "View LeetCode",
    // stats: ["200+ Problems"],
  },
  {
    number: "03",
    icon: "👥",
    tone: "tone-pink",
    category: "COLLEGE LEADERSHIP",
    title: "Student Coordinator — Citronics Tech Fest",
    subtitle: "Event Operations",
    description:
      "Served as a core student organizer for the Citronics festival, managing volunteer schedules, coordinating logistics between different technical tracks, and helping streamline communication across college departments.",
    // type: "leadership",
    // link: "#contact",
    // linkText: "Get in Touch",
  },
];

export default function Achievements() {
  return (
    <section className="section">
      <div className="mx-auto max-w-6xl px-6 py-28">
        {/* Heading */}
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Achievements & Leadership</p>

            <h2 className="h2 mt-5">
              More than
              <br />
              <span className="grad">just data patterns.</span>
            </h2>

            <p className="lead mt-6 text-lg leading-8">
              Highlights from real-world analytics projects, interactive
              dashboard engineering, and operational management.
            </p>
          </div>
        </Reveal>

        {/* Achievement Cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {achievements.map((achievement, index) => (
            <Reveal
              key={achievement.number}
              delay={index * 0.09}
              className="h-full"
            >
              <article
                data-glow
                data-tilt
                className={`glass ${achievement.tone} group flex h-full min-h-105 flex-col p-7 sm:p-8`}
              >
                <span className="card-top" aria-hidden="true" />

                {/* Top Row */}
                <div className="flex items-start justify-between">
                  <span className="num">{achievement.number}</span>

                  <span className="tile">{achievement.icon}</span>
                </div>

                {/* Content */}
                <div className="mt-10">
                  <p className="mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--dim)]">
                    {achievement.category}
                  </p>

                  <h3 className="card-title mt-3 text-2xl leading-tight">
                    {achievement.title}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-[var(--c)]">
                    {achievement.subtitle}
                  </p>

                  <p className="mt-5 leading-7 text-[var(--muted)]">
                    {achievement.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
