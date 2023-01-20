import { PropsWithChildren, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext"
import { auth, database } from "../base";
import { onValue, ref } from "firebase/database";

export const DataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser){
            const userInfo = ref(database, 'brukere/' + firebaseUser.uid);
            onValue(userInfo, (snapshot) => {
                setData(snapshot);
            });
          }
    });

    return unsubscribe;
  }, []);

  return <DataContext.Provider value={data} >{children}</DataContext.Provider>;
};