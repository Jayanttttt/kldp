import {
  Database,
  ChartColumnStacked,
  ChartNoAxesCombined,
  SearchCode,
} from "lucide-react";

import Reveal from "@/components/Reveal";

const skillGroups = [
  {
    number: "01",
    title: "Data Analytics",
    description:
      "Mining insights from data to solve complex business problems.",
    icon: ChartColumnStacked,
    tone: "tone-cyan",
    span: "lg:col-span-7",
    skills: [
      "SQL",
      "Python",
      "R",
      "Statistics",
      "Pandas",
      "NumPy",
      "Predictive Modeling",
    ],
  },
  {
    number: "02",
    title: "Business Intelligence",
    description:
      "Creating powerful dashboards and reports for strategic decision-making.",
    icon: ChartNoAxesCombined,
    tone: "tone-violet",
    span: "lg:col-span-5",
    skills: [
      "Power BI",
      "Tableau",
      "Looker",
      "Data Visualization",
      "Report Automation",
      "KPI Tracking",
    ],
  },
  {
    number: "03",
    title: "Data Engineering & ETL",
    description:
      "Designing and managing robust data pipelines for reliable analytics.",
    icon: Database,
    tone: "tone-pink",
    span: "lg:col-span-5",
    skills: [
      "ETL",
      "Airflow",
      "dbt",
      "Redshift",
      "Snowflake",
      "BigQuery",
      "Data Modeling",
    ],
  },
  {
    number: "04",
    title: "Analytics Tools",
    description: "Utilities used to clean, analyze, and present data findings.",
    icon: SearchCode,
    tone: "tone-mint",
    span: "lg:col-span-7",
    skills: ["Excel", "Jupyter", "Git", "Anaconda", "Alteryx", "Metabase"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="mx-auto max-w-6xl px-6 py-28">
        {/* Heading */}
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Technical Skills</p>

            <h2 className="h2 mt-5">
              The tools I use
              <br />
              <span className="grad">to uncover insights.</span>
            </h2>

            <p className="lead mt-6 text-lg leading-8">
              From data cleaning and analysis to interactive dashboards and
              visualization, I use tools like SQL, Python, Excel, and Power BI
              to transform raw data into meaningful insights and support
              data-driven decision-making.
            </p>
          </div>
        </Reveal>

        {/* Skill Cards */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          {skillGroups.map((group, index) => {
            const Icon = group.icon;

            return (
              <Reveal
                key={group.number}
                delay={index * 0.08}
                className={group.span}
              >
                <div
                  data-glow
                  data-tilt
                  className={`glass ${group.tone} group h-full p-7 sm:p-8`}
                >
                  <span className="card-top" aria-hidden="true" />

                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    {/* Number */}
                    <span className="num">{group.number}</span>

                    {/* Category Icon */}
                    <div className="tile">
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="card-title mt-8 text-2xl">{group.title}</h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {group.description}
                  </p>

                  {/* Skills */}
                  <div className="mt-7 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span key={skill} className="chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom Statement */}
        <Reveal>
          <div className="quote-rail mt-12">
            <p className="text-sm leading-7 text-[var(--muted)] sm:text-base">
              I focus on understanding the problem first, then choosing the
              simplest technology that solves it effectively.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
