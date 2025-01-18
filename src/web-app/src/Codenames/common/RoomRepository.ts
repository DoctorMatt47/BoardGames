import { arrayUnion, doc, DocumentReference, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { makeAutoObservable, runInAction } from "mobx";
import { db } from "../../firebase.ts";
import { CardDbItem, ChatMessageDbItem, PlayerDbItem, RoomDbItem } from "./db-items.ts";
import { TeamEnum } from "../Team/TeamEnum.ts";

const initState = {
  chatMessages: [],
  cards: [],
  players: [],
  turn: null,
};

const initCards = [
  { id: 1, value: "apple", color: "red", revealed: false },
  { id: 2, value: "banana", color: "black", revealed: false },
  { id: 3, value: "cherry", color: "white", revealed: false },
  { id: 4, value: "date", color: "blue", revealed: false },
  { id: 5, value: "elderberry", color: "blue", revealed: false },
  { id: 6, value: "fig", color: "red", revealed: false },
  { id: 7, value: "grape", color: "blue", revealed: false },
  { id: 8, value: "honeydew", color: "blue", revealed: false },
  { id: 9, value: "kiwi", color: "red", revealed: false },
  { id: 10, value: "lemon", color: "blue", revealed: false },
  { id: 11, value: "mango", color: "red", revealed: false },
  { id: 12, value: "nectarine", color: "red", revealed: false },
  { id: 13, value: "orange", color: "white", revealed: false },
  { id: 14, value: "pear", color: "red", revealed: false },
  { id: 15, value: "quince", color: "white", revealed: false },
  { id: 16, value: "raspberry", color: "white", revealed: false },
  { id: 17, value: "strawberry", color: "red", revealed: false },
  { id: 18, value: "tangerine", color: "red", revealed: false },
  { id: 19, value: "ugli", color: "white", revealed: false },
  { id: 20, value: "vanilla", color: "red", revealed: false },
  { id: 21, value: "watermelon", color: "red", revealed: false },
  { id: 22, value: "ximenia", color: "white", revealed: false },
  { id: 23, value: "yellow watermelon", color: "red", revealed: false },
  { id: 24, value: "zucchini", color: "white", revealed: false },
  { id: 25, value: "avocado", color: "red", revealed: false },
];

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

  async putMessage(message: ChatMessageDbItem) {
    await updateDoc(this.documentRef, {
      chatMessages: arrayUnion(message),
      turn: { team: message.team == TeamEnum.Red ? TeamEnum.Red : TeamEnum.Blue, isMaster: false },
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

  async updatePlayers(players: PlayerDbItem[]) {
    await updateDoc(this.documentRef, {
      players,
    });
  }

  async revealCard(card: CardDbItem) {
    await updateDoc(this.documentRef, {
      cards: this.state.cards.map(c => (c.id === card.id ? card : c)),
      turn: { team: card.color == TeamEnum.Red ? TeamEnum.Red : TeamEnum.Blue, isMaster: false },
    });
  }

  async updateItems(chatMessages: ChatMessageDbItem[], cards: CardDbItem[], players: PlayerDbItem[]) {
    await updateDoc(this.documentRef, {
      chatMessages,
      cards,
      players,
    });
  }

  async startGame() {
    await updateDoc(this.documentRef, {
      chatMessages: [],
      cards: initCards,
    });
  }
}
