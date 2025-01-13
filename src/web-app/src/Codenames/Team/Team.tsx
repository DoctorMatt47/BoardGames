import { TeamEnum } from "./TeamEnum.ts";
import TeamPlayerList from "./TeamPlayerList.tsx";
import TeamChat from "./TeamChat.tsx";
import { observer } from "mobx-react-lite";

function Team({ team, className }: { team: TeamEnum; className?: string }) {
  const teamColorMap = team === TeamEnum.Blue ? "bg-blue-950" : "bg-red-950";

  return (
    <div className={["flex flex-col h-full space-y-3 p-1 lg:p-3 rounded", teamColorMap, className].join(" ")}>
      <div className="flex flex-col flex-grow space-y-1 lg:space-y-2">
        <div className="lg:text-2xl text-center">Team {team}</div>
        <TeamPlayerList team={team} />
      </div>
      <TeamChat team={team} />
    </div>
  );
}

const TeamObserved = observer(Team);

export default TeamObserved;
