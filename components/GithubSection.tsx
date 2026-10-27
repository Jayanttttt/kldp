const githubStats = [
  {
    value: "25+",
    label: "Repositories",
  },
  {
    value: "200+",
    label: "DSA Problems",
  },
  {
    value: "MERN",
    label: "Primary Stack",
  },
];

const featuredRepos = [
  {
    name: "Bakery-Sales-Insight",
    description:
      "An interactive sales tracking and business intelligence dashboard engineered to optimize product inventory for a local bakery shop.",
    tech: "Power BI • SQL • Advanced Excel",
    // url: "https://github.com/vivek-namdev/FullStack-EMS",
  },

  // School-Data-Model
  // A structured database model and descriptive data project analyzing student performance matrices, attendance patterns, and administrative resource metrics.
  // * SQL • Python • Pandas
  {
    name: "Cafe-KPI-Tracker",
    description:
      "A centralized transactional analytics repository designed for a local cafe to monitor peak sales hours, track customer retention parameters, and calculate average order ticket sizes.",
    tech: "Python • PostgreSQL",
    // url: "https://github.com/vivek-namdev/React-Chat",
  },
  {
    name: "School-Data-Model",
    description:
      "A structured database model and descriptive data project analyzing student performance matrices, attendance patterns, and administrative resource metrics.",
    tech: "SQL • Python • Pandas",
    // url: "https://github.com/vivek-namdev/HelpingHands-Kitchen",
  },
];

export default function GithubSection() {
  return (
    <section className="border-t border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-28">
        {/* Heading */}
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
              GitHub
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Building in
              <br />
              <span className="text-zinc-500">public.</span>
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-zinc-400">
              I use GitHub to build, experiment, document projects and
              continuously improve my development skills.
            </p>

            <a
              href="https://github.com/vivek-namdev"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-500/10"
            >
              Visit GitHub
              <span>↗</span>
            </a>
          </div>

          {/* Profile */}
          <div className="rounded-3xl border border-zinc-800 bg-[#0d0d0d] p-7 md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">
                  github.com/vivek-namdev
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  Full-Stack MERN Developer
                </p>
              </div>

              <span className="w-fit rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs text-green-400">
                Open to Opportunities
              </span>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 divide-x divide-zinc-800 border-y border-zinc-800">
              {githubStats.map((stat) => (
                <div key={stat.label} className="px-4 py-6 text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>

                  <p className="mt-2 text-xs text-zinc-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Profile Links */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://github.com/vivek-namdev"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                GitHub Profile ↗
              </a>

              <a
                href="https://leetcode.com/u/viveknamdev03/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
              >
                LeetCode Profile ↗
              </a>
            </div>
          </div>
        </div>

        {/* Featured repositories */}
        <div className="mt-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                Selected Repositories
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-white">
                Some of the work behind the portfolio.
              </h3>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featuredRepos.map((repo) => (
              <a
                key={repo.name}
                // href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-zinc-800 bg-[#0d0d0d] p-6 transition duration-500 hover:-translate-y-1 hover:border-zinc-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-lg font-semibold text-white">
                    {repo.name}
                  </h4>

                  {/* <span className="text-zinc-600 transition group-hover:text-violet-400">
                    ↗
                  </span> */}
                </div>

                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  {repo.description}
                </p>

                <p className="mt-6 text-xs text-violet-400">{repo.tech}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-10 border-l border-violet-500/50 pl-5">
          <p className="text-sm leading-7 text-zinc-500">
            Explore my repositories to see the code, architecture and
            implementation behind the projects featured above.
          </p>
        </div>
      </div>
    </section>
  );
}
