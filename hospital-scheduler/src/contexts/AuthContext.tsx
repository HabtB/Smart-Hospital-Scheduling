import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, DocumentSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string, userData: Partial<UserProfile>) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginAnonymously: () => Promise<UserCredential>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (email: string, password: string): Promise<UserCredential> => 
    signInWithEmailAndPassword(auth, email, password);

  const signup = async (email: string, password: string, userData: Partial<UserProfile>): Promise<UserCredential> => {
    try {
      console.log('🔄 Attempting Firebase signup with:', { email, hasPassword: !!password });
      console.log('🔄 Auth instance:', auth);
      console.log('🔄 Auth app:', auth.app);
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase signup successful:', result.user.uid);
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        id: result.user.uid,
        name: userData.name || '',
        email: email,
        role: userData.role || 'nurse',
        departmentId: userData.departmentId || '',
        certifications: userData.certifications || [],
        isActive: true,
        createdAt: new Date() as any,
      };

      console.log('🔄 Creating user profile in Firestore...');
      await setDoc(doc(db, 'staff', result.user.uid), userProfile);
      console.log('✅ User profile created successfully');
      
      return result;
    } catch (error: any) {
      console.error('❌ Firebase signup error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      // Provide more helpful error messages
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/password authentication is not enabled. Please enable it in Firebase Console.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use a stronger password.');
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      }
      
      throw error;
    }
  };

  const logout = (): Promise<void> => signOut(auth);

  const loginAnonymously = (): Promise<UserCredential> => signInAnonymously(auth);

  const fetchUserProfile = async (user: User): Promise<UserProfile | null> => {
    if (!user) return null;
    
    try {
      const userDoc: DocumentSnapshot = await getDoc(doc(db, 'staff', user.uid));
      if (userDoc.exists()) {
        return {
          id: user.uid,
          ...userDoc.data()
        } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setCurrentUser(user);
      
      if (user) {
        const profile = await fetchUserProfile(user);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    loginAnonymously,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}