export function AngeliaLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Warm gradient background circle */}
      <defs>
        <linearGradient id="warmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      
      {/* Outer circle */}
      <circle cx="100" cy="100" r="90" fill="url(#warmGradient)" opacity="0.1" />
      
      {/* Stylized house/home icon representing family connection */}
      <path
        d="M100 50 L150 85 L150 140 L50 140 L50 85 Z"
        fill="url(#warmGradient)"
        opacity="0.8"
      />
      
      {/* Door */}
      <rect x="85" y="110" width="30" height="30" fill="#d97706" />
      
      {/* Window 1 */}
      <rect x="65" y="95" width="15" height="15" fill="#fbbf24" opacity="0.7" />
      
      {/* Window 2 */}
      <rect x="120" y="95" width="15" height="15" fill="#fbbf24" opacity="0.7" />
      
      {/* Roof peak - warm accent */}
      <path
        d="M100 50 L150 85 L145 88 L100 56 L55 88 L50 85 Z"
        fill="#d97706"
      />
      
      {/* Heart symbol - representing connection */}
      <path
        d="M100 75 Q95 70 90 70 Q85 70 85 75 Q85 80 100 90 Q115 80 115 75 Q115 70 110 70 Q105 70 100 75 Z"
        fill="#fbbf24"
      />
    </svg>
  );
}
