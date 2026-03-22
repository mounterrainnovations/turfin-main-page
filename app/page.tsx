"use client";

import Image from "next/image";

import WaitlistForm from "./components/WaitlistForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProgressSteps from "./components/ProgressSteps";

const AVATARS = [
  { char: "P", src: "/PLogo.png", gradient: null },
  { char: "M", src: null, gradient: "from-violet-400 to-purple-500" },
  { char: "G", src: "/GLogo.webp", gradient: null },
  { char: "A", src: null, gradient: "from-pink-400 to-rose-500" },
] as const;

export default function Home() {
  const currentPhase = Number(process.env.NEXT_PUBLIC_PROGRESS_PHASE) || 1;


  return (
    <main className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 -z-0">
        <Image
          src="/turfInBG.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Navbar Container */}
      <div className="relative z-50 w-full flex justify-center pt-2 md:pt-4">
        <Navbar />
      </div>

      {/* Main Content Area - Centered with flex-1 */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center px-3 xs:px-4 py-2 xs:py-4 md:py-6">
        {/* Glassmorphic Container with Dual Borders */}
        <div className="rounded-[40px] md:rounded-[48px] border border-white/10 bg-white/5 backdrop-blur-xl p-1.5 md:p-2 shadow-2xl w-full max-w-[880px] animate-fade-up premium-glow">
          {/* Lime Space (thick border) + Inner Glass (backdrop blur) */}
          <div id="waitlist" className="rounded-[32px] md:rounded-[40px] border-[5px] md:border-[8px] border-[#CCFF00] bg-black/40 backdrop-blur-2xl overflow-hidden">
            {/* Content Area - Maintain vertical one column design */}
            <div className="w-full py-3 xs:py-5 md:py-8 px-4 xs:px-6 md:px-20 flex flex-col items-center text-center gap-2 xs:gap-3 md:gap-6 text-white">
              {/* Launch Badge */}
              <div className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                <span className="text-[#CCFF00] text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase">
                  {currentPhase === 4 ? "Live Now" : "Release Date: TBA"}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight tracking-tight shrink-0">
                Join our <span className="text-[#CCFF00]">waitlist.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-white/50 text-xs md:text-sm leading-relaxed max-w-sm md:max-w-md shrink-0">
                Obtain early access to our program and remain informed about
                release announcements, insider news, and feature previews.
              </p>

              {/* Progress Steps */}
              <div className="w-full max-w-3xl py-2 md:py-4 overflow-visible">
                <ProgressSteps currentPhase={currentPhase} />
              </div>

              {/* Email Form */}
              <div className="w-full max-w-md">
                <WaitlistForm />
              </div>

              {/* Social Proof */}
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-1 shrink-0">
                {/* Avatar Stack */}
                <div className="flex -space-x-2.5">
                  {AVATARS.map(({ char, src, gradient }) => (
                    <div
                      key={char}
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-black/40 flex items-center justify-center overflow-hidden transition-transform hover:scale-110 hover:z-20 ${
                        src ? "bg-white" : `bg-linear-to-br ${gradient}`
                      }`}
                    >
                      {src ? (
                        <Image
                          src={src}
                          alt={char}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-[10px] md:text-xs font-bold text-white/80">
                          {char}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-[10px] md:text-xs">
                  Join <span className="text-white/70 font-semibold">525+</span>{" "}
                  others on the waitlist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Container */}
      <div className="relative z-50 w-full flex justify-center pb-2 md:pb-4">
        <Footer />
      </div>
    </main>
  );
}
