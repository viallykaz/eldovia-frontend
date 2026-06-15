import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAyo-9J-p2yUbaY7ZM2EpzdT7MnS9AGPrI',
  authDomain: 'eldovia-dc893.firebaseapp.com',
  projectId: 'eldovia-dc893',
  storageBucket: 'eldovia-dc893.firebasestorage.app',
  messagingSenderId: '224832177921',
  appId: '1:224832177921:web:0e9fb0172b44dc50f3fd00',
  measurementId: 'G-N56R8T3ZDG',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const firebaseAuth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });


export const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');
