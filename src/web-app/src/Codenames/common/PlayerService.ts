import { getClientColor, getClientId } from "./local-storage.ts";
import { RoomRepository } from "./RoomRepository.ts";
import { PlayerDbItem } from "./db-items.ts";
import { TeamEnum } from "../Team/TeamEnum.ts";
import { autorun } from "mobx";
import { createContext } from "react";

export const PlayerServiceContext = createContext<PlayerService>(null!);

export class PlayerService {
  private readonly clientId: string = getClientId();
  private readonly clientColor: string = getClientColor();
  player: PlayerDbItem | null = null;
  isConnected: boolean = false;

  constructor(private roomRepository: RoomRepository) {
    autorun(() => {
      console.log("Room state changed", this.roomRepository.state);
      this.player = this.roomRepository.state.players.find(p => p.clientId === this.clientId) || null;
      this.isConnected = Boolean(this.player);
    });
  }

  isMaster(team: TeamEnum) {
    return this.player!.isMaster && this.player!.team === team.toString();
  }

  isAdmin() {
    return this.player!.isAdmin;
  }

  isPlayerTurn(team: TeamEnum) {
    return true;
  }

  async sendMessage(team: TeamEnum, message: string) {
    await this.roomRepository.putMessage({
      player: this.player!.name,
      team: team,
      value: message,
    });
  }

  async becomeMaster(team: TeamEnum) {
    await this.roomRepository.updatePlayer({
      ...this.player!,
      team: team.toString(),
      isMaster: true,
    });
  }

  async joinTeam(team: TeamEnum) {
    await this.roomRepository.updatePlayer({
      ...this.player!,
      team: team.toString(),
      isMaster: false,
    });
  }
}
