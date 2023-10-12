import { Section } from "../lib/scielo/article";

export default function SectionTitle(props: {section: Section}) {
  if (props.section.isSubtitle) {
    return <h3>{props.section.title}</h3>
  } else {
    return <h2>{props.section.title}</h2>
  }
}