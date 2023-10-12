import { Authors, AuthorDescription } from "../lib/scielo/article";

export default function ArticleAuthors(props: {
  data: {
    authors: Authors[];
    descriptions: AuthorDescription;
  };
}) {
  const descriptions: any = [];
  return (
    <article>
      <h2>Autores</h2>
      {props.data.authors.map((author, i) => {
        descriptions.push(
          <p id={author.id.slice(1)}>
            {i + 1 + " - " + props.data.descriptions[author.id]}
          </p>
        );
        return (
          <p key={author.id}>
            {author.name}
            <sup>
              {" "}
              <a aria-label="Mais informações do autor" href={author.id}>
                {i + 1}
              </a>
            </sup>
          </p>
        );
      })}
      {descriptions}
    </article>
  );
}
