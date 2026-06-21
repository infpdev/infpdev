import { ExternalLink } from "lucide-react";
import { Project } from "./Projects";
import { DownloadCounter } from "@/components/DownloadCounter";

function ProjectsMobileLayout({
  randomProjects,
  imagesLoaded,
}: {
  randomProjects: Project[];
  imagesLoaded: boolean;
}) {
  return (
    <div
      style={
        !imagesLoaded
          ? {
              position: "fixed",
              inset: 0,
              visibility: "hidden",
              overflow: "hidden",
              pointerEvents: "none",
            }
          : undefined
      }
    >
      <div className="w-full flex mt-5 flex-col justify-center items-center">
        <h2
          className="text-sm w-fit mb-2 flex items-center justify-center font-medium text-muted-foreground tracking-wide
                bg-secondary/10 rounded-lg p-2"
        >
          little things, lately
        </h2>

        <div className="grid grid-cols-1 w-full gap-7 transition-opacity duration-300">
          {/* Project Cards*/}

          {randomProjects.map((project) => (
            <div
              key={project.title}
              className="flex flex-col rounded-xl w-full bg-background/50
                  border border-border p-4 transition-colors duration-200 hover:bg-secondary/30"
            >
              <a
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
                {project.hasVideo ? (
                  <div className="relative z-10 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 duration-200">
                    <ExternalLink className="w-5 h-5 text-primary fill-primary" />
                  </div>
                ) : (
                  <div className="p-5" />
                )}
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

export default ProjectsMobileLayout;
