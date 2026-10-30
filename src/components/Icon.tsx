import type { CSSProperties } from 'react';

export type IconName =
  | 'ball'
  | 'arrow'
  | 'calendar'
  | 'clock'
  | 'pin'
  | 'ghost'
  | 'pumpkin'
  | 'moon'
  | 'bolt'
  | 'coffee'
  | 'bat'
  | 'sparkles'
  | 'leaf'
  | 'hat'
  | 'search'
  | 'trophy'
  | 'grid'
  | 'chevron'
  | 'check'
  | 'info'
  | 'close'
  | 'heart'
  | 'sun'
  | 'cloud'
  | 'bag'
  | 'whistle'
  | 'water';
const paths: Record<IconName, React.ReactNode> = {
  // Original three-panel volleyball, drawn for this project.
  ball: (
    <>
      <circle cx="12" cy="12" r="9.25" />
      {[0, 120, 240].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 12 12)`}>
          <path d="M12 2.75C9.6 5.8 9.7 9.2 12 12" />
          <path d="M10.24 7.47C14 6.8 18 7.8 21.11 10.4" />
        </g>
      ))}
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M8 3v4m8-4v4M4 11h16m-11 5h2m3 0h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  pin: (
    <>
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  ghost: (
    <>
      <path d="M5 21V10a7 7 0 0 1 14 0v11l-3-2-4 2-4-2-3 2Z" />
      <path d="M9 10v2m6-2v2m-5 4h4" />
    </>
  ),
  pumpkin: (
    <>
      <path d="M12 9.4V7c0-1.1.5-2 1.6-2.6" />
      <path d="M12 9.4C10.6 8.2 8.6 7.8 6.8 8.2 3.8 8.9 2 11.7 2 14.8s1.8 5.6 4.8 6.3c1.8.4 3.8 0 5.2-1.1 1.4 1.1 3.4 1.5 5.2 1.1 3-.7 4.8-3.2 4.8-6.3s-1.8-5.9-4.8-6.6c-1.8-.4-3.8 0-5.2 1.2Z" />
      <path
        d="M6.6 12.6 8.3 10.4l1.7 2.2Z M14 12.6l1.7-2.2 1.7 2.2Z M12 12.9l1.1 1.8h-2.2Z M6.3 14.6C7.1 17 9.1 18.5 11.3 18.6v-1h1.4v1c2.2-.1 4.2-1.6 5-4-.7.8-1.5 1.2-2.4 1.5v.9h-1.7v-.6c-.5.1-1 .1-1.6.1s-1.1 0-1.6-.1v.6H8.7v-.9c-.9-.3-1.7-.7-2.4-1.5Z"
        fill="currentColor"
        strokeWidth="1"
      />
    </>
  ),
  moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
  bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
  coffee: (
    <>
      <path d="M4 8h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm13 1h2a3 3 0 0 1 0 6h-2M7 2v2m4-2v2m4-2v2" />
    </>
  ),
  bat: <path d="m12 8 3-4 1 5 6-3-3 11-4-2-3 5-3-5-4 2L2 6l6 3 1-5 3 4Z" />,
  sparkles: (
    <>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 3C9 2 1 8 6 16c8 6 15-2 14-13ZM4 21 16 8" />
    </>
  ),
  hat: (
    <>
      <path d="M8 16.4 10.8 6.6c.5-1.8 1.8-3 3.6-3.4l2.4-.5-1.4 2.1c-.6.9-.8 2-.5 3L16 16.4" />
      <path d="M3 18.6c0-1.3 4-2.4 9-2.4s9 1.1 9 2.4-4 2.4-9 2.4-9-1.1-9-2.4Z" />
      <path d="M8.8 13.6h6.8" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 6 6" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 3h10v7a5 5 0 0 1-10 0V3Zm5 12v5m-4 1h8M7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  chevron: <path d="m7 10 5 5 5-5" />,
  check: <path d="m5 12 4 4L19 6" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v.1" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  heart: <path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-5 5 8 15 8 15S25 10 20 5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" />
    </>
  ),
  cloud: (
    <path d="M6 19a5 5 0 1 1 .5-10A7 7 0 0 1 20 12a3.5 3.5 0 0 1-1.5 7H6Z" />
  ),
  bag: (
    <>
      <rect x="4" y="7" width="16" height="14" rx="3" />
      <path d="M8 9V6a4 4 0 0 1 8 0v3M8 14h8" />
    </>
  ),
  water: (
    <>
      <path d="M9 3h6v4l2 3v10H7V10l2-3V3Zm0 0h6M7 14h10" />
    </>
  ),
  whistle: (
    <>
      <path d="M16 9h5v4h-5a6 6 0 1 1-6-6h3v2Z" />
      <circle cx="10" cy="13" r="2" />
      <path d="m16 3-1 2m5 0-2 1" />
    </>
  ),
};

export default function Icon({
  name,
  size = 20,
  className = '',
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {paths[name]}
    </svg>
  );
}
