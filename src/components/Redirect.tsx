import { useState, useEffect } from "react";

interface RedirectConfig {
  param: string;
  value: string | number;
  type: "bug-report" | "text-redirect";
  title: string;
  message: string;
  yesButtonText?: string;
  noButtonText?: string;
  yesRedirect?: string;
  textBeforeLoader?: string;
}

// Define all redirect configurations here
const REDIRECT_CONFIGS: RedirectConfig[] = [
  {
    param: "vaultOps",
    value: "1",
    type: "bug-report",
    title: "vaultOps",
    message:
      "Hello there, are you here to report a bug or suggest a feature for vaultOps?",
    yesButtonText: "Yes",
    noButtonText: "No (stay here)",
    yesRedirect:
      "https://github.com/infpdev/gtao-heist-toolkit/issues/new/choose",
  },
  {
    param: "vaultOps",
    value: "2",
    type: "text-redirect",
    title: "vaultOps",
    message: "Redirecting to vaultsOps → update page",
    yesRedirect:
      "https://github.com/infpdev/gtao-heist-toolkit/blob/main/HOW-TO-UPDATE.md",
  },
  {
    param: "vaultOps",
    value: "3",
    type: "text-redirect",
    title: "vaultOps",
    message: "Redirecting to vaultsOps → standalone update page",
    yesRedirect:
      "https://github.com/infpdev/gtao-heist-toolkit/blob/main/lib/standalone%20scripts/HOW-TO-UPDATE-STANDALONE.md",
  },
];

const redirectWithReferrer = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_self";
  link.rel = "noopener";
  link.referrerPolicy = "strict-origin-when-cross-origin";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const Redirect = () => {
  const [activeRedirect, setActiveRedirect] = useState<RedirectConfig | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showRedirectText, setShowRedirectText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Parse query params
    const params = new URLSearchParams(window.location.search);

    // Check each configuration
    for (const config of REDIRECT_CONFIGS) {
      const paramValue = params.get(config.param);
      if (paramValue === String(config.value)) {
        setActiveRedirect(config);
        if (config.type === "text-redirect") {
          setShowRedirectText(true);

          const redirectTimer = setTimeout(() => {
            if (config.yesRedirect) {
              redirectWithReferrer(config.yesRedirect);
            }
          }, 2000);

          return () => clearTimeout(redirectTimer);
        }
        break;
      }
    }
  }, []);

  useEffect(() => {
    if (!activeRedirect) return;

    // Ensure hidden state is painted first, then fade in over 1s.
    setIsVisible(false);
    const fadeTimer = setTimeout(() => setIsVisible(true), 20);

    return () => clearTimeout(fadeTimer);
  }, [activeRedirect]);

  if (!activeRedirect) return null;

  const handleYes = async () => {
    setIsLoading(true);
    // 2s debounce
    await new Promise((resolve) => setTimeout(resolve, 2000));

    hidePopup();

    if (activeRedirect.yesRedirect) {
      redirectWithReferrer(activeRedirect.yesRedirect);
    }
  };

  const hidePopup = () => {
    setIsVisible(false);
    setTimeout(() => {
      setActiveRedirect(null);
    }, 500);
  };

  const handleNo = () => {
    hidePopup();
  };

  return (
    <div
      className={`fixed inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center z-50 transition-opacity duration-500 ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-card border border-border rounded-2xl p-8 max-w-lg mx-auto text-center space-y-6">
        <div className="space-y-3">
          <h2 className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {activeRedirect.title}
          </h2>
          <hr className="border-border" />
        </div>

        <p className="text-lg text-foreground/70 font-medium">
          {activeRedirect.message}
        </p>

        {/* Bug Report Type */}
        {activeRedirect.type === "bug-report" && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleYes}
              disabled={isLoading}
              className="px-6 py-2 transition-all bg-secondary disabled:pointer-events-none hover:bg-primary/30 text-secondary-foreground rounded opacity-70 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <span className="w-5 h-5 rounded-full border-2 border-primary/35 border-t-primary animate-spin" />
              )}
              {activeRedirect.yesButtonText || "Yes"}
            </button>
            <button
              onClick={handleNo}
              disabled={isLoading}
              className="px-6 py-2 transition-all bg-secondary disabled:pointer-events-none hover:bg-primary/20 text-secondary-foreground rounded opacity-70 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activeRedirect.noButtonText || "No"}
            </button>
          </div>
        )}

        {/* Text Redirect Type */}
        {activeRedirect.type === "text-redirect" && showRedirectText && (
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="w-5 h-5 rounded-full border-2 border-primary/35 border-t-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Redirect;
