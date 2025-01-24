// hooks/useFirebase.ts
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // 

export function useFirebase() {
    const getDocumentById = async (collectionName: string, docId: string) => {
        try {
            const docRef = doc(db, collectionName, docId);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        } catch (error) {
            console.error('Error getting document:', error);
            throw error;
        }
    };

    const getCollectionDocs = async (collectionName: string, options = {}) => {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting collection:', error);
            throw error;
        }
    };

    const getWatchesByBrand = async (brandName: string) => {
        try {
            const q = query(
                collection(db, 'Watches'),
                where('brand', '==', brandName)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting watches by brand:', error);
            throw error;
        }
    };

    return {
        getDocumentById,
        getCollectionDocs,
        getWatchesByBrand,
    };
}