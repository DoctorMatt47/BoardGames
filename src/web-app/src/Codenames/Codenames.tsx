﻿import { useNavigate, useParams } from "react-router";
import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import Settings from "./Settings/Settings.tsx";
import { GameService, GameServiceContext } from "./common/GameService.ts";
import { RoomRepository } from "./common/RoomRepository.ts";
import Team from "./Team/Team.tsx";
import Cards from "./Cards/Cards.tsx";
import { TeamEnum } from "./Team/TeamEnum.ts";
import { WordRepository } from "./common/WordRepository.ts";

function Codenames() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const roomRepository = useMemo(() => new RoomRepository(roomId!), [roomId]);
  const wordRepository = useMemo(() => new WordRepository(), []);
  const gameService = useMemo(() => new GameService(roomRepository, wordRepository), [roomRepository, wordRepository]);

  useEffect(() => {
    console.log("Subscribing to room");
    return roomRepository.subscribe();
  }, [roomRepository]);

  useEffect(() => {
    if (!gameService.isLoaded) return;

    void gameService.connectPlayer();
    console.log("Connecting player");

    return () => {
      void gameService.disconnectPlayer();
      console.log("Disconnecting player");
    };
  }, [gameService, gameService.isLoaded]);

  useEffect(() => {
    console.log("Checking if player is connected");
    if (gameService.isConnected && !gameService.player) {
      navigate("/");
    }
  }, [gameService.isConnected, gameService.player, gameService.state, navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-emerald-100 flex flex-col space-y-1 lg:space-y-2 justify-center items-center p-1 lg:p-5 overflow-auto">
      {gameService.isConnected && gameService.player && (
        <GameServiceContext.Provider value={gameService}>
          <div className="container flex flex-grow items-center justify-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 lg:grid-rows-1 gap-1 lg:gap-5 w-full h-full 2xl:w-9/12">
              <Team className="order-1 lg:order-2" team={TeamEnum.Blue} />
              <Cards className="order-3 lg:order-2 col-span-2 lg:mt-0" />
              <Team className="order-2 lg:order-3" team={TeamEnum.Red} />
            </div>
          </div>
          <Settings />
        </GameServiceContext.Provider>
      )}
    </div>
  );
}

const CodenamesObserved = observer(Codenames);

export default CodenamesObserved;
