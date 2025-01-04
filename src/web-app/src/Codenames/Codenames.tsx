import { useParams } from "react-router";
import Team from "./Team/Team.tsx";
import { TeamEnum } from "./Team/TeamEnum.ts";
import Cards from "./Cards/Cards.tsx";
import { useGameState, RoomIdContext } from "./useGameState.ts";
import { useEffect } from "react";

function Codenames() {
  const { roomId } = useParams();
  const { connectPlayer } = useGameState(roomId!);

  useEffect(() => {
    connectPlayer();
    console.log("Connected player");
  }, [connectPlayer]);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-emerald-100 flex justify-center items-center sm:p-1 lg:p-5 overflow-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 lg:grid-rows-1 sm:gap-1 lg:gap-5 w-full h-full 2xl:w-9/12">
        <RoomIdContext.Provider value={roomId!}>
          <Team className="order-1 lg:order-2" team={TeamEnum.Blue} />
          <Cards className="order-3 lg:order-2 col-span-2 mt-5 sm:mt-2 lg:mt-0" />
          <Team className="order-2 lg:order-3" team={TeamEnum.Red} />
        </RoomIdContext.Provider>
      </div>
    </div>
  );
}

export default Codenames;
