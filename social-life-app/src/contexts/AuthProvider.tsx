import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User as FirebaseUser } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"
import {auth, db } from "../lib/firebase"


type AppUser = {
    uid: string;
    email?: string | null;
    displayName?: string;
    avatarUrl?: string;
};

type AuthContextType = {
    user: AppUser | null;
    loading: boolean;
    firebaseUser: FirebaseUser | null;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setFirebaseUser(u);
            if (u) {
                try{
                    const snap = await getDoc(doc(db, "users", u.uid));
                    const data = snap.exists() ? (snap.data() as any) : {};
                    setUser({
                        uid: u.uid,
                        email: u.email,
                        displayName: data.displayName || u.displayName || "",
                        avatarUrl: data.avatarUrl || "",
                    });
                } catch (err) {
                    setUser({
                        uid: u.uid,
                        email: u.email,
                        displayName: u.displayName || "",
                        avatarUrl: "",
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const getIdToken = async () => {
        if (!firebaseUser) return null;
        return await firebaseUser.getIdToken();
    };

    return (
        <AuthContext.Provider value={{user, loading, firebaseUser, getIdToken}}>
            {children}
        </AuthContext.Provider>
    )
}