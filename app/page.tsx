import SearchBar from "./components/SearchBar";

export default function Home() {
  return (
    <div className="m-5">
      <header className="mb-4 text-center">
        <h1 className="text-3xl">Busca</h1>
      </header>
      <main className="flex justify-center">
        <SearchBar />
      </main>
    </div>
  )
}
