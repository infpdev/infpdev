import { useEffect, useMemo, useState } from "react";
import { DownloadCounter } from "@/components/DownloadCounter";
import { projects } from "@/assets/projects.ts";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
import ProjectsMobileLayout from "./ProjectsMobileLayout";

interface ProjectProps {
  isCompact: boolean;
  imagesLoaded: boolean;
  setShowLoader: (show: boolean) => void;
  setImagesLoaded: (loaded: boolean) => void;
  isMobile: boolean;
}

export interface Project {
  title: string;
  description: string;
  github: string;
  hasVideo: boolean;

  videoId?: string;
  screenshot?: string;
  href?: string;

  githubRepoNameForDownloadCounter?: string;
}

const STATIC_PROJECT: Project = {
  title: "vaultOps",
  description:
    "a small toolkit for gtao heists \nfixes the PgUp bug and solves fingerprint puzzles.",
  github: "https://github.com/infpdev/gtao-heist-toolkit",
  hasVideo: true,
  videoId: "j44mYY3tC10",
  githubRepoNameForDownloadCounter: "gtao-heist-toolkit",
};

function Projects({
  setShowLoader,
  setImagesLoaded,
  isMobile,
  imagesLoaded,
  isCompact,
}: ProjectProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const allProjects = useMemo(() => {
    const sorted = [...projects].sort(() => Math.random() - 0.5);
    sorted.splice(1, 0, STATIC_PROJECT);
    return sorted;
  }, []);

  const GAP = 1;
  const CARD_WIDTH = (100 - GAP * 2) / 3;
  const STEP = CARD_WIDTH + GAP;

  const pageInfo = useMemo(() => {
    const info: { translate: number }[] = [];

    for (let page = 0; page < allProjects.length - 2; page++) {
      info.push({
        translate: page * STEP,
      });
    }

    return info;
  }, [allProjects, STEP]);

  const translatePercent = pageInfo[page]?.translate ?? 0;

  // Preload project images
  useEffect(() => {
    let showLoaderTimeout: number;
    const loadImageTimeout = setTimeout(() => {
      setShowLoader(true);

      setImagesLoaded(false);
      const imageUrls: string[] = [];

      allProjects.forEach((project) => {
        if (project.hasVideo) {
          imageUrls.push(
            `https://img.youtube.com/vi/${project.videoId}/sddefault.jpg`,
          );
        } else {
          imageUrls.push(project.screenshot);
        }
      });

      imageUrls.push(
        "https://img.youtube.com/vi/j44mYY3tC10/maxresdefault.jpg",
      );

      let loadedCount = 0;
      const handleImageLoad = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          showLoaderTimeout = setTimeout(() => {
            setImagesLoaded(true);
            setShowLoader(false);
          }, 1000);
        }
      };

      imageUrls.forEach((url) => {
        const img = new Image();
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad;
        img.src = url;
      });
    }, 100);

    return () => {
      clearTimeout(loadImageTimeout);
      clearTimeout(showLoaderTimeout);
    };
  }, [allProjects, setImagesLoaded, setShowLoader]);

  if (isMobile)
    return (
      <ProjectsMobileLayout
        randomProjects={allProjects.slice(0, 3)}
        imagesLoaded={imagesLoaded}
      />
    );

  return (
    <div>
      <div
        className={`w-full flex flex-col justify-center items-center relative`}
      >
        <div
          className={`grid w-full grid-cols-3 items-center
          ${isCompact ? "mt-1.5 mb-1.5" : "mt-5 mb-3"}`}
        >
          <div /> {/* left spacer */}
          <h2
            className="justify-self-center text-sm font-medium text-muted-foreground tracking-wide
               bg-secondary/10 backdrop-blur-sm rounded-lg p-2"
          >
            little things, lately
          </h2>
          <div className="justify-self-end mr-5 flex items-center gap-2">
            <span className="text-sm text-muted-foreground opacity-70">
              {page + 1}/{pageInfo.length}
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPage(
                        (p) => (p - 1 + pageInfo.length) % pageInfo.length,
                      )
                    }
                  >
                    <ChevronLeft className="bg-foreground/10 cursor-small rounded-md w-6 h-6 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={() => setPage((p) => (p + 1) % pageInfo.length)}
                  >
                    <ChevronRight className="bg-foreground/10 cursor-small rounded-md w-6 h-6 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity" />
                  </button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs" sideOffset={15}>
                Show more
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Project Cards*/}
        <div className="overflow-hidden w-full">
          {/* Gap is 1% so that the card width can take 33.333% - 1% */}
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] gap-[1%]"
            style={{
              transform: `translateX(-${translatePercent}%)`,
            }}
          >
            {allProjects.map((project) => (
              // Width is 32.333% to account for 3 cards and 2% total gap between them
              <div
                key={project.title}
                className="w-full sm:w-[calc((100%-2%)/3)] flex-shrink-0"
              >
                <div
                  className="flex flex-col rounded-xl w-full bg-background/50 aspect-video
                    border border-border p-4 transition-colors duration-200 hover:bg-secondary/30"
                >
                  <a
                    onMouseEnter={() => setHoveredProject(project.title)}
                    onMouseLeave={() => setHoveredProject(null)}
                    href={
                      !project.hasVideo
                        ? project.href
                        : `https://youtu.be/${project.videoId}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative mb-3 flex aspect-video items-center justify-center overflow-hidden rounded-md bg-muted/30"
                  >
                    <img
                      src={
                        !project.hasVideo
                          ? project.screenshot
                          : `https://img.youtube.com/vi/${project.videoId}/sddefault.jpg`
                      }
                      alt={`${project.title} preview`}
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <Tooltip open={hoveredProject === project.title}>
                      <TooltipTrigger asChild>
                        {project.hasVideo ? (
                          <div className="relative z-10 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 duration-200">
                            <ExternalLink className="w-5 h-5 text-primary fill-primary" />
                          </div>
                        ) : (
                          <div className="p-5" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="text-xs"
                        sideOffset={15}
                      >
                        {project.hasVideo ? "watch on youtube" : "visit site"}
                      </TooltipContent>
                    </Tooltip>
                  </a>

                  <h3 className="font-medium text-card-foreground mb-1">
                    {project.title}
                  </h3>

                  <p
                    className={`text-sm text-muted-foreground mb-2 whitespace-pre-wrap ${isCompact ? "compact" : ""}`}
                  >
                    {project.description}
                  </p>
                  <div className="mt-auto relative items-center gap-3 text-xs">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-xs text-primary/80 transition-colors w-fit duration-200 hover:text-primary select-auto"
                    >
                      view on github →
                    </a>
                    {project.githubRepoNameForDownloadCounter && (
                      <div className="absolute right-0 -top-1">
                        <DownloadCounter
                          repo={project.githubRepoNameForDownloadCounter}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
