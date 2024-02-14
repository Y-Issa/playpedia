import { useState, useEffect } from "react";
import GamesList from "./components/GamesList";
import Details from "./components/Details";
import Stats from "./components/Stats";
import PlayedGameList from "./components/PlayedGameList";
import Search from "./components/Search";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Box from "./components/Box";
export const KEY = "34ada40ed97349ef91ac21d163906a28";

export default function App() {
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
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

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
            <>
              <Stats played={played} average={average} />
              <PlayedGameList
                played={played}
                onShowDetails={handleShowDetails}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}
