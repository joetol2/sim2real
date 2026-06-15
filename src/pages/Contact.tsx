import { useState } from "react";
import PageNav from "@/components/PageNav";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function Section({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section className="py-20 sm:py-28 border-t border-border">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto px-8 sm:px-12 lg:px-20 transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const mailto = `mailto:hello@sim2real.bot?subject=Sim2Real inquiry from ${data.get("company") || data.get("name")}&body=${encodeURIComponent(
      [
        `Name: ${data.get("name")}`,
        `Company: ${data.get("company")}`,
        `Email: ${data.get("email")}`,
        `Robot / task: ${data.get("robot")}`,
        `Current bottleneck: ${data.get("bottleneck")}`,
        `Website: ${data.get("website")}`,
      ].join("\n\n")
    )}`;

    window.location.href = mailto;
    setSubmitted(true);
  }

  const inputClass =
    "w-full bg-white/5 border border-white/15 rounded-md px-4 py-3 text-sm text-foreground placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors duration-200";

  return (
    <main className="min-h-screen">
      <PageNav />

      {/* Hero */}
      <section className="py-20 sm:py-28 px-8 sm:px-12 lg:px-20">
        <div className="max-w-4xl">
          <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Get in touch</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold tracking-tight leading-[1.1] mb-6">
            Let&#39;s talk about your deployment bottleneck
          </h1>
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
            If your team is using simulation but still spending too much time on hardware trial and error, we&#39;d like to hear what you are working on.
          </p>
        </div>
      </section>

      {/* Form section */}
      <Section>
        <div className="max-w-4xl">
          <p className="text-sm font-heading tracking-[0.3em] uppercase text-muted-foreground mb-6">Reach out if you are</p>
          <ul className="space-y-3 text-base text-white/70 leading-relaxed mb-12">
            {[
              "Training robot control policies in simulation",
              "Struggling with sim-to-real transfer",
              "Trying to reduce hardware testing cycles",
              "Exploring a more scalable path to synthetic training data",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          {submitted ? (
            <p className="text-base text-white/80">Thanks, your message is on its way. We&#39;ll be in touch.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Name</label>
                  <input name="name" required placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Company</label>
                  <input name="company" placeholder="Company name" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Work email</label>
                <input name="email" type="email" required placeholder="you@company.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">What kind of robot or task are you working on?</label>
                <input name="robot" placeholder="e.g. manipulation, locomotion, pick-and-place..." className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Where is the current bottleneck?</label>
                <textarea name="bottleneck" rows={4} placeholder="Describe the challenge you&#39;re running into..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Website or project link</label>
                <input name="website" type="url" placeholder="https://" className={inputClass} />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-[#012b62] text-sm font-heading font-semibold tracking-wide uppercase rounded hover:bg-white/90 transition-colors duration-300"
              >
                Start the conversation
              </button>
            </form>
          )}
        </div>
      </Section>

      <Footer />
    </main>
  );
};

export default Contact;
