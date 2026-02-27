import { db, storage } from '@/lib/firebase';
import { Post } from '@/lib/post';
import { PostFormData } from '@/screens/PostCreate';
import generateId from '@/util/generateId';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addDoc, collection } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  ref as storageRefFromUrl,
  uploadBytes,
} from 'firebase/storage';
import { RootState } from '..';

// Helper to upload a single file to Firebase Storage
async function uploadMediaFile(
  file: File,
  postId: string,
  index: number,
): Promise<string> {
  const ext = file.name.split('.').pop() || 'media';
  const path = `posts/${postId}/media_${index}_${generateId('postMedia')}.${ext}`;
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
}

// Clean up uploaded media if post creation fails
async function deleteMediaFiles(urls: string[]) {
  const deletePromises = urls.map(async (url) => {
    try {
      // Convert download URL to storage path
      // Firebase Storage allows refFromURL
      const fileRef = storageRefFromUrl(storage, url);
      await deleteObject(fileRef);
    } catch (err) {
      // Ignore errors for individual files
      // Optionally log error
      console.error('Failed to delete media file:', url, err);
    }
  });
  await Promise.all(deletePromises);
}

// Thunk to upload a post with media
export const uploadPost = createAsyncThunk(
  'posts/uploadPost',
  async (
    { formData }: { formData: PostFormData },
    { rejectWithValue, getState },
  ) => {
    const state = getState() as RootState;

    const user = state.users?.currentUser;

    if (!user) {
      return rejectWithValue('User not authenticated');
    }

    // 1. Upload media files
    const uploadedUrls: string[] = [];
    const mediaFiles = formData.mediaFiles || [];
    try {
      const postId = generateId('post');
      for (let i = 0; i < mediaFiles.length; i++) {
        const url = await uploadMediaFile(mediaFiles[i], postId, i);
        uploadedUrls.push(url);
      }

      const newPost: Post = {
        id: postId,
        authorId: user.id,
        channelId: formData.channelId,
        text: formData.text,
        media: uploadedUrls.map((url, i) => ({
          url,
          type: mediaFiles[i].type.startsWith('image') ? 'image' : 'video',
        })),
        timestamp: Date.now(),
        reactions: [],
        comments: [],
        conversationEnrollees: [],
        markedForDeletionAt: null,
      };

      // 2. Create post in Firestore
      await addDoc(collection(db, 'posts'), newPost);
      return newPost;
    } catch (err) {
      // Clean up any uploaded media if post creation fails
      if (uploadedUrls.length > 0) {
        await deleteMediaFiles(uploadedUrls);
      }
      return rejectWithValue(err);
    }
  },
);
