import PostCreateMediaUploader, { FileUpload } from '@/components/PostCreateMediaUploader';
import { Post } from '@/lib/post';
import {
  Button,
  Form,
  FormFactories,
} from '@moondreamsdev/dreamer-ui/components';
import { useActionModal, useToast } from '@moondreamsdev/dreamer-ui/hooks';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { uploadPost } from '@store/actions/postActions';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  selectUserChannels,
  selectUserDailyChannel,
} from '@store/slices/channelsSlice';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export type PostFormData = Pick<Post, 'text' | 'channelId'> & {
  fileUploads: FileUpload[]; // For handling file uploads in the form
};

export default function PostCreate() {
  const navigate = useNavigate();
  const toast = useToast();
  const { confirm } = useActionModal();
  const dispatch = useAppDispatch();
  const userChannels = useAppSelector(selectUserChannels);
  const userDailyChannel = useAppSelector(selectUserDailyChannel);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const [formData, setFormData] = useState<PostFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submit
  const handleSubmit = async (data: PostFormData) => {
    if (!data.channelId) {
      toast.addToast({
        title: 'Channel selection is required',
        description: 'Please select a channel to post in.',
        type: 'error',
      });
      return;
    }
    if (!data.text.trim()) {
      toast.addToast({
        title: 'Post text is required',
        description: 'Please enter some text for your post.',
        type: 'error',
      });
      return;
    }
    if (!currentUser) {
      toast.addToast({
        title: 'Not signed in',
        description: 'You must be signed in to post.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        uploadPost({
          formData: data,
        }),
      ).unwrap();

      toast.addToast({
        title: 'Post created successfully!',
        description: 'Your update has been shared.',
        type: 'success',
      });
      setTimeout(() => {
        navigate('/feed');
      }, 1000);
    } catch (err: any) {
      toast.addToast({
        title: 'Failed to create post',
        description:
          err?.message || 'Something went wrong uploading your post.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no channels, show error (could redirect or show message)
  if (!userChannels.length) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center'>
        <p className='text-foreground/60 text-lg'>
          You need to create a channel before posting.
        </p>
      </div>
    );
  }

  const confirmDiscard = async () => {
    const confirmed = await confirm({
      title: 'Discard Post?',
      message:
        'Are you sure you want to discard this post? All changes will be lost.',
      confirmText: 'Yes, Discard',
      cancelText: 'No, Keep Editing',
      destructive: true,
    });

    if (confirmed) {
      navigate('/feed');
    }
  };

  const defaultChannel = userDailyChannel || userChannels[0];

  const formFields = [
    FormFactories.custom({
      name: 'channelId',
      label: 'Select Channel',
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
                  'hover:border-primary/50 focus:ring-primary focus:ring-2 focus:outline-none',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-foreground/10 bg-background',
                )}
              >
                <div
                  className='h-4 w-4 rounded-full border-2'
                  style={{
                    borderColor: isSelected
                      ? 'var(--color-primary)'
                      : 'var(--color-foreground)',
                    backgroundColor: isSelected
                      ? 'var(--color-primary)'
                      : 'transparent',
                  }}
                />
                <div className='flex-1'>
                  <span className='text-foreground font-medium'>
                    {channel.name}
                  </span>
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
    FormFactories.textarea({
      name: 'text',
      label: "What's on your mind?",
      placeholder: 'Share an update with your family...',
      rows: 4,
      isValid: (value: unknown) => {
        const text = ((value as string) || '').trim();
        if (!text) {
          return {
            valid: false,
            message: 'Hmm 🤔 seems like you forgot to write something',
          };
        }
        return { valid: true };
      },
    }),

    FormFactories.custom({
      name: 'fileUploads',
      label: 'Add Photos or Videos (Optional)',
      renderComponent: (props) => (
        <PostCreateMediaUploader
          value={props.value}
          onValueChange={props.onValueChange}
        />
      ),
    }),
  ];

  const initialData: PostFormData = {
    text: '',
    channelId: defaultChannel?.id || '',
    fileUploads: [],
  };

  return (
    <div className='relative mx-auto w-full max-w-lg px-4 pt-20 pb-16'>
      <Link
        to='/feed'
        className='text-primary focus:ring-primary absolute top-4 left-0 flex items-center rounded px-4 py-2 font-medium hover:underline focus:ring-2 focus:outline-none'
        aria-label='Back to feed'
      >
        ← Back to feed
      </Link>
      <h1 className='text-foreground mb-2 text-center text-3xl font-bold'>
        Create New Post
      </h1>
      <p className='text-foreground/60 mb-6 text-center'>
        Share an update with your family
      </p>
      <Form<PostFormData>
        form={formFields}
        initialData={initialData}
        onDataChange={(updatedData) => setFormData(updatedData)}
        onSubmit={handleSubmit}
        submitButton={
          <div className='flex gap-3 pt-2'>
            <Button
              type='button'
              variant='tertiary'
              onClick={confirmDiscard}
              className='flex-1'
              disabled={isSubmitting}
            >
              Discard
            </Button>
            <Button
              type='submit'
              disabled={!formData?.text || !formData?.channelId || isSubmitting}
              className='flex-1'
              loading={isSubmitting}
            >
              Share Post
            </Button>
          </div>
        }
      />
    </div>
  );
}
