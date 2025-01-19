import AppButton from "../../common/AppButton.tsx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { GameServiceContext } from "../common/GameService.ts";

function Settings() {
  const gameService = useContext(GameServiceContext);

  function updateUsername() {
    const username = prompt("Enter your new username");

    if (username) {
      void gameService.setUsername(username);
    }
  }

  return (
    <div className="w-full grid grid-cols-5 gap-x-1 lg:gap-x-2 text-gray-400 text-center mt-auto">
      <AppButton className="text-xs" text="Username" onClick={updateUsername} />
      <AppButton
        disabled={!gameService.player!.isAdmin}
        className="text-xs"
        text="Restart"
        onClick={() => gameService.startGame()}
      />
      <AppButton
        disabled={!gameService.player!.isAdmin}
        className="text-xs"
        text="Shuffle"
        onClick={() => gameService.teamsShuffle()}
      />
      {gameService.state.settings.isLocked ? (
        <AppButton
          disabled={!gameService.player!.isAdmin}
          className="text-xs"
          text="Unlock"
          onClick={() => gameService.setTeamsLock(false)}
        />
      ) : (
        <AppButton
          disabled={!gameService.player!.isAdmin}
          className="text-xs"
          text="Lock"
          onClick={() => gameService.setTeamsLock(true)}
        />
      )}
      <AppButton disabled={!gameService.player!.isAdmin} className="text-xs" text="Not available" />
    </div>
  );
}

const SettingsObserved = observer(Settings);

export default SettingsObserved;
