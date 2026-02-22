import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { UserSettings, Multiplex } from '../types';

export const DatabaseService = {
  async saveSettings(userId: string, settings: UserSettings) {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { settings }, { merge: true });
  },

  async getSettings(userId: string): Promise<UserSettings | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().settings as UserSettings;
    }
    return null;
  },

  async saveMultiplex(userId: string, multiplex: Multiplex) {
    const docRef = doc(db, 'users', userId, 'history', multiplex.id);
    await setDoc(docRef, multiplex);
  },

  async getHistory(userId: string): Promise<Multiplex[]> {
    const colRef = collection(db, 'users', userId, 'history');
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);
    const history: Multiplex[] = [];
    querySnapshot.forEach((doc) => {
      history.push(doc.data() as Multiplex);
    });
    return history;
  },

  async deleteMultiplex(userId: string, multiplexId: string) {
    const docRef = doc(db, 'users', userId, 'history', multiplexId);
    await deleteDoc(docRef);
  }
};