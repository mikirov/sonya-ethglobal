import Link from "next/link";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 px-1 py-2 bg-gradient-to-r from-base-200/95 to-base-200/80 backdrop-blur-sm">
      <div className="w-full">
        <div className="flex flex-col items-center justify-between w-full gap-6 p-2 px-4 md:flex-row md:gap-3">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-transparent transition-opacity bg-gradient-to-r from-primary via-accent to-primary bg-clip-text hover:opacity-80"
            >
              Sonya AI
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a
              href="https://twitter.com/sonyaai"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium transition-all duration-300 text-base-content/80 hover:text-primary hover:scale-105"
            >
              Twitter
            </a>
            <a
              href="https://discord.gg/sonyaai"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium transition-all duration-300 text-base-content/80 hover:text-primary hover:scale-105"
            >
              Discord
            </a>
            <a
              href="https://github.com/sonyaai"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium transition-all duration-300 text-base-content/80 hover:text-primary hover:scale-105"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
