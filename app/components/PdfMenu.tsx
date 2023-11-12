"use client";

import { HiMenu } from "react-icons/hi";
import { pdfFile } from "../lib/scielo/article";
import { useState } from "react";

interface PdfMenuProps {
  files: pdfFile[];
}

export default function PdfMenu(props: PdfMenuProps) {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <div className="flex justify-end w-4">
      <button
        className="bg-red-400 text-black text-lg p-1 px-2 flex justify-center items-center gap-2"
        aria-controls="pdfmenu"
        aria-haspopup="menu"
        aria-expanded={opened}
        onClick={() => setOpened(!opened)}
        aria-label="Baixar PDF"
      >
        <HiMenu />
        PDF
      </button>
      {opened && (
        <div id="pdfmenu" role="menu" className="absolute flex flex-col top-10 bg-slate-500 py-2">
          {props.files.map((file, i) => {
            return <a className="text-white px-2 py-1 hover:bg-slate-600" role="menuitem" key={i} href={file.url}>{file.text.replace("|", '')}</a>
          })}
        </div>)}
    </div>
  );
}
