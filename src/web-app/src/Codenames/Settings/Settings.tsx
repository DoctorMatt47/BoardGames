import AppButton from "../../common/AppButton.tsx";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { GameServiceContext } from "../common/GameService.ts";
import { PlayerServiceContext } from "../common/PlayerService.ts";

function Settings() {
  const gameService = useContext(GameServiceContext);
  const playerService = useContext(PlayerServiceContext);

  return (
    <div className="w-full grid grid-cols-5 gap-x-1 lg:gap-x-2 text-gray-400 text-center mt-auto">
      <AppButton className="text-xs" text="Nickname" />
      <AppButton disabled={!playerService.isAdmin()} className="text-xs" text="Restart" />
      <AppButton disabled={!playerService.isAdmin()} className="text-xs" text="Shuffle" />
      <AppButton disabled={!playerService.isAdmin()} className="text-xs" text="Nickname" />
      <AppButton disabled={!playerService.isAdmin()} className="text-xs" text="Nickname" />
    </div>
  );
}

const SettingsObserved = observer(Settings);

export default SettingsObserved;
