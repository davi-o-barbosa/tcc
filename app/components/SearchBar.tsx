"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";
import FormInput from "./FormInput";
import { ChangeEvent, useState } from "react";
import SearchFilters from "./SearchFilters";

interface Filters {
  [key: string]: string;
}

export default function SearchBar() {
  const [filters, setFilters] = useState<Filters>({});
  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newValues = { ...filters };
    newValues[e.target.id] = e.target.value;
    setFilters(newValues);
  }

  function handleSubmit(e: any) {
    e.preventDefault();

    const query: string[] = [];
    
    for (const id in filters) {
      if (filters[id] == '') continue;
      if (id == 'q') query.push(`(${filters[id]})`)
      else query.push(`(${id}:(${filters[id]}))`)
    }
    
    router.push(`/scielo/busca/?keywords=${encodeURI(query.join('+AND+'))}`);
  }

  return (
    <form
      role="search"
      className="w-full flex flex-col gap-3"
      onSubmit={handleSubmit}
    >
      <FormInput
        label="Procurar"
        placeholder="Exemplo: células-tronco"
        type="search"
        title="Pesquisar"
        onChange={handleChange}
      />
      <SearchFilters handleChange={handleChange} />
      <Button type="submit">Buscar</Button>
    </form>
  );
}
