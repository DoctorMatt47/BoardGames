import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { GameServiceContext } from "../common/GameService.ts";
import Card from "./Card.tsx";

function Cards() {
  const gameService = useContext(GameServiceContext);

  const cards =
    gameService.state.cards?.length == 25
      ? gameService.state.cards
      : [...new Array(25)].map((_, index) => ({
          id: index,
          value: "",
          color: "white",
          revealed: false,
        }));

  return (
    <div className="h-full grid grid-cols-5 grid-rows-5 gap-1 lg:gap-3">
      {cards.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </div>
  );
}

const CardsObserved = observer(Cards);

export default CardsObserved;
