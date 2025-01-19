import { useNavigate, useParams } from "react-router";
import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import Settings from "./Settings/Settings.tsx";
import { GameService, GameServiceContext } from "./common/GameService.ts";
import { RoomRepository } from "./common/RoomRepository.ts";
import Team from "./Team/Team.tsx";
import Cards from "./Cards/Cards.tsx";
import { TeamEnum } from "./Team/TeamEnum.ts";
import { WordRepository } from "./common/WordRepository.ts";
import WinResult from "./WinResult/WinResult.tsx";

function Codenames() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const wordRepository = useMemo(() => new WordRepository(), []);
  const roomRepository = useMemo(() => new RoomRepository(roomId!), [roomId]);
  const gameService = useMemo(() => new GameService(roomRepository, wordRepository), [roomRepository, wordRepository]);

  useEffect(() => {
    return roomRepository.subscribe();
  }, [roomRepository]);

  useEffect(() => {
    if (!gameService.isLoaded) return;

    void gameService.connectPlayer();

    return () => {
      void gameService.disconnectPlayer();
    };
  }, [gameService, gameService.isLoaded]);

  useEffect(() => {
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
              <div className="order-1 lg:order-2">
                <Team team={TeamEnum.Blue} />
              </div>
              <div className="order-3 lg:order-2 col-span-2 lg:mt-0 relative">
                <WinResult />
                <Cards />
              </div>
              <div className="order-2 lg:order-3">
                <Team team={TeamEnum.Red} />
              </div>
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
