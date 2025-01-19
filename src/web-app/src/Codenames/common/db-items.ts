export interface RoomDbItem {
  chatMessages: ChatMessageDbItem[];
  players: PlayerDbItem[];
  cards: CardDbItem[];
  turn: TurnDbItem | null;
  settings: SettingsDbItem;
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

export interface TurnDbItem {
  team: string;
  isMaster: boolean;
  win?: boolean;
}

export interface WordDbItem {
  id: string;
  value: string;
}

export interface SettingsDbItem {
  isLocked: boolean;
}
