import { GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut  } from 'firebase/auth'
import { auth } from '@/firebase'

const provider = new GoogleAuthProvider()

export const loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, provider)
    } catch(error) {
        console.error('Error signing in with Goggle', error);
        throw error;
    }
}

export const signUpWithEmail = async () => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        return result.user;
    } catch(error) {
        console.error('Error singing up with email', error)
        throw error;
    }
}

export const loginWithEmail = async () => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        return result.user;
    } catch(error) {
        console.error('Error logging in with email', error)
        throw error;
    }
}

export const logOut = async () => {
    try {
        await signOut(auth)
    } catch(error) {
        console.error('Error logging out', error)
        throw error;
    }
}