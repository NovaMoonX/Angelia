import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

type ItemType = 'channel' | 'channelInviteCode' | 'post' | 'postMedia' | 'postComment' | 'joinRequest';

// Use nanoid for channels to get a shorter ID (URL-friendly)
// and uuidv4 for more secure, random IDs
export default function generateId(type: ItemType) {
  let uuid = '';

  switch (type) {
    case 'channel':
      uuid = nanoid()
      break;
    case 'channelInviteCode':
      uuid = nanoid(8).toUpperCase(); // Shorter, uppercase for invite codes
      break;
    case 'joinRequest':
      uuid = nanoid();
      break;
    case 'post':
      uuid = nanoid(); // Use default nanoid for posts
      break;
    case 'postMedia':
    case 'postComment':
      uuid = uuidv4();
      break;
    default:
      throw new Error(`Unsupported type for ID generation: ${type}`);
  }

  return uuid;
}
