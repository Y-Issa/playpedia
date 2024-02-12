import { useState, useEffect } from "react";
import StarRating from "./StarRating";
const KEY = "34ada40ed97349ef91ac21d163906a28";

export default function App() {
  // const KEY = "e529db99b8f0a8921b88a2e46df456a53a75edad";
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [played, setPlayed] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleShowDetails(id) {
    setSelectedId(selectedId !== id ? id : null);
  }

  function handleAddPlayedGame(playedGame) {
    setPlayed([...played, playedGame]);
    console.log(playedGame);
  }

  function handleCloseDetails() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchData() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.rawg.io/api/games?key=${KEY}&search=${query}`,
            { signal: controller.signal }
          );

          // const res = await fetch(
          //   `https://www.gamespot.com/api/games/?api_key=${KEY}&format=json&filter=name:${query}`,
          //   { signal: controller.signal }
          // );

          const data = await res.json();
          console.log(data);
          setGames(data.results);
        } catch (err) {
          console.log(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length > 2) fetchData();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <div className="App">
      <Navbar>
        <Search query={query} setQuery={setQuery} />
      </Navbar>
      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : (
            <GamesList games={games} onShowDetails={handleShowDetails} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <Details
              selectedId={selectedId}
              onAddGame={handleAddPlayedGame}
              played={played}
              onCloseDetails={handleCloseDetails}
            />
          ) : (
            <PlayedGameList played={played} />
          )}
        </Box>
      </Main>
    </div>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <h2 className="logo">
      <span>🎮</span> PlayPedia
    </h2>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      type="text"
      className="search"
      placeholder="Search for a game..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Loader() {
  return (
    <div className="loader">
      <p>LOADING...</p>
    </div>
  );
}

function Box({ children }) {
  return <div className="container-box">{children}</div>;
}

function GamesList({ games, onShowDetails }) {
  return (
    <ul className="list list-games">
      {games?.map((game) => (
        <Game key={game.id} game={game} onShowDetails={onShowDetails} />
      ))}
    </ul>
  );
}

function Game({ game, onShowDetails }) {
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

function Details({ selectedId, onAddGame, played, onCloseDetails }) {
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
        setIsLoading(true);
        const res = await fetch(
          `https://api.rawg.io/api/games/${selectedId}?key=${KEY}`
        );
        const data = await res.json();
        console.log(data);
        setGame(data);
        setIsLoading(false);
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
                  <span>
                    {genre.name}
                    {i < game.genres.length - 1 && ", "}
                  </span>
                ))}
              </p>

              {game.publishers?.length > 0 && (
                <p>
                  Published by:{" "}
                  {game.publishers?.map((publisher, i) => (
                    <span>
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

function PlayedGameList({ played }) {
  return (
    <ul>
      {played.map((game) => (
        <PlayedGame key={game.id} name={game.name} />
      ))}
    </ul>
  );
}

function PlayedGame({ name }) {
  return <li>{name}</li>;
}
