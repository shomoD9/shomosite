/*
 * This file renders the simple geometric mark used in navigation, footer, and iconography.
 * It exists separately because the symbol is part of the site's identity and should stay consistent everywhere.
 * The header, footer, and metadata surfaces import it as the compact visual signature for Shomo.
 */

type SiteMarkProps = {
  className?: string;
};

export function SiteMark({ className }: SiteMarkProps): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* We keep the lines thin and primitive so the mark reads like a directional instrument, not an emblem. */}
      <path d="M12 3V21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
      <path d="M3 12H21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
      <path d="M5.75 5.75L18.25 18.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
      <path d="M18.25 5.75L5.75 18.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
    </svg>
  );
}
