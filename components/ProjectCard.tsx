import Image from "next/image";

type Project = {
  number: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  liveUrl: string;
  githubUrl: string;
};

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-800 bg-[#0d0d0d] transition-all duration-500 hover:-translate-y-2 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/40">
      {/* Project Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950">
        <Image
          src={project.image}
          alt={`${project.title} project screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition duration-700 group-hover:scale-[1.02]"
        />

        {/* Subtle overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-7 md:p-8">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
            Featured Project
          </p>

          <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {project.title}
          </h3>
        </div>

        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 transition group-hover:border-zinc-700"
            >
              {technology}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-2 text-sm font-medium text-white"
          >
            Live Demo
            <span className="transition-transform duration-300 group-hover/link:translate-x-1">
              ↗
            </span>
          </a>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-white"
          >
            GitHub
            <span>↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}