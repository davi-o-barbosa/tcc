import ArticleSource from "@/app/components/ArticleSource";
import ArticleTitle from "@/app/components/ArticleTitle";
import Header from "@/app/components/Header";
import Navbar from "@/app/components/Navbar";
import PDFLinks from "@/app/components/PdfLinks";
import SearchBar from "@/app/components/SearchBar";
import TextLinks from "@/app/components/TextLinks";
import search from "@/app/lib/scielo/search";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scielo - Protótipo",
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
    <div className="m-0 sm:mx-10">
      <Header />
      <Navbar />
      <main className="flex flex-col">
        <h2>Resultados da pesquisa</h2>
        <ul className="p-0 m-0">
          {results.length > 0 ? (
            results.map((result) => (
              <li key={result.id} className="flex flex-col mb-5 w-ful sm:w-3/4">
                <ArticleTitle title={result.displayTitle} />
                {result.isNotPreprint && (
                  <ArticleSource source={result.source} year={result.year} />
                )}
                {result.isNotPreprint && (
                  <TextLinks articlesList={result.text} />
                )}
                {result.isNotPreprint && <PDFLinks pdfList={result.pdf} />}
                <p className="m-0 mt-2">
                  Autores: {result.authors.join("; ") + "."}
                </p>
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
