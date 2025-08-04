// src/utils/auth.ts
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase/firebaseConfig';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
  }
};
