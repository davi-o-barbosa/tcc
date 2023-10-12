import parse, { domToReact } from "html-react-parser";
import { Element } from "html-react-parser";
import { Table } from "../lib/scielo/article";

export default function SectionTable(props: { table: Table }) {
  return parse(props.table.value ?? "", {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs) {
        if (domNode.attribs && domNode.attribs.class === "table") {
          return (
            <table id={props.table.id} className="table-auto border-collapse">
              <caption className="caption-top mb-3">
                <b>{props.table.label.name}</b> -{" "}
                {props.table.label.description}
              </caption>
              {domToReact(domNode.children)}
            </table>
          );
        }
      }
    },
  });
}
