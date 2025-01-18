import { observer } from "mobx-react-lite";
import { PlayerDbItem } from "../common/db-items.ts";
import { useContext, useState } from "react";
import { GameServiceContext } from "../common/GameService.ts";

function Player({ player }: { player: PlayerDbItem }) {
  const gameService = useContext(GameServiceContext);

  const [isMouseOver, setIsMouseOver] = useState(false);

  function playerActions() {
    if (player.isAdmin) {
      return <span>👑</span>;
    }

    if (gameService.isAdmin()) {
      return (
        <div>
          <span className="cursor-pointer" onClick={() => gameService.makeAdmin(player.clientId)}>
            ⏫
          </span>
          <span className="cursor-pointer" onClick={() => gameService.kickPlayer(player.clientId)}>
            ⛔
          </span>
        </div>
      );
    }

    return <></>;
  }

  return (
    <div
      className="flex flex-row items-center space-x-1 lg:space-x-2"
      onMouseOver={() => setIsMouseOver(true)}
      onMouseOut={() => setIsMouseOver(false)}
    >
      <div className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: `#${player.color}` }} />
      <div className="flex flex-row items-center space-x-0.5">
        <div>{player.name}</div>
        {isMouseOver && playerActions()}
      </div>
    </div>
  );
}

const PlayerUsernameObserved = observer(Player);

export default PlayerUsernameObserved;
