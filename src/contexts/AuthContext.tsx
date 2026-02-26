import { useEffect, useState, type ReactNode } from 'react';
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@lib/firebase';
import { AuthContext, AuthContextType } from '@hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import {
  fetchUserProfile,
  updateAccountProgress,
} from '@/store/actions/userActions';
import { User } from '@/lib/user';
import { ensureDailyChannelExists } from '@/store/actions/channelActions';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        dispatch({ type: 'RESET_ALL_STATE' });
        setLoading(false);
      } else {
        // User is authenticated, fetch their profile from Firestore
        try {
          const result = await dispatch(fetchUserProfile(user.uid));

          // If Firebase user's email is verified but Firestore doesn't reflect it, sync it
          const resultAsUser: User | null =
            result.payload && typeof result.payload === 'object'
              ? (result.payload as User)
              : null;
          if (
            user.emailVerified &&
            resultAsUser &&
            !resultAsUser.accountProgress.emailVerified
          ) {
            await dispatch(
              updateAccountProgress({
                uid: user.uid,
                field: 'emailVerified',
                value: true,
              }),
            );
          }

          if (
            user.emailVerified &&
            resultAsUser?.accountProgress.signUpComplete
          ) {
            await dispatch(ensureDailyChannelExists(user.uid));
          }
        } catch (err) {
          console.error(
            'Error fetching user profile on auth state change:',
            err,
          );
        } finally {
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, [dispatch]);

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential.user;
  };

  const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential.user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    return userCredential.user;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const sendVerificationEmail = async () => {
    if (!firebaseUser) {
      throw new Error(
        'No authenticated user available to send verification email.',
      );
    }

    await sendEmailVerification(firebaseUser);
  };

  const value: AuthContextType = {
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
