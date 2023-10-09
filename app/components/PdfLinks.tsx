export default function PDFLinks(props: {
  pdfList: { lang: string; url: string }[];
}) {
  return (
    <div>
      <span>PDF:</span>
      {props.pdfList.map((pdf) => (
        <a href={pdf.url} key={pdf.lang} className="ml-2">
          {pdf.lang}
        </a>
      ))}
    </div>
  );
}
