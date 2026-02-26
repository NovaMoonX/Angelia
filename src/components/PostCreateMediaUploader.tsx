import { MediaItem } from '@/lib/post';
import { Button, Callout } from '@moondreamsdev/dreamer-ui/components';
import { X } from '@moondreamsdev/dreamer-ui/symbols';
import { useState } from 'react';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES];

function PostCreateMediaUploader({
  value,
  onValueChange,
}: {
  value: unknown;
  onValueChange: (value: MediaItem[]) => void;
}) {
  const mediaItems = (value as MediaItem[]) || [];
  const [errors, setErrors] = useState<string[]>([]);

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    const files = Array.from(e.target.files || []);
    if (mediaItems.length + files.length > MAX_FILES) {
      setErrors([`You can only attach up to ${MAX_FILES} files per post.`]);
      e.target.value = '';
      return;
    }
    const validFiles: File[] = [];
    const newErrors: string[] = [];
    for (const file of files) {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        newErrors.push(validation.message || `${file.name}: Invalid file`);
      }
    }
    if (validFiles.length > 0) {
      const newMediaItems: MediaItem[] = validFiles.map((file) => {
        const type = ACCEPTED_IMAGE_TYPES.includes(file.type)
          ? 'image'
          : 'video';
        const url = URL.createObjectURL(file);
        return { type, url };
      });
      onValueChange([...mediaItems, ...newMediaItems]);
    }
    setErrors(newErrors);
    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    const updatedMedia = mediaItems.filter((_, i) => i !== index);
    onValueChange(updatedMedia);
    setErrors([]);
  };

  return (
    <div className='space-y-3'>
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
          Images (JPEG, PNG, GIF, WebP) or Videos (MP4, WebM, OGG). Max{' '}
          {MAX_FILE_SIZE_MB}MB per file.
        </p>
      </div>
      {errors.length > 0 && (
        <div className='space-y-1'>
          {errors.map((err, idx) => (
            <Callout key={idx} variant='destructive' description={err} />
          ))}
        </div>
      )}
      {mediaItems.length > 0 && (
        <div className='grid grid-cols-2 gap-3'>
          {mediaItems.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className='group border-foreground/10 bg-foreground/5 relative aspect-video overflow-hidden rounded-lg border'
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
              <button
                type='button'
                onClick={() => handleRemove(index)}
                className='absolute top-2 right-2 max-h-fit rounded-full bg-red-500 p-1 text-white opacity-100 transition-opacity hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100'
                aria-label='Remove media'
              >
                <X className='size-3' />
              </button>
              <span className='bg-background/50 absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs'>
                {item.type === 'image' ? '🖼️' : '🎥'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCreateMediaUploader;
