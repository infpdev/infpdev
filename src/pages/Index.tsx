import { Github, ExternalLink, Copy, Check, Youtube } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { projects } from "../assets/projects";
import { AmbientAudioToggle } from "@/components/AmbientAudioToggle";
import { Ded } from "@/components/Ded";
// Import all background images - add more with bg-X.png naming
import bg1 from "@/assets/1.png";
import bg2 from "@/assets/2.png";
import bg3 from "@/assets/3.png";
import bg4 from "@/assets/4.png";
import bg5 from "@/assets/5.png";
import bg6 from "@/assets/6.png";
import bg7 from "@/assets/7.png";
import bg8 from "@/assets/8.png";
import bg9 from "@/assets/9.png";
import bg10 from "@/assets/10.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// const pfp = "https://avatar-cyan.vercel.app/api/pfp/495820009629810698/smallimage";
const pfp = "/favicon.png";
// Array of all background images - add new imports here
const backgroundImages = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10];

// Pick a random background image
const getRandomBackground = () => {
  const index = Math.floor(Math.random() * backgroundImages.length);
  return backgroundImages[index];
};
const isDevDead = false;

const Index = () => {
  const [copied, setCopied] = useState(false);
  const backgroundImage = useMemo(() => getRandomBackground(), []);
  const discordUsername = ".dev17";
  const [isMobile, setIsMobile] = useState(false);

  // Select 3 unique random projects
  const randomProjects = useMemo(() => {
    if (projects.length <= 3) {
      // Shuffle the array so order is random
      return [...projects].sort(() => Math.random() - 0.5);
    }
    const selected = new Set<number>();
    while (selected.size < 3) {
      const idx = Math.floor(Math.random() * projects.length);
      selected.add(idx);
    }
    return Array.from(selected).map((i) => projects[i]);
  }, []);

  const copyUsername = () => {
    navigator.clipboard.writeText(discordUsername);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(pointer: coarse)").matches ||
          window.matchMedia("(max-width: 960px)").matches,
      );
    };

    checkMobile(); // initial check
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <div className="min-h-screen bg-background text-foreground flex flex-col p-6 md:p-8 relative select-none">
          {isDevDead && <Ded />}

          <AmbientAudioToggle isMobile={isMobile} />
          {/* fixed background image */}
          <div
            className={`fixed inset-0 flex items-center justify-center pointer-events-none z-0
              ${isMobile ? "" : "-translate-y-[10vh]"}`}
          >
            <img
              src={backgroundImage}
              alt=""
              className="h-[70vh] w-auto object-contain opacity-30"
            />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <div className="w-full max-w-[85rem]">
              <section className="space-y-3 transition-transform duration-200 origin-left">
                <h1 className="text-2xl font-medium text-foreground">
                  hey, i'm dev (dave's okay too ^^)
                </h1>
              </section>

              {/* Main content grid - responsive, both columns in same container */}
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left column */}
                <div className="space-y-10 flex flex-col">
                  {/* About me - brief */}
                  <div className="flex text-[15px] flex-col justify-center p-4 rounded-lg bg-secondary/10 backdrop-blur-sm border border-border/50 lg:flex-1">
                    <p className="text-muted-foreground leading-relaxed">
                      i'm an introverted developer who likes building small,
                      silly stuff.
                      <br></br> it's usually just for fun, but sometimes they
                      end up being useful
                      <br></br>
                      <br></br>i learn as i build, break stuff, fix, repeat
                      <br></br>sometimes i meet people i actually vibe with
                      <br></br>
                      <br></br> p.s. i post random stuff on youtube sometimes :
                      {">"}
                      <br></br>
                      also, yes - cats {"<3"}
                    </p>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-8 flex flex-col">
                  {/* comfort zone */}
                  <div className="flex flex-col justify-center p-4 rounded-lg bg-secondary/10 backdrop-blur-sm border border-border/50 lg:flex-1">
                    <h3 className="text-sm font-medium text-muted-foreground tracking-wide mb-3">
                      (if you're still here, here's a bit more)
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      if i'm online, i'm probably fixing something that annoyed
                      me or just looking for a new distraction.
                      <br />
                      sometimes it works, sometimes it doesn't — i keep it if
                      it's fun.
                      <br />
                      <br />
                      open to collabs, as long as it's not some
                      quantum-computing AI startup ;]
                      <br />
                      <br />
                      p.s. i play gtao, pubg, battlefront 2, etc — if you're
                      introverted too, we’ll get along fine :]
                    </p>
                  </div>
                </div>
              </div>

              {/* Projects, below the grid */}
              <div className="w-full flex mt-5 flex-col justify-center items-center">
                <h2
                  className="text-sm w-fit mb-2 flex items-center justify-center font-medium text-muted-foreground tracking-wide
                bg-secondary/10 backdrop-blur-[2px] rounded-lg p-2"
                >
                  little things, lately
                </h2>

                <div className="grid grid-cols-1 w-full sm:grid-cols-3 gap-5">
                  {/* Project Card 1 */}
                  <div
                    className="flex flex-col rounded-xl w-full bg-card/20 backdrop-blur-[1px] 
                  border border-border p-4 transition-colors duration-200 hover:bg-secondary/30"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={
                            !randomProjects[0].hasVideo
                              ? randomProjects[0].href
                              : `https://youtu.be/${randomProjects[0].videoId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group aspect-video rounded-md bg-muted/30 mb-3 overflow-hidden flex items-center justify-center relative select-auto"
                        >
                          <img
                            src={
                              !randomProjects[0].hasVideo
                                ? randomProjects[0].screenshot
                                : `https://img.youtube.com/vi/${randomProjects[0].videoId}/sddefault.jpg`
                            }
                            alt={`${randomProjects[0].title} preview`}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />

                          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/20" />
                          {randomProjects[0].hasVideo ? (
                            <div className="relative z-10 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 duration-200">
                              <ExternalLink className="w-5 h-5 text-primary fill-primary" />
                            </div>
                          ) : (
                            ""
                          )}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="text-xs "
                        sideOffset={-35}
                      >
                        {randomProjects[0].hasVideo
                          ? "watch on youtube"
                          : "visit site"}
                      </TooltipContent>
                    </Tooltip>

                    <h3 className="font-medium text-card-foreground mb-1">
                      {randomProjects[0].title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">
                      {randomProjects[0].description}
                    </p>

                    <a
                      href={randomProjects[0].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-xs text-primary/80 transition-colors w-fit duration-200 hover:text-primary select-auto"
                    >
                      view on github →
                    </a>
                  </div>

                  {/* Project Card 2  - Static*/}
                  <div className="flex flex-col rounded-xl w-full bg-card/20 backdrop-blur-[2px] border border-border p-4 transition-colors duration-200 hover:bg-secondary/30">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href="https://youtu.be/RcretUM65l0"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group aspect-video rounded-md bg-muted/30 mb-3 overflow-hidden flex items-center justify-center relative select-auto"
                        >
                          {/* Thumbnail */}
                          <img
                            src="https://img.youtube.com/vi/RcretUM65l0/sddefault.jpg"
                            alt="Project video thumbnail"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />

                          {/* Soft overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-muted/60 to-muted/30" />

                          {/* Play button */}
                          <div className="relative z-10 w-12 opacity-0 group-hover:opacity-100 transition-all h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 duration-200">
                            <ExternalLink className="w-5 h-5 text-primary fill-primary" />
                          </div>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="text-xs "
                        sideOffset={-35}
                      >
                        <p>watch on youtube</p>
                      </TooltipContent>
                    </Tooltip>
                    <h3 className="font-medium text-card-foreground mb-1">
                      vaultOps
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      a small toolkit for gtao heists <br></br>fixes annoying
                      things and solves fingerprint puzzles.
                    </p>
                    <a
                      href="https://github.com/infpdev/gtao-heist-toolkit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-xs text-primary/80 transition-colors duration-200 hover:text-primary w-fit select-auto"
                    >
                      view on github →
                    </a>
                  </div>
                  {/* Project Card 3 */}
                  <div
                    className="flex flex-col rounded-xl w-full bg-card/20 whitespace-pre-wrap
                   backdrop-blur-[1px] border border-border p-4 transition-colors duration-200 hover:bg-secondary/30"
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={
                            !randomProjects[1].hasVideo
                              ? randomProjects[1].href
                              : `https://youtu.be/${randomProjects[1].videoId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group aspect-video rounded-md bg-muted/30 mb-3 overflow-hidden flex items-center justify-center relative select-auto"
                        >
                          <img
                            src={
                              !randomProjects[1].hasVideo
                                ? randomProjects[1].screenshot
                                : `https://img.youtube.com/vi/${randomProjects[1].videoId}/sddefault.jpg`
                            }
                            alt={`${randomProjects[1].title} preview`}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />

                          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/20" />

                          {randomProjects[1].hasVideo ? (
                            <div className="relative z-10 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 duration-200">
                              <ExternalLink className="w-5 h-5 text-primary fill-primary" />
                            </div>
                          ) : (
                            ""
                          )}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="text-xs "
                        sideOffset={-35}
                      >
                        {randomProjects[1].hasVideo
                          ? "watch on youtube"
                          : "visit site"}
                      </TooltipContent>
                    </Tooltip>

                    <h3 className="font-medium text-card-foreground mb-1">
                      {randomProjects[1].title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-2">
                      {randomProjects[1].description}
                    </p>

                    <a
                      href={randomProjects[1].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-xs text-primary/80 transition-colors w-fit duration-200 hover:text-primary select-auto"
                    >
                      view on github →
                    </a>
                  </div>
                </div>
              </div>

              {/* Reach out - below both columns */}
              <section
                className={`mt-12 w-full items-center flex flex-col space-y-3 
                  ${!isMobile ? "text-base" : "text-sm"}`}
              >
                <h2 className=" font-medium text-muted-foreground tracking-wide">
                  i'm usually around here
                </h2>
                <div
                  className={`flex items-center  text-secondary-foreground
                     ${!isMobile ? "gap-10" : "gap-5"}`}
                >
                  <div className=" flex items-center gap-1 ">
                    {/* pfp next to Discord */}

                    <div
                      className={`transition-all  rounded-full bg-muted/50 border border-border/50 flex items-center justify-center overflow-hidden ${
                        isMobile
                          ? "w-[11vw] h-[11vw]"
                          : "w-5 h-5 hover:w-14 hover:h-14"
                      }`}
                    >
                      <img
                        src={pfp}
                        alt="pfp"
                        className="w-full h-full object-cover"
                      ></img>
                    </div>

                    <div className="flex group  justify-center items-center gap-1 ml-2">
                      <DiscordIcon className="w-4 h-4 " />

                      <span className="select-text">{discordUsername}</span>
                      {isMobile ? (
                        <button
                          onClick={copyUsername}
                          className="ml-1 px-2 py-1 rounded bg-secondary/80 hover:bg-secondary text-xs text-secondary-foreground flex items-center gap-1 select-auto cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              copy
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={copyUsername}
                          className={`flex group-hover:ml-2 group-hover:px-2 gap-1 py-1 rounded bg-secondary/80 hover:bg-secondary text-xs text-secondary-foreground items-center select-auto cursor-pointer 
                    overflow-hidden w-0 opacity-0  group-hover:opacity-100 transition-all duration-300 ease-out ${
                      copied
                        ? "px-2 group-hover:w-[68px] mr-3"
                        : "group-hover:pl-2 group-hover:w-14"
                    }`}
                        >
                          {copied ? (
                            <>
                              <Check className="w-3 h-3" />
                              copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <a
                    href="https://github.com/infpdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors duration-200 hover:text-primary select-auto"
                  >
                    <Github className="w-4 h-4" />
                    <span>infpdev</span>
                  </a>
                  <a
                    href="https://youtube.com/@dev17"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors duration-200 hover:text-primary select-auto"
                  >
                    <Youtube className="w-5 h-5" />
                    <span>dev</span>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

// Simple Discord icon component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
  </svg>
);

export default Index;
