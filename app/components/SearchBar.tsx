'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [dataset, setDataset] = useState<string>('scielo');
  const [keywords, setKeywords] = useState<string>('');
  const router = useRouter();

  function handleKeywordsChange(e: ChangeEvent<HTMLInputElement>) {
    setKeywords(e.target.value);
  }

  function handleDatasetChange(e: ChangeEvent<HTMLSelectElement>) {
    setDataset(e.target.value);
  }

  function handleSubmit(e: any) {
    if (keywords.length === 0) return;

    e.preventDefault();
    router.push(`/${dataset}/busca/?keywords=${keywords.split(' ').join('+')}`);
  }

  return (
    <form className="flex flex-col w-full md:w-2/3 items-start">
      <div>
        <label htmlFor="bancos">Banco:</label>
        <select
          defaultValue={dataset}
          id="bancos"
          className="mr-3 ml-3"
          onChange={handleDatasetChange}
        >
          <option value="scielo">
            Scielo.org
          </option>
        </select>
      </div>
      <div>
        <label htmlFor="keywords">Palavras-chave:</label>
        <input
          type="text"
          id="keywords"
          placeholder="Digite uma ou mais palavras-chave"
          className="ml-3 w-72"
          onChange={handleKeywordsChange} />
      </div>
      <button type="button" onClick={handleSubmit}>Buscar</button>
    </form>
  );
}