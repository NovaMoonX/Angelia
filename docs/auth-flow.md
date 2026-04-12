# Auth Flow — New Account Creation

This document describes the complete flow for creating a new account in Angelia, from the sign-up form through to a fully verified, ready-to-use profile. It covers every screen, every store action used, and how demo mode intersects with the real auth path.

---

## Overview

```
/auth (signup)
  → Firebase createUserWithEmailAndPassword
  → /complete-profile
      → createUserProfile (thunk)   [Firestore + Redux]
      → sendVerificationEmail       [Firebase Auth]
      → createDailyChannel (thunk)  [Firestore]
  → /verify-email
      → (poll / reload until emailVerified)
      → AuthContext onAuthStateChanged fires
          → fetchUserProfile (thunk)
          → updateAccountProgress (thunk)  [emailVerified = true]
          → ensureDailyChannelExists (thunk)
  → /feed
```

---

## 1. Auth Screen — `/auth`

**File:** `src/screens/Auth.tsx`

The user lands on `/auth?mode=signup`. The `AuthForm` component (from Dreamer UI) renders email/password and Google sign-in options.

### What happens on signup

```ts
// Auth.tsx — handleAuthSubmit
await signUp(data.email, data.password);
navigate('/complete-profile', { replace: true });
```

`signUp` is provided by `useAuth()` (see §5). It calls Firebase's `createUserWithEmailAndPassword` and returns the Firebase user — **no Firestore document is created yet**.

The screen then navigates to `/complete-profile`. A `?redirect=<url>` query param is preserved throughout if the user arrived via a deep link.

### Demo mode shortcut

A "demo feed" link is shown on the auth screen:

```ts
// Auth.tsx — handleDemoFeedClick
dispatch(enterDemoMode());   // demoActions thunk
navigate('/feed');
```

This loads mock data into every Redux slice and sets `demo.isActive = true`, bypassing the entire auth flow. See §6 for demo state details.

---

## 2. Complete Profile Screen — `/complete-profile`

**File:** `src/screens/CompleteProfile.tsx`

The user fills in their first name, last name, a fun fact, and picks an avatar preset. Submission is gated until all required fields are non-empty.

### Store action: `createUserProfile`

**File:** `src/store/actions/userActions.ts`

```ts
dispatch(
  createUserProfile({
    id: firebaseUser.uid,
    email: firebaseUser.email,
    firstName, lastName, funFact, avatar,
  })
);
```

The thunk builds a full `User` object, writes it to `Firestore/users/{uid}`, and dispatches `setCurrentUser` to put it in Redux:

```ts
// userActions.ts — createUserProfile
const newUser: User = {
  ...user,
  joinedAt: Date.now(),
  accountProgress: {
    emailVerified: false,
    signUpComplete: true,    // marks profile as done
    dailyChannelCreated: false,
  },
  customChannelCount: 0,
};
await setDoc(doc(db, 'users', newUser.id), newUser);
dispatch(setCurrentUser(newUser));   // usersSlice action
```

### Verification email

After the profile is saved, the screen calls `sendVerificationEmail()` from `useAuth()`. This calls Firebase's `sendEmailVerification(firebaseUser)`.

### Store action: `createDailyChannel`

**File:** `src/store/actions/channelActions.ts`

```ts
dispatch(createDailyChannel(firebaseUser.uid));
```

Creates a `channels/{uid}-daily` document in Firestore. If the document already exists and is not marked for deletion, it returns the existing one. The channel is:

```ts
{
  id: `${userId}-daily`,
  name: 'Daily',
  isDaily: true,
  ownerId: userId,
  subscribers: [],
  inviteCode: generateId('channelInviteCode'),
  createdAt: Date.now(),
  markedForDeletionAt: null,
}
```

After both actions succeed, the user is sent to `/verify-email`.

---

## 3. Verify Email Screen — `/verify-email`

**File:** `src/screens/VerifyEmail.tsx`

This screen polls for email verification every 3 seconds by calling `window.location.reload()`. When the page reloads, `AuthContext`'s `onAuthStateChanged` listener fires (see §5), which:

