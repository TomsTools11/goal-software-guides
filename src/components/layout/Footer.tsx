import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-soft py-8">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-text-muted sm:flex-row">
        <p>&copy; 2026 Goal Platform, LLC. All Rights Reserved.</p>
        <nav className="flex gap-4">
          <a
            href="https://goalplatform.com/terms-of-use"
            className="transition-colors hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
          <a
            href="https://goalplatform.com/privacy-policy"
            className="transition-colors hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
        </nav>
      </Container>
    </footer>
  );
}
