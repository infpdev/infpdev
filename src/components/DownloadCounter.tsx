import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DownloadCounterProps = {
  repo: string;
};

type GithubReleaseAsset = {
  download_count?: number;
};

type GithubRelease = {
  assets?: GithubReleaseAsset[];
};

export function DownloadCounter({ repo }: DownloadCounterProps) {
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadDownloads = async () => {
      try {
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
          throw new Error(`GitHub releases request failed: ${response.status}`);
        }

        const releases = (await response.json()) as GithubRelease[];

        const totalDownloads = releases.reduce((releaseTotal, release) => {
          const assetTotal = (release.assets ?? []).reduce(
            (assetSum, asset) => assetSum + (asset.download_count ?? 0),
            0,
          );

          return releaseTotal + assetTotal;
        }, 0);

        setDownloadCount(totalDownloads);
      } catch {
        if (!controller.signal.aborted) {
          setDownloadCount(null);
        }
      }
    };

    loadDownloads();

    return () => controller.abort();
  }, [repo]);

  return downloadCount === null ? null : (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-muted-foreground cursor-small select-none">
          <Download className="h-3.5 w-3.5" />
          <span>{downloadCount.toLocaleString()}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs" sideOffset={8}>
        <p>total downloads</p>
      </TooltipContent>
    </Tooltip>
  );
}
