import { createContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { TeamEnum } from "./Team/TeamEnum.ts";

export interface GameState {
  id: string;
  players: PlayerState[];
  words: WordState[];
}

export interface PlayerState {
  clientId: string;
  name: string;
  team: string;
  isAdmin: boolean;
  isMaster: boolean;
  color: string;
}

export interface WordState {
  id: string;
  value: string;
  color: string;
  revealed: boolean;
}

const initState = {
  cards: [],
  players: [],
  words: [],
};

export const RoomIdContext = createContext<string>(null!);

export function useGameState(roomId: string) {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    const document = doc(db, "codename-state", roomId);

    return onSnapshot(document, snapshot => {
      if (snapshot.exists()) {
        setState({ id: snapshot.id, ...snapshot.data() } as GameState);
        return;
      }

      setDoc(doc(db, "codename-state", roomId), initState).then(() => setState({ id: roomId, ...initState }));
    });
  }, [roomId]);

  return {
    gameState: state,
    connectPlayer: async () => setState(await connectPlayerState()),
    joinTeam: async (team: TeamEnum) => setState(await joinTeam(team, state)),
    becomeMaster: async (team: TeamEnum) => setState(await becomeMaster(team, state)),
  };

  async function connectPlayerState() {
    if (!state || state.players.some(p => p.clientId === getClientId())) {
      return null;
    }

    const player = {
      clientId: getClientId(),
      name: "Guest",
      team: "spectator",
      isAdmin: (state?.players ?? []).length === 0,
      isMaster: false,
      color: getRandomColor(),
    };

    const players = [...state.players, player];

    await updateDoc(doc(db, "codename-state", roomId), { players: players });

    return { ...state!, players: players };
  }

  async function joinTeam(team: TeamEnum, state: GameState | null) {
    if (!state) {
      return null;
    }

    const player = state.players.find(p => p.clientId === getClientId());

    if (!player) {
      return state;
    }

    player.team = team.toString();
    player.isMaster = false;

    const players = [...state.players];

    await updateDoc(doc(db, "codename-state", roomId), { players: players });

    return { ...state, players: players };
  }

  async function becomeMaster(team: TeamEnum, state: GameState | null) {
    if (!state) {
      return null;
    }

    const player = state.players.find(p => p.clientId === getClientId());

    if (!player) {
      return state;
    }

    player.team = team.toString();
    player.isMaster = true;

    const players = [...state.players];

    await updateDoc(doc(db, "codename-state", roomId), { players: players });

    return { ...state, players: players };
  }
}

function getClientId() {
  let clientId = localStorage.getItem("clientId");

  if (!clientId) {
    clientId = crypto.randomUUID();
    localStorage.setItem("clientId", clientId);
  }

  return clientId;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}
