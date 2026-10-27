import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="section relative overflow-hidden">
      <div className="contact-orb" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr]">
          {/* Left */}
          <Reveal>
            <div>
              <p className="eyebrow">Contact</p>

              <h2 className="h2 h2-xl mt-5">
                Let&apos;s build
                <br />
                <span className="grad">something useful.</span>
              </h2>

              <p className="lead mt-6 max-w-xl text-lg leading-8">
                Apart from Data Analytics, we provide targeted solutions in the
                IT and ITES sectors. If you need support with Web Development,
                SEO Marketing, Business datasets, or Business Consultancy, do
                not hesitate to contact us: our specialized team is ready to
                bring your projects to life!
              </p>
              <p className="lead mt-4 whitespace-pre-line">
                🚀 Ready to take on your next big project!
              </p>

              {/* Resume */}
            </div>
          </Reveal>

          {/* Right */}
          <div className="flex flex-col justify-end">
            <Reveal delay={0.1}>
              <div>
                {/* Email */}
                <a
                  href="mailto:YOUR_EMAIL@gmail.com"
                  data-glow
                  className="glass tone-cyan contact-row group"
                >
                  <div className="min-w-0">
                    <p className="fact-label">Email</p>

                    <p className="contact-value mt-2 text-base sm:text-lg">
                      yaduvanshi.kuldeep.6398@gmail.com{" "}
                    </p>
                  </div>

                  <span className="arrow">↗</span>
                </a>

                {/* GitHub */}

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/kuldeep-yadav-932095319?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-glow
                  className="glass tone-violet contact-row group"
                >
                  <div className="min-w-0">
                    <p className="fact-label">LinkedIn</p>

                    <p className="contact-value mt-2 text-base sm:text-lg">
                      linkedin.com/in/kuldeepYadav
                    </p>
                  </div>

                  <span className="arrow">↗</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-line" aria-hidden="true" />
      </div>
    </section>
  );
}
