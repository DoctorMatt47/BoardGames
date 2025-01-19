import {
  collection,
  CollectionReference,
  getCountFromServer,
  getDocs,
  where,
  documentId,
  query,
} from "firebase/firestore";
import { db } from "../../firebase.ts";
import { WordDbItem } from "./db-items.ts";

export class WordRepository {
  private readonly collectionRef: CollectionReference;

  constructor() {
    this.collectionRef = collection(db, "codename-words");
  }

  async getWordCount() {
    const snapshot = await getCountFromServer(this.collectionRef);
    return snapshot.data().count;
  }

  async getWordsByIds(ids: string[]) {
    const querySnapshot = await getDocs(query(this.collectionRef, where(documentId(), "in", ids)));
    return querySnapshot.docs.map(doc => doc.data() as WordDbItem);
  }
}
