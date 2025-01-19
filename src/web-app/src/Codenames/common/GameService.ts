import { RoomRepository } from "./RoomRepository.ts";
import { TeamEnum } from "../Team/TeamEnum.ts";
import { makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";
import { getClientColor, getClientId, getClientUsername, setClientUsername } from "./local-storage.ts";
import { PlayerDbItem } from "./db-items.ts";
import { arrayUnion } from "firebase/firestore";
import { WordRepository } from "./WordRepository.ts";
import { shuffled } from "../../common/utils.ts";

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

  constructor(
    private roomRepository: RoomRepository,
    private wordRepository: WordRepository,
  ) {
    makeAutoObservable(this);
  }

  async connectPlayer() {
    if (this.state.players.some(p => p.clientId === getClientId())) {
      runInAction(() => {
        this.isConnected = true;
      });

      return;
    }

    await this.roomRepository.updateItems({
      players: arrayUnion({
        clientId: getClientId(),
        name: getClientUsername(),
        team: "spectator",
        isAdmin: !this.state.players.some(p => p.isAdmin),
        isMaster: false,
        color: getClientColor(),
      }),
    });

    runInAction(() => {
      this.isConnected = true;
    });
  }

  isMaster(team: TeamEnum) {
    return this.player!.isMaster && this.player!.team === team.toString();
  }

  isPlayerTurn() {
    return this.state.turn?.team === this.player?.team && this.state.turn?.isMaster == this.player?.isMaster;
  }

  async makeAdmin(playerId: string) {
    const player = this.state.players.find(p => p.clientId === playerId);

    if (!player) {
      return;
    }

    await this.roomRepository.updateItems({
      players: [
        ...this.state.players.filter(p => p.clientId !== playerId && p != this.player),
        {
          ...player,
          isAdmin: true,
        },
        {
          ...this.player!,
          isAdmin: false,
        },
      ],
    });
  }

  async kickPlayer(playerId: string) {
    await this.removePlayer(playerId);
  }

  async cardSelect(cardId: number) {
    if (this.player!.isMaster || this.state.turn!.isMaster || this.state.turn!.team !== this.player!.team) {
      return;
    }

    const card = this.state.cards.find(c => c.id === cardId);

    if (!card || card.revealed) {
      return;
    }

    const nextTeam = this.player!.team === TeamEnum.Blue ? TeamEnum.Red : TeamEnum.Blue;
    const turn = card.color == this.player!.team ? this.state.turn! : { team: nextTeam, isMaster: true };

    if (this.getRestCardCount(turn.team as TeamEnum) == 1 || card.color === "black") {
      turn.win = true;
    }

    await this.roomRepository.updateItems({
      cards: this.state.cards.map(c => (c.id === card.id ? { ...card, revealed: true } : c)),
      turn: turn,
    });
  }

  async setUsername(username: string) {
    await this.updatePlayer({
      ...this.player!,
      name: username,
    });

    setClientUsername(username);
  }

  async sendMessage(team: TeamEnum, message: string) {
    const messageItem = {
      player: this.player!.name,
      team: team,
      value: message,
    };

    await this.roomRepository.updateItems({
      chatMessages: arrayUnion(messageItem),
      turn: { team: messageItem.team, isMaster: false },
    });
  }

  async becomeMaster(team: TeamEnum) {
    await this.updatePlayer({
      ...this.player!,
      team: team.toString(),
      isMaster: true,
    });
  }

  async joinTeam(team: TeamEnum) {
    await this.updatePlayer({
      ...this.player!,
      team: team.toString(),
      isMaster: false,
    });
  }

  async disconnectPlayer() {
    await this.removePlayer(getClientId());

    runInAction(() => {
      this.isConnected = false;
    });
  }

  getMaster(team: TeamEnum) {
    return this.state!.players.find(p => p.team === team.toString() && p.isMaster);
  }

  async endTurn() {
    const nextTeam = this.state.turn!.team === TeamEnum.Blue ? TeamEnum.Red : TeamEnum.Blue;

    await this.roomRepository.updateItems({
      turn: { team: nextTeam, isMaster: true },
    });
  }

  getRestCardCount(team: TeamEnum) {
    return this.state.cards.filter(c => c.color === team.toString() && !c.revealed).length;
  }

  getAllCardCount(team: TeamEnum) {
    return this.state.cards.filter(c => c.color === team.toString()).length;
  }

  async setTeamsLock(isLocked: boolean) {
    await this.roomRepository.updateItems({
      settings: {
        isLocked: isLocked,
      },
    });
  }

  async startGame() {
    const wordCount = await this.wordRepository.getWordCount();

    const randomIds = new Set<string>();

    while (randomIds.size < 25) {
      randomIds.add(Math.floor(Math.random() * wordCount).toString());
    }

    const words = await this.wordRepository.getWordsByIds(Array.from(randomIds));

    const firstTeam = Math.random() > 0.5 ? TeamEnum.Blue : TeamEnum.Red;

    const cardColors = [
      ...Array(9).fill(firstTeam),
      ...Array(8).fill(firstTeam === TeamEnum.Blue ? TeamEnum.Red : TeamEnum.Blue),
      "black",
      ...Array(7).fill("white"),
    ];

    const shuffledColors = shuffled(cardColors);

    await this.roomRepository.updateItems({
      chatMessages: [],
      cards: words.map((word, index) => ({
        id: index,
        value: word.value,
        color: shuffledColors[index],
        revealed: false,
      })),
      turn: {
        team: firstTeam,
        isMaster: true,
      },
    });
  }

  async teamsShuffle() {
    if (this.state.players.length === 1) {
      await this.updatePlayer({
        ...this.state.players[0],
        isMaster: true,
        team: Math.random() > 0.5 ? TeamEnum.Blue : TeamEnum.Red,
      });

      return;
    }

    const players = shuffled(this.state.players);

    const redMaster = { ...players[0], team: TeamEnum.Red, isMaster: true };
    const blueMaster = { ...players[1], team: TeamEnum.Blue, isMaster: true };

    const sliceLength = Math.floor(
      players.length % 2 === 0 ? players.length / 2 : players.length / 2 + (Math.random() > 0.5 ? 1 : 0),
    );

    const redPlayers = players.slice(2, sliceLength + 1).map(p => ({ ...p, team: TeamEnum.Red, isMaster: false }));
    const bluePlayers = players.slice(sliceLength + 1).map(p => ({ ...p, team: TeamEnum.Blue, isMaster: false }));

    await this.roomRepository.updateItems({
      players: [redMaster, blueMaster, ...redPlayers, ...bluePlayers],
    });
  }

  private async removePlayer(clientId: string) {
    await this.roomRepository.updateItems({
      players: this.state.players.filter(p => p.clientId !== clientId),
    });
  }

  private async updatePlayer(player: PlayerDbItem) {
    await this.roomRepository.updateItems({
      players: this.state.players.map(p => (p.clientId === player.clientId ? player : p)),
    });
  }
}
