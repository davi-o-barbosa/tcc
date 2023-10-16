import SearchBar from "./components/SearchBar";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <SearchBar />
      <main className="text-left mt-5">
        <article>
          <header>
            <h2>Sobre o protótipo</h2>
          </header>
          <section>
            <p>
              Esse protótipo é feito como uma prova de conceito para uma
              abordagem acessível à plataformas de busca de periódicos, como o{" "}
              <a href="https://www.scielo.org/">Scielo</a>.
            </p>
            <p>
              Todos os dados retornados nas pesquisas realizadas aqui pertencem
              às plataformas incluídas, esse website é apenas uma ponte que liga
              a acessibilidade a elas.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
