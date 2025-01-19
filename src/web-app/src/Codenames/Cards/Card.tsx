import { CardDbItem } from "../common/db-items.ts";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { GameServiceContext } from "../common/GameService.ts";
import { capitalize } from "../../common/utils.ts";

function Card({ card }: { card: CardDbItem }) {
  const gameService = useContext(GameServiceContext);

  const shouldBeRevealed = gameService.player?.isMaster || card.revealed;

  const pointerClass = shouldBeRevealed && gameService.isPlayerTurn() ? "cursor-default" : "cursor-pointer";

  const bgColorClass = !shouldBeRevealed
    ? "bg-emerald-900 text-white"
    : ({
        red: "bg-red-900 text-white",
        blue: "bg-blue-900 text-white",
        white: "bg-gray-400 text-black",
        black: "bg-black text-white",
      }[card.color] ?? "");

  return (
    <div
      key={card.id}
      className={`p-0.5 lg:p-1 rounded content-center text-center text-wrap break-words hyphens-auto ${pointerClass} ${bgColorClass}`}
      onClick={() => gameService.cardSelect(card.id)}
    >
      {card && capitalize(card.value)}
    </div>
  );
}

const CardObserved = observer(Card);

export default CardObserved;
