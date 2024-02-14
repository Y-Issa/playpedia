import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { KEY } from "../App";
import Loader from "./Loader";

export default function Details({
  selectedId,
  onAddGame,
  played,
  onCloseDetails,
}) {
  const [game, setGame] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const isPlayed = played.map((game) => game.id).includes(selectedId);
  const playedGameRating = played.find(
    (game) => game.id === selectedId
  )?.userRating;

  function handleAdd() {
    const newPlayedGame = {
      id: selectedId,
      background_image: game.background_image,
      slug: game.slug,
      name: game.name,
      rating: Number(game.rating),
      userRating,
    };
    onAddGame(newPlayedGame);
    onCloseDetails();
  }

  useEffect(
    function () {
      async function fetchMovieDetails() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.rawg.io/api/games/${selectedId}?key=${KEY}`
          );
          const data = await res.json();
          console.log(data);
          setGame(data);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovieDetails();
    },
    [selectedId]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseDetails}>
              &larr;
            </button>
            <img src={game.background_image} alt={game.slug} />
            <div className="details-overview">
              <h3>{game.name}</h3>
              {game.released && <p>{new Date(game.released).toDateString()}</p>}

              <p>
                Platforms:{" "}
                {game.platforms?.map((platform, i) => (
                  <span key={i}>{platform.platform.name} </span>
                ))}
              </p>

              <p>
                Genres:{" "}
                {game.genres?.map((genre, i) => (
                  <span key={genre.id}>
                    {genre.name}
                    {i < game.genres.length - 1 && ", "}
                  </span>
                ))}
              </p>

              {game.publishers?.length > 0 && (
                <p>
                  Published by:{" "}
                  {game.publishers?.map((publisher, i) => (
                    <span key={publisher.id}>
                      {publisher.name}
                      {i < game.publishers.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              )}
              {game.rating ? <p>⭐ {game.rating} RAWG rating</p> : ""}
            </div>
          </header>
          <section>
            <div className="user-rating">
              {!isPlayed ? (
                <>
                  <StarRating
                    className="star-rating"
                    size={28}
                    color="#01ADB5"
                    messages={[
                      "skip",
                      "meh",
                      "good",
                      "recommended",
                      "exeptional",
                    ]}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add Game
                    </button>
                  )}
                </>
              ) : (
                <p>You have rated this game: {playedGameRating} ⭐</p>
              )}
            </div>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: game.description }}
            />
          </section>
        </>
      )}
    </div>
  );
}
