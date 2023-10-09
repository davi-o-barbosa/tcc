export default function ArticleSource(props: {
  source: string | undefined;
  year: string | undefined;
}) {
  return (
    <p className="m-0 mb-2">
      {props.source}{props.source && props.year && ' - '}{props.year}
    </p>
  );
}
