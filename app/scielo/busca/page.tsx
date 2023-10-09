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
        <h1 className="mb-5">Periódicos</h1>
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
                  <h3 className="mb-0">
                    {result.displayTitle ?? result.originalTitle}
                  </h3>
                  <p className="m-0 mb-2">{result.source}- {result.year}</p>

                  <div>
                    <span>Texto:</span>
                    {result.text.map((text) => 
                      <a href={text.url} key={text.lang} className="ml-2">{text.lang}</a>
                    )}
                  </div>
                  <div>
                    <span>PDF:</span>
                    {result.pdf.map((pdf) => 
                      <a href={pdf.url} key={pdf.lang} className="ml-2">{pdf.lang}</a>
                    )}

                  </div>
                  <p className="m-0 mt-2">Autores: {result.authors.join('; ') + '.'}</p>
                </li>
              ) : <h2>Nenhum resultado encontrado.</h2>
          }
        </ul>
      </main>
    </div>
  )
}
