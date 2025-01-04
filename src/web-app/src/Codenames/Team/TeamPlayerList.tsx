import { TeamEnum } from "./TeamEnum.ts";
import { useContext } from "react";
import { RoomIdContext, useGameState } from "../useGameState.ts";

function PlayerList({ team }: { team: TeamEnum }) {
  const roomId = useContext(RoomIdContext);
  const { gameState, joinTeam, becomeMaster } = useGameState(roomId!);

  const master = gameState?.players.find(p => p.isMaster && p.team === team)?.name;

  return (
    <div className="flex flex-col flex-grow gap-1 lg:gap-2">
      <div className="lg:text-2xl text-center">Team {team}</div>
      <div className="lg:text-xl text-center mt-1 lg:mt-2">Master</div>
      <div className="bg-white bg-opacity-10 rounded p-1 lg:p-2">
        {master ? (
          <div>{master}</div>
        ) : (
          <button
            className="w-full text-center lg:mt-3 p-1 lg:p-2 rounded bg-white bg-opacity-20 hover:bg-opacity-30"
            onClick={() => becomeMaster(team)}
          >
            Become master
          </button>
        )}
      </div>
      <div className="lg:text-xl text-center mt-1 lg:mt-2">Players</div>
      <div className="bg-white bg-opacity-10 rounded p-1 lg:p-2">
        <div className="flex flex-col space-y-1 lg:space-y-2 h-20 lg:h-40 overflow-auto">
          {gameState?.players
            .filter(player => player.team === team.toString())
            .filter(player => !player.isMaster)
            .map((player, index) => <div key={index}>{player.name}</div>)}
        </div>
        <button
          className="w-full text-center mt-1 lg:mt-3 p-1 lg:p-2 rounded bg-white bg-opacity-20 hover:bg-opacity-30"
          onClick={() => joinTeam(team)}
        >
          Join team
        </button>
      </div>
    </div>
  );
}

export default PlayerList;
