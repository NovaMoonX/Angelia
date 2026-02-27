import { User } from '../user';

export const getPostAuthorName = (postAuthor?: User | null, currentUser?: User | null) => {
  if (!postAuthor) return 'Unknown User';
  let name = `${postAuthor.firstName} ${postAuthor.lastName}`;

  if (currentUser && postAuthor.id === currentUser.id) {
    name += ' (You)';
  }
  return name;
};
