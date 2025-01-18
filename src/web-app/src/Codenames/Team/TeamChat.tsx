import { TeamEnum } from "./TeamEnum.ts";
import { KeyboardEvent, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import AppPanel from "../../common/AppPanel.tsx";
import AppButton from "../../common/AppButton.tsx";
import AppInput from "../../common/AppInput.tsx";
import { GameServiceContext } from "../common/GameService.ts";

function TeamChat({ team }: { team: TeamEnum }) {
  const [message, setMessage] = useState("");
  const gameService = useContext(GameServiceContext);

  function onMessageKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSendMessage();
    }
  }

  function onSendMessage() {
    if (message) {
      gameService.sendMessage(team, message).then(() => setMessage(""));
    }
  }

  return (
    <AppPanel>
      <div className="h-20 lg:h-40 overflow-y-auto space-y-1 lg:space-y-2">
        {gameService.state.chatMessages
          .filter(message => message.team === team)
          .map((message, index) => (
            <div key={index}>
              <span className="text-emerald-400">{message.player}</span>: {message.value}
            </div>
          ))}
      </div>
      <div className="flex flex-row space-x-1 lg:space-x-2">
        {gameService.isMaster(team) ? (
          <>
            <AppInput
              disabled={!gameService.isPlayerTurn(team)}
              value={message}
              onChange={event => setMessage(event.target.value)}
              onKeyDown={onMessageKeyDown}
            />
            <AppButton
              className="w-3/12"
              disabled={!gameService.isPlayerTurn(team)}
              text="Send"
              onClick={onSendMessage}
            />
          </>
        ) : (
          <AppButton disabled={!gameService.isPlayerTurn(team)} text="End turn" onClick={gameService.endTurn} />
        )}
      </div>
    </AppPanel>
  );
}

const TeamChatObserved = observer(TeamChat);

export default TeamChatObserved;
