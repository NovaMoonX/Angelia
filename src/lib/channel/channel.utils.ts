import { CHANNEL_COLOR_MAP, DEFAULT_CHANNEL_COLOR } from '../channelColors';

export const getColorPair = (channel: { color?: string } | null | undefined) => {
  const colorData = CHANNEL_COLOR_MAP.get(channel?.color ?? DEFAULT_CHANNEL_COLOR);
  return {
    backgroundColor: colorData?.value || '#c7d2fe',
    textColor: colorData?.textColor || '#4338ca',
  };
};
