export default function Image(props: {
  url: string;
  label: string;
}) {
  const label = !props.label ? "Descrição não disponível" : props.label;
  return (
    <picture>
      <img src={props.url} alt={label} />
    </picture>
  );
}
