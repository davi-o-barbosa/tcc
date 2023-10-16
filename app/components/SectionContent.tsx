import { Image, Table, Text } from "../lib/scielo/article";
import parse from "html-react-parser";
import Img from "./Image";
import SectionTable from "./SectionTable";

export default function SectionContent(props: {
  content: Text | Image | Table;
}) {
  switch (props.content.type) {
    case "text":
      const text = props.content as Text;
      if (text.quote)
        return <blockquote>{parse(props.content.value ?? "")}</blockquote>;
      else return <p>{parse(props.content.value ?? "")}</p>;

    case "image":
      const image = props.content as Image;
      return (
        <div className="my-10">
          <p id={image.id ?? ""}>
            <b>{image.label.name}</b> - {image.label.description}
          </p>
          <Img url={image.value!} label={image.label.description} />
          <p>{parse(image.textBelow ?? "")}</p>
        </div>
      );

    case "table":
      const table = props.content as Table;
      return (
        <div className="my-10">
          {table.isImage ? (
            <>
              <p id={table.id ?? ""}>
                <b>{table.label.name}</b> - {table.label.description}
              </p>
              <Img url={table.value!} label={table.label.description} />
            </>
          ) : (
            <SectionTable table={table} />
          )}
          {<p>{parse(table.textBelow ?? "")}</p>}
        </div>
      );
  }
}
