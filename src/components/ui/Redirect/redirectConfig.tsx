export interface RedirectConfig {
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
export const REDIRECT_CONFIGS: RedirectConfig[] = [
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
  {
    param: "vaultOps",
    value: "4",
    type: "text-redirect",
    title: "vaultOps",
    message: "Redirecting to vaultsOps → post-patch NoSave tutorial",
    yesRedirect: "https://youtu.be/6ZYJPmXAMu4",
  },
  {
    param: "vaultOps",
    value: "5",
    type: "text-redirect",
    title: "vaultOps",
    message: "Redirecting to vaultsOps → Discord Rich Presence tutorial",
    yesRedirect:
      "https://github.com/infpdev/gtao-heist-toolkit/releases/tag/v4.69.69",
  },
];
