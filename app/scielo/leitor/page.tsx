import Abstracts from "@/app/components/Abstracts";
import ArticleAuthours from "@/app/components/ArticleAuthors";
import PdfMenu from "@/app/components/PdfMenu";
import SectionContent from "@/app/components/SectionContent";
import SectionTitle from "@/app/components/SectionTitle";
import scrapeArticle, { getTitle } from "@/app/lib/scielo/article";
import parse from "html-react-parser";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import {HiOutlineDownload, HiMenu} from "react-icons/hi"

type Props = {
  searchParams: { url: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const title = await getTitle(searchParams.url);
  return {
    title: title,
  };
}

export default async function Leitor({
  searchParams,
}: {
  searchParams: {
    url: string;
  };
}) {
  const data = await scrapeArticle(searchParams.url);

  if (data === "redirect" || !data) redirect(searchParams.url);

  return (
    <>
      <header className="w-full flex justify-end fixed z-50 bg-slate-200">
        <PdfMenu files={data.pdfFiles} />
      </header>
      <main className="w-10/12 sm:w-10/12 lg:w-3/5 xl:w-6/12 p-10">
        <h1>{parse(data.title!)}</h1>
        {data.altTitle.map((title) => {
          return <h2 key={title}>{parse(title!)}</h2>;
        })}
        <hr className="my-10" />
        <ArticleAuthours data={data.authors} />
        <hr className="my-10" />
        <Abstracts abstracts={data.abstracts} />
        <hr className="my-10" />
        <article>
          {data.sections.map((section, index: number) => {
            return (
              <section key={index}>
                <SectionTitle section={section} />
                {section.content.map((content, i) => {
                  return <SectionContent key={i} content={content} />;
                })}
              </section>
            );
          })}
        </article>
        <div>
          <h2>{data.references.headingName}</h2>
          {data.references.data.map((a) => {
            return (
              <div key={a.id} id={a.id}>
                <p>
                  {a.text + " "}
                  <a href={a.url}>{a.url}</a>
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
