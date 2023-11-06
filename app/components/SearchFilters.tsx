"use client";

import { ChangeEvent, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const allFilters = [
  { label: "Autor", code: "au", type: "text", example: "Gabriel" },
  {
    label: "Ano de publicação",
    code: "year_cluster",
    type: "number",
    example: "2008",
  },
  { label: "Resumo", code: "ab", type: "text", example: "texto do resumo" },
  { label: "Palavras-chave", code: "kw", type: "text", example: "covid" },
];

interface SearchFiltersProps {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

export default function SearchFilters(props: SearchFiltersProps) {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  return (
    <section>
      <div className="bg-slate-400 text-black rounded-lg p-3 flex flex-col items-start shadow-md">
        <button
          id="add-filter"
          onClick={() => setMenuOpened(!menuOpened)}
          type="button"
          aria-expanded={menuOpened}
          aria-controls="filters"
          className="flex justify-center items-center gap-2 font-semibold"
        >
          <span>
            {menuOpened ? <AiFillCaretUp /> : <AiFillCaretDown/>}
          </span>
          Filtros avançados
        </button>
        {menuOpened && (
          <div id="filters" className="mt-3">
            {allFilters.map((filter) => {
              return (
                <div
                  className="flex-1 mb-2 text-white bg-gray-700 p-2 rounded-md shadow-lg"
                  key={filter.code}
                >
                  <label className="mr-2" htmlFor={filter.code}>
                    {filter.label}:
                  </label>
                  <input
                    type={filter.type}
                    placeholder={"Exemplo: " + filter.example}
                    className="w-full px-2 py-1 rounded-md text-black"
                    id={filter.code}
                    onChange={props.handleChange}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
