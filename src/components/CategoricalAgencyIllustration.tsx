export function CategoricalAgencyIllustration({
  className = '',
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" />
          <stop offset="100%" stopColor="color-mix(in srgb, var(--color-accent) 60%, black)" />
        </linearGradient>
      </defs>

      {/* Left side: Sharer categorizing updates */}
      <g id="sharer">
        {/* Person icon */}
        <circle cx="80" cy="80" r="25" fill="url(#accentGradient)" opacity="0.18" />
        <circle cx="80" cy="72" r="10" fill="var(--color-accent)" opacity="0.9" />
        <path d="M60 92 Q80 85 100 92" stroke="var(--color-accent)" strokeWidth="2" fill="none" opacity="0.8" />
        
        {/* Channels flowing from sharer */}
        <g id="channels">
          {/* Channel 1 - Family Updates */}
          <rect x="130" y="40" width="100" height="30" rx="15" fill="var(--color-secondary)" opacity="0.28" />
          <text x="180" y="60" fontSize="12" textAnchor="middle" fill="var(--color-secondary-foreground)" fontWeight="600">Family Updates</text>
          
          {/* Channel 2 - Photos */}
          <rect x="130" y="80" width="100" height="30" rx="15" fill="var(--color-secondary)" opacity="0.28" />
          <text x="180" y="100" fontSize="12" textAnchor="middle" fill="var(--color-secondary-foreground)" fontWeight="600">Photos</text>
          
          {/* Channel 3 - Milestones */}
          <rect x="130" y="120" width="100" height="30" rx="15" fill="var(--color-secondary)" opacity="0.28" />
          <text x="180" y="140" fontSize="12" textAnchor="middle" fill="var(--color-secondary-foreground)" fontWeight="600">Milestones</text>
        </g>
        
        {/* Label */}
        <text x="80" y="135" fontSize="14" textAnchor="middle" fill="var(--color-popover-foreground)" fontWeight="700">Sharer</text>
        <text x="80" y="150" fontSize="10" textAnchor="middle" fill="var(--color-muted-foreground)" opacity="0.85">Categorizes</text>
      </g>

      {/* Center: Flow arrows */}
      <g id="flow">
        <path d="M245 55 L345 55" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.45" />
        <path d="M245 95 L345 95" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.45" />
        <path d="M245 135 L345 135" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.45" />
        
        {/* Arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="var(--color-accent)" opacity="0.6" />
          </marker>
        </defs>
      </g>

      {/* Right side: Reader subscribing */}
      <g id="reader">
        {/* Person icon */}
        <circle cx="520" cy="80" r="25" fill="url(#accentGradient)" opacity="0.18" />
        <circle cx="520" cy="72" r="10" fill="var(--color-primary)" opacity="0.85" />
        <path d="M500 92 Q520 85 540 92" stroke="var(--color-primary)" strokeWidth="2" fill="none" opacity="0.8" />
        
        {/* Subscription checkmarks */}
        <g id="subscriptions">
          {/* Selected channels with checkmarks */}
          <circle cx="360" cy="55" r="12" fill="var(--color-success)" opacity="0.22" />
          <path d="M356 55 L359 58 L365 52" stroke="var(--color-success)" strokeWidth="2" fill="none" />
          
          <circle cx="360" cy="135" r="12" fill="var(--color-success)" opacity="0.22" />
          <path d="M356 135 L359 138 L365 132" stroke="var(--color-success)" strokeWidth="2" fill="none" />
          
          {/* Unselected channel */}
          <circle cx="360" cy="95" r="12" fill="var(--color-muted)" opacity="0.6" />
        </g>
        
        {/* Subscription lines */}
        <path d="M375 55 L490 70" stroke="var(--color-success)" strokeWidth="2" strokeDasharray="5,5" opacity="0.38" />
        <path d="M375 135 L490 90" stroke="var(--color-success)" strokeWidth="2" strokeDasharray="5,5" opacity="0.38" />
        
        {/* Label */}
        <text x="520" y="135" fontSize="14" textAnchor="middle" fill="var(--color-popover-foreground)" fontWeight="700">Reader</text>
        <text x="520" y="150" fontSize="10" textAnchor="middle" fill="var(--color-muted-foreground)" opacity="0.85">Subscribes</text>
      </g>

      {/* Bottom: Agency message */}
      <g id="message">
        <rect x="150" y="200" width="300" height="80" rx="10" fill="url(#accentGradient)" opacity="0.08" />
        <text x="300" y="230" fontSize="16" textAnchor="middle" fill="var(--color-popover-foreground)" fontWeight="700">Bilateral Agency</text>
        <text x="300" y="250" fontSize="11" textAnchor="middle" fill="var(--color-muted-foreground)" opacity="0.9">You control what you share</text>
        <text x="300" y="265" fontSize="11" textAnchor="middle" fill="var(--color-muted-foreground)" opacity="0.9">You control what you see</text>
      </g>
    </svg>
  );
}
