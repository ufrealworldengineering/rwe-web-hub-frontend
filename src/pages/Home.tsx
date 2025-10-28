import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import logo from "@/assets/placeholder-rwe-logo.png";
import team1 from "@/assets/placeholder-robotic-arm.jpg";
import team2 from "@/assets/placeholder-rwe-logo.png";
import team3 from "@/assets/placeholder-uf-scene.jpg";

const teamImages = [
  { src: team1, alt: "Team 1" },
  { src: team2, alt: "Team 2" },
  { src: team3, alt: "Team 3" },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? teamImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === teamImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ===== HERO + CAROUSEL ===== */}
      <section className="flex flex-row flex-wrap md:flex-nowrap h-[80vh] overflow-hidden">
        {/* LEFT: HERO SECTION */}
        <div className="relative w-full md:w-[40%] min-w-[280px] flex flex-col justify-start px-8 md:px-16 py-12">
          {/* Top text */}
          <p className="text-text-secondary font-extrabold text-2xl md:text-3xl mb-2">
            this is
          </p>

          {/* Heading with background logo */}
          <div className="relative">
            <img
              src={logo}
              alt="RWE Logo Background"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[80%] opacity-10 object-contain pointer-events-none"
            />
            <h1 className="relative z-10 text-6xl md:text-7xl text-text-primary font-extrabold leading-tight">
              REAL
              <br />
              WORLD
              <br />
              ENGINEER <br className="md:hidden" />ING
            </h1>
          </div>
        </div>

        {/* RIGHT: IMAGE CAROUSEL */}
        <div className="w-full md:w-[60%] min-w-[300px] flex items-center justify-center relative px-6 mt-6 md:-mt-6">
          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-30 z-20 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition"
          >
            ◀
          </button>

          {/* Image with HoverCard */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="w-full max-w-xl md:max-w-3xl h-96 md:h-[500px] overflow-hidden rounded-lg scale-75">
                <img
                  src={teamImages[currentIndex].src}
                  alt={teamImages[currentIndex].alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="text-sm">
              {teamImages[currentIndex].alt}
            </HoverCardContent>
          </HoverCard>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-30 z-20 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition"
          >
            ▶
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto bg-muted/30 py-8 px-6 md:px-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-primary">
              Real World Engineering
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              University of Florida · Gainesville, FL
            </p>
          </div>

          <Separator className="hidden md:block h-10" orientation="vertical" />

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex space-x-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Email
              </a>
              <a
                href="https://www.instagram.com/realworldengineering?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/rwe-real-world-engineering/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                LinkedIn
              </a>
              <a
                href="https://discord.gg/fT8aYcRZVw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Discord
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Copyright © {new Date().getFullYear()} RWE · All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
