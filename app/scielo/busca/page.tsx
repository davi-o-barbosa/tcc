import ArticleSource from "@/app/components/ArticleSource";
import ArticleTitle from "@/app/components/ArticleTitle";
import Header from "@/app/components/Header";
import PDFLinks from "@/app/components/PdfLinks";
import SearchBar from "@/app/components/SearchBar";
import TextLinks from "@/app/components/TextLinks";
import search from "@/app/lib/scielo/search";
import { data } from "autoprefixer";
import { Metadata } from "next";
import { HiUsers } from "react-icons/hi";
import { FaAnglesRight } from "react-icons/fa6";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resultados",
};

export default async function ScieloBusca({
  searchParams,
}: {
  searchParams: {
    keywords: string;
  };
}) {
  const results = await search(searchParams.keywords);

  return (
    <div className="w-10/12 sm:w-10/12 lg:w-3/5 xl:w-6/12 flex flex-col justify-center">
      <Header />
      <SearchBar />
      <main className="flex flex-col">
        <h2 className="mt-10 mb-5">Resultados da pesquisa</h2>
        <ul className="p-0 m-0">
          {results.length > 0 ? (
            results.map((result) => (
              <li
                key={result.id}
                className="flex flex-col gap-2 mb-5 p-4 bg-slate-200"
              >
                <ArticleTitle title={result.displayTitle} />
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
                        <a className="mr-2" href={author.url} key={i}>
                          {author.name};
                        </a>
                      );
                    })}
                  </div>
                </div>
                <Link
                  className="flex w-36 mt-2 justify-center items-center gap-2 p-2 text-black bg-blue-300 rounded-md hover:bg-blue-400"
                  href={{
                    pathname: "/scielo/leitor",
                    query: { url: result.text[0].url.slice(0, -8) },
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
