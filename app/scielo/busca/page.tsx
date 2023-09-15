import { search } from "@/app/lib/ScieloScraper";

export default async function ScieloBusca({ searchParams }: { searchParams: {
  keywords: string,
} }) {
  const data = await search(searchParams.keywords);
  console.log(data);
  return (
    <h1>{searchParams.keywords}</h1>
  )
}
