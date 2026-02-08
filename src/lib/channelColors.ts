// Pre-defined color options for channels
export interface ChannelColorOption {
  name: string;
  value: string;
  tailwindClass: string;
}

export const CHANNEL_COLORS: ChannelColorOption[] = [
  { name: 'Indigo', value: '#c7d2fe', tailwindClass: 'bg-indigo-200' },
  { name: 'Amber', value: '#fde68a', tailwindClass: 'bg-amber-200' },
  { name: 'Emerald', value: '#a7f3d0', tailwindClass: 'bg-emerald-200' },
  { name: 'Pink', value: '#fbcfe8', tailwindClass: 'bg-pink-200' },
  { name: 'Lime', value: '#d9f99d', tailwindClass: 'bg-lime-200' },
  { name: 'Purple', value: '#e9d5ff', tailwindClass: 'bg-purple-200' },
  { name: 'Rose', value: '#fecdd3', tailwindClass: 'bg-rose-200' },
  { name: 'Cyan', value: '#a5f3fc', tailwindClass: 'bg-cyan-200' },
  { name: 'Orange', value: '#fed7aa', tailwindClass: 'bg-orange-200' },
  { name: 'Teal', value: '#99f6e4', tailwindClass: 'bg-teal-200' },
  { name: 'Blue', value: '#bfdbfe', tailwindClass: 'bg-blue-200' },
  { name: 'Violet', value: '#ddd6fe', tailwindClass: 'bg-violet-200' },
];

export const DEFAULT_CHANNEL_COLOR = CHANNEL_COLORS[0].value; // Indigo
