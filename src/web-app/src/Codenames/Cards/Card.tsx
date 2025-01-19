import { CardDbItem } from "../common/db-items.ts";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { GameServiceContext } from "../common/GameService.ts";

function Card({ card }: { card: CardDbItem }) {
  const gameService = useContext(GameServiceContext);

  const shouldBeRevealed = gameService.player?.isMaster || card.revealed || gameService.state.turn?.win;

  const pointerClass = !shouldBeRevealed && gameService.isPlayerTurn() ? "cursor-pointer" : "cursor-default";

  const bgColorClass = !shouldBeRevealed
    ? "bg-emerald-900"
    : ({
        red: "bg-red-900",
        blue: "bg-blue-900",
        white: "bg-gray-600",
        black: "bg-black",
      }[card.color] ?? "");

  return (
    <div
      key={card.id}
      className={`p-0.5 lg:p-1 rounded content-center text-center text-wrap break-words hyphens-auto text-white ${pointerClass} ${bgColorClass}`}
      onClick={() => gameService.cardSelect(card.id)}
    >
      {card && card.value.toUpperCase()}
    </div>
  );
}

const CardObserved = observer(Card);

export default CardObserved;
