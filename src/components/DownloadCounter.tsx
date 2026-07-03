import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DownloadCounterProps = {
  repo: string | null;
  handleCounterLoad: () => void;
};

type GithubReleaseAsset = {
  download_count?: number;
};

type GithubRelease = {
  assets?: GithubReleaseAsset[];
};

export function DownloadCounter({
  repo,
  handleCounterLoad,
}: DownloadCounterProps) {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    if (!repo) {
      handleCounterLoad();
      return;
    }

    const controller = new AbortController();

    const loadFromShields = async (force = false) => {
      const response = await fetch(
        `https://img.shields.io/github/downloads/infpdev/${repo}/total.json`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error("Shields request failed");
      }

      const data = await response.json();
      if (typeof data.value !== "number") {
        if (force) return data.value;
        throw new Error("Value exceeded 1k. Use GitHub API instead.");
      }

      return Number(data.value);
    };

    const loadFromGithub = async () => {
      const response = await fetch(
        `https://api.github.com/repos/infpdev/${repo}/releases`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/vnd.github+json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("GitHub request failed");
      }

      const releases = (await response.json()) as GithubRelease[];

      return releases.reduce(
        (releaseTotal, release) =>
          releaseTotal +
          (release.assets ?? []).reduce(
            (assetTotal, asset) => assetTotal + (asset.download_count ?? 0),
            0,
          ),
        0,
      );
    };

    const loadDownloads = async () => {
      try {
        const count = await loadFromShields();
        setDownloadCount(count);
      } catch {
        try {
          const count = await loadFromGithub();
          setDownloadCount(count);
        } catch {
          // GitHub failed too
          const count = await loadFromShields(true);
          setDownloadCount(count);
        }
      } finally {
        handleCounterLoad();
      }
    };

    loadDownloads();
    return () => controller.abort();
  }, [repo, handleCounterLoad]);

  return downloadCount === null ? null : (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="ml-auto flex items-center gap-1.5 px-2 hover:bg-accent/10 transition-colors rounded-md p-1 text-[11px] text-muted-foreground cursor-small select-none">
          <Download className="h-3.5 w-3.5" />
          <span>{downloadCount.toLocaleString()}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs" sideOffset={7}>
        <p>total downloads</p>
      </TooltipContent>
    </Tooltip>
  );
}
