import { useMemo } from 'react';
import {
  Modal,
  Form,
  FormFactories,
  Button,
  type FormCustomFieldProps,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { CHANNEL_COLORS, DEFAULT_CHANNEL_COLOR } from '@lib/channelColors';
import type { Channel } from '@lib/channel';

interface ChannelFormData {
  name: string;
  description: string;
  color: string;
}

// Custom color picker field component
function ColorPickerField({ value, onValueChange }: FormCustomFieldProps<unknown>) {
  const selectedColor = (value as string) || DEFAULT_CHANNEL_COLOR;

  return (
    <div className='grid grid-cols-6 gap-2'>
      {CHANNEL_COLORS.map((colorOption) => (
        <button
          key={colorOption.name}
          type='button'
          onClick={() => onValueChange(colorOption.name)}
          className={join(
            'w-10 h-10 rounded-lg transition-all',
            'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            selectedColor === colorOption.name
              ? 'ring-2 ring-offset-2 ring-foreground scale-110'
              : ''
          )}
          style={{ backgroundColor: colorOption.value }}
          aria-label={`Select ${colorOption.name} color`}
          title={colorOption.name}
        />
      ))}
    </div>
  );
}

interface ChannelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ChannelFormData) => void;
  channel?: Channel | null;
  mode: 'create' | 'edit';
  existingChannelNames?: string[];
}

export function ChannelFormModal({
  isOpen,
  onClose,
  onSubmit,
  channel,
  mode,
  existingChannelNames = [],
}: ChannelFormModalProps) {
  // Memoize lowercase channel names as a Set for O(1) lookups
  const existingNamesLowerSet = useMemo(
    () => new Set(existingChannelNames.map((name) => name.toLowerCase())),
    [existingChannelNames]
  );

  const currentChannelNameLower = useMemo(
    () => channel?.name.toLowerCase() || '',
    [channel]
  );

  // Memoize form fields to keep them stable
  const formFields = useMemo(
    () => [
      FormFactories.input({
        name: 'name',
        label: 'Channel Name',
        placeholder: 'e.g., Family Adventures, Cooking Corner',
        required: true,
        isValid: (value: unknown) => {
          const name = ((value as string) || '').trim();
          if (!name) return { valid: false, message: 'Channel name is required' };

          const nameLower = name.toLowerCase();
          const isDuplicate =
            existingNamesLowerSet.has(nameLower) &&
            (mode === 'create' || nameLower !== currentChannelNameLower);

          if (isDuplicate) {
            return {
              valid: false,
              message: `A channel named "${name}" already exists. Please choose a different name.`,
            };
          }

          return { valid: true };
        },
      }),
      FormFactories.textarea({
        name: 'description',
        label: 'Description',
        placeholder: 'Share what this channel is about...',
        required: false,
        rows: 3,
      }),
      FormFactories.custom({
        name: 'color',
        label: 'Channel Color',
        required: true,
        renderComponent: ColorPickerField,
        isValid: (value: unknown) => {
          if (!value) return { valid: false, message: 'Please select a channel color' };
          return { valid: true };
        },
      }),
    ],
    [existingNamesLowerSet, mode, currentChannelNameLower]
  );

  const initialData = useMemo(
    () => ({
      name: channel?.name || '',
      description: '',
      color: channel?.color || DEFAULT_CHANNEL_COLOR,
    }),
    [channel]
  );

  const handleFormSubmit = (formData: ChannelFormData) => {
    const data: ChannelFormData = {
      name: formData.name.trim(),
      description: formData.description || '',
      color: formData.color || DEFAULT_CHANNEL_COLOR,
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
        <Form<ChannelFormData>
          form={formFields}
          initialData={initialData}
          onSubmit={handleFormSubmit}
          submitButton={
            <div className='flex gap-3 pt-2'>
              <Button type='button' variant='tertiary' onClick={onClose} className='flex-1'>
                Cancel
              </Button>
              <Button type='submit' className='flex-1'>
                {mode === 'create' ? 'Create Channel' : 'Save Changes'}
              </Button>
            </div>
          }
        />
      </div>
    </Modal>
  );
}
