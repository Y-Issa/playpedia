export default function Game({ game, onShowDetails }) {
  return (
    <li key={game.id} onClick={() => onShowDetails(game.id)}>
      <img
        src={
          game.background_image
            ? game.background_image
            : game.short_screenshots[0]?.image
        }
        alt={game.slug}
      />
      <div>
        <h3>{game.name}</h3>
        <p>
          <span>⌚</span> {game.released?.split("-").at(0)}
        </p>
      </div>
    </li>
  );
}
