import { arrayUnion, doc, DocumentReference, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { makeAutoObservable } from "mobx";
import { db } from "../../firebase.ts";
import { ChatMessageDbItem, PlayerDbItem, RoomDbItem } from "./db-items.ts";

const initState = {
  chatMessages: [],
  cards: [],
  players: [],
  words: [],
};

export class RoomRepository {
  private readonly documentRef: DocumentReference = null!;
  state: RoomDbItem = initState;

  constructor(roomId: string) {
    makeAutoObservable(this);
    this.documentRef = doc(db, "codename-rooms", roomId);
  }

  subscribe() {
    return onSnapshot(this.documentRef, async snapshot => {
      if (snapshot.exists()) {
        this.state = snapshot.data() as RoomDbItem;
      } else {
        await setDoc(this.documentRef, initState);
      }
    });
  }

  async putMessage(message: ChatMessageDbItem) {
    await updateDoc(this.documentRef, {
      chatMessages: arrayUnion(message),
    });
  }

  async putPlayer(player: PlayerDbItem) {
    await updateDoc(this.documentRef, {
      players: arrayUnion(player),
    });
  }

  async removePlayer(clientId: string) {
    await updateDoc(this.documentRef, {
      players: this.state.players.filter(p => p.clientId !== clientId),
    });
  }

  async updatePlayer(player: PlayerDbItem) {
    await updateDoc(this.documentRef, {
      players: this.state.players.map(p => (p.clientId === player.clientId ? player : p)),
    });
  }
}
