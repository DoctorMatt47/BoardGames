import { arrayUnion, doc, DocumentReference, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { makeAutoObservable, runInAction } from "mobx";
import { db } from "../../firebase.ts";
import { CardDbItem, ChatMessageDbItem, PlayerDbItem, RoomDbItem } from "./db-items.ts";
import { TeamEnum } from "../Team/TeamEnum.ts";
import { FieldValue } from "firebase/firestore"; // or appropriate import

type UpdateFields<T> = {
  [P in keyof T]?: T[P] | FieldValue;
};

const initState = {
  chatMessages: [],
  cards: [],
  players: [],
  turn: null,
  result: null,
} as RoomDbItem;

export class RoomRepository {
  private readonly documentRef: DocumentReference = null!;
  state: RoomDbItem = initState;
  isLoaded = false;

  constructor(roomId: string) {
    makeAutoObservable(this);
    this.documentRef = doc(db, "codename-rooms", roomId);
  }

  subscribe() {
    return onSnapshot(this.documentRef, async snapshot => {
      if (snapshot.exists()) {
        runInAction(() => {
          this.state = snapshot.data() as RoomDbItem;
          this.isLoaded = true;
        });

        return;
      }

      await setDoc(this.documentRef, initState);

      runInAction(() => {
        this.isLoaded = true;
      });
    });
  }

  async updateItems(roomDbItem: UpdateFields<RoomDbItem>) {
    await updateDoc(this.documentRef, {
      ...roomDbItem,
    });
  }
}
