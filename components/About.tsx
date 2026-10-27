import Reveal from "@/components/Reveal";

const journey = [
  {
    number: "01",
    tone: "tone-cyan",
    live: true,
    title: "Started in Data Analytics",
    body: "Began by mastering the fundamentals of data exploration, starting with advanced Excel models before transitioning into database programming with SQL and statistical computation using Python.",
  },
  {
    number: "02",
    tone: "tone-violet",
    live: false,
    title: "Expanded into Frontend & BI",
    body: "Developed a solid foundational baseline in frontend fundamentals (HTML5, CSS3, and JavaScript) to understand web data structures, leveraging this knowledge to engineer dynamic, consumer-facing reporting frameworks and automated dashboards in Power BI.",
  },
  {
    number: "03",
    tone: "tone-pink",
    live: false,
    title: "Joined a Multi-National Corporation (MNC)",
    body: "Transitioned into a professional corporate environment, deploying production-scale data pipelines, managing enterprise cloud warehouses, and collaborating with cross-functional teams to translate complex business metrics into clear strategic decisions.",
  },
  {
    number: "04",
    tone: "tone-mint",
    live: true,
    title: "Skilling Up Day by Day",
    body: "Continuously upgrading technical capabilities in predictive data modeling, advanced big data infrastructures, and specialized automation tools to deliver deeper analytical impact and drive high-performing data teams forward.",
  },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="mx-auto max-w-6xl px-6 py-28">
        {/* Section heading */}
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">About Me</p>

            <h2 className="h2 mt-5">
              An analyst
              <br />
              <span className="grad">who likes to uncover insights.</span>
            </h2>
          </div>
        </Reveal>

        {/* Main content */}
        <div className="mt-16 grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Story */}
          <Reveal>
            <div>
              <p className="display text-xl leading-9 text-[var(--fg)] sm:text-2xl sm:leading-10">
                I&apos;m Kuldeep Yadav, a Data Analyst focused on parsing
                complex datasets, building interactive tracking tools, and
                turning raw numbers into clear, actionable business strategies.
              </p>

              <p className="mt-6 leading-8 text-[var(--muted)]">
                I enjoy working across data extraction and visualization, from
                writing optimized queries with SQL to engineering automated
                reporting pipelines and high-impact dashboards using Power BI
                and Tableau.
              </p>

              <p className="mt-6 leading-8 text-[var(--muted)]">
                I&apos;m particularly interested in solving real-world
                operational problems, discovering hidden trends through
                quantitative projects, and continuously improving how
                organizations apply data to drive strategic decisions.
              </p>

              {/* CTA */}
              <div className="mt-9">
                <a href="#contact" className="cta">
                  Let&apos;s connect
                  <span>↗</span>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Quick facts */}
          <div className="grid gap-4">
            <Reveal delay={0.05}>
              <div data-glow className="glass tone-cyan p-6" style={{ "--r": "20px" } as React.CSSProperties}>
                <span className="card-top" aria-hidden="true" />
                <p className="fact-label">Focus</p>

                <p className="fact-value mt-3 text-lg">Data Analytics & BI</p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div data-glow className="glass tone-violet p-6" style={{ "--r": "20px" } as React.CSSProperties}>
                <span className="card-top" aria-hidden="true" />
                <p className="fact-label">Core Stack</p>

                <p className="fact-value mt-3 text-lg">
                  SQL • Power BI • Python
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.19}>
              <div data-glow className="glass tone-pink p-6" style={{ "--r": "20px" } as React.CSSProperties}>
                <span className="card-top" aria-hidden="true" />
                <p className="fact-label">Based In</p>

                <p className="fact-value mt-3 text-lg">India</p>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <div data-glow className="glass tone-mint p-6" style={{ "--r": "20px" } as React.CSSProperties}>
                <span className="card-top" aria-hidden="true" />
                <p className="fact-label">Status</p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="dot-live" />

                  <span className="fact-value text-lg">
                    Open to Opportunities
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Journey */}
        <div className="mt-28">
          <Reveal>
            <p className="eyebrow">Developer Journey</p>
          </Reveal>

          <div className="timeline mt-12">
            {journey.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.06}>
                <div className={`tl-item ${step.tone}`}>
                  <span
                    className={`tl-node ${step.live ? "is-live" : ""}`}
                    aria-hidden="true"
                  />

                  <p className="num">{step.number}</p>

                  <h3 className="card-title mt-2 text-xl sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
