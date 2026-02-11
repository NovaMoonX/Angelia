# GitHub AI Instructions for project

## Primary Context Source (Read First)

Before starting any work, always read the product context in [.context.md](../.context.md). Treat it as the primary source of truth for background, target personas, core problem/value proposition, brand description, market analysis/differentiator, and digital wellbeing goals.

## Core Development Rules

### 1. Component Creation
- Use `export function ComponentName` syntax (NOT `React.FC` or arrow functions)

### 2. Date Fields
- All date fields must be stored as millisecond timestamps (number, Unix ms)
- Do NOT use the `Date` type for field values; convert to ms at boundaries

### 3. Optional Fields
- Use `| null` for optional fields instead of `?:` since Firebase does not adapt well to `undefined`

### 4. Time Formatting
- **ALWAYS** use `getRelativeTime` from `@lib/timeUtils` for displaying relative time (e.g., "2h ago", "3d ago")
- **NEVER** create custom time formatting functions for relative time display
- Import: `import { getRelativeTime } from '@lib/timeUtils';`

### 5. Code Formatting
- **Always use 2 spaces for indentation** (NOT 4 spaces or tabs)
- Ensure consistent indentation across all files
- Configure your editor to use 2 spaces for TypeScript, JavaScript, TSX, and JSX files

### 6. Return Value Debugging
- Always store return values in variables before returning them for easier debugging
- This applies to all callbacks, computed values, and complex expressions

```tsx
// ❌ Hard to debug - direct return
const answeredCount = useMemo(() => {
  if (!selectedApartment) return 0;
  return allQuestions.filter(
    (q) => getAnswer(q.id, selectedApartment) !== '',
  ).length;
}, [allQuestions, selectedApartment, getAnswer]);

// ✅ Easy to debug - store in variable first
const answeredCount = useMemo(() => {
  if (!selectedApartment) return 0;
  
  const result = allQuestions.filter(
    (q) => getAnswer(q.id, selectedApartment) !== '',
  ).length;
  
  return result;
}, [allQuestions, selectedApartment, getAnswer]);
```

### 7. Styling & Class Names
- Use TailwindCSS exclusively
- **ALWAYS** use `join` from `@moondreamsdev/dreamer-ui/utils` for conditional class names
- **NEVER** use template literals with `${` for className - always use `join()` instead
- Use existing styles and colors from `src/dreamer-ui.css` and `src/index.css` when applicable (do not modify them)

```tsx
import { join } from '@moondreamsdev/dreamer-ui/utils';

export function Test({ variant, className }: TestProps) {
  return (
    <div 
      className={join(
        'px-4 py-2 rounded',
        variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary',
        className
      )}
    >
      Click me
    </div>
  );
}
```

**❌ NEVER DO THIS:**
```tsx
// Bad - template literals for conditional classes
className={`base-class ${condition ? 'conditional-class' : ''}`}
className={`base-class ${isActive ? 'active' : 'inactive'}`}
```

**✅ ALWAYS DO THIS:**
```tsx
// Good - use join() for all conditional classes
className={join('base-class', condition && 'conditional-class')}
className={join('base-class', isActive ? 'active' : 'inactive')}
```

### 8. Component Library Priority
- Always check Dreamer UI first before creating custom components
- Import from `@moondreamsdev/dreamer-ui/components`, `/hooks`, `/symbols`, `/utils`
- Always check existing props of Dream UI components before setting custom styles

### 9. File Structure
Follow the existing structure:
```
src/
├── components/ # Reusable UI components
├── contexts/   # React context providers (Should always import the context from its hook file)
├── hooks/      # Custom React hooks (should always declare the context they use)
├── lib/        # Async functions, mock data, constants, etc
├── routes/     # Router configuration
├── screens/    # Page/route components
├── store/      # State management (i.e. Redux store)
├── styles/     # Additional CSS/styling files
├── ui/         # Layout and core UI components
├── utils/      # Utility functions
```

### 10. Import Patterns
```tsx
// Dreamer UI imports
import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useTheme } from '@moondreamsdev/dreamer-ui/hooks';

// Project imports using aliases
import { APP_TITLE } from '@lib/app';
import Home from '@screens/Home';
import Layout from '@ui/Layout';
import { router } from '@routes/AppRoutes';
import MyComponent from '@components/MyComponent';
import { useCustomHook } from '@hooks/useCustomHook';
import { MyContext } from '@contexts/MyContext';
import { store } from '@store';
import { helper } from '@utils/helper';
```

### 11. Available Import Aliases
- `@/` → `src/`
- `@components/` → `src/components/`
- `@contexts/` → `src/contexts/`
- `@hooks/` → `src/hooks/`
- `@lib/` → `src/lib/`
- `@routes/` → `src/routes/`
- `@screens/` → `src/screens/`
- `@store/` → `src/store/`
- `@styles/` → `src/styles/`
- `@ui/` → `src/ui/`
- `@utils/` → `src/utils/`

### 12. Content & Tone Guidelines
- **ALWAYS** use consumer-friendly wording that's human and warm
- Write for real people, not robots—avoid jargon and technical terms
- Use conversational language that feels personal and approachable
- Focus on benefits and feelings, not just features
- Be empathetic to user pain points and aspirations
- Examples:
  - ❌ "Categorical organization paradigm for data entities"
  - ✅ "Organize your updates the way that makes sense to you"
  - ❌ "Temporal hygiene enforcement mechanism"
  - ✅ "Updates fade after six months, so you can share freely"

