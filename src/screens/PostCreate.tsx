import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { useToast } from '@moondreamsdev/dreamer-ui/hooks';
import { PostFormModal, PostFormData } from '@components/PostFormModal';
import { selectUserChannels } from '@store/slices/channelsSlice';

export default function PostCreate() {
  const navigate = useNavigate();
  const toast = useToast();
  const userChannels = useAppSelector(selectUserChannels);

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

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh]'>
      <PostFormModal
        isOpen={true}
        onClose={() => navigate('/feed')}
        onSubmit={handleSubmit}
        userChannels={userChannels}
      />
    </div>
  );
}
