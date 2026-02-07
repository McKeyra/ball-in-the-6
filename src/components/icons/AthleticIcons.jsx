
export const BaseballCap = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M2 12h20" />
    <path d="M22 12s-1.5-5-9-7-9 7-9 7" />
    <path d="M12 5c-2 0-3 1-3 1" />
    <circle cx="12" cy="5" r="1" fill="currentColor" />
  </svg>
);

export const Toque = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M6 20h12" />
    <path d="M18 20V9a6 6 0 0 0-12 0v11" />
    <path d="M6 15h12" />
    <path d="M12 3v2" />
    <circle cx="12" cy="2" r="1.5" />
  </svg>
);

export const Hoodie = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M12 2a5 5 0 0 0-5 5v3h10V7a5 5 0 0 0-5-5z" />
    <path d="M4 10l2-2" />
    <path d="M20 10l-2-2" />
    <path d="M7 10v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10" />
    <path d="M12 14h.01" />
    <path d="M12 17h.01" />
  </svg>
);

export const LongSleeve = ({ size = 24, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M16 2h-8a4 4 0 0 0-4 4v1h16V6a4 4 0 0 0-4-4z" />
    <path d="M4 7l-2 6 3 1 2-4" />
    <path d="M20 7l2 6-3 1-2-4" />
    <path d="M4 7v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" />
    <path d="M12 11l0 6" />
  </svg>
);