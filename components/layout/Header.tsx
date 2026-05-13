import { Container } from "@/components/ui/Container";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { Navigation } from "./Navigation";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-sm">
      <Container size="page">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-6">
            <Navigation />
            <ThemeToggle className="hidden md:inline-block" />
            <LocaleSwitcher className="hidden md:flex" />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
