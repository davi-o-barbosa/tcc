import Link from "next/link";

export default function ArticleTitle(props: { title: string | undefined, url: string }) {
  return (
    <Link
      className="m-0 p-0"
      href={{
        pathname: "/scielo/leitor",
        query: {
          url: props.url,
        },
      }}
    >
      <h3 className="m-0">{props.title}</h3>
    </Link>
  );
}
