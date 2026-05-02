// Premium SVG illustrations for empty states and decorations

export function EmptyBoardIllustration({ width = 220, height = 180 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="55" height="130" rx="8" fill="var(--surface-2)" stroke="var(--border-color)" strokeWidth="1.5"/>
      <rect x="28" y="44" width="39" height="6" rx="3" fill="var(--accent-primary)" opacity="0.4"/>
      <rect x="28" y="56" width="39" height="26" rx="4" fill="var(--surface-3)" stroke="var(--border-color)" strokeWidth="1"/>
      <rect x="28" y="88" width="39" height="26" rx="4" fill="var(--surface-3)" stroke="var(--border-color)" strokeWidth="1"/>
      <rect x="83" y="30" width="55" height="130" rx="8" fill="var(--surface-2)" stroke="var(--border-color)" strokeWidth="1.5"/>
      <rect x="91" y="44" width="39" height="6" rx="3" fill="#3b82f6" opacity="0.4"/>
      <rect x="91" y="56" width="39" height="26" rx="4" fill="var(--surface-3)" stroke="var(--border-color)" strokeWidth="1"/>
      <rect x="146" y="30" width="55" height="130" rx="8" fill="var(--surface-2)" stroke="var(--border-color)" strokeWidth="1.5"/>
      <rect x="154" y="44" width="39" height="6" rx="3" fill="#22c55e" opacity="0.4"/>
      {/* Floating card animation hint */}
      <rect x="87" y="80" width="47" height="30" rx="6" fill="var(--accent-primary)" opacity="0.15" stroke="var(--accent-primary)" strokeWidth="1" strokeDasharray="4 2"/>
      <path d="M110 90 L110 98 M106 94 L114 94" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Decorative circles */}
      <circle cx="180" cy="20" r="6" fill="var(--accent-primary)" opacity="0.1"/>
      <circle cx="30" cy="15" r="4" fill="#22c55e" opacity="0.15"/>
      <circle cx="195" cy="150" r="8" fill="#f59e0b" opacity="0.1"/>
    </svg>
  );
}

export function EmptyInboxIllustration({ width = 200, height = 160 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Inbox box */}
      <path d="M40 60 L60 30 L140 30 L160 60 L160 120 C160 124.4 156.4 128 152 128 L48 128 C43.6 128 40 124.4 40 120 L40 60Z" fill="var(--surface-2)" stroke="var(--border-color)" strokeWidth="1.5"/>
      <path d="M40 60 L70 60 C70 60 75 80 100 80 C125 80 130 60 130 60 L160 60" stroke="var(--border-color)" strokeWidth="1.5" fill="none"/>
      {/* Document pages */}
      <rect x="70" y="85" width="60" height="4" rx="2" fill="var(--surface-3)"/>
      <rect x="80" y="95" width="40" height="4" rx="2" fill="var(--surface-3)"/>
      <rect x="75" y="105" width="50" height="4" rx="2" fill="var(--surface-3)"/>
      {/* Stars */}
      <circle cx="175" cy="25" r="3" fill="var(--accent-primary)" opacity="0.3"/>
      <circle cx="25" cy="45" r="2" fill="#f59e0b" opacity="0.3"/>
      <circle cx="185" cy="105" r="4" fill="#22c55e" opacity="0.2"/>
    </svg>
  );
}

export function EmptyTeamIllustration({ width = 200, height = 160 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center person */}
      <circle cx="100" cy="55" r="18" fill="var(--accent-primary)" opacity="0.2" stroke="var(--accent-primary)" strokeWidth="1.5"/>
      <circle cx="100" cy="50" r="7" fill="var(--accent-primary)" opacity="0.4"/>
      <path d="M86 67 C86 60 93 56 100 56 C107 56 114 60 114 67" stroke="var(--accent-primary)" strokeWidth="1.5" fill="none" opacity="0.4"/>
      {/* Left person */}
      <circle cx="52" cy="75" r="14" fill="#22c55e" opacity="0.15" stroke="#22c55e" strokeWidth="1"/>
      <circle cx="52" cy="71" r="5" fill="#22c55e" opacity="0.3"/>
      <path d="M42 83 C42 78 47 75 52 75 C57 75 62 78 62 83" stroke="#22c55e" strokeWidth="1" fill="none" opacity="0.3"/>
      {/* Right person */}
      <circle cx="148" cy="75" r="14" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1"/>
      <circle cx="148" cy="71" r="5" fill="#f59e0b" opacity="0.3"/>
      <path d="M138 83 C138 78 143 75 148 75 C153 75 158 78 158 83" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.3"/>
      {/* Connection lines */}
      <line x1="75" y1="65" x2="65" y2="72" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3"/>
      <line x1="125" y1="65" x2="135" y2="72" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3"/>
      {/* Plus circle */}
      <circle cx="100" cy="120" r="12" fill="var(--surface-2)" stroke="var(--border-color)" strokeWidth="1.5"/>
      <path d="M100 114 L100 126 M94 120 L106 120" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function EmptyTargetIllustration({ width = 200, height = 160 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Target rings */}
      <circle cx="100" cy="75" r="50" fill="none" stroke="var(--border-color)" strokeWidth="1.5"/>
      <circle cx="100" cy="75" r="35" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" opacity="0.3"/>
      <circle cx="100" cy="75" r="20" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" opacity="0.5"/>
      <circle cx="100" cy="75" r="6" fill="var(--accent-primary)" opacity="0.8"/>
      {/* Arrow */}
      <line x1="140" y1="35" x2="108" y2="67" stroke="#f59e0b" strokeWidth="2"/>
      <polygon points="106,69 110,63 116,67" fill="#f59e0b"/>
      {/* Sparkles */}
      <circle cx="155" cy="28" r="3" fill="#f59e0b" opacity="0.5"/>
      <circle cx="162" cy="22" r="2" fill="#f59e0b" opacity="0.3"/>
      <circle cx="40" cy="130" r="4" fill="var(--accent-primary)" opacity="0.15"/>
      <circle cx="170" cy="120" r="3" fill="#22c55e" opacity="0.2"/>
    </svg>
  );
}

export function EmptyChartIllustration({ width = 200, height = 160 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chart axes */}
      <line x1="40" y1="130" x2="180" y2="130" stroke="var(--border-color)" strokeWidth="1.5"/>
      <line x1="40" y1="130" x2="40" y2="25" stroke="var(--border-color)" strokeWidth="1.5"/>
      {/* Bars */}
      <rect x="55" y="90" width="18" height="40" rx="3" fill="var(--accent-primary)" opacity="0.3"/>
      <rect x="83" y="60" width="18" height="70" rx="3" fill="var(--accent-primary)" opacity="0.5"/>
      <rect x="111" y="75" width="18" height="55" rx="3" fill="var(--accent-primary)" opacity="0.4"/>
      <rect x="139" y="45" width="18" height="85" rx="3" fill="var(--accent-primary)" opacity="0.6"/>
      {/* Trend line */}
      <path d="M64 85 L92 55 L120 68 L148 38" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="64" cy="85" r="3" fill="#22c55e"/>
      <circle cx="92" cy="55" r="3" fill="#22c55e"/>
      <circle cx="120" cy="68" r="3" fill="#22c55e"/>
      <circle cx="148" cy="38" r="3" fill="#22c55e"/>
      {/* Decorations */}
      <circle cx="175" cy="20" r="4" fill="#f59e0b" opacity="0.2"/>
    </svg>
  );
}

export function AuthIllustration({ width = 400, height = 400 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background glow */}
      <circle cx="200" cy="200" r="150" fill="url(#authGlow)" opacity="0.15"/>
      
      {/* Floating board cards */}
      <g transform="rotate(-12 130 140)">
        <rect x="80" y="100" width="100" height="70" rx="10" fill="var(--surface-2)" stroke="var(--accent-primary)" strokeWidth="1" opacity="0.7"/>
        <rect x="92" y="116" width="50" height="5" rx="2.5" fill="var(--accent-primary)" opacity="0.4"/>
        <rect x="92" y="128" width="70" height="4" rx="2" fill="var(--surface-3)"/>
        <rect x="92" y="138" width="40" height="4" rx="2" fill="var(--surface-3)"/>
        <circle cx="160" cy="152" r="8" fill="var(--accent-primary)" opacity="0.2"/>
      </g>
      
      <g transform="rotate(8 280 160)">
        <rect x="230" y="120" width="100" height="70" rx="10" fill="var(--surface-2)" stroke="#22c55e" strokeWidth="1" opacity="0.7"/>
        <rect x="242" y="136" width="50" height="5" rx="2.5" fill="#22c55e" opacity="0.4"/>
        <rect x="242" y="148" width="70" height="4" rx="2" fill="var(--surface-3)"/>
        <rect x="242" y="158" width="55" height="4" rx="2" fill="var(--surface-3)"/>
        <circle cx="310" cy="172" r="8" fill="#22c55e" opacity="0.2"/>
      </g>
      
      <g transform="rotate(-5 200 280)">
        <rect x="150" y="240" width="100" height="70" rx="10" fill="var(--surface-2)" stroke="#f59e0b" strokeWidth="1" opacity="0.7"/>
        <rect x="162" y="256" width="50" height="5" rx="2.5" fill="#f59e0b" opacity="0.4"/>
        <rect x="162" y="268" width="70" height="4" rx="2" fill="var(--surface-3)"/>
        <rect x="162" y="278" width="45" height="4" rx="2" fill="var(--surface-3)"/>
        <circle cx="230" cy="292" r="8" fill="#f59e0b" opacity="0.2"/>
      </g>
      
      {/* Center kanban icon */}
      <g transform="translate(170 175)">
        <rect width="60" height="50" rx="8" fill="var(--accent-primary)" opacity="0.15" stroke="var(--accent-primary)" strokeWidth="1.5"/>
        <rect x="10" y="10" width="12" height="25" rx="3" fill="var(--accent-primary)" opacity="0.5"/>
        <rect x="25" y="10" width="12" height="18" rx="3" fill="var(--accent-primary)" opacity="0.7"/>
        <rect x="40" y="10" width="12" height="30" rx="3" fill="var(--accent-primary)" opacity="0.4"/>
      </g>
      
      {/* Connecting dots */}
      <circle cx="200" cy="200" r="4" fill="var(--accent-primary)" opacity="0.6"/>
      <circle cx="100" cy="90" r="3" fill="var(--accent-primary)" opacity="0.2"/>
      <circle cx="310" cy="110" r="3" fill="#22c55e" opacity="0.2"/>
      <circle cx="340" cy="270" r="4" fill="#f59e0b" opacity="0.15"/>
      <circle cx="60" cy="250" r="3" fill="#8b5cf6" opacity="0.2"/>
      
      {/* Orbiting ring */}
      <ellipse cx="200" cy="200" rx="170" ry="170" fill="none" stroke="var(--accent-primary)" strokeWidth="0.5" opacity="0.15" strokeDasharray="8 12"/>
      <ellipse cx="200" cy="200" rx="120" ry="120" fill="none" stroke="var(--accent-primary)" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 8"/>
      
      <defs>
        <radialGradient id="authGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  );
}
