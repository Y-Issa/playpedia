export default function Search({ query, setQuery }) {
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
