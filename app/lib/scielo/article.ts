import { Element, load } from "cheerio";

type Type = "legacy" | "br" | "preprint";

interface ArticleData {
  type: Type,
  title?: string,
}

async function scrapeDefaultArticle(html: string): Promise<any> {
  const $ = load(html);
  return {
    type: "br",
    title: $('.article-title').text(),
  }
}

async function scrapeLegacyArticle(html: string): Promise<any> {
  const $ = load(html);

  // Resumo em diversas línguas do artigo
  const abstracts: any = [];

  $('.trans-abstract').each(function () {
    const title = $(this).find('.sec').text();
    let content;
    let keywords;

    $(this).find('p').filter(function (i) { return $(this).attr('class') != 'sec' }).each(
      function (i) {
        if (i == 0) content = $(this).html()
        else keywords = $(this).html()
      }
    )

    abstracts.push({
      title: title,
      content: content,
      keywords: keywords,
    })
  })

  return {
    type: "legacy",
    title: $('.title').text(),
    altTitle: getTranslatedTitles($('.trans-title').toArray()),
    abstracts: abstracts,
  }
}

async function scrapePreprintArticle(html: string): Promise<any> {

}

function getTranslatedTitles(titles: Element[]) {
  // Cheerio is badly typed, data exists in Element
  // But typescript isn't reading it.
  return titles.map((e: any) => {
    return e.children[0].data
  })
}

function getTypeFromUrl(url: string): Type {
  const words = url.split(/[./]/g);
  if (words[2] === 'preprints') return 'preprint';
  if (words[4] === 'br') return 'br';
  else return 'legacy';
}

export default async function scrapeArticle(url: string): Promise<any> {
  const type = getTypeFromUrl(url);
  const html = await (await fetch(url)).text();

  switch (type) {
    case 'br':
      return await scrapeDefaultArticle(html);
    case 'legacy':
      return await scrapeLegacyArticle(html);
    case 'preprint':
      return await scrapePreprintArticle(html);
  }
}