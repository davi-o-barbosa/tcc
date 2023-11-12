import ArticleSource from "@/app/components/ArticleSource";
import ArticleTitle from "@/app/components/ArticleTitle";
import Header from "@/app/components/Header";
import SearchBar from "@/app/components/SearchBar";
import search from "@/app/lib/scielo/search";
import { Metadata } from "next";
import { HiUsers } from "react-icons/hi";
import { FaAnglesRight } from "react-icons/fa6";
import Link from "next/link";
import Paginator from "@/app/components/Paginator";
import SkipContentButton from "@/app/components/SkipContentButton";
import ResultAbstract from "@/app/components/ResultAbstract";

export const metadata: Metadata = {
  title: "Resultados da busca",
};

export default async function ScieloBusca({
  searchParams,
}: {
  searchParams: {
    keywords: string;
    page: string;
    number: string;
  };
}) {
  const fromArticle =
    Number(searchParams.number) * Number(searchParams.page) + 1;
  const { results, numberOfResults } = await search(
    searchParams.keywords,
    searchParams.number,
    fromArticle
  );

  return (
    <div className="w-10/12 sm:w-10/12 lg:w-3/5 xl:w-6/12 flex flex-col justify-center">
      <SkipContentButton />
      <Header />
      <SearchBar />
      <main className="flex flex-col mb-20">
        <h2 className="mt-10" id="results">
          Resultados da pesquisa: <span className="font-normal text-base">{numberOfResults} artigos encontrados</span>
        </h2>
        <Paginator
          searchDetails={{
            keywords: searchParams.keywords,
            page: searchParams.page,
            resultsPerPage: searchParams.number,
            numberOfResults: numberOfResults,
          }}
        />
        <ul className="p-0 m-0">
          {results.length > 0 ? (
            results.map((result) => (
              <li
                key={result.id}
                className="flex flex-col gap-2 mb-5 p-4 bg-slate-200 rounded-md shadow-lg"
              >
                <ArticleTitle
                  title={result.displayTitle}
                  url={result.text[0]?.url.slice(0, -8) ?? result.url}
                />
                {result.isNotPreprint && (
                  <ArticleSource source={result.source} />
                )}
                <div className="m-0">
                  <p className="flex justify-left items-center gap-2  font-semibold m-0">
                    <HiUsers />
                    Autores
                  </p>
                  <div>
                    {result.authors.map((author, i) => {
                      return (
                        <a className="mr-2 text-lg text-blue-800" href={author.url} key={i}>
                          {author.name};
                        </a>
                      );
                    })}
                  </div>
                </div>
                {result.abstracts['pt'] && <ResultAbstract text={result.abstracts['pt']}/>}
                <Link
                  className="flex w-36 mt-2 justify-center items-center gap-2 p-2 text-black bg-blue-300 rounded-md hover:bg-blue-400 shadow-md"
                  href={{
                    pathname: "/scielo/leitor",
                    query: {
                      url: result.text[0]?.url.slice(0, -8) ?? result.url,
                    },
                  }}
                >
                  <FaAnglesRight />
                  Ler Artigo
                </Link>
              </li>
            ))
          ) : (
            <h2>Nenhum resultado encontrado.</h2>
          )}
        </ul>
      </main>
    </div>
  );
}
