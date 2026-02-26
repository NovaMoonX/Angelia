import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { useToast } from '@moondreamsdev/dreamer-ui/hooks';
import { Form, FormFactories, Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { selectUserChannels, selectUserDailyChannel } from '@store/slices/channelsSlice';
import { MediaItem } from '@/lib/post';
import PostCreateMediaUploader from '@/components/PostCreateMediaUploader';

export interface PostFormData {
  text: string;
  channelId: string;
  media: MediaItem[];
  isHighPriority: boolean;
}

export default function PostCreate() {
  const navigate = useNavigate();
  const toast = useToast();
  const userChannels = useAppSelector(selectUserChannels);
  const userDailyChannel = useAppSelector(selectUserDailyChannel)

  // Handle form submit
  const handleSubmit = (data: PostFormData) => {
    // In a real app, this would save to the database
    toast.addToast({
      title: 'Post created successfully!',
      description: 'This is a demo - post not saved',
      type: 'success',
    });
    navigate('/feed');
  };

  // If no channels, show error (could redirect or show message)
  if (!userChannels.length) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <p className='text-foreground/60 text-lg'>You need to create a channel before posting.</p>
      </div>
    );
  }

  const defaultChannel = userDailyChannel || userChannels[0];

  const formFields = [
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
      renderComponent: (props) => (
        <div className='grid grid-cols-1 gap-2'>
          {userChannels.map((channel) => {
            const isSelected = props.value === channel.id;
            return (
              <button
                key={channel.id}
                type='button'
                onClick={() => props.onValueChange(channel.id)}
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
      renderComponent: (props) => (
        <PostCreateMediaUploader value={props.value} onValueChange={props.onValueChange} />
      ),
    }),
    FormFactories.checkbox({
      name: 'isHighPriority',
      label: 'Mark as High Priority',
      description: 'Use for important family announcements',
    }),
  ];

  const initialData = {
    text: '',
    channelId: defaultChannel?.id || '',
    media: [] as MediaItem[],
    isHighPriority: false,
  };

  return (
    <div className='w-full max-w-lg mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-2 text-foreground'>Create New Post</h1>
      <p className='mb-6 text-foreground/60'>Share an update with your family</p>
      <Form<PostFormData>
        form={formFields}
        initialData={initialData}
        onSubmit={handleSubmit}
        submitButton={
          <div className='flex gap-3 pt-2'>
            <Button type='button' variant='tertiary' onClick={() => navigate('/feed')} className='flex-1'>
              Nevermind
            </Button>
            <Button type='submit' className='flex-1'>
              Share Post
            </Button>
          </div>
        }
      />
    </div>
  );
}
