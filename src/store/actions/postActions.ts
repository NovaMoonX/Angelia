import { FileUpload } from '@/components/PostCreateMediaUploader';
import { db, storage } from '@/lib/firebase';
import { MediaItem, Post } from '@/lib/post';
import { PostFormData } from '@/screens/PostCreate';
import generateId from '@/util/generateId';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
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
  upload: FileUpload,
  postId: string,
  index: number,
): Promise<string> {
  const ext = upload.file.name.split('.').pop() || 'media';
  const path = `posts/${postId}/media_${index}_${upload.id}.${ext}`;
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, upload.file);
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

    const uploadedUrls: string[] = [];
    const fileUploads = formData.fileUploads || [];
    const postId = generateId('post');
    const postRef = doc(db, 'posts', postId);
    try {
      // 1. Create post with status 'uploading' and no media
      const uploadingPost: Post = {
        id: postId,
        authorId: user.id,
        channelId: formData.channelId,
        text: formData.text,
        media: null,
        timestamp: Date.now(),
        reactions: [],
        comments: [],
        conversationEnrollees: [],
        markedForDeletionAt: null,
        status: 'uploading',
      };
      await setDoc(postRef, uploadingPost);

      // 2. Upload media files
      for (let i = 0; i < fileUploads.length; i++) {
        const url = await uploadMediaFile(fileUploads[i], postId, i);
        uploadedUrls.push(url);
      }

      if (uploadedUrls.length < fileUploads.length) {
        throw new Error('Failed to upload all media files');
      }

      // 3. Update post with media and status 'ready'
      const readyMedia: MediaItem[] = uploadedUrls.map((url, i) => ({
        url,
        type: fileUploads[i].file.type.startsWith('image') ? 'image' : 'video',
      }));
      await updateDoc(postRef, {
        media: readyMedia,
        status: 'ready',
      });

      const newPost: Post = {
        ...uploadingPost,
        media: readyMedia,
        status: 'ready',
      };
      return newPost;
    } catch (err) {
      // Clean up any uploaded media if post creation fails
      if (uploadedUrls.length > 0) {
        await deleteMediaFiles(uploadedUrls);
      }
      // Set post status to 'error' if post was created
      try {
        await updateDoc(postRef, { status: 'error' });
      } catch {}
      return rejectWithValue(err);
    }
  },
);
