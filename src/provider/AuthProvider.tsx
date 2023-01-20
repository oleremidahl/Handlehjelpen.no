import { PropsWithChildren, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import firebase from "firebase/compat/app";
import { auth } from "../base";

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      console.log("AuthProvider   " + firebaseUser);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user} >{children}</AuthContext.Provider>;
};