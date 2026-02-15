import { CHANNEL_COLOR_MAP } from '../channelColors';

export const getColorPair = (channel: { color: string }) => {
  const colorData = CHANNEL_COLOR_MAP.get(channel.color);
  return {
    backgroundColor: colorData?.value || '#c7d2fe',
    textColor: colorData?.textColor || '#4338ca',
  };
};
