import { nanoid } from 'nanoid';

type ItemType = 'channel' | 'channelInviteCode'

// Use nanoid for channels to get a shorter ID (URL-friendly)
// and uuidv4 for other types if needed in the future
export default function generateId(type: ItemType) {
  let uuid = '';

  switch (type) {
    case 'channel':
      uuid = nanoid()
      break;
    case 'channelInviteCode':
      uuid = nanoid(8).toUpperCase(); // Shorter, uppercase for invite codes
      break;
    default:
      throw new Error(`Unsupported type for ID generation: ${type}`);
  }

  return uuid;
}
