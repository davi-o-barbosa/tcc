import scrapeArticle from "@/app/lib/scielo/article";
import parse from 'html-react-parser'

export default async function Leitor({ searchParams }: {
  searchParams: {
    url: string,
  }
}) {
  const data = await scrapeArticle(searchParams.url);
  return (
    <p>
      <h1>{data.abstracts[1].title}</h1>
      <p>{parse(data.abstracts[1].content)}</p>
      <p>{parse(data.abstracts[1].keywords)}</p>
    </p>
  );
}
