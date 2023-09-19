'use client';

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [dataset, setDataset] = useState<string>('scielo');
  const [keywords, setKeywords] = useState<string | undefined>(undefined);
  const [author, setAuthor] = useState<string | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);

  const router = useRouter();

  function handleKeywordsChange(e: ChangeEvent<HTMLInputElement>) {
    setKeywords(e.target.value);
  }

  function handleDatasetChange(e: ChangeEvent<HTMLSelectElement>) {
    setDataset(e.target.value);
  }

  function handleAuthorChange(e: ChangeEvent<HTMLInputElement>) {
    setAuthor(e.target.value);
  }

  function handleYearChange(e: ChangeEvent<HTMLInputElement>) {
    setYear(Number(e.target.value));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    let searchString = '';

    if (!keywords && !author && !year) return;
    if (keywords && (!author && !year)) {
      searchString = encodeURI(keywords);
    } else {
      let fields: string[] = [];
      if (keywords) fields.push(keywords);
      if (author) fields.push(`(au:(${author}))`)
      if (year) fields.push(`(year_cluster:(${year}))`)
      searchString = encodeURI(fields.join('+AND+'));
    }
    router.push(`/${dataset}/busca/?keywords=${searchString}`);
  }

  return (
    <form className='flex flex-col items-start' onSubmit={handleSubmit}>
      <div>
        <label htmlFor="bancos">Banco:</label>
        <select
          aria-label='Selecione o banco de periódicos para realizar a busca.'
          defaultValue={dataset}
          id="bancos"
          className="ml-3 mb-2"
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
          placeholder="Exemplo: covid"
          className="ml-3 mb-2 w-52 sm:w-96"
          onChange={handleKeywordsChange} />
      </div>
      <div>
        <label htmlFor="author">Autor:</label>
        <input
          type="text"
          id="author"
          placeholder="Exemplo: João"
          className="ml-3 mb-2 w-52 sm:w-96"
          onChange={handleAuthorChange} />
      </div>
      <div>
        <label htmlFor="year">Ano da publicação:</label>
        <input
          type="number"
          id="year"
          placeholder="Exemplo: 2021, 2020"
          className="ml-3 mb-2 w-52 sm:w-96"
          onChange={handleYearChange} />
      </div>
      <button type="submit">Buscar</button>
    </form>
  );
}