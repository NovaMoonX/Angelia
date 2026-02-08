// Pre-defined color options for channels
export interface ChannelColorOption {
  name: string;
  value: string;
  textColor: string;
  tailwindClass: string;
}

export const CHANNEL_COLORS: ChannelColorOption[] = [
  {
    name: 'INDIGO',
    value: '#c7d2fe',
    textColor: '#4338ca',
    tailwindClass: 'bg-indigo-200',
  },
  {
    name: 'AMBER',
    value: '#fde68a',
    textColor: '#d97706',
    tailwindClass: 'bg-amber-200',
  },
  {
    name: 'EMERALD',
    value: '#a7f3d0',
    textColor: '#047857',
    tailwindClass: 'bg-emerald-200',
  },
  {
    name: 'PINK',
    value: '#fbcfe8',
    textColor: '#be185d',
    tailwindClass: 'bg-pink-200',
  },
  {
    name: 'LIME',
    value: '#d9f99d',
    textColor: '#4d7c0f',
    tailwindClass: 'bg-lime-200',
  },
  {
    name: 'PURPLE',
    value: '#e9d5ff',
    textColor: '#7e22ce',
    tailwindClass: 'bg-purple-200',
  },
  {
    name: 'ROSE',
    value: '#fecdd3',
    textColor: '#be123c',
    tailwindClass: 'bg-rose-200',
  },
  {
    name: 'CYAN',
    value: '#a5f3fc',
    textColor: '#0e7490',
    tailwindClass: 'bg-cyan-200',
  },
  {
    name: 'ORANGE',
    value: '#fed7aa',
    textColor: '#c2410c',
    tailwindClass: 'bg-orange-200',
  },
  {
    name: 'TEAL',
    value: '#99f6e4',
    textColor: '#0f766e',
    tailwindClass: 'bg-teal-200',
  },
  {
    name: 'BLUE',
    value: '#bfdbfe',
    textColor: '#1d4ed8',
    tailwindClass: 'bg-blue-200',
  },
  {
    name: 'VIOLET',
    value: '#ddd6fe',
    textColor: '#6d28d9',
    tailwindClass: 'bg-violet-200',
  },
];

// Derived map for efficient color lookups by name
export const CHANNEL_COLOR_MAP = new Map(
  CHANNEL_COLORS.map((color) => [
    color.name,
    {
      value: color.value,
      textColor: color.textColor,
      tailwindClass: color.tailwindClass,
    },
  ]),
);

export const DEFAULT_CHANNEL_COLOR = CHANNEL_COLORS[0].name; // INDIGO
