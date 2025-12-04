import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import Search from "@/components/Search";
import SiteNavLinks from "@/components/SiteNavLinks";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Link } from "@/i18n/routing";

interface SiteHeaderProps {
  isHome?: boolean;
  variant?: "themed" | "dark";
  activeBlog?: boolean;
  locale?: string;
}

export default function SiteHeader({
  isHome = false,
  variant = "themed",
  activeBlog = false,
  locale = "en",
}: SiteHeaderProps) {
  return (
    <nav className="p-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className={
            variant === "dark"
              ? "text-2xl font-bold text-white hover:text-accent transition-colors"
              : "text-2xl font-bold text-foreground hover:text-accent transition-colors"
          }
        >
          Portfolio
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <SiteNavLinks isHome={isHome} variant={variant} activeBlog={activeBlog} locale={locale} />
          <div className="hidden md:block">
            <Search />
          </div>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>
          <MobileMenu isHome={isHome} hideBlog={activeBlog} hideAbout={isHome} locale={locale} />
        </div>
      </div>
    </nav>
  );
}
