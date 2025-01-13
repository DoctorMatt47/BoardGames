import { RoomRepository } from "./RoomRepository.ts";
import { TeamEnum } from "../Team/TeamEnum.ts";
import { autorun, makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";
import { getClientColor, getClientId } from "./local-storage.ts";

export const GameServiceContext = createContext<GameService>(null!);

export class GameService {
  isLoaded: boolean = false;
  isConnected: boolean = false;

  get state() {
    return this.roomRepository.state;
  }

  constructor(private roomRepository: RoomRepository) {
    makeAutoObservable(this);

    autorun(() => {
      console.log("Room state changed", this.roomRepository.state);
      runInAction(() => {
        this.isLoaded = Boolean(this.roomRepository.state);
      });
    });
  }

  async connectPlayer() {
    if (this.state.players.some(p => p.clientId === getClientId())) return;

    await this.roomRepository.putPlayer({
      clientId: getClientId(),
      name: "Guest",
      team: "spectator",
      isAdmin: this.state.players.length === 0,
      isMaster: false,
      color: getClientColor(),
    });

    runInAction(() => {
      this.isConnected = true;
    });
  }

  async disconnectPlayer() {
    await this.roomRepository.removePlayer(getClientId());

    runInAction(() => {
      this.isConnected = false;
    });
  }

  getMaster(team: TeamEnum) {
    return this.state!.players.find(p => p.team === team.toString() && p.isMaster);
  }

  endTurn() {}
}
