# Angelia — React Native Migration Analysis

> **Purpose**: This document provides a comprehensive, one-to-one mapping of the Angelia web application architecture for recreation as a React Native mobile application. It includes complete specifications of every Dreamer UI component (which has no React Native equivalent and must be rebuilt), all screens, Redux state management, Firebase integration, data models, and navigation.

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Tech Stack Mapping (Web → React Native)](#2-tech-stack-mapping-web--react-native)
3. [Dreamer UI Components — Full Specifications for Rebuild](#3-dreamer-ui-components--full-specifications-for-rebuild)
4. [Dreamer UI Hooks — Full Specifications for Rebuild](#4-dreamer-ui-hooks--full-specifications-for-rebuild)
5. [Dreamer UI Utilities — Full Specifications for Rebuild](#5-dreamer-ui-utilities--full-specifications-for-rebuild)
6. [Dreamer UI Symbols (Icons) — Full Specifications for Rebuild](#6-dreamer-ui-symbols-icons--full-specifications-for-rebuild)
7. [Dreamer UI Provider & Theming — Full Specifications for Rebuild](#7-dreamer-ui-provider--theming--full-specifications-for-rebuild)
8. [File-by-File Dreamer UI Import Map](#8-file-by-file-dreamer-ui-import-map)
9. [Data Models (TypeScript Interfaces)](#9-data-models-typescript-interfaces)
10. [Firestore Database Structure](#10-firestore-database-structure)
11. [Firebase Security Rules](#11-firebase-security-rules)
12. [Redux Architecture](#12-redux-architecture)
13. [Real-Time Data Subscriptions](#13-real-time-data-subscriptions)
14. [Authentication Flow](#14-authentication-flow)
15. [Screen Specifications](#15-screen-specifications)
16. [Custom Component Specifications](#16-custom-component-specifications)
17. [Navigation Map](#17-navigation-map)
18. [Utility Functions](#18-utility-functions)
19. [Design System & Theme Tokens](#19-design-system--theme-tokens)
20. [React Native Migration Notes](#20-react-native-migration-notes)

---

## 1. Application Overview

**Angelia** is a private, channel-based family communication app designed to solve "conversational overload" from group chats. Users curate life updates into themed channels with customizable notification tiers and a 6-month ephemeral history.

### Core Value Proposition
- **Categorical Agency**: Sharers categorize updates into channels; readers subscribe only to what matters
- **Notification Intelligence**: Tiered alerts for normal vs. high-importance updates
- **Mandatory Ephemerality**: 6-month auto-expiring content to reduce archive pressure

### Target Personas
| Persona | Description |
|---------|-------------|
| **Remote Elder** | Grandparents wanting daily connection without tech friction |
| **Global Professional** | Busy individuals who need to catch up during downtime |
| **Saturated Parent** | Parents who want to share without performance pressure |

---

## 2. Tech Stack Mapping (Web → React Native)

| Web Technology | Version | Purpose | React Native Equivalent |
|----------------|---------|---------|------------------------|
| React | 19.2.0 | UI framework | React Native 0.7x+ |
| React Router DOM | 7.13.0 | Navigation | React Navigation 7.x |
| Redux Toolkit | 2.11.2 | State management | **Same** (Redux Toolkit) |
| React Redux | 9.2.0 | Redux bindings | **Same** (React Redux) |
| Firebase | 12.9.0 | Backend services | `@react-native-firebase/*` |
| TailwindCSS | 4.1.18 | Styling | NativeWind or StyleSheet |
| **Dreamer UI** | **1.7.26** | **Component library** | **⚠️ NO RN EQUIVALENT — Must rebuild all components (see Section 3)** |
| Vite | 7.2.4 | Build tool | Metro bundler (default) |
| nanoid | 5.1.6 | ID generation | **Same** (nanoid) |
| uuid | 13.0.0 | UUID generation | **Same** (uuid) |

---

## 3. Dreamer UI Components — Full Specifications for Rebuild

> **⚠️ CRITICAL**: The `@moondreamsdev/dreamer-ui` package is a web-only React component library with **no React Native equivalent**. Every component below must be rebuilt as a custom React Native component. This section provides the complete API, props, variants, and usage patterns for each component so they can be recreated 1:1.

### 3.1 `ErrorBoundary`

**Import**: `import { ErrorBoundary } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `App.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `fallback` | `ReactNode` | Yes | JSX to display when an error is caught |
| `children` | `ReactNode` | Yes | App content to wrap |

**Usage**:
```tsx
<ErrorBoundary fallback={<div>Something went wrong.</div>}>
  {/* entire app */}
</ErrorBoundary>
```

**RN Rebuild Notes**: Create a class component implementing `componentDidCatch` and `getDerivedStateFromError`. React Native has no built-in error boundary — same pattern as web React.

---

### 3.2 `AuthForm`

**Import**: `import { AuthForm, type AuthFormOnEmailSubmit } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/Auth.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `methods` | `('email' \| 'google')[]` | Yes | Authentication methods to show |
| `action` | `'both'` | Yes | Shows both login and signup toggle |
| `onActionChange` | `(newMode: 'login' \| 'sign up') => void` | Yes | Callback when user toggles mode |
| `onEmailSubmit` | `AuthFormOnEmailSubmit` | Yes | Form submission handler |
| `className` | `string` | No | Container styling |

**AuthFormOnEmailSubmit type**:
```typescript
type AuthFormOnEmailSubmit = (params: {
  data: { email: string; password: string };
  action: 'login' | 'signup';
}) => Promise<{ error?: { message: string } }>;
```

**Behavior**:
- Renders email/password form with validation
- Toggles between login/signup modes
- Shows Google sign-in button when `'google'` is in methods
- Returns error messages to display inline

**RN Rebuild Notes**: Build a form with `TextInput` for email/password, password confirmation (signup mode), a toggle between login/signup, and a Google sign-in button (using `@react-native-google-signin`). Must handle form validation for email format, password minimum length, and password confirmation matching.

---

### 3.3 `Avatar`

**Import**: `import { Avatar } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/Feed.tsx`, `screens/CompleteProfile.tsx`, `screens/Account.tsx`, `screens/PostDetail.tsx`, `screens/InviteAccept.tsx`, `components/ChatMessage.tsx`, `components/ChannelCard.tsx`, `components/ChannelModal.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `preset` | `AvatarPreset` | Yes | One of 12 preset avatar names |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | No | Avatar dimensions |
| `shape` | `'circle' \| 'square'` | No | Shape (defaults to circle) |
| `className` | `string` | No | Additional styling |

**AvatarPreset values**: `'astronaut' | 'moon' | 'star' | 'galaxy' | 'nebula' | 'planet' | 'cosmic-cat' | 'dream-cloud' | 'rocket' | 'constellation' | 'comet' | 'twilight'`

**Size mappings** (approximate):
| Size | Dimensions |
|------|-----------|
| `sm` | 32×32px |
| `md` | 40×40px |
| `lg` | 64×64px |
| `xl` | 96×96px |

**Usage patterns**:
```tsx
<Avatar preset={currentUser?.avatar || 'moon'} size='md' />
<Avatar preset={avatar} size='lg' shape='circle' />
<Avatar preset={currentUser?.avatar || 'moon'} size='xl' />
<Avatar preset={author.avatar} size='sm' className='shrink-0' />
```

**RN Rebuild Notes**: Create a component with 12 preset cartoon-like avatar images. Each preset maps to a specific illustration. Can use `react-native-svg` or pre-rendered PNG assets. Size and shape are controlled by `width`, `height`, and `borderRadius` styles.

---

### 3.4 `Badge`

**Import**: `import { Badge } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `components/PostCard.tsx`, `components/ChannelCard.tsx`, `components/ChannelModal.tsx`, `screens/PostDetail.tsx`, `screens/InviteAccept.tsx`, `screens/Account.tsx`, `screens/Feed.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `'base' \| 'secondary'` | No | Visual style variant |
| `className` | `string` | No | Additional styling |
| `style` | `CSSProperties` | No | Inline styles (used for dynamic channel colors) |
| `children` | `ReactNode` | Yes | Badge text content |

**Usage patterns**:
```tsx
{/* Dynamic channel color badge */}
<Badge
  variant='base'
  className='text-xs font-medium'
  style={{
    backgroundColor: colors.backgroundColor,
    borderColor: colors.backgroundColor,
    color: colors.textColor,
  }}
>
  {channelName}
</Badge>

{/* Standard secondary badge */}
<Badge variant='secondary' className='mx-1 inline-flex px-3 py-1 text-base font-semibold'>
  {channel.name}
</Badge>
```

**RN Rebuild Notes**: Small rounded pill/chip component with text. Supports dynamic background/text colors via inline styles (critical for channel color coding). The `base` variant uses custom colors; `secondary` uses theme secondary colors.

---

### 3.5 `Button`

**Import**: `import { Button } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: Almost every file in the codebase

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'outline' \| 'link' \| 'destructive'` | No | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | No | Button size (defaults to `md`) |
| `href` | `string` | No | Makes button a navigation link |
| `onClick` | `() => void` | No | Click handler |
| `disabled` | `boolean` | No | Disables interaction |
| `loading` | `boolean` | No | Shows loading spinner |
| `type` | `'button' \| 'submit'` | No | HTML button type |
| `className` | `string` | No | Additional styling |
| `aria-label` | `string` | No | Accessibility label |
| `children` | `ReactNode` | Yes | Button content (text, icons, or both) |

**Variant descriptions**:
| Variant | Visual Style |
|---------|-------------|
| `primary` | Solid amber/accent background, white text |
| `secondary` | Light amber background, dark text |
| `tertiary` | No background, text only, subtle hover |
| `outline` | Border only, transparent background |
| `link` | Text-link style, no border/background |
| `destructive` | Red/danger background |

**Usage patterns**:
```tsx
{/* Navigation button */}
<Button href='/auth?mode=login' variant='tertiary'>Login</Button>

{/* Action button */}
<Button onClick={handleClick} variant='primary' size='md'>View Demo Feed →</Button>

{/* Loading state */}
<Button type='submit' disabled={!valid || isSubmitting} loading={isSubmitting}>
  Share Post
</Button>

{/* Icon button */}
<Button variant='primary' size='sm' onClick={handleCreatePost}>
  <Plus className='h-4 w-4 mr-1' />
  New Post
</Button>

{/* Floating action button */}
<Button
  variant='primary'
  onClick={scrollToTop}
  className='fixed right-6 bottom-6 z-50 h-14 w-14 rounded-3xl p-0 shadow-lg'
>
  <ChevronUp className='h-8 w-8' />
</Button>
```

**RN Rebuild Notes**: Core UI component. Use `TouchableOpacity` or `Pressable`. Must support all 6 variants with appropriate styling, loading spinner via `ActivityIndicator`, disabled state with opacity reduction, and icon+text combinations. The `href` prop should navigate using React Navigation instead of anchor links.

---

### 3.6 `Callout`

**Import**: `import { Callout } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/Auth.tsx`, `screens/VerifyEmail.tsx`, `screens/Feed.tsx`, `components/PostCreateMediaUploader.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `variant` | `'info' \| 'success' \| 'destructive' \| 'warning'` | Yes | Color and icon style |
| `title` | `string` | No | Bold heading |
| `description` | `ReactNode` | Yes | Main content (can be JSX) |
| `icon` | `string` | No | Emoji icon (e.g., '👀', '⚠️') |
| `dismissible` | `boolean` | No | Shows dismiss/close button |
| `onDismiss` | `() => void` | No | Callback when dismissed |
| `className` | `string` | No | Additional styling |

**Variant colors**:
| Variant | Background | Border |
|---------|-----------|--------|
| `info` | Light blue | Blue |
| `success` | Light green | Green |
| `destructive` | Light red | Red |
| `warning` | Light amber | Amber |

**Usage patterns**:
```tsx
{/* Info callout with emoji */}
<Callout variant='info' icon='👀' description={<>Want to see the app in action? ...</>} />

{/* Info callout with title */}
<Callout variant='info' title='Verification link sent!'
  description={<span>We sent a verification link to <strong>{email}</strong>.</span>}
/>

{/* Dismissible callout */}
<Callout variant='info' description="Click on any post..." dismissible onDismiss={handleDismiss} />

{/* Error callout */}
<Callout variant='destructive' icon='⚠️' description={errorMessage} />

{/* Success callout */}
<Callout variant='success' icon='✅' description='Verification link sent!' />
```

**RN Rebuild Notes**: Bordered container with icon, optional title, description, and optional dismiss button. Use colored `View` with `Text` children. Animate dismiss with `Animated` API or Reanimated.

---

### 3.7 `Card`

**Import**: `import { Card } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/PostDetail.tsx`, `screens/InviteAccept.tsx`, `screens/Account.tsx`, `components/PostCard.tsx`, `components/SkeletonPostCard.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | Styling (padding, spacing, overflow) |
| `children` | `ReactNode` | Yes | Card content |

**Usage patterns**:
```tsx
<Card className='p-4 transition-all'>{/* Content */}</Card>
<Card className='space-y-6 p-8 text-center'>{/* Content */}</Card>
<Card className='relative overflow-hidden p-0'>{/* Content without padding */}</Card>
```

**RN Rebuild Notes**: Simple container `View` with background color (`card` token), border radius, shadow/elevation, and configurable padding. Uses theme token `--color-card` for background.

---

### 3.8 `Carousel`

**Import**: `import { Carousel } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `components/PostCard.tsx`, `screens/PostDetail.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | Container styling |
| `buttonPosition` | `'interior'` | No | Navigation button placement |
| `onIndexChange` | `(newIndex: number) => void` | No | Slide change callback |
| `children` | `ReactNode[]` | Yes | Array of carousel items |

**Usage**:
```tsx
<Carousel className='w-full' buttonPosition='interior' onIndexChange={handleCarouselIndexChange}>
  {mediaItems.map((item, index) => (
    <div key={`media-${index}`} className='w-full'>
      {renderMedia(item, index)}
    </div>
  ))}
</Carousel>
```

**Behavior**:
- Horizontal swipe between items
- Interior navigation buttons (left/right arrows)
- Reports index changes (used to pause videos when switching slides)
- Supports image and video items

**RN Rebuild Notes**: Use `react-native-reanimated-carousel` or build with `FlatList` with `horizontal`, `pagingEnabled`, and `onMomentumScrollEnd` for index tracking. Add overlay navigation arrows if `buttonPosition='interior'`.

---

### 3.9 `CopyButton`

**Import**: `import { CopyButton } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `components/ChannelCard.tsx`, `components/ChannelModal.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `textToCopy` | `string` | Yes | Text to copy to clipboard |
| `variant` | `string` | No | Same variants as Button |
| `size` | `'sm' \| 'md' \| 'lg'` | No | Same sizes as Button |
| `className` | `string` | No | Additional styling |
| `disabled` | `boolean` | No | Disables interaction |
| `onClick` | `(e: Event) => void` | No | Additional click handler |
| `children` | `ReactNode` | Yes | Button text |

**Usage**:
```tsx
<CopyButton textToCopy={inviteUrl || ''} variant='secondary' className='w-full' disabled={!inviteUrl}>
  Copy Invite Link
</CopyButton>
```

**Behavior**:
- Copies `textToCopy` to system clipboard on press
- Shows brief "Copied!" feedback
- Extends Button with clipboard functionality

**RN Rebuild Notes**: Extend the custom Button component. Use `Clipboard.setString()` from `@react-native-clipboard/clipboard`. Show a brief "Copied!" state change (icon or text swap) before reverting.

---

### 3.10 `Form`, `FormFactories`, `type FormCustomFieldProps`

**Import**: `import { Form, FormFactories, type FormCustomFieldProps } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/PostCreate.tsx`, `components/ChannelFormModal.tsx`

#### `Form<T>` Props:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `form` | `FormField[]` | Yes | Array of field definitions from FormFactories |
| `initialData` | `T` | Yes | Initial form values |
| `onSubmit` | `(data: T) => void` | Yes | Submit callback with typed form data |
| `onDataChange` | `(data: T) => void` | No | Callback on any field change |
| `submitButton` | `ReactNode` | No | Custom submit button JSX |

#### `FormFactories` methods:

**`.input(config)`**:
```typescript
FormFactories.input({
  name: string;           // Field key in form data
  label: string;          // Displayed label
  placeholder?: string;   // Placeholder text
  required?: boolean;     // Mark as required
  isValid?: (value: unknown) => { valid: boolean; message?: string };
})
```

**`.textarea(config)`**:
```typescript
FormFactories.textarea({
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;          // Visible rows
  isValid?: (value: unknown) => { valid: boolean; message?: string };
})
```

**`.custom(config)`**:
```typescript
FormFactories.custom({
  name: string;
  label: string;
  required?: boolean;
  renderComponent: (props: FormCustomFieldProps<unknown>) => ReactNode;
  isValid?: (value: unknown) => { valid: boolean; message?: string };
})
```

#### `FormCustomFieldProps<T>`:
```typescript
interface FormCustomFieldProps<T> {
  value: T;                          // Current field value
  onValueChange: (value: T) => void; // Update field value
}
```

**Usage patterns**:
```tsx
const formFields = [
  FormFactories.input({
    name: 'name',
    label: 'Channel Name',
    placeholder: 'e.g., Family Adventures',
    required: true,
    isValid: (value) => {
      const name = ((value as string) || '').trim();
      if (!name) return { valid: false, message: 'Channel name is required' };
      return { valid: true };
    },
  }),
  FormFactories.textarea({
    name: 'description',
    label: 'Description',
    placeholder: 'Share what this channel is about...',
    rows: 3,
  }),
  FormFactories.custom({
    name: 'color',
    label: 'Channel Color',
    required: true,
    renderComponent: ColorPickerField, // Custom React component
    isValid: (value) => {
      if (!value) return { valid: false, message: 'Please select a channel color' };
      return { valid: true };
    },
  }),
];

<Form<ChannelFormData>
  form={formFields}
  initialData={{ name: '', description: '', color: 'INDIGO' }}
  onSubmit={handleSubmit}
  submitButton={
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button variant='tertiary' onPress={onClose}>Cancel</Button>
      <Button type='submit'>Create Channel</Button>
    </View>
  }
/>
```

**Validation pattern**: All `isValid` functions return `{ valid: true }` or `{ valid: false, message: 'Error text' }`. Errors display below the field.

**RN Rebuild Notes**: Build a form engine that accepts field definitions, manages state, runs validation on submit, and displays inline error messages. Use `TextInput` for input/textarea fields. Support custom render components via `renderComponent`. This is the most complex component to rebuild.

---

### 3.11 `HelpIcon`

**Import**: `import { HelpIcon } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `components/ChannelModal.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | Tooltip text on hover/press |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | Tooltip position |

**Usage**:
```tsx
<HelpIcon
  message='Generates a brand-new invite link and instantly invalidates the old one.'
  placement='top'
/>
```

**RN Rebuild Notes**: Small info circle icon (`ⓘ`) that shows a tooltip/popover on press (since there's no hover on mobile). Use a small `Modal` or absolutely positioned `View` that appears on press and dismisses on outside tap.

---

### 3.12 `Input`

**Import**: `import { Input } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/CompleteProfile.tsx`, `screens/Account.tsx`, `screens/PostDetail.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | No | HTML id (for Label association) |
| `type` | `string` | No | Input type ('text', 'email', etc.) |
| `value` | `string` | Yes | Controlled value |
| `onChange` | `(e: ChangeEvent) => void` | Yes | Change handler |
| `onKeyDown` | `(e: KeyboardEvent) => void` | No | Keyboard event handler |
| `placeholder` | `string` | No | Placeholder text |
| `className` | `string` | No | Additional styling |
| `maxLength` | `number` | No | Max character count |
| `autoComplete` | `string` | No | Auto-complete behavior |

**Usage patterns**:
```tsx
<Input
  id='firstName'
  type='text'
  value={profileData.firstName}
  onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
  placeholder='John'
/>

{/* Emoji input */}
<Input
  value={customEmoji}
  onChange={(e) => setCustomEmoji(e.target.value)}
  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
  placeholder='Custom'
  className='h-12 w-20 text-center text-2xl'
  maxLength={1}
/>
```

**RN Rebuild Notes**: Wrap React Native `TextInput` with consistent border, padding, and theme-aware styling. Map `onChange` to `onChangeText`, `onKeyDown` to `onSubmitEditing` or `onKeyPress`.

---

### 3.13 `Label`

**Import**: `import { Label } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/CompleteProfile.tsx`, `screens/Account.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `htmlFor` | `string` | No | Associated input ID |
| `className` | `string` | No | Additional styling |
| `children` | `ReactNode` | Yes | Label text |

**Usage**:
```tsx
<Label htmlFor='firstName'>First Name</Label>
<Label>Choose Your Avatar *</Label>
```

**RN Rebuild Notes**: Simple styled `Text` component with consistent font weight (semi-bold), font size, and margin-bottom. The `htmlFor` prop is not needed in RN — just place above the corresponding `TextInput`.

---

### 3.14 `Modal`

**Import**: `import { Modal } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `components/ChannelFormModal.tsx`, `components/ChannelModal.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls visibility |
| `onClose` | `() => void` | Yes | Close callback |
| `title` | `string` | Yes | Modal header title |
| `children` | `ReactNode` | Yes | Modal content |

**Usage**:
```tsx
<Modal isOpen={isOpen} onClose={onClose} title='Create New Channel'>
  <div className='space-y-6'>
    {/* Form or content */}
  </div>
</Modal>
```

**Behavior**:
- Overlay backdrop (semi-transparent dark)
- Centered content card
- Close button in header
- Scrollable content area
- Closes on backdrop tap

**RN Rebuild Notes**: Use React Native's built-in `Modal` component with `transparent` and `animationType='fade'` or `'slide'`. Add a backdrop `Pressable` for close-on-outside-tap. Include a header with title and close button.

---

### 3.15 `Select`

**Import**: `import { Select } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/Feed.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `options` | `{ text: string; value: string }[]` | Yes | Dropdown options |
| `value` | `string` | Yes | Currently selected value |
| `onChange` | `(value: string) => void` | Yes | Selection change callback |
| `placeholder` | `string` | No | Placeholder when no selection |
| `className` | `string` | No | Additional styling |

**Usage**:
```tsx
const channelOptions = [
  { text: 'All Channels', value: 'all' },
  { text: `Daily channels (${count})`, value: 'daily' },
  ...channels.map(ch => ({ text: ch.name, value: ch.id })),
];

<Select
  options={channelOptions}
  value={selectedChannel}
  onChange={handleChannelChange}
  placeholder='Filter by channel'
  className='w-full'
/>
```

**RN Rebuild Notes**: Use a custom dropdown or bottom sheet (e.g., `@gorhom/bottom-sheet`) with a scrollable list of options. Could also use React Native's `Picker` component or a third-party select library. Must support search/filter for many options.

---

### 3.16 `Separator`

**Import**: `import { Separator } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `components/ChannelModal.tsx`, `screens/Account.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | Spacing/margin classes |

**Usage**:
```tsx
<Separator />
<Separator className='my-4' />
```

**RN Rebuild Notes**: Simple horizontal line `View` with `height: 1`, `backgroundColor: borderColor`, and configurable vertical margin.

---

### 3.17 `Skeleton`

**Import**: `import { Skeleton } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `components/SkeletonPostCard.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `shape` | `'circle' \| 'square'` | No | Shape (defaults to square/rectangle) |
| `className` | `string` | No | Width, height, border-radius |

**Usage**:
```tsx
<Skeleton shape='circle' className='w-12 h-12' />
<Skeleton className='w-32 h-4' />
<Skeleton className='w-16 h-3' />
<Skeleton className='w-24 h-6 rounded-xl' />
<Skeleton className='w-full h-4' />
```

**RN Rebuild Notes**: Animated placeholder component with pulsing/shimmer effect. Use `Animated` API or `react-native-reanimated` for the shimmer animation. Accept `width`, `height`, and `borderRadius` as style props.

---

### 3.18 `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`

**Import**: `import { Tabs, TabsContent, TabsList, TabsTrigger } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/PostDetail.tsx`, `screens/Account.tsx`

#### `Tabs` Props:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | No | Controlled active tab |
| `defaultValue` | `string` | No | Initial tab (uncontrolled) |
| `onValueChange` | `(value: string) => void` | No | Tab change callback |
| `tabsWidth` | `'full'` | No | Full-width tabs |
| `className` | `string` | No | Container styling |

#### `TabsList` — Container for tab triggers (no special props)

#### `TabsTrigger` Props:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | Yes | Tab identifier |
| `children` | `ReactNode` | Yes | Trigger label |

#### `TabsContent` Props:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | Yes | Matches trigger value |
| `className` | `string` | No | Content styling |
| `children` | `ReactNode` | Yes | Content |

**Usage**:
```tsx
<Tabs value={activeTab} onValueChange={handleTabChange} tabsWidth='full'>
  <TabsList>
    <TabsTrigger value='account'>Account</TabsTrigger>
    <TabsTrigger value='my-channels'>My Channels</TabsTrigger>
    <TabsTrigger value='subscribed'>Subscribed Channels</TabsTrigger>
  </TabsList>
  <TabsContent value='account' className='mt-4 space-y-4'>
    {/* Account form */}
  </TabsContent>
  <TabsContent value='my-channels' className='mt-4 space-y-4'>
    {/* Channel list */}
  </TabsContent>
</Tabs>
```

**RN Rebuild Notes**: Build a tab bar component. Use `ScrollView` with horizontal tab buttons and conditional content rendering based on active tab. Alternatively, use `@react-navigation/material-top-tabs` for native tab behavior with swipe gestures.

---

### 3.19 `Textarea`

**Import**: `import { Textarea } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `screens/CompleteProfile.tsx`, `screens/Account.tsx`, `screens/PostDetail.tsx`, `screens/InviteAccept.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | No | HTML id |
| `value` | `string` | Yes | Controlled value |
| `onChange` | `(e: ChangeEvent) => void` | Yes | Change handler |
| `placeholder` | `string` | No | Placeholder text |
| `rows` | `number` | No | Visible rows (height) |
| `maxLength` | `number` | No | Character limit |
| `className` | `string` | No | Additional styling |

**Usage**:
```tsx
<Textarea
  id='funFact'
  value={profileData.funFact}
  onChange={(e) => setProfileData({...profileData, funFact: e.target.value})}
  rows={3}
  placeholder='I once...'
  className='resize-none'
/>

<Textarea value={message} onChange={(e) => setMessage(e.target.value)}
  placeholder='e.g. "It\'s me, Alex!"' rows={4} maxLength={300}
/>
```

**RN Rebuild Notes**: React Native `TextInput` with `multiline={true}` and `numberOfLines` prop corresponding to `rows`. Map `onChange` to `onChangeText`. Show character count if `maxLength` is set.

---

### 3.20 `Toggle`

**Import**: `import { Toggle } from '@moondreamsdev/dreamer-ui/components'`

**Used in**: `components/ThemeToggle.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `checked` | `boolean` | Yes | Current state |
| `onClick` | `() => void` | Yes | Toggle handler |
| `size` | `'sm' \| 'md' \| 'lg'` | No | Toggle size |

**Usage**:
```tsx
<Toggle checked={resolvedTheme === 'dark'} onClick={() => toggleTheme()} size='sm' />
```

**RN Rebuild Notes**: Use React Native's built-in `Switch` component, or build a custom animated toggle with `Animated` API. Map `checked` to `value` and `onClick` to `onValueChange`.

---

## 4. Dreamer UI Hooks — Full Specifications for Rebuild

### 4.1 `useActionModal()`

**Import**: `import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks'`

**Used in**: `screens/CompleteProfile.tsx`, `screens/Account.tsx`, `screens/PostCreate.tsx`

**Returns**:
```typescript
interface ActionModalHook {
  alert: (options: AlertOptions) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}
```

#### `alert(options)`:
| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `title` | `string` | No | Dialog title |
| `message` | `string` | Yes | Dialog message |

#### `confirm(options)`:
| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `title` | `string` | Yes | Dialog title |
| `message` | `string` | Yes | Dialog message |
| `confirmText` | `string` | No | Confirm button text (default: "Confirm") |
| `cancelText` | `string` | No | Cancel button text (default: "Cancel") |
| `destructive` | `boolean` | No | Red/danger styling for confirm button |

**Returns**: `Promise<boolean>` — `true` if user confirms, `false` if cancels.

**Usage**:
```tsx
const { alert, confirm } = useActionModal();

// Alert
alert({ title: 'Success', message: 'Your account has been updated!' });

// Confirm (destructive)
const confirmed = await confirm({
  title: 'Delete Channel',
  message: `Are you sure you want to delete "${channel.name}"?`,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  destructive: true,
});
if (confirmed) { /* proceed with delete */ }
```

**RN Rebuild Notes**: Create a context + provider that renders a `Modal` component. The hook returns `alert` and `confirm` functions that resolve promises. Use React Native `Modal` with custom styled buttons. Can also use React Native's built-in `Alert.alert()` for simple cases, but custom modal gives more control over styling.

---

### 4.2 `useToast()`

**Import**: `import { useToast } from '@moondreamsdev/dreamer-ui/hooks'`

**Used in**: `screens/PostCreate.tsx`, `screens/InviteAccept.tsx`

**Returns**:
```typescript
interface ToastHook {
  addToast: (options: ToastOptions) => void;
}
```

#### `addToast(options)`:
| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `title` | `string` | Yes | Toast heading |
| `description` | `string` | No | Additional detail text |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | Yes | Toast variant |

**Usage**:
```tsx
const { addToast } = useToast();

// Success
addToast({
  title: 'Post created successfully!',
  description: 'Your update has been shared.',
  type: 'success',
});

// Error
addToast({
  title: 'Failed to create post',
  description: error?.message || 'Something went wrong.',
  type: 'error',
});
```

**RN Rebuild Notes**: Create a toast context + provider that manages a queue of toast notifications. Render toasts at the top or bottom of the screen with slide-in/out animations. Auto-dismiss after 3-5 seconds. Each toast has an icon, title, optional description, and close button. Use `react-native-reanimated` for smooth animations. Alternatively, use `react-native-toast-message` as a third-party solution.

---

### 4.3 `useTheme()`

**Import**: `import { useTheme } from '@moondreamsdev/dreamer-ui/hooks'`

**Used in**: `components/ThemeToggle.tsx`

**Returns**:
```typescript
interface ThemeHook {
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

**Usage**:
```tsx
const { resolvedTheme, toggleTheme } = useTheme();
// resolvedTheme === 'dark' ? <Moon /> : <Sun />
```

**RN Rebuild Notes**: Create a theme context that stores theme preference in `AsyncStorage`. Use React Native's `useColorScheme()` for system default, then allow manual override. Provide `resolvedTheme` and `toggleTheme` through context.

---

## 5. Dreamer UI Utilities — Full Specifications for Rebuild

### 5.1 `join()`

**Import**: `import { join } from '@moondreamsdev/dreamer-ui/utils'`

**Used in**: 15+ files across the codebase

**Signature**:
```typescript
function join(...args: (string | boolean | undefined | null)[]): string
```

**Purpose**: Conditionally join class names (equivalent to `clsx` or `classnames` libraries).

**Usage**:
```tsx
className={join(
  'base-class',
  condition && 'conditional-class',
  isActive ? 'active' : 'inactive',
  optionalProp // can be undefined
)}
```

**RN Rebuild Notes**: For React Native with NativeWind, the same utility works. If using StyleSheet, this utility is not needed — use conditional style arrays instead: `style={[styles.base, condition && styles.conditional]}`. If using NativeWind, port this 1:1 or use `clsx` package.

---

## 6. Dreamer UI Symbols (Icons) — Full Specifications for Rebuild

**Import**: `import { IconName } from '@moondreamsdev/dreamer-ui/symbols'`

All icons are React components that accept:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `className` | `string` | No | Size and color styling |

### Icons Used:

| Icon | Used In | Typical Size | Purpose |
|------|---------|-------------|---------|
| `ChevronUp` | `screens/Feed.tsx` | `h-8 w-8` | Scroll-to-top button |
| `Plus` | `screens/Feed.tsx` | `h-4 w-4` | New post button |
| `Moon` | `components/ThemeToggle.tsx` | default | Dark theme indicator |
| `Sun` | `components/ThemeToggle.tsx` | default | Light theme indicator |
| `Trash` | `components/ChannelCard.tsx` | `h-4 w-4` | Delete channel button |
| `X` | `components/PostCreateMediaUploader.tsx` | default | Remove file/close button |

**RN Rebuild Notes**: Use `react-native-vector-icons` (Feather, Ionicons, or MaterialIcons sets) or `@expo/vector-icons` for equivalent icons:
- `ChevronUp` → `chevron-up` (Feather)
- `Plus` → `plus` (Feather)
- `Moon` → `moon` (Feather)
- `Sun` → `sun` (Feather)
- `Trash` → `trash-2` (Feather)
- `X` → `x` (Feather)

---

## 7. Dreamer UI Provider & Theming — Full Specifications for Rebuild

### 7.1 `DreamerUIProvider`

**Import**: `import { DreamerUIProvider } from '@moondreamsdev/dreamer-ui/providers'`

**Used in**: `App.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `theme` | `{ defaultTheme: 'light' \| 'dark' }` | Yes | Default theme |
| `children` | `ReactNode` | Yes | App content |

**Provides**: Theme context (accessed via `useTheme()`), Toast container, Action Modal container.

**RN Rebuild Notes**: Create a combined provider that wraps:
1. **ThemeProvider** — stores and toggles theme
2. **ToastProvider** — manages toast notification queue
3. **ActionModalProvider** — manages alert/confirm dialogs

### 7.2 Theme Tokens

The design system uses CSS custom properties. These must be mapped to a React Native theme object:

#### Light Theme:
```typescript
const lightTheme = {
  primary: '#D97706',           // amber-600
  primaryForeground: '#FFFFFF',
  secondary: '#FEF3C7',        // amber-100
  secondaryForeground: '#78350F', // amber-900
  muted: '#D1D5DB',            // gray-300
  mutedForeground: '#1F2937',  // gray-800
  accent: '#D97706',           // amber-600
  accentForeground: '#FFFFFF',
  success: '#16A34A',          // green-600
  successForeground: '#FFFFFF',
  warning: '#F59E0B',          // amber-500
  warningForeground: '#000000',
  destructive: '#DC2626',      // red-600
  destructiveForeground: '#FFFFFF',
  border: '#D1D5DB',           // gray-300
  card: '#FFFFFF',
  popover: '#FFFFFF',
  popoverForeground: '#111827', // gray-900
  tooltip: '#F3F4F6',          // gray-100
  tooltipForeground: '#111827', // gray-900
  background: '#FFFFFF',
  foreground: '#111827',       // gray-900
};
```

#### Dark Theme:
```typescript
const darkTheme = {
  primary: '#FBBF24',           // amber-400
  primaryForeground: '#111827', // gray-900
  secondary: '#B45309',        // amber-700
  secondaryForeground: '#FFFBEB', // amber-50
  muted: '#4B5563',            // gray-600
  mutedForeground: '#9CA3AF',  // gray-400
  accent: '#FBBF24',           // amber-400
  accentForeground: '#111827', // gray-900
  success: '#4ADE80',          // green-400
  successForeground: '#111827',
  warning: '#FBBF24',          // amber-400
  warningForeground: '#111827',
  destructive: '#F87171',      // red-400
  destructiveForeground: '#111827',
  border: '#374151',           // gray-700
  card: '#111827',             // gray-900
  popover: '#111827',
  popoverForeground: '#F3F4F6', // gray-100
  tooltip: '#374151',          // gray-700
  tooltipForeground: '#F3F4F6',
  background: '#111827',
  foreground: '#F3F4F6',
};
```

---

## 8. File-by-File Dreamer UI Import Map

This section shows exactly which Dreamer UI imports are used in each file, for precise migration tracking.

### Screens

| File | Components | Hooks | Utils | Symbols |
|------|-----------|-------|-------|---------|
| `App.tsx` | `ErrorBoundary` | — | — | — |
| `screens/Auth.tsx` | `AuthForm`, `Callout`, `Button`, `type AuthFormOnEmailSubmit` | — | `join` | — |
| `screens/Home.tsx` | `Button` | — | `join` | — |
| `screens/About.tsx` | `Button` | — | — | — |
| `screens/Feed.tsx` | `Avatar`, `Button`, `Callout`, `Select` | — | — | `ChevronUp`, `Plus` |
| `screens/PostCreate.tsx` | `Button`, `Form`, `FormFactories` | `useActionModal`, `useToast` | `join` | — |
| `screens/PostDetail.tsx` | `Avatar`, `Badge`, `Button`, `Card`, `Carousel`, `Input`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `Textarea` | — | `join` | — |
| `screens/CompleteProfile.tsx` | `Avatar`, `Input`, `Label`, `Button`, `Textarea` | `useActionModal` | `join` | — |
| `screens/Account.tsx` | `Avatar`, `Badge`, `Button`, `Card`, `Input`, `Label`, `Separator`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `Textarea` | `useActionModal` | `join` | — |
| `screens/InviteAccept.tsx` | `Avatar`, `Badge`, `Button`, `Card`, `Textarea` | `useToast` | — | — |
| `screens/VerifyEmail.tsx` | `Button`, `Callout` | — | `join` | — |
| `screens/ErrorFallback.tsx` | `Button` | — | — | — |

### Components

| File | Components | Hooks | Utils | Symbols |
|------|-----------|-------|-------|---------|
| `components/PostCard.tsx` | `Avatar`, `Badge`, `Card`, `Carousel` | — | — | — |
| `components/ChannelCard.tsx` | `Badge`, `Button`, `Card`, `CopyButton` | — | `join` | `Trash` |
| `components/ChannelFormModal.tsx` | `Modal`, `Form`, `FormFactories`, `Button`, `type FormCustomFieldProps` | — | `join` | — |
| `components/ChannelModal.tsx` | `Avatar`, `Badge`, `Button`, `CopyButton`, `HelpIcon`, `Modal`, `Separator` | — | — | — |
| `components/ChatMessage.tsx` | `Avatar` | — | `join` | — |
| `components/ReactionDisplay.tsx` | `Button` | — | `join` | — |
| `components/DemoModeBanner.tsx` | `Button` | — | `join` | — |
| `components/SkeletonPostCard.tsx` | `Card`, `Skeleton` | — | — | — |
| `components/PostCreateMediaUploader.tsx` | `Button`, `Callout` | — | `join` | `X` |
| `components/ThemeToggle.tsx` | `Toggle` | `useTheme` | `join` | `Moon`, `Sun` |
| `components/BellIcon.tsx` | — | — | `join` | — |

### Providers

| File | Providers |
|------|----------|
| `App.tsx` | `DreamerUIProvider` |

### Styles

| File | Import |
|------|--------|
| `index.css` | `@import "@moondreamsdev/dreamer-ui/styles"` |
| `index.css` | `@source "../node_modules/@moondreamsdev/dreamer-ui/dist/**/*"` |
| `dreamer-ui.css` | Theme token overrides (see Section 7.2) |

---

## 9. Data Models (TypeScript Interfaces)

All interfaces port directly to React Native — no changes needed.

### User
```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  funFact: string;
  avatar: AvatarPreset;
  joinedAt: number;              // Unix ms timestamp
  accountProgress: {
    signUpComplete: boolean;
    emailVerified: boolean;
    dailyChannelCreated: boolean;
  };
  customChannelCount: number;    // Max 3
}

type AvatarPreset = 'astronaut' | 'moon' | 'star' | 'galaxy' | 'nebula' | 'planet'
  | 'cosmic-cat' | 'dream-cloud' | 'rocket' | 'constellation' | 'comet' | 'twilight';

type NewUser = Omit<User, 'joinedAt' | 'accountProgress' | 'customChannelCount'>;
type UpdateUserProfileData = Pick<User, 'firstName' | 'lastName' | 'funFact' | 'avatar'>;
```

### Channel
```typescript
interface Channel {
  id: string;
  name: string;
  description: string;
  color: string;                      // 'INDIGO', 'AMBER', etc.
  isDaily: boolean | null;
  ownerId: string;
  subscribers: string[];
  inviteCode: string | null;         // 8-char uppercase
  createdAt: number;                 // Unix ms
  markedForDeletionAt: number | null; // Soft delete
}

type NewChannel = Omit<Channel, 'id' | 'isDaily' | 'inviteCode' | 'createdAt' | 'markedForDeletionAt'>;
```

### Post
```typescript
interface Post {
  id: string;
  authorId: string;
  channelId: string;
  text: string;
  media: MediaItem[] | null;
  timestamp: number;
  reactions: Reaction[];
  comments: Comment[];
  conversationEnrollees: string[];
  markedForDeletionAt: number | null;
  status: PostStatus;
}

interface MediaItem { type: 'image' | 'video'; url: string; }
interface Reaction { emoji: string; userId: string; }
interface Comment { id: string; authorId: string; text: string; timestamp: number; }
type PostStatus = 'uploading' | 'ready' | 'error';
```

### Channel Join Request
```typescript
interface ChannelJoinRequest {
  id: string;
  channelId: string;
  channelOwnerId: string;
  requesterId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
  respondedAt: number | null;
}
```

### Channel Colors
```typescript
interface ChannelColorOption {
  name: string;          // 'INDIGO', 'AMBER', etc.
  value: string;         // Hex bg color
  textColor: string;     // Hex text color
  tailwindClass: string; // CSS class (web-only, replace with style objects in RN)
}

// 12 colors: INDIGO, AMBER, EMERALD, PINK, LIME, PURPLE, ROSE, CYAN, ORANGE, TEAL, BLUE, VIOLET
```

---

## 10. Firestore Database Structure

### Collections

| Collection | Document ID | Description |
|-----------|------------|-------------|
| `users/{userId}` | Firebase Auth UID | User profiles |
| `channels/{channelId}` | nanoid or `{userId}-daily` | Channels |
| `posts/{postId}` | nanoid | Posts with reactions/comments |
| `channelJoinRequests/{requestId}` | nanoid | Join request records |

### Storage Structure
```
posts/{postId}/{mediaFile}  — Post media (images/videos)
```

---

## 11. Firebase Security Rules

### Firestore Rules

**Users** (`/users/{userId}`):
- Read: Any authenticated user
- Create/Update: Only the document owner
- Delete: Not allowed

**Channels** (`/channels/{channelId}`):
- Read: Any authenticated user
- Create: Owner only; custom channels limited to 3 per user
- Update: Owner (most fields) or subscriber (self-removal only)
- Delete: Owner only, custom channels only (daily protected)

**Posts** (`/posts/{postId}`):
- Read: Author or channel member (owner/subscriber)
- Create: Author only
- Update: Author only (authorId immutable)
- Delete: Author only

**Channel Join Requests** (`/channelJoinRequests/{requestId}`):
- Read: Requester or channel owner
- Create: Requester only; status='pending'; respondedAt=null; channel must exist
- Update: Channel owner only (status change)
- Delete: Not allowed

### Storage Rules

**Posts media** (`/posts/{postId}/{mediaFile}`):
- Read: If status='uploading': author only; if status='ready': author or channel member
- Write: Author only when status='uploading'
- Delete: Author only

---

## 12. Redux Architecture

### Store Shape
```typescript
const store = configureStore({
  reducer: {
    demo: demoReducer,
    posts: postsReducer,
    channels: channelsReducer,
    users: usersReducer,
    invites: invitesReducer,
  }
});
```

### Typed Hooks
```typescript
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

### Slices

#### Demo Slice
```typescript
interface DemoState { isActive: boolean; }
// Reducers: enterDemoMode, exitDemoMode
```

#### Posts Slice
```typescript
interface PostsState {
  items: Post[];
  previousReactions: Record<string, Reaction[]>;  // Optimistic rollback
  previousComments: Record<string, Comment[]>;     // Optimistic rollback
}
// Reducers (9): setPosts, addPost, clearPosts, loadDemoPosts,
//   updateReactionsOptimistic, removeReactionOptimistic, revertReactionsOptimistic,
//   updateCommentsOptimistic, revertCommentsOptimistic
// Selectors (3): selectPostById, selectPostAuthor, selectPostChannel
```

#### Users Slice
```typescript
interface UsersState { currentUser: User | null; users: User[]; }
// Reducers (5): setCurrentUser, setUsers, updateCurrentUser, clearUsers, loadDemoUsers
// Selectors (1): selectAllUsersMapById
```

#### Channels Slice
```typescript
interface ChannelsState { items: Channel[]; }
// Reducers (6): setChannels, addChannel, updateChannel, removeChannel, clearChannels, loadDemoChannels
// Selectors (5): selectUserChannels, selectUserDailyChannel, selectChannelMapById,
//   selectChannelById, selectAllDailyChannels
```

#### Invites Slice
```typescript
interface InvitesState {
  incoming: ChannelJoinRequest[];
  outgoing: ChannelJoinRequest[];
}
// Reducers (5): setIncomingRequests, setOutgoingRequests, updateJoinRequest,
//   clearInvites, loadDemoInvites
```

#### Global Action
```typescript
const resetAllState = createAction('RESET_ALL_STATE');
// All slices handle this in extraReducers → return initialState
```

### Async Thunks (createAsyncThunk)

#### User Actions
| Thunk | Args | Firestore Operations |
|-------|------|---------------------|
| `fetchUserProfile` | `uid` | `getDoc(users/{uid})` |
| `createUserProfile` | `NewUser` | `setDoc(users/{id})` |
| `updateAccountProgress` | `{uid, field, value}` | `updateDoc(users/{uid})` |
| `updateUserProfile` | `{uid, data}` | `updateDoc(users/{uid})` |

#### Channel Actions
| Thunk | Args | Notes |
|-------|------|-------|
| `ensureDailyChannelExists` | `userId` | Guards against duplicates |
| `createDailyChannel` | `userId` | ID: `{userId}-daily` |
| `createCustomChannel` | `NewChannel` | Transaction: create + increment count |
| `updateCustomChannel` | `Channel` | Strips immutable fields |
| `deleteCustomChannel` | `channelId` | Transaction: soft-delete + decrement count |
| `createJoinRequest` | `{channelId, inviteCode, message}` | Validates invite code |
| `unsubscribeFromChannel` | `channelId` | Transaction: remove from subscribers |
| `removeSubscriberFromChannel` | `{channelId, subscriberId}` | Owner-only |
| `refreshChannelInviteCode` | `channelId` | Transaction: new 8-char code |
| `respondToJoinRequest` | `{requestId, accept}` | Transaction: update status + add subscriber |

#### Post Actions
| Thunk | Args | Pattern |
|-------|------|---------|
| `uploadPost` | `{formData}` | Multi-step: create doc → upload media → update status |
| `joinConversation` | `{postId, userId}` | `arrayUnion` |
| `updatePostReactions` | `{postId, newReaction}` | **Optimistic UI** |
| `removePostReaction` | `{postId, emoji, userId}` | **Optimistic UI** |
| `updatePostComments` | `{postId, newComment}` | **Optimistic UI** |

#### Demo Actions
| Thunk | Logic |
|-------|-------|
| `enterDemoMode` | Clear all → load mock data → set active |
| `exitDemoMode` | Set inactive → resetAllState |

### Optimistic Update Pattern
```
1. Dispatch optimistic reducer (instant UI update)
2. Make Firestore call
3. Success: real-time listener will sync with server
4. Error: dispatch revert reducer (rollback UI)
```

---

## 13. Real-Time Data Subscriptions

### DataListenerWrapper — The Subscription Hub

Wraps all protected routes. Manages 5 concurrent Firestore listeners:

```
DataListenerWrapper
├── useEffect #1: Auth state
│   ├── subscribeToCurrentUser(uid) → setCurrentUser()
│   ├── subscribeToChannels(uid) → setChannels()
│   ├── subscribeToIncomingJoinRequests(uid) → setIncomingRequests()
│   └── subscribeToOutgoingJoinRequests(uid) → setOutgoingRequests()
│
├── useEffect #2: Channel changes
│   └── subscribeToPosts(uid, channelIds) → setPosts()
│       (re-subscribes when channel set changes)
│
└── useEffect #3: User set changes
    └── subscribeToChannelUsers(userIds) → setUsers()
```

### Firestore Queries
- **Channels**: `WHERE (ownerId == uid OR uid IN subscribers) AND markedForDeletionAt == null`
- **Posts**: `WHERE (authorId == uid OR channelId IN [channelIds]) AND markedForDeletionAt == null` (batched in groups of 30)
- **Incoming requests**: `WHERE channelOwnerId == uid`
- **Outgoing requests**: `WHERE requesterId == uid`
- **Channel users**: `WHERE __name__ IN [userIds]` (batched in groups of 30)

---

## 14. Authentication Flow

### Auth Context
```typescript
interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<FirebaseUser>;
  signUp(email: string, password: string): Promise<FirebaseUser>;
  signInWithGoogle(): Promise<FirebaseUser>;
  signOut(): Promise<void>;
  sendVerificationEmail(): Promise<void>;
}
```

### Auth State Machine
```
Firebase onAuthStateChanged
├── User logged in:
│   ├── fetchUserProfile(uid) → Redux
│   ├── Sync emailVerified → updateAccountProgress
│   └── ensureDailyChannelExists(uid)
└── User logged out:
    └── resetAllState()
```

### Registration Flow
```
1. Auth Screen (email + password) → signUp()
2. Complete Profile (firstName, lastName, avatar, funFact)
   → createUserProfile()
   → sendVerificationEmail()
   → createDailyChannel()
3. Verify Email (polls every 3s)
   → Auto-redirects to Feed when verified
```

### Protected Route Guard
```
1. Demo mode? → Allow all
2. Loading? → Show spinner
3. No Firebase user? → Redirect to Auth
4. Signup incomplete? → Redirect to CompleteProfile
5. Email not verified? → Redirect to VerifyEmail
6. All good → Show route + DataListenerWrapper
```

---

## 15. Screen Specifications

### 15.1 Home Screen (`/`)
- Landing page with hero, CTAs, comparison table, use-case cards
- "Get Started" → Auth (signup), "Try Demo" → Feed (demo mode)

### 15.2 About Screen (`/about`)
- Marketing manifesto (purely presentational)
- Sections: Connectivity Paradox, Crisis of Synchronous Noise, The Solution, 180-Day Rule

### 15.3 Auth Screen (`/auth`)
- Login/signup toggle, email/password form, Google sign-in, demo mode link
- Params: `mode=login|signup`, `redirect=<url>`

### 15.4 Complete Profile (`/complete-profile`)
- Post-signup form: firstName, lastName, funFact, avatar picker (12 presets)
- Creates user profile, daily channel, sends verification email

### 15.5 Verify Email (`/verify-email`)
- Polls every 3s for verification, auto-redirects to Feed, resend link button

### 15.6 Feed (`/feed`) — PROTECTED
- Post list with channel filter (Select dropdown) and sort order
- Infinite scroll (loads 3 more at bottom), scroll-to-top FAB
- Bell icon with notification badge, user avatar → Account
- "+ New Post" button → PostCreate
- Scroll position saved/restored across navigation

### 15.7 Post Create (`/post/new`) — PROTECTED
- Form: Channel selector (radio), text, media uploader (max 5 files, 10MB each)
- Supported formats: JPEG, PNG, GIF, WebP, MP4, WebM, OGG

### 15.8 Post Detail (`/post/:id`) — PROTECTED
- Full post view with progressive disclosure:
  1. Show emoji reaction buttons (8 common + custom input)
  2. After reacting → show Reactions + Conversation tabs
  3. Reactions tab: grouped emoji counts, add/remove
  4. Conversation: opt-in enrollment, chat messages

### 15.9 Account (`/account`) — PROTECTED
- 3 tabs: Account (edit profile), My Channels, Subscribed Channels
- Notifications section: incoming join requests (accept/decline), outgoing request status
- Modals: ChannelFormModal (create/edit), ChannelModal (details/subscribers/invite)

### 15.10 Invite Accept (`/invite/:channelId/:inviteCode`) — PROTECTED
- Validates invite link, shows channel info, identification prompt (300 chars)
- Handles: already subscribed, pending/accepted/declined requests, invalid links

### 15.11 Error Fallback
- Go Home, Try Again (reload), Sign Out buttons

### 15.12 Not Found
- 404 with auto-redirect to home after 2 seconds

---

## 16. Custom Component Specifications

These are Angelia's own components (not from Dreamer UI) that also need to be rebuilt:

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `AngeliaLogo` | SVG logo (house with heart) | `className?` |
| `BellIcon` | Bell icon with notification dot | `className?, hasNotification?` |
| `CategoricalAgencyIllustration` | Marketing SVG illustration | `className?` |
| `ChannelCard` | Channel info card with actions | `channel, owner?, onEdit?, onDelete?, onUnsubscribe?, onClick?, isOwner?, isLoading?` |
| `ChannelFormModal` | Create/edit channel modal | `isOpen, onClose, onSubmit, channel?, mode, existingChannelNames?` |
| `ChannelModal` | Channel details with invite/subscribers | `isOpen, onClose, channel, subscribers?, onRefreshInviteCode?, onRemoveSubscriber?, removingSubscriberId?` |
| `ChatMessage` | Chat bubble with avatar/timestamp | `authorId, text, timestamp, isCurrentUser?` |
| `ComparisonTable` | Feature comparison table | `className?` |
| `DemoModeBanner` | Fixed top banner for demo mode | (none) |
| `PostCard` | Post preview card for feed | `post, onNavigate?` |
| `PostCreateMediaUploader` | File upload with previews | `value, onValueChange` — max 5 files, 10MB each |
| `ReactionDisplay` | Emoji reaction button with count | `emoji, count, isUserReacted, onClick` |
| `SkeletonPostCard` | Loading placeholder | (none) |
| `ThemeToggle` | Light/dark theme switch | `className?` |
| `Layout` | Root layout with demo banner | (wraps Outlet) |
| `Loading` | Full-page spinner | (none) |

---

## 17. Navigation Map

```
Stack Navigator (Root)
├── Home                                     (/)
├── About                                    (/about)
├── Auth                                     (/auth)
│   params: { mode, redirect }
├── CompleteProfile                           (/complete-profile)
│   params: { redirect }
├── VerifyEmail                              (/verify-email)
│   params: { redirect }
├── [PROTECTED GROUP]
│   ├── Feed                                 (/feed)
│   ├── PostCreate                           (/post/new)
│   ├── PostDetail                           (/post/:id)
│   │   params: { id }
│   ├── Account                              (/account)
│   │   params: { tab?, view? }
│   └── InviteAccept                         (/invite/:channelId/:inviteCode)
│       params: { channelId, inviteCode }
├── NotFound                                 (*)
└── ErrorFallback                            (error boundary)
```

### Deep Linking
Configure React Navigation deep links for invite URLs: `/invite/:channelId/:inviteCode`

---

## 18. Utility Functions

These port 1:1 to React Native:

| Utility | Location | Purpose |
|---------|----------|---------|
| `getRelativeTime(timestamp)` | `lib/timeUtils.ts` | "Just now", "Xm ago", "Xh ago", "Xd ago" |
| `generateId(type)` | `util/generateId.ts` | nanoid/uuid based on type |
| `debounce(fn, delay)` | `util/debounce.ts` | Standard debounce |
| `getAuthErrorMessage(error)` | `util/firebaseAuth.ts` | Maps 30+ Firebase error codes to user messages |
| `formatAuthErrorCode(code)` | `util/firebaseAuth.ts` | Firebase error code → message |
| `isFirebaseError(error)` | `util/firebaseAuth.ts` | Type guard for Firebase errors |
| `getColorPair(channel)` | `lib/channel/channel.utils.ts` | Channel → {backgroundColor, textColor} |
| `generateChannelInviteLink(channel)` | `lib/channel/channel.utils.ts` | Full invite URL |
| `getPostAuthorName(author, currentUser)` | `lib/post/post.utils.ts` | "Name (You)" formatting |
| `isValidEmoji(str)` | `lib/post/post.constants.ts` | Unicode emoji validation |
| `getRandomPhrase(phrases)` | `lib/post/post.constants.ts` | Random conversation prompt |

### Constants
| Constant | Value |
|----------|-------|
| `CUSTOM_CHANNEL_LIMIT` | `3` |
| `DAILY_CHANNEL_SUFFIX` | `'-daily'` |
| `COMMON_EMOJIS` | `['❤️', '👀', '😊', '🎉', '😮', '😢', '😄', '🔥']` |
| `MAX_FILES` | `5` |
| `MAX_FILE_SIZE_MB` | `10` |
| `AVATAR_PRESETS` | 12 preset names (see User model) |
| `CHANNEL_COLORS` | 12 color definitions (see Channel Colors) |

---

## 19. Design System & Theme Tokens

See [Section 7.2](#72-theme-tokens) for complete light and dark theme color values.

### Key Design Principles
- **Warm Amber Accent**: Intentionally calm, not high-engagement
- **Minimalist Layout**: Clean, spacious, ample whitespace
- **Consumer-Friendly Tone**: Human, warm language — no jargon
- **12 Avatar Presets**: Cosmic-themed cartoon illustrations
- **12 Channel Colors**: Vibrant badge colors with contrast text

---

## 20. React Native Migration Notes

### What Stays the Same (Port 1:1)
- All TypeScript interfaces/types
- Redux store structure, slices, selectors, async thunks
- Firestore security rules and storage rules
- All business logic (validation, ID generation, color maps, constants)
- Data subscription patterns (onSnapshot)
- Optimistic update patterns
- Authentication flow logic
- Demo mode logic with mock data
- Utility functions

### What Must Be Rebuilt
- **All 20 Dreamer UI components** (see Section 3)
- **All 3 Dreamer UI hooks** (see Section 4)
- **`join()` utility** or replace with NativeWind/conditional styles (see Section 5)
- **All 6 Dreamer UI icons** — use `react-native-vector-icons` (see Section 6)
- **DreamerUIProvider** → custom ThemeProvider + ToastProvider + ActionModalProvider (see Section 7)
- **Theme CSS variables** → React Native theme object (see Section 7.2)

### What Changes Platform
| Web | React Native |
|-----|-------------|
| React Router DOM | React Navigation |
| TailwindCSS | NativeWind or StyleSheet |
| `<input type="file">` | `react-native-image-picker` |
| `localStorage` / `sessionStorage` | `@react-native-async-storage/async-storage` |
| `window.location.origin` | Deep linking configuration |
| IntersectionObserver | FlatList `onEndReached` |
| CSS custom properties | Theme context object |
| `firebase` web SDK | `@react-native-firebase/*` |
| Google Sign-In (popup) | `@react-native-google-signin/google-signin` |
| SVG elements | `react-native-svg` |
| `Clipboard` web API | `@react-native-clipboard/clipboard` |
| `<video>` element | `react-native-video` |
| Scroll position save/restore | FlatList ref + `scrollToOffset` |

### Recommended RN Packages
| Purpose | Package |
|---------|---------|
| Navigation | `@react-navigation/native`, `@react-navigation/stack` |
| Firebase | `@react-native-firebase/app`, `/auth`, `/firestore`, `/storage` |
| State Management | `@reduxjs/toolkit`, `react-redux` (same as web) |
| Styling | `nativewind` or `StyleSheet` |
| Icons | `react-native-vector-icons` or `@expo/vector-icons` |
| Image Picker | `react-native-image-picker` |
| Clipboard | `@react-native-clipboard/clipboard` |
| Video Player | `react-native-video` |
| Carousel | `react-native-reanimated-carousel` |
| Async Storage | `@react-native-async-storage/async-storage` |
| SVG | `react-native-svg` |
| Google Sign-In | `@react-native-google-signin/google-signin` |
| Animations | `react-native-reanimated` |
| Bottom Sheet | `@gorhom/bottom-sheet` |
| Toast | Custom build or `react-native-toast-message` |
| Skeleton Loading | Custom build with `react-native-reanimated` |

---

*This document was auto-generated from a comprehensive analysis of the Angelia web application source code for the purpose of React Native mobile application development.*
