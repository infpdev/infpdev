import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { DiscordIcon, YouTubeIcon, GitHubIcon } from "./Icons";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function Socials({ isMobile }: { isMobile: boolean }) {
  const [copied, setCopied] = useState(false);
  const discordUsername = ".dev17";
  const pfp = "/favicon.png";
  // const pfp = "https://avatar-cyan.vercel.app/api/pfp/495820009629810698/smallimage";

  const copyUsername = () => {
    navigator.clipboard.writeText(discordUsername);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CopyButtonContent = (
    <>
      <div className="relative w-3 h-3 shrink-0">
        <Copy
          className={`absolute inset-0 w-3 h-3 transition-all duration-200 ${
            copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
          }`}
        />

        <Check
          className={`absolute inset-0 w-3 h-3 transition-all duration-200 ${
            copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        />
      </div>

      <span>{copied ? "copied" : "copy"}</span>
    </>
  );

  return (
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
        <div className="flex items-center gap-1">
          {/* pfp next to Discord */}

          <div
            className={`transition-all group cursor-small overflow-visible flex items-center justify-center ${
              isMobile ? "w-[11vw] h-[11vw]" : "w-5 h-5 hover:w-14"
            }`}
          >
            <div
              className={`w-5 h-5 transition-transform rounded-full overflow-hidden ${
                isMobile ? "scale-[2.4]" : "group-hover:scale-[2.8]"
              }`}
            >
              <img src={pfp} alt="pfp" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex group justify-center items-center gap-1 ml-2">
            <DiscordIcon className="w-4 h-4" />

            <span className="select-text ml-1">{discordUsername}</span>
            {isMobile ? (
              <button
                onClick={copyUsername}
                className={`ml-1 px-2 py-1 rounded bg-secondary/80 hover:bg-secondary text-xs text-secondary-foreground flex items-center gap-1 select-auto cursor-pointer overflow-hidden transition-all duration-300 ${
                  copied ? "w-[70px]" : "w-[60px]"
                }`}
              >
                {CopyButtonContent}
              </button>
            ) : (
              <button
                onClick={copyUsername}
                className={`flex group-hover:ml-2 group-hover:px-2 gap-1 py-1 rounded bg-secondary/80
                             hover:bg-secondary text-xs text-secondary-foreground items-center select-auto cursor-pointer 
                              overflow-hidden w-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out ${
                                copied
                                  ? "px-2 group-hover:w-[70px] mr-3"
                                  : "group-hover:px-2 group-hover:w-[60px]"
                              }`}
              >
                {CopyButtonContent}
              </button>
            )}
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://github.com/infpdev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors duration-200 hover:text-primary select-auto"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>infpdev</span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs" sideOffset={6}>
            GitHub
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://youtube.com/@dev17"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[6px] transition-colors duration-200 hover:text-primary select-auto"
            >
              <YouTubeIcon className="w-5 h-5" />
              <span>dev</span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs" sideOffset={6}>
            YouTube
          </TooltipContent>
        </Tooltip>
      </div>
    </section>
  );
}

export default Socials;
