export const INSTALLS: {
  manager: string;
  items: { label: string; command: string }[];
}[] = [
  {
    manager: "Homebrew",
    items: [
      {
        label: "desktop app",
        command: "brew install --cask yuemiyuki/risuko/risuko-app",
      },
      { label: "CLI", command: "brew install yuemiyuki/risuko/risuko-cli" },
    ],
  },
  {
    manager: "npm",
    items: [
      { label: "app + engine", command: "npm install -g @risuko/app" },
      { label: "CLI only", command: "npm install -g @risuko/cli" },
    ],
  },
];
