import PlayedGame from "./PlayedGame";

export default function PlayedGameList({ played, onShowDetails }) {
  return (
    <ul className="list list-played">
      {played.map((game) => (
        <PlayedGame
          key={game.id}
          id={game.id}
          name={game.name}
          image={game.background_image}
          rating={game.rating}
          userRating={game.userRating}
          onShowDetails={onShowDetails}
        />
      ))}
    </ul>
  );
}
