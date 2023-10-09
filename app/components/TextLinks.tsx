import Link from "next/link";

export default function TextLinks(props: {
  articlesList: { lang: string; url: string }[];
}) {
  return (
    <ul className="textlinks">
      <span>Texto:</span>
      {props.articlesList.map((article) => {
        return (
          <Link
            key={article.lang}
            href={{ pathname: "/scielo/leitor", query: { url: article.url } }}
          >
            {article.lang}
          </Link>
        );
      })}
    </ul>
  );
}
