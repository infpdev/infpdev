import { useEffect, useMemo, useState } from "react";
import { DownloadCounter } from "@/components/DownloadCounter";
import { projects } from "@/assets/projects.ts";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";

interface ProjectProps {
  setShowLoader: (show: boolean) => void;
  setImagesLoaded: (loaded: boolean) => void;
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

function Projects({ setShowLoader, setImagesLoaded }: ProjectProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Select 2 unique random projects
  const randomProjects = useMemo(() => {
    const shuffled = [...projects].sort(() => Math.random() - 0.5);

    return [shuffled[0], STATIC_PROJECT, shuffled[1]];
  }, []);

  // Preload project images
  useEffect(() => {
    let showLoaderTimeout: number;
    const loadImageTimeout = setTimeout(() => {
      setShowLoader(true);

      // Move preloadImages function here
      setImagesLoaded(false);
      const imageUrls: string[] = [];

      randomProjects.forEach((project) => {
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
  }, [randomProjects, setImagesLoaded, setShowLoader]);

  return (
    <div>
      <div className="w-full flex mt-5 flex-col justify-center items-center">
        <h2
          className="text-sm w-fit mb-2 flex items-center justify-center font-medium text-muted-foreground tracking-wide
                bg-secondary/10 backdrop-blur-sm rounded-lg p-2"
        >
          little things, lately
        </h2>

        <div
          className={`grid grid-cols-1 w-full sm:grid-cols-3 gap-7 transition-opacity duration-300`}
        >
          {/* Project Cards*/}

          {randomProjects.map((project) => (
            <div
              key={project.title}
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
                  className="absolute inset-0 w-full h-full object-cover opacity-80 backdrop-blur-sm"
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

              <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">
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
          ))}
          {/* <span className="mb-[100%]"></span> */}
        </div>
      </div>
    </div>
  );
}

export default Projects;
