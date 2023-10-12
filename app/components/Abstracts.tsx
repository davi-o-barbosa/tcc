import { Abstract } from "../lib/scielo/article";
import parse from "html-react-parser";


export default function Abstracts(props: { abstracts: Abstract[] }) {
  return (
    <article className="my-10">
      {props.abstracts.map((abstract, i) => {
        return (
          <section key={i}>
            <h2>{abstract.title}</h2>
            <p>{parse(abstract.text!)}</p>
            <p><b>{abstract.keywords.label}</b>{abstract.keywords.text}</p>
          </section>
        );
      })}
    </article>
  );
}
