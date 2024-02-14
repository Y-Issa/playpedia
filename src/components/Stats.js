export default function Stats({ played, average }) {
  const avgRating = average(played.map((game) => game.rating));
  const avgUserRating = average(played.map((game) => game.userRating));

  return (
    <div className="stats">
      <h2>Games you have played</h2>
      <p>
        <span>🔢 {played.length} games</span>
        <span>RAWG: ⭐ {avgRating}</span>
        <span>your average: 🌟 {avgUserRating}</span>
      </p>
    </div>
  );
}
