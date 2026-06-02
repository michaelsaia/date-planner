export default function Logo({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Calendar body */}
      <rect
        x="3"
        y="6"
        width="26"
        height="23"
        rx="4"
        fill="currentColor"
        className="text-primary"
      />
      {/* Calendar header bar */}
      <rect
        x="3"
        y="6"
        width="26"
        height="8"
        rx="4"
        fill="currentColor"
        className="text-primary"
      />
      {/* Calendar rings */}
      <rect x="9" y="3" width="2.5" height="6" rx="1.25" fill="currentColor" className="text-primary" />
      <rect x="20.5" y="3" width="2.5" height="6" rx="1.25" fill="currentColor" className="text-primary" />
      {/* Calendar body below header — adapts to dark mode */}
      <rect x="5" y="14" width="22" height="13" rx="2" fill="currentColor" className="text-card" />
      {/* Heart centered on the calendar */}
      <path
        d="M16 25.5l-1.1-1C11.1 21.2 9 19.3 9 17c0-1.9 1.5-3.4 3.4-3.4 1.1 0 2.1.5 2.8 1.3.6-.8 1.6-1.3 2.8-1.3 1.9 0 3.4 1.5 3.4 3.4 0 2.3-2.1 4.2-5.9 7.5L16 25.5z"
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}
