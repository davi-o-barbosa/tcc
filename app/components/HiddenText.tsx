export default function HiddenText(props: {text: string}) {
  return <span className="sr-only">{props.text}</span>
}