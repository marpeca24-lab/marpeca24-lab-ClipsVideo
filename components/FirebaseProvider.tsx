'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, doc, getDoc, setDoc, updateDoc, FirebaseUser } from '@/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: any | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  createProfile: (uid: string, email: string, displayName: string, country: string, referredBy?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'marpeca24@gmail.com';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const createProfile = async (uid: string, email: string, displayName: string, country: string, referredBy?: string) => {
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const initialProfile = {
      uid,
      email,
      displayName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
      country,
      balance: 0,
      tasksCompleted: 0,
      role: email === ADMIN_EMAIL ? 'admin' : 'user',
      kycStatus: 'none',
      referralCode,
      referredBy: referredBy || null,
      referralCount: 0,
      dailyTasksLimit: 4,
      withdrawalMin: 80,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', uid), initialProfile);
    setProfile(initialProfile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Auto-upgrade to admin if email matches
          if (user.email === ADMIN_EMAIL && data.role !== 'admin') {
            await updateDoc(docRef, { role: 'admin' });
            data.role = 'admin';
          }
          setProfile(data);
        } else {
          // If user logged in via Google but profile doesn't exist
          // We'll need a way to set country, but for now we'll default to 'AR'
          await createProfile(user.uid, user.email || "", user.displayName || "Usuario", "AR");
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const { signInWithPopup, googleProvider } = await import('@/firebase');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const signOutUser = async () => {
    const { signOut } = await import('@/firebase');
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut: signOutUser, createProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
};
