import { TeamEnum } from "./TeamEnum.ts";
import TeamPlayerList from "./TeamPlayerList.tsx";
import TeamChat from "./TeamChat.tsx";

function Team({ team, className }: { team: TeamEnum; className?: string }) {
  const teamColorMap = team === TeamEnum.Blue ? "bg-blue-950" : "bg-red-950";

  return (
    <div className={["flex flex-col h-full space-y-3 p-1 lg:p-3 lg:rounded", teamColorMap, className].join(" ")}>
      <TeamPlayerList team={team} />
      <TeamChat team={team} />
    </div>
  );
}

export default Team;
