export default function PlayedGame({
  id,
  name,
  image,
  rating,
  userRating,
  onShowDetails,
}) {
  return (
    <li className="game-item" onClick={() => onShowDetails(id)}>
      <img src={image} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>
          <span>RAWG: ⭐ {rating} </span>
          <span>Your rating: 🌟 {userRating} </span>
        </p>
      </div>
    </li>
  );
}
