export function CategoricalAgencyIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Left side: Sharer categorizing updates */}
      <g id="sharer">
        {/* Person icon */}
        <circle cx="80" cy="80" r="25" fill="url(#accentGradient)" opacity="0.3" />
        <circle cx="80" cy="72" r="10" fill="#f59e0b" opacity="0.6" />
        <path d="M60 92 Q80 85 100 92" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.6" />
        
        {/* Channels flowing from sharer */}
        <g id="channels">
          {/* Channel 1 - Family Updates */}
          <rect x="130" y="40" width="100" height="30" rx="15" fill="#fbbf24" opacity="0.4" />
          <text x="180" y="60" fontSize="12" textAnchor="middle" fill="#78350f" fontWeight="600">Family Updates</text>
          
          {/* Channel 2 - Photos */}
          <rect x="130" y="80" width="100" height="30" rx="15" fill="#fbbf24" opacity="0.4" />
          <text x="180" y="100" fontSize="12" textAnchor="middle" fill="#78350f" fontWeight="600">Photos</text>
          
          {/* Channel 3 - Milestones */}
          <rect x="130" y="120" width="100" height="30" rx="15" fill="#fbbf24" opacity="0.4" />
          <text x="180" y="140" fontSize="12" textAnchor="middle" fill="#78350f" fontWeight="600">Milestones</text>
        </g>
        
        {/* Label */}
        <text x="80" y="135" fontSize="14" textAnchor="middle" fill="#92400e" fontWeight="700">Sharer</text>
        <text x="80" y="150" fontSize="10" textAnchor="middle" fill="#92400e" opacity="0.7">Categorizes</text>
      </g>

      {/* Center: Flow arrows */}
      <g id="flow">
        <path d="M245 55 L345 55" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.5" />
        <path d="M245 95 L345 95" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.5" />
        <path d="M245 135 L345 135" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.5" />
        
        {/* Arrow marker */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" opacity="0.5" />
          </marker>
        </defs>
      </g>

      {/* Right side: Reader subscribing */}
      <g id="reader">
        {/* Person icon */}
        <circle cx="520" cy="80" r="25" fill="url(#accentGradient)" opacity="0.3" />
        <circle cx="520" cy="72" r="10" fill="#d97706" opacity="0.6" />
        <path d="M500 92 Q520 85 540 92" stroke="#d97706" strokeWidth="2" fill="none" opacity="0.6" />
        
        {/* Subscription checkmarks */}
        <g id="subscriptions">
          {/* Selected channels with checkmarks */}
          <circle cx="360" cy="55" r="12" fill="#10b981" opacity="0.3" />
          <path d="M356 55 L359 58 L365 52" stroke="#10b981" strokeWidth="2" fill="none" />
          
          <circle cx="360" cy="135" r="12" fill="#10b981" opacity="0.3" />
          <path d="M356 135 L359 138 L365 132" stroke="#10b981" strokeWidth="2" fill="none" />
          
          {/* Unselected channel */}
          <circle cx="360" cy="95" r="12" fill="#e5e7eb" opacity="0.5" />
        </g>
        
        {/* Subscription lines */}
        <path d="M375 55 L490 70" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
        <path d="M375 135 L490 90" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
        
        {/* Label */}
        <text x="520" y="135" fontSize="14" textAnchor="middle" fill="#92400e" fontWeight="700">Reader</text>
        <text x="520" y="150" fontSize="10" textAnchor="middle" fill="#92400e" opacity="0.7">Subscribes</text>
      </g>

      {/* Bottom: Agency message */}
      <g id="message">
        <rect x="150" y="200" width="300" height="80" rx="10" fill="url(#accentGradient)" opacity="0.1" />
        <text x="300" y="230" fontSize="16" textAnchor="middle" fill="#92400e" fontWeight="700">Bilateral Agency</text>
        <text x="300" y="250" fontSize="11" textAnchor="middle" fill="#92400e" opacity="0.8">You control what you share</text>
        <text x="300" y="265" fontSize="11" textAnchor="middle" fill="#92400e" opacity="0.8">You control what you see</text>
      </g>
    </svg>
  );
}
