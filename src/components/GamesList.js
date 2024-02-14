import Game from "./Game";

export default function GamesList({ games, onShowDetails }) {
  return (
    <ul className="list list-games">
      {games?.map((game) => (
        <Game key={game.id} game={game} onShowDetails={onShowDetails} />
      ))}
    </ul>
  );
}
