import SearchBar from "./components/SearchBar";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <main className="w-6/12">
        <SearchBar />
      </main>
    </div>
  );
}
