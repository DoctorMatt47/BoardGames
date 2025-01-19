import { useContext } from "react";
import { GameServiceContext } from "../common/GameService.ts";
import { observer } from "mobx-react-lite";

function WinResult() {
  const gameService = useContext(GameServiceContext);

  const team = gameService.state.turn?.team;

  const textColorClass = {
    red: "text-red-600",
    blue: "text-blue-600",
  }[team?.toString() ?? ""];

  return (
    gameService.state.turn?.win && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`text-8xl opacity-80 select-none text-center ${textColorClass}`}>
          {team!.toUpperCase()} TEAM WIN
        </div>
      </div>
    )
  );
}

const ResultObserved = observer(WinResult);

export default ResultObserved;