### 13. Redux State Management
- **ALWAYS** use `createAsyncThunk` from `@reduxjs/toolkit` for async operations that affect Redux state
- **NEVER** perform async Firestore operations directly in components - use thunks instead
- Place async thunks in `src/store/` directory (e.g., `authActions.ts`, `demoActions.ts`)
- Thunks should handle both the async operation and the Redux state update

**❌ NEVER DO THIS:**
```tsx
// Bad - async Firestore operations directly in component
const handleLogin = async () => {
  const user = await signIn(email, password);
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  dispatch(setCurrentUser(userDoc.data()));
};
```

**✅ ALWAYS DO THIS:**
```tsx
// Good - create async thunk in store/authActions.ts
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (uid: string, { dispatch }) => {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      const user = { id: uid, ...userDocSnap.data() };
      dispatch(setCurrentUser(user));
      return user;
    }
    return null;
  }
);

// Then use in component
const handleLogin = async () => {
  const user = await signIn(email, password);
  await dispatch(fetchUserProfile(user.uid));
};
```

**Benefits of createAsyncThunk:**
- Centralized async logic for better maintainability
- Built-in loading states (pending/fulfilled/rejected)
- Automatic error handling
- Better testing and debugging
- Consistent pattern across the application

## Quick Reference
- Component syntax: `export function ComponentName`
- **Indentation: Always use 2 spaces (NOT 4 spaces or tabs)**
- **Time formatting: ALWAYS use `getRelativeTime()` for relative time - NEVER create custom time functions**
- **Class names: ALWAYS use `join()` for conditionals - NEVER template literals**
- **Redux async: ALWAYS use `createAsyncThunk` for async operations that affect state**
- **Tone: Consumer-friendly, human, and warm - avoid jargon**
- Check Dreamer UI first
- Use import aliases: `@components/`, `@hooks/`, `@lib/`, `@screens/`, `@ui/`, etc.
- Follow structured folder organization with proper separation of concerns

## ⚠️ Critical Reminders
- **2 spaces for indentation - ALWAYS**
- **`getRelativeTime()` for relative time - NEVER custom time formatting functions**
- **Template literals with `${` in className are FORBIDDEN**
- **Always import and use `join` from `@moondreamsdev/dreamer-ui/utils`**
- **Before writing any conditional className, ask: "Am I using join()?"**
- **Async operations that update Redux state must use `createAsyncThunk`**
- **Use consumer-friendly, warm, human language - avoid jargon**

## 📚 Documentation Maintenance

### 13. README.md Update Rule
**CRITICAL**: The README.md must be updated with **EVERY** change to the codebase.

**When to Update README:**
- ✅ Adding new features or functionality
- ✅ Modifying security implementation (encryption, authentication, etc.)
- ✅ Changing UI/UX elements or design
- ✅ Updating dependencies or tech stack
- ✅ Modifying data schemas or architecture
- ✅ Adding or changing configuration requirements
- ✅ Implementing new security measures
- ✅ Changing file upload limits or constraints
- ✅ Modifying authentication flow
- ✅ Any user-facing changes

**What to Update in README:**
1. **Features Section**: Add/update feature descriptions with emojis and clear explanations
2. **Security Architecture**: Document any encryption, authentication, or security changes
3. **Usage Guide**: Update if user workflows or steps change
4. **Security Notes**: Add warnings or important security information
5. **Data Schema**: Update TypeScript interfaces if data structure changes
6. **Tech Stack**: Update versions or add new technologies
7. **Troubleshooting**: Add solutions to new common issues
8. **Design & Visual Aesthetic**: Document design changes or visual updates

**README Update Checklist:**
- [ ] Is this change user-visible or security-related?
- [ ] Does this affect how users interact with the app?
- [ ] Does this change security guarantees or encryption?
- [ ] Does this modify setup or configuration requirements?
- [ ] Have I updated all relevant README sections?
- [ ] Are code examples accurate and up-to-date?
- [ ] Are version numbers current?

**Why This Matters:**
The README is the **primary documentation** for potential users. Outdated documentation:
- ❌ Misleads users about capabilities
- ❌ Creates security misunderstandings
- ❌ Causes setup/configuration issues
- ❌ Damages project credibility
- ❌ Wastes user time troubleshooting

**Example:**
```markdown
# Before making changes
- Check current README sections
- Note what needs updating

# After making changes
- Update affected README sections
- Verify all examples still work
- Check that security claims are accurate
- Update version numbers if needed
- Add new troubleshooting if needed
```

**README Sections to Monitor:**
1. Features (categorized by Security, Authentication, Data Management, UI)
2. Tech Stack (versions matter!)
3. Security Architecture (encryption details, iterations, algorithms)
4. Usage Guide (step-by-step user flows)
5. Security Notes (critical warnings)
6. Data Schema (TypeScript interfaces)
7. Design & Visual Aesthetic (visual design system)
8. Firestore Rules (security rule explanations)
9. Troubleshooting (common issues and solutions)
10. Project Structure (file organization)

**Enforcement:**
- Every PR should include README updates if applicable
- Code reviews should verify README accuracy
- Outdated README is considered a bug
