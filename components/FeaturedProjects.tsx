import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    number: "01",
    title: "FoodBridge",
    description:
      "A full-stack food donation and distribution platform connecting donors with NGOs and streamlining donation claims, pickup and delivery workflows.",
    technologies: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "Redux",
    ],
    image: "/projects/foodbridge.png",
    liveUrl: "https://food-bridge-neon-ten.vercel.app/landing",
    githubUrl: "https://github.com/vivek-namdev/HelpingHands-Kitchen",
  },
  {
    number: "02",
    title: "ReactChat",
    description:
      "A real-time chat application featuring instant messaging and location sharing using Socket.IO and WebSocket communication.",
    technologies: ["React", "Tailwind CSS", "Socket.IO", "WebSocket"],
    image: "/projects/reactchat.png",
    liveUrl: "https://reactchatio.vercel.app/",
    githubUrl: "https://github.com/vivek-namdev/React-Chat",
  },
  {
    number: "03",
    title: "FullStack EMS",
    description:
      "A MERN-based employee management system with authentication, employee workflows and CRUD operations.",
    technologies: ["MongoDB", "Express.js", "React", "Node.js", "JWT"],
    image: "/projects/ems.png",
    liveUrl: "https://fullstack-ems-o9r6.vercel.app/login",
    githubUrl: "https://github.com/vivek-namdev/FullStack-EMS",
  },
];

export default function FeaturedProjects() {
  return (
    <section id="work" className="border-t border-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-400">
            Selected Work
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Projects that show
            <br />
            <span className="text-zinc-500">how I build.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            A selection of applications I&apos;ve designed and built using
            modern web technologies.
          </p>
        </div>

        <Reveal>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={index === 0 ? "lg:col-span-2" : ""}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}