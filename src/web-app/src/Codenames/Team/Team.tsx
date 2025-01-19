import { TeamEnum } from "./TeamEnum.ts";
import TeamPlayerList from "./TeamPlayerList.tsx";
import TeamChat from "./TeamChat.tsx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { GameServiceContext } from "../common/GameService.ts";

function Team({ team }: { team: TeamEnum }) {
  const gameService = useContext(GameServiceContext);

  const teamColorMap = team === TeamEnum.Blue ? "bg-blue-950" : "bg-red-950";

  return (
    <div className={["flex flex-col h-full space-y-3 p-1 lg:p-3 rounded", teamColorMap].join(" ")}>
      <div className="flex flex-col flex-grow space-y-1 lg:space-y-2">
        <div className="lg:text-2xl text-center">Team {team}</div>
        <div className="lg:text-xl text-center">
          {gameService.getRestCardCount(team)}/{gameService.getAllCardCount(team)} Score
        </div>
        <TeamPlayerList team={team} />
      </div>
      <TeamChat team={team} />
    </div>
  );
}

const TeamObserved = observer(Team);

export default TeamObserved;
