import { CardDbItem } from "../common/db-items.ts";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { GameServiceContext } from "../common/GameService.ts";
import { wordHyphenation } from "../../common/utils.ts";

function Card({ card }: { card: CardDbItem }) {
  const gameService = useContext(GameServiceContext);

  function cardColorClass() {
    const colorClassMap = {
      red: "bg-red-900 text-white",
      blue: "bg-blue-900 text-white",
      white: "bg-gray-400 text-black",
      black: "bg-black text-white",
    } as Record<string, string>;

    if (!card.revealed) {
      return "bg-emerald-900 text-white";
    }

    return colorClassMap[card.color];
  }

  return (
    <div
      key={card.id}
      className={`p-0.5 lg:p-1 rounded content-center text-center text-wrap break-words hyphens-auto ${cardColorClass()}`}
      onClick={() => gameService.cardSelect(card.id)}
    >
      {card && card.value}
    </div>
  );
}

const CardObserved = observer(Card);

export default CardObserved;
