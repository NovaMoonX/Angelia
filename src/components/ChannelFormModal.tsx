import { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  FormFactories,
  Button,
  Label,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { CHANNEL_COLORS, DEFAULT_CHANNEL_COLOR } from '@lib/channelColors';
import type { Channel } from '@lib/mockData';

interface ChannelFormData {
  name: string;
  description: string;
  color: string;
}

interface ChannelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChannelFormData) => void;
  channel?: Channel | null;
  mode: 'create' | 'edit';
}

export function ChannelFormModal({
  isOpen,
  onClose,
  onSubmit,
  channel,
  mode,
}: ChannelFormModalProps) {
  const [selectedColor, setSelectedColor] = useState(
    channel?.color || DEFAULT_CHANNEL_COLOR
  );

  // Reset form when channel changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedColor(channel?.color || DEFAULT_CHANNEL_COLOR);
    }
  }, [isOpen, channel]);

  // Memoize form fields to keep them stable
  const formFields = useMemo(
    () => [
      FormFactories.input({
        name: 'name',
        label: 'Channel Name',
        placeholder: 'e.g., Family Adventures, Cooking Corner',
        required: true,
      }),
      FormFactories.textarea({
        name: 'description',
        label: 'Description',
        placeholder: 'Share what this channel is about...',
        required: false,
        rows: 3,
      }),
    ],
    []
  );

  const initialData = useMemo(
    () => ({
      name: channel?.name || '',
      description: '',
    }),
    [channel]
  );

  const handleFormSubmit = (formData: Record<string, string>) => {
    const data: ChannelFormData = {
      name: formData.name,
      description: formData.description || '',
      color: selectedColor,
    };

    onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create New Channel' : 'Edit Channel'}
    >
      <div className='space-y-6'>
        <Form
          form={formFields}
          initialData={initialData}
          onSubmit={handleFormSubmit}
          submitButton={
            <div className='space-y-4'>
              {/* Color Picker */}
              <div className='space-y-2'>
                <Label>Channel Color</Label>
                <div className='grid grid-cols-6 gap-2'>
                  {CHANNEL_COLORS.map((colorOption) => (
                    <button
                      key={colorOption.value}
                      type='button'
                      onClick={() => setSelectedColor(colorOption.value)}
                      className={join(
                        'w-10 h-10 rounded-lg transition-all',
                        'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
                        selectedColor === colorOption.value
                          ? 'ring-2 ring-offset-2 ring-foreground scale-110'
                          : ''
                      )}
                      style={{ backgroundColor: colorOption.value }}
                      aria-label={`Select ${colorOption.name} color`}
                      title={colorOption.name}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 pt-2'>
                <Button type='button' variant='tertiary' onClick={onClose} className='flex-1'>
                  Cancel
                </Button>
                <Button type='submit' className='flex-1'>
                  {mode === 'create' ? 'Create Channel' : 'Save Changes'}
                </Button>
              </div>
            </div>
          }
        />
      </div>
    </Modal>
  );
}
