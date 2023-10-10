import scrapeArticle from "@/app/lib/scielo/article";
import parse from "html-react-parser";

export default async function Leitor({
  searchParams,
}: {
  searchParams: {
    url: string;
  };
}) {
  const data = await scrapeArticle(searchParams.url);
  console.log(data)
  return (
    /*<div>
      {data.sections.map((section: any, index: number) => {
        return <section key={index}>
          <h1 key={index}>{section.title.value}</h1>
          {
            section.content.map((c: any, i: number) => {
              return <p key={i}>{parse(c.value)}</p>
            })
           }
        </section>
      })}
    </div>
    */
   <h1>haha</h1>
  );
}
