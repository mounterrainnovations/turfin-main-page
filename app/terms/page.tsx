"use client";

import PageLayout from "../components/PageLayout";

export default function TermsOfService() {
  const lastUpdated = "March 15, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing TurfInApp and joining our waitlist, you agree to comply with and be bound by these Terms of Service. These terms apply to all visitors, users, and others who access or use our service.",
    },
    {
      title: "2. Waitlist Participation",
      content:
        "Joining the waitlist represents an expression of interest in TurfInApp. It does not guarantee immediate access to the platform upon launch. Access will be granted based on various factors, including availability and position in the queue.",
    },
    {
      title: "3. User Conduct",
      content:
        "Users agree not to use the service for any unlawful purpose. You are prohibited from attempting to interfere with the proper working of the site, including submitting false information or attempting to bypass waitlist security measures.",
    },
    {
      title: "4. Intellectual Property",
      content:
        "All content, trademarks, logos, and digital assets on this site are the exclusive property of TurfInApp and RE Orbit Innovations Pvt Ltd. Unauthorized use, reproduction, or distribution of these materials is strictly prohibited.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "TurfInApp is provided 'as is' without warranties of any kind. RE Orbit Innovations Pvt Ltd shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of this site or participation in the waitlist.",
    },
    {
      title: "6. Governing Law",
      content:
        "These terms shall be governed and construed in accordance with the laws of the jurisdiction in which RE Orbit Innovations Pvt Ltd operates, without regard to its conflict of law provisions.",
    },
  ];

  return (
    <PageLayout>
      <div className="rounded-[32px] md:rounded-[48px] border border-white/10 bg-black/40 backdrop-blur-2xl p-8 md:p-16 text-white shadow-2xl premium-glow mb-20">
        <header className="mb-12 border-b border-white/10 pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Terms of <span className="text-[#CCFF00]">Service.</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base uppercase tracking-widest font-semibold italic">
            Last Updated: {lastUpdated}
          </p>
        </header>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <section key={index} className="group">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#CCFF00]/90 group-hover:text-[#CCFF00] transition-colors">
                {section.title}
              </h2>
              <p className="text-white/60 leading-relaxed md:text-lg">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm text-center italic">
            Participating in the waitlist implies acceptance of these terms.
            Questions? Contact{" "}
            <a
              href="mailto:contact@turfinapp.com"
              className="text-[#CCFF00] hover:underline"
            >
              contact@turfinapp.com
            </a>
            .
          </p>
        </footer>
      </div>
    </PageLayout>
  );
}