1. Calls `fetchUserProfile` to reload the user from Firestore into Redux.
2. Detects that `firebaseUser.emailVerified === true` but `user.accountProgress.emailVerified === false` and dispatches `updateAccountProgress`.
3. Because `signUpComplete` is also `true`, dispatches `ensureDailyChannelExists`.

Once `firebaseUser.emailVerified` is truthy, the screen auto-redirects to `/feed` (or the preserved `?redirect` URL) after a 2-second delay.

The user can also request a resend via `sendVerificationEmail()`.

---

## 4. Store Actions Reference

All async operations that touch Firestore or update Redux state are implemented as `createAsyncThunk` in `src/store/actions/`.

### `fetchUserProfile` — `src/store/actions/userActions.ts`

| | |
|---|---|
| **Action type** | `auth/fetchUserProfile` |
| **Input** | `uid: string` |
| **Firestore** | Reads `users/{uid}` |
| **Redux** | Dispatches `setCurrentUser(user)` |
| **Used in** | `AuthContext` (on every auth state change), `Auth.tsx` (after login) |

### `createUserProfile` — `src/store/actions/userActions.ts`

| | |
|---|---|
| **Action type** | `auth/createUserProfile` |
| **Input** | `NewUser` (id, email, firstName, lastName, funFact, avatar) |
| **Firestore** | Writes `users/{uid}` with full `User` shape |
| **Redux** | Dispatches `setCurrentUser(newUser)` |
| **Used in** | `CompleteProfile.tsx` |

### `updateAccountProgress` — `src/store/actions/userActions.ts`

| | |
|---|---|
| **Action type** | `auth/accountProgress` |
| **Input** | `{ uid, field: keyof accountProgress, value: boolean }` |
| **Firestore** | Updates `users/{uid}.accountProgress.{field}` |
| **Redux** | Re-fetches the user doc and dispatches `setCurrentUser` |
| **Used in** | `AuthContext` (to sync `emailVerified`), `ensureDailyChannelExists` (to sync `dailyChannelCreated`) |

### `createDailyChannel` — `src/store/actions/channelActions.ts`

| | |
|---|---|
| **Action type** | `channels/createDaily` |
| **Input** | `userId: string` |
| **Firestore** | Writes `channels/{userId}-daily` (or restores an existing one) |
| **Redux** | Returns the channel via fulfilled payload; `channelsSlice` should handle it if subscribed |
| **Used in** | `CompleteProfile.tsx`, `ensureDailyChannelExists` |

### `ensureDailyChannelExists` — `src/store/actions/channelActions.ts`

| | |
|---|---|
| **Action type** | `channels/checkDailyExists` |
| **Input** | `userId: string` |
| **Logic** | Checks Redux state → Firestore → creates if missing |
| **Side effects** | May dispatch `updateAccountProgress` and/or `createDailyChannel` |
| **Used in** | `AuthContext` (after every verified auth state change) |

---

## 5. `AuthProvider` Structure

**Files:** `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts`

### Context shape

```ts
// src/hooks/useAuth.ts
interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email, password) => Promise<FirebaseUser>;
  signUp: (email, password) => Promise<FirebaseUser>;
  signInWithGoogle: () => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}
```

`AuthContext` is created here and exported alongside the `useAuth` hook. Consuming components call `useAuth()` — throwing if used outside a provider.

### `AuthProvider` lifecycle

`AuthProvider` (`src/contexts/AuthContext.tsx`) wraps the whole app and:

1. **Subscribes to `onAuthStateChanged`** on mount via a `useEffect`. This is the single source of truth for Firebase auth state.
2. On **sign-out / no user**: dispatches `{ type: 'RESET_ALL_STATE' }` (same as the `resetAllState` action) to clear all Redux slices to their initial state.
3. On **sign-in**:
   - Dispatches `fetchUserProfile(user.uid)` to load the Firestore user into Redux.
   - If `firebaseUser.emailVerified` is `true` but `user.accountProgress.emailVerified` is `false`, dispatches `updateAccountProgress({ uid, field: 'emailVerified', value: true })`.
   - If both `emailVerified` and `signUpComplete` are `true`, dispatches `ensureDailyChannelExists(user.uid)`.
4. Sets `loading = false` after these checks, so the UI never flashes an incorrect state.

