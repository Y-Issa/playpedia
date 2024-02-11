import { useState, useEffect } from "react";

const KEY = "34ada40ed97349ef91ac21d163906a28";

export default function App() {
  // const KEY = "e529db99b8f0a8921b88a2e46df456a53a75edad";
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  function handleShowDetails(id) {
    setSelectedId(id);
    console.log(id);
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchData() {
        try {
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
          <GamesList games={games} onShowDetails={handleShowDetails} />
        </Box>
        <Box>{selectedId && <Details selectedId={selectedId} />}</Box>
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
      placeholder="Search for a game..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
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

function Details({ selectedId }) {
  return <div>{selectedId}</div>;
}
