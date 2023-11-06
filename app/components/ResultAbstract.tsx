"use client";

import { useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export default function ResultAbstract(props: { text: string }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="bg-slate-300 shadow-md rounded-md">
      <button
        className="flex flex-row items-center gap-1 px-3 py-1 font-semibold"
        type="button"
        aria-expanded={opened}
        aria-controls="resumo"
        onClick={() => setOpened(!opened)}
      >
        {opened ? <AiFillCaretUp/> : <AiFillCaretDown/>}
        <span className="sr-only">Exibir </span>
        Resumo
      </button>
      <div id="resumo" className="mx-3 mb-3 mt-1 px-3 py-2 bg-slate-100 rounded-md" hidden={!opened}>
        <p>{props.text}</p>
      </div>
    </div>
  );
}
