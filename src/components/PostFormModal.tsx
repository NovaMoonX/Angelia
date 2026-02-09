import { useMemo, useState } from 'react';
import {
  Modal,
  Form,
  FormFactories,
  Button,
  type FormCustomFieldProps,
  Badge,
  Callout,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { X } from '@moondreamsdev/dreamer-ui/symbols';
import type { Channel, MediaItem } from '@lib/mockData';

export interface PostFormData {
  text: string;
  channelId: string;
  media: MediaItem[];
  isHighPriority: boolean;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Accepted file types
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

// Helper to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const result = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  return result;
}

// Helper to validate file
function validateFile(file: File): { valid: boolean; message?: string } {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      message: `${file.name}: File type not supported. Please use images (JPEG, PNG, GIF, WebP) or videos (MP4, WebM, OGG).`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      message: `${file.name}: File is too large (${formatFileSize(file.size)}). Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  return { valid: true };
}

interface MediaUploaderFieldProps {
  value: unknown;
  onValueChange: (value: MediaItem[]) => void;
}

// Custom media uploader field component
function MediaUploaderField({ value, onValueChange }: MediaUploaderFieldProps) {
  const mediaItems = (value as MediaItem[]) || [];
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    const files = Array.from(e.target.files || []);

    // Check total count including existing
    if (mediaItems.length + files.length > MAX_FILES) {
      setError(`You can only attach up to ${MAX_FILES} files per post.`);
      e.target.value = '';
      return;
    }

    // Validate each file
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.message || 'Invalid file');
        e.target.value = '';
        return;
      }
    }

    // Convert files to MediaItems (using object URLs for preview)
    const newMediaItems: MediaItem[] = files.map((file) => {
      const type = ACCEPTED_IMAGE_TYPES.includes(file.type) ? 'image' : 'video';
      const url = URL.createObjectURL(file);
      return { type, url };
    });

    onValueChange([...mediaItems, ...newMediaItems]);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const updatedMedia = mediaItems.filter((_, i) => i !== index);
    onValueChange(updatedMedia);
    setError('');
  };

  return (
    <div className='space-y-3'>
      {/* File Input */}
      <div className='flex flex-col gap-2'>
        <input
          type='file'
          id='media-upload'
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          className='hidden'
        />
        <label htmlFor='media-upload'>
          <Button
            type='button'
            variant='outline'
            onClick={() => document.getElementById('media-upload')?.click()}
            disabled={mediaItems.length >= MAX_FILES}
            className='w-full'
          >
            {mediaItems.length >= MAX_FILES
              ? `Maximum ${MAX_FILES} files reached`
              : `Add Media (${mediaItems.length}/${MAX_FILES})`}
          </Button>
        </label>
        <p className='text-foreground/60 text-xs'>
          Images (JPEG, PNG, GIF, WebP) or Videos (MP4, WebM, OGG). Max {MAX_FILE_SIZE_MB}MB per file.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Callout variant='destructive' description={error} />
      )}

      {/* Media Preview Grid */}
      {mediaItems.length > 0 && (
        <div className='grid grid-cols-2 gap-3'>
          {mediaItems.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className='group relative aspect-video overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5'
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`Upload ${index + 1}`}
                  className='h-full w-full object-cover'
                />
              ) : (
                <video
                  src={item.url}
                  className='h-full w-full object-cover'
                  muted
                />
              )}
              {/* Remove Button */}
              <button
                type='button'
                onClick={() => handleRemove(index)}
                className='absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-100 transition-opacity hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100'
                aria-label='Remove media'
              >
                <X className='h-4 w-4' />
              </button>
              {/* Type Badge */}
              <Badge
                variant='base'
                className='absolute bottom-2 left-2 bg-background text-xs'
              >
                {item.type === 'image' ? '🖼️' : '🎥'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ChannelSelectorFieldProps {
  value: unknown;
  onValueChange: (value: string) => void;
  userChannels: Channel[];
}

// Custom channel selector field component
function ChannelSelectorField({ value, onValueChange, userChannels }: ChannelSelectorFieldProps) {
  const selectedChannelId = value as string;

  return (
    <div className='grid grid-cols-1 gap-2'>
      {userChannels.map((channel) => {
        const isSelected = selectedChannelId === channel.id;

        return (
          <button
            key={channel.id}
            type='button'
            onClick={() => onValueChange(channel.id)}
            className={join(
              'flex items-center gap-3 rounded-lg border p-3 text-left transition-all',
              'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary',
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-foreground/10 bg-background'
            )}
          >
            <div
              className='h-4 w-4 rounded-full border-2'
              style={{
                borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-foreground)',
                backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
              }}
            />
            <div className='flex-1'>
              <span className='text-foreground font-medium'>{channel.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormData) => void;
  userChannels: Channel[];
}

export function PostFormModal({
  isOpen,
  onClose,
  onSubmit,
  userChannels,
}: PostFormModalProps) {
  // Find the user's daily channel as default
  const defaultChannel = useMemo(() => {
    const dailyChannel = userChannels.find((ch) => ch.isDaily);
    return dailyChannel || userChannels[0];
  }, [userChannels]);

  // Memoize form fields to keep them stable
  const formFields = useMemo(
    () => [
      FormFactories.textarea({
        name: 'text',
        label: "What's on your mind?",
        placeholder: 'Share an update with your family...',
        required: true,
        rows: 4,
        isValid: (value: unknown) => {
          const text = ((value as string) || '').trim();
          if (!text) {
            return { valid: false, message: 'Please share something before posting' };
          }
          return { valid: true };
        },
      }),
      FormFactories.custom({
        name: 'channelId',
        label: 'Select Channel',
        required: true,
        renderComponent: (props: FormCustomFieldProps<unknown>) => (
          <ChannelSelectorField
            value={props.value}
            onValueChange={props.onValueChange}
            userChannels={userChannels}
          />
        ),
        isValid: (value: unknown) => {
          if (!value) {
            return { valid: false, message: 'Please select a channel' };
          }
          return { valid: true };
        },
      }),
      FormFactories.custom({
        name: 'media',
        label: 'Add Photos or Videos (Optional)',
        required: false,
        renderComponent: (props: FormCustomFieldProps<unknown>) => (
          <MediaUploaderField
            value={props.value}
            onValueChange={props.onValueChange}
          />
        ),
      }),
      FormFactories.checkbox({
        name: 'isHighPriority',
        label: 'Mark as High Priority',
        description: 'Use for important family announcements',
      }),
    ],
    [userChannels]
  );

  const initialData = useMemo(
    () => ({
      text: '',
      channelId: defaultChannel?.id || '',
      media: [] as MediaItem[],
      isHighPriority: false,
    }),
    [defaultChannel]
  );

  const handleFormSubmit = (formData: PostFormData) => {
    const data: PostFormData = {
      text: formData.text.trim(),
      channelId: formData.channelId,
      media: formData.media || [],
      isHighPriority: formData.isHighPriority || false,
    };

    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Create New Post'
    >
      <div className='space-y-6'>
        <Form<PostFormData>
          form={formFields}
          initialData={initialData}
          onSubmit={handleFormSubmit}
          submitButton={
            <div className='flex gap-3 pt-2'>
              <Button type='button' variant='tertiary' onClick={onClose} className='flex-1'>
                Cancel
              </Button>
              <Button type='submit' className='flex-1'>
                Share Post
              </Button>
            </div>
          }
        />
      </div>
    </Modal>
  );
}
