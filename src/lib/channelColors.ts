// Pre-defined color options for channels
export interface ChannelColorOption {
  name: string;
  value: string;
  tailwindClass: string;
}

export const CHANNEL_COLORS: ChannelColorOption[] = [
  { name: 'Indigo', value: '#6366f1', tailwindClass: 'bg-indigo-500' },
  { name: 'Amber', value: '#f59e0b', tailwindClass: 'bg-amber-500' },
  { name: 'Emerald', value: '#10b981', tailwindClass: 'bg-emerald-500' },
  { name: 'Pink', value: '#ec4899', tailwindClass: 'bg-pink-500' },
  { name: 'Lime', value: '#84cc16', tailwindClass: 'bg-lime-500' },
  { name: 'Purple', value: '#a855f7', tailwindClass: 'bg-purple-500' },
  { name: 'Rose', value: '#f43f5e', tailwindClass: 'bg-rose-500' },
  { name: 'Cyan', value: '#06b6d4', tailwindClass: 'bg-cyan-500' },
  { name: 'Orange', value: '#f97316', tailwindClass: 'bg-orange-500' },
  { name: 'Teal', value: '#14b8a6', tailwindClass: 'bg-teal-500' },
  { name: 'Blue', value: '#3b82f6', tailwindClass: 'bg-blue-500' },
  { name: 'Violet', value: '#8b5cf6', tailwindClass: 'bg-violet-500' },
];

export const DEFAULT_CHANNEL_COLOR = CHANNEL_COLORS[0].value; // Indigo
