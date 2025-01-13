export interface RoomDbItem {
  chatMessages: ChatMessageDbItem[];
  players: PlayerDbItem[];
  words: WordDbItem[];
}

export interface ChatMessageDbItem {
  player: string;
  team: string;
  value: string;
}

export interface PlayerDbItem {
  clientId: string;
  name: string;
  team: string;
  isAdmin: boolean;
  isMaster: boolean;
  color: string;
}

export interface WordDbItem {
  id: string;
  value: string;
  color: string;
  revealed: boolean;
}
