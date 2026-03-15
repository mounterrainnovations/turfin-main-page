"use client";

import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="relative min-h-screen w-full flex flex-col bg-black overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/turfInBG.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay to ensure readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Navbar Container */}
      <div className="relative z-50 w-full flex justify-center pt-2 md:pt-4">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center px-4 py-12 md:py-20">
        <div className="w-full max-w-[1000px] animate-fade-up">
          {children}
        </div>
      </div>

      {/* Footer Container */}
      <div className="relative z-50 w-full flex justify-center pb-8 mt-auto">
        <Footer />
      </div>
    </main>
  );
}
