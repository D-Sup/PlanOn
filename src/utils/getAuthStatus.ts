import { appAuth } from "../firebase/config";
import { User, onAuthStateChanged } from "firebase/auth";

const getAuthStatus = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(appAuth, (user) => {
      resolve(user);
      unsubscribe(); 
    }, (error) => {
      reject(error); 
    });
  });
};

export default getAuthStatus;
