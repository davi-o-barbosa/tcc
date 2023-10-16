export default function ArticleTitle(props: { title: string | undefined }) {
  return (
    <h3 className="m-0">
      {props.title}
    </h3>
  );
}