### Exposed methods

| Method | Firebase call | Notes |
|---|---|---|
| `signIn` | `signInWithEmailAndPassword` | Returns Firebase user |
| `signUp` | `createUserWithEmailAndPassword` | Returns Firebase user; does NOT create Firestore doc |
| `signInWithGoogle` | `signInWithPopup(GoogleAuthProvider)` | Returns Firebase user |
| `signOut` | `firebaseSignOut` | Triggers `onAuthStateChanged` → `RESET_ALL_STATE` |
| `sendVerificationEmail` | `sendEmailVerification(firebaseUser)` | Throws if no current user |

---

## 6. Demo Mode

**Files:** `src/store/actions/demoActions.ts`, `src/store/slices/demoSlice.ts`

Demo mode lets anyone explore the app without creating an account. It is completely separate from the real auth flow.

### Entering demo mode

```ts
// demoActions.ts — enterDemoMode thunk
dispatch(clearPosts());
dispatch(clearChannels());
dispatch(clearUsers());
dispatch(clearInvites());

dispatch(loadDemoPosts());
dispatch(loadDemoChannels());
dispatch(loadDemoUsers());    // sets currentUser to mockCurrentUser
dispatch(loadDemoInvites());

dispatch(enterDemoModeAction()); // sets demo.isActive = true
```

Triggered from `Auth.tsx` when the user clicks "Head straight to the demo feed →".

### Exiting demo mode

```ts
// demoActions.ts — exitDemoMode thunk
dispatch(exitDemoModeAction());  // sets demo.isActive = false
dispatch(resetAllState());       // clears all slices
```

### Redux slice

```ts
// demoSlice.ts
interface DemoState { isActive: boolean; }
```

`resetAllState` resets this slice (along with all others) to `{ isActive: false }`.

### Effect on `ProtectedRoutes`

`ProtectedRoutes` (`src/routes/ProtectedRoutes.tsx`) reads `state.demo.isActive`. When `true`, it renders `<Outlet />` immediately — no Firebase auth, no email verification, no profile check is required. When `false`, it enforces the full auth + verification + profile-complete chain before allowing access.

---

## 7. Redux Store Shape (auth-relevant slices)

**File:** `src/store/index.ts`

```ts
{
  demo:     { isActive: boolean },
  users:    { currentUser: User | null, users: User[] },
  channels: { items: Channel[] },
  posts:    { ... },
  invites:  { ... },
}
```

All slices respond to `resetAllState` by returning their `initialState`. This single global action is used both on sign-out (dispatched inside `AuthProvider`'s `onAuthStateChanged`) and on demo exit.

---

## 8. Route Map

```
/auth                 — Auth.tsx            (public)
/complete-profile     — CompleteProfile.tsx (public, but requires Firebase user)
/verify-email         — VerifyEmail.tsx     (public, but requires Firebase user)
/feed                 — Feed.tsx            (ProtectedRoutes)
/post/new             — PostCreate.tsx      (ProtectedRoutes)
/post/:id             — PostDetail.tsx      (ProtectedRoutes)
/account              — Account.tsx         (ProtectedRoutes)
/invite/:id/:code     — InviteAccept.tsx    (ProtectedRoutes)
```

`ProtectedRoutes` guards the last group. Redirect order when a user is not fully set up:

1. No Firebase user → `/auth?redirect=<current>`
2. Firebase user but `signUpComplete = false` → `/complete-profile`
3. Firebase user but `emailVerified = false` → `/verify-email?redirect=<current>`
4. All checks pass → render `<DataListenerWrapper><Outlet /></DataListenerWrapper>`

---

## 9. Data Types

```ts
// src/lib/user/user.types.ts
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  funFact: string;
  avatar: AvatarPreset;
  joinedAt: number;             // Unix ms timestamp
  accountProgress: {
    signUpComplete: boolean;
    emailVerified: boolean;
    dailyChannelCreated: boolean;
  };
  customChannelCount: number;
}

type NewUser = Omit<User, 'joinedAt' | 'accountProgress' | 'customChannelCount'>;
```

`createUserProfile` accepts a `NewUser` and adds the omitted fields with sensible defaults.
