import SearchBar from "@/app/components/SearchBar";
import { search } from "@/app/lib/ScieloScraper";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scielo - Protótipo',
}


export default async function ScieloBusca({ searchParams }: {
  searchParams: {
    keywords: string,
  }
}) {
  const results = await search(searchParams.keywords);

  return (
    <div className="m-0 sm:mx-10">
      <header>
        <h1 className="mb-5">Protótipo</h1>
      </header>
      <nav>
        <h2>Realizar nova busca</h2>
        <SearchBar />
      </nav>
      <main className="flex flex-col">
        <h2>Resultados da pesquisa</h2>
        <ul className="p-0 m-0">
          {
            results.length > 0 ?
              results.map((result) =>
                <li key={result.id} className="flex flex-col mb-5 w-ful sm:w-3/4">
                  <a href={result.url} className="text-blue-700">
                    {result.displayTitle ?? result.originalTitle}
                  </a>
                  <p className="m-0">{result.source}- {result.year}</p>
                  <p className="m-0">Autores: {result.authors.join('; ') + '.'}</p>
                </li>
              ) : <h2>Nenhum resultado encontrado.</h2>
          }
        </ul>
      </main>
    </div>
  )
}
