import {load} from 'cheerio';

const searchUrl = "https://search.scielo.org/?lang=pt&count=15&from=0&output=site&sort=&format=summary&fb=&page=1&q=$keywords";

interface SearchResult {
  originalTitle: string | undefined;
  displayTitle: string | undefined;
  id: string | undefined;
  url: string | undefined;
  doi: string | undefined;
  source: string | undefined;
  year: string | undefined;
  authors: string[];
  abstracts: Abstracts;
}

interface Abstracts {
  [key: string]: string;
}

function trimUselessText(text: string) {
  return text.replace(/\s{2,}/g, '');
}

function scrapeData (html: string) {
  const searchResults: SearchResult[] = [];
  const $ = load(html);

  $('.results > .item').each(function () {
    const authors: string[] = [];
    const abstracts: Abstracts = {};

    $(this)
      .find('.authors > .author')
      .each(function () {
        const name = $(this).text().split(',');
        name[0] = name[0].toUpperCase();

        authors.push(name.join(','));
      });

    $(this)
      .find('.user-actions > .abstract')
      .each(function () {
        const lang = $(this).attr('id')?.slice(-2);
        if (lang) abstracts[lang] = trimUselessText($(this).text());
      });

    searchResults.push({
      originalTitle: $(this).find('.line > a').attr('title'),
      displayTitle: $(this).find('.line .title').text(),
      id: $(this).attr('id'),
      url: $(this).find('.line > a').attr('href'),
      doi: $(this).find('.metadata a').attr('href'),
      source: $(this).find('.source a').first().text(),
      year: $(this).find('.source span').filter(function(i, el) {
        if ($(this).text() == '') return false;
        return !isNaN(+$(this).text().replace(',', ''));
      }).first().text().replace(',', ''),
      authors: authors,
      abstracts: abstracts,
    });
  });

  return searchResults;
}

export async function search (keywords: string) {
  const response = await fetch(searchUrl.replace("$keywords", keywords));
  const data = scrapeData(await response.text());

  return data;
}