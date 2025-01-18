import { RoomRepository } from "./RoomRepository.ts";
import { TeamEnum } from "../Team/TeamEnum.ts";
import { makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";
import { getClientColor, getClientId, getClientUsername, setClientUsername } from "./local-storage.ts";

export const GameServiceContext = createContext<GameService>(null!);

export class GameService {
  isConnected: boolean = false;

  get isLoaded() {
    return this.roomRepository.isLoaded;
  }

  get state() {
    return this.roomRepository.state;
  }

  get player() {
    return this.state.players.find(p => p.clientId === getClientId()) || null;
  }

  constructor(private roomRepository: RoomRepository) {
    makeAutoObservable(this);
  }

  async connectPlayer() {
    if (this.state.players.some(p => p.clientId === getClientId())) {
      runInAction(() => {
        this.isConnected = true;
      });

      return;
    }

    await this.roomRepository.putPlayer({
      clientId: getClientId(),
      name: getClientUsername(),
      team: "spectator",
      isAdmin: !this.state.players.some(p => p.isAdmin),
      isMaster: false,
      color: getClientColor(),
    });

    runInAction(() => {
      this.isConnected = true;
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

  async makeAdmin(playerId: string) {
    const player = this.state.players.find(p => p.clientId === playerId);

    if (!player) {
      return;
    }

    await this.roomRepository.updatePlayers([
      ...this.state.players.filter(p => p.clientId !== playerId && p != this.player),
      {
        ...player,
        isAdmin: true,
      },
      {
        ...this.player!,
        isAdmin: false,
      },
    ]);
  }

  async kickPlayer(playerId: string) {
    await this.roomRepository.removePlayer(playerId);
  }

  async cardSelect(cardId: number) {
    const card = this.state.cards.find(c => c.id === cardId);

    if (!card || card.revealed) {
      return;
    }

    await this.roomRepository.revealCard({
      ...card,
      revealed: true,
    });
  }

  async restartGame() {
    await this.roomRepository.startGame();
  }

  async setUsername(username: string) {
    await this.roomRepository.updatePlayer({
      ...this.player!,
      name: username,
    });

    setClientUsername(username);
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

  getRestCardCount(team: TeamEnum) {
    return this.state.cards.filter(c => c.color === team.toString() && !c.revealed).length;
  }

  getAllCardCount(team: TeamEnum) {
    return this.state.cards.filter(c => c.color === team.toString()).length;
  }
}
