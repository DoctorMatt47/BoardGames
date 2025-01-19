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
      <AppButton disabled={!gameService.player!.isAdmin} className="text-xs" text="Shuffle" />
      <AppButton disabled={!gameService.player!.isAdmin} className="text-xs" text="Nickname" />
      <AppButton disabled={!gameService.player!.isAdmin} className="text-xs" text="Nickname" />
    </div>
  );
}

const SettingsObserved = observer(Settings);

export default SettingsObserved;
