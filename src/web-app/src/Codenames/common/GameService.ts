import { RoomRepository } from "./RoomRepository.ts";
import { TeamEnum } from "../Team/TeamEnum.ts";
import { makeAutoObservable, runInAction } from "mobx";
import { createContext } from "react";
import { getClientColor, getClientId, getClientUsername, setClientUsername } from "./local-storage.ts";
import { ChatMessageDbItem, PlayerDbItem } from "./db-items.ts";
import { arrayUnion } from "firebase/firestore";
import { WordRepository } from "./WordRepository.ts";

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

    const turn = card.color == this.player!.team ? this.state.turn : { team: this.player!.team, isMaster: true };

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
    await this.roomRepository.updateItems({
      turn: { team: this.state.turn!.team, isMaster: true },
    });
  }

  getRestCardCount(team: TeamEnum) {
    return this.state.cards.filter(c => c.color === team.toString() && !c.revealed).length;
  }

  getAllCardCount(team: TeamEnum) {
    return this.state.cards.filter(c => c.color === team.toString()).length;
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

    const shuffledColors = cardColors.sort(() => Math.random() - 0.5);

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

  private async putMessage(message: ChatMessageDbItem) {
    await this.roomRepository.updateItems({
      chatMessages: arrayUnion(message),
      turn: { team: message.team, isMaster: false },
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
