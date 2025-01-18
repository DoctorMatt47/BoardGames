export interface RoomDbItem {
  chatMessages: ChatMessageDbItem[];
  players: PlayerDbItem[];
  cards: CardDbItem[];
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

export interface CardDbItem {
  id: number;
  value: string;
  color: string;
  revealed: boolean;
}

export interface GameStateDbItem {
  turn: { team: string; isMaster: boolean } | null;
  result: { team: string; win: boolean } | null;
}
