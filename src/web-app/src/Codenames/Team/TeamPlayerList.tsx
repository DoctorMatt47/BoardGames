import { TeamEnum } from "./TeamEnum.ts";
import { useState } from "react";

function PlayerList({ team }: { team: TeamEnum }) {
  const master = "DoctorMatt";
  const [players, setPlayers] = useState(["Guest1", "Guest2", "Guest3", "Guest4", "Guest5"]);

  return (
    <div className="flex flex-col flex-grow gap-2">
      <div className="lg:text-2xl text-center">Team {team}</div>
      <div className="lg:text-xl text-center mt-2">Master</div>
      <div className="bg-white bg-opacity-10 rounded lg:p-2">
        <div>{master}</div>
      </div>
      <div className="lg:text-xl text-center mt-2">Players</div>
      <div className="bg-white bg-opacity-10 rounded lg:p-2">
        <div className="flex flex-col space-y-2">
          {players.map((player, index) => (
            <div key={index}>{player}</div>
          ))}
        </div>
        <button
          className="w-full text-center mt-1 lg:mt-3 p-1 lg:p-2 rounded bg-emerald-700 hover:bg-emerald-600"
          onClick={() => setPlayers([...players, "Guest" + (players.length + 1)])}
        >
          Join team
        </button>
      </div>
    </div>
  );
}

export default PlayerList;
