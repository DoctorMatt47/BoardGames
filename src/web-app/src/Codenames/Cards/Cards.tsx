import { useState } from "react";

function Cards({ className }: { className?: string }) {
  const [cards, setCards] = useState([
    { id: 1, value: "apple", color: "red", revealed: false },
    { id: 2, value: "banana", color: "black", revealed: false },
    { id: 3, value: "cherry", color: "white", revealed: false },
    { id: 4, value: "date", color: "blue", revealed: false },
    { id: 5, value: "elderberry", color: "blue", revealed: false },
    { id: 6, value: "fig", color: "red", revealed: false },
    { id: 7, value: "grape", color: "blue", revealed: false },
    { id: 8, value: "honeydew", color: "blue", revealed: false },
    { id: 9, value: "kiwi", color: "red", revealed: false },
    { id: 10, value: "lemon", color: "blue", revealed: false },
    { id: 11, value: "mango", color: "red", revealed: false },
    { id: 12, value: "nectarine", color: "red", revealed: false },
    { id: 13, value: "orange", color: "white", revealed: false },
    { id: 14, value: "pear", color: "red", revealed: false },
    { id: 15, value: "quince", color: "white", revealed: false },
    { id: 16, value: "raspberry", color: "white", revealed: false },
    { id: 17, value: "strawberry", color: "red", revealed: false },
    { id: 18, value: "tangerine", color: "red", revealed: false },
    { id: 19, value: "ugli", color: "white", revealed: false },
    { id: 20, value: "vanilla", color: "red", revealed: false },
    { id: 21, value: "watermelon", color: "red", revealed: false },
    { id: 22, value: "ximenia", color: "white", revealed: false },
    { id: 23, value: "yellow watermelon", color: "red", revealed: false },
    { id: 24, value: "zucchini", color: "white", revealed: false },
    { id: 25, value: "avocado", color: "red", revealed: false },
  ]);

  function cardClassName(card: { value: string; color: string; revealed: boolean }): string {
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

  function onCardClick(card: { id: number; value: string; color: string; revealed: boolean }) {
    if (card.revealed) {
      return;
    }

    for (const c of cards) {
      if (c.id === card.id) {
        c.revealed = true;
      }
    }

    setCards([...cards]);
  }

  return (
    <div className={className}>
      <div className="h-full grid grid-cols-5 grid-rows-5 gap-1 lg:gap-3">
        {cards.map(card => (
          <div
            key={card.id}
            className={["rounded", "content-center", "text-center", cardClassName(card)].join(" ")}
            onClick={() => onCardClick(card)}
          >
            {card.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;
