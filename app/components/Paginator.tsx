"use client";

import { useRouter } from "next/navigation";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

interface PaginatorProps {
  searchDetails: {
    keywords: string;
    page: string;
    resultsPerPage: string;
    numberOfResults: number;
  };
}

export default function Paginator({ searchDetails }: PaginatorProps) {
  const router = useRouter();

  const baseStyle =
    "w-10 h-9 flex justify-center items-center rounded-md border border-1 duration-150 transition shadow-md ";
  const currentPageStyle = baseStyle + "bg-sky-500 border-sky-500";
  const otherPagesStyle = baseStyle + "border-gray-300 hover:bg-gray-300";

  const lastPage = Math.ceil(
    searchDetails.numberOfResults / Number(searchDetails.resultsPerPage)
  );
  const currentPage = Number(searchDetails.page) + 1;

  const PageButtons = [];

  if (lastPage > 5) {
    let middle = currentPage;
    if (currentPage <= 4) {
      middle = 3;
    } else if (currentPage >= lastPage - 3) {
      middle = lastPage - 2;
    }
    for (let i = middle - 2; i <= middle + 2; i++) {
      const selected = currentPage == i;
      PageButtons.push(
        <button
          disabled={selected}
          key={i}
          aria-label={selected ? `Página ${i}` : `Ir para a página ${i}`}
          aria-current={selected ? "page" : undefined}
          className={selected ? currentPageStyle : otherPagesStyle}
          onClick={() => goToPage(i - 1)}
        >
          {i}
        </button>
      );
    }
  } else {
    for (let i = 1; i <= lastPage; i++) {
      const selected = currentPage == i;
      PageButtons.push(
        <button
          disabled={selected}
          key={i}
          aria-label={selected ? `Página ${i}` : `Ir para a página ${i}`}
          aria-current={selected ? "page" : undefined}
          className={selected ? currentPageStyle : otherPagesStyle}
          onClick={() => goToPage(i - 1)}
        >
          {i}
        </button>
      );
    }
  }

  function goToPage(page: number) {
    router.push(
      `/scielo/busca/?page=${page}&number=${searchDetails.resultsPerPage}&keywords=${searchDetails.keywords}`
    );
  }

  return (
    <nav aria-label="Paginação" className="my-5 flex flex-wrap gap-2">
      <button
        aria-label="Ir para a página anterior"
        className={otherPagesStyle}
        onClick={() => goToPage(currentPage == 1 ? 0 : currentPage - 2)}
      >
        <IoArrowBack />
      </button>

      {currentPage >= 5 && (
        <>
          <button
            aria-label={`Ir para a primeira página`}
            className={otherPagesStyle}
            onClick={() => goToPage(0)}
          >
            1
          </button>
          <p>...</p>
        </>
      )}

      {PageButtons}

      {currentPage <= lastPage - 4 && (
        <>
          <p>...</p>
          <button
            aria-label={`Ir para a última página`}
            className={otherPagesStyle}
            onClick={() => goToPage(lastPage - 1)}
          >
            {lastPage}
          </button>
        </>
      )}

      <button
        aria-label="Ir para a próxima página"
        className={otherPagesStyle}
        onClick={() =>
          goToPage(currentPage == lastPage ? lastPage - 1 : currentPage)
        }
      >
        <IoArrowForward />
      </button>
    </nav>
  );
}
