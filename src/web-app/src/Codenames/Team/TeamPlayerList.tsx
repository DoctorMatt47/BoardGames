import { TeamEnum } from "./TeamEnum.ts";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import AppButton from "../../common/AppButton.tsx";
import AppPanel from "../../common/AppPanel.tsx";
import { GameServiceContext } from "../common/GameService.ts";
import Player from "./Player.tsx";

function TeamPlayerList({ team }: { team: TeamEnum }) {
  const gameService = useContext(GameServiceContext);
  const master = gameService.getMaster(team);

  return (
    <>
      <div className="lg:text-xl text-center mt-1 lg:mt-2">Master</div>
      {master ? (
        <AppPanel>
          <Player player={master} />
        </AppPanel>
      ) : (
        <AppButton text="Become master" onClick={() => gameService.becomeMaster(team)} />
      )}
      <div className="lg:text-xl text-center mt-1 lg:mt-2">Players</div>
      <AppPanel>
        <div className="flex flex-col space-y-1 lg:space-y-2 h-20 lg:h-40 overflow-auto">
          {gameService.state.players
            .filter(player => player.team === team.toString())
            .filter(player => !player.isMaster)
            .map((player, index) => (
              <Player key={index} player={player} />
            ))}
        </div>
        <AppButton text="Join team" onClick={() => gameService.joinTeam(team)} />
      </AppPanel>
    </>
  );
}

const PlayerListObserved = observer(TeamPlayerList);

export default PlayerListObserved;
