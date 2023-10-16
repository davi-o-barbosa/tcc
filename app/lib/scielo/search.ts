import { load } from "cheerio";

const searchUrl = "https://search.scielo.org/?lang=pt&count=15&from=0&output=site&sort=&format=summary&fb=&page=1&q=$keywords";

interface SearchResult {
  originalTitle: string | undefined;
  displayTitle: string | undefined;
  isNotPreprint: boolean;
  id: string | undefined;
  url: string | undefined;
  doi: string | undefined;
  source: string | undefined;
  authors: { name: string, url: string }[];
  abstracts: Abstracts;
  pdf: { lang: string, url: string }[];
  text: { lang: string, url: string }[]
}

interface Abstracts {
  [key: string]: string;
}

function trimUselessText(text: string) {
  return text.replace(/\s{2,}/g, "");
}

function isNotPreprint(title: string | undefined): boolean {
  if (!title) return false;
  return title?.slice(0, 18) != "[SciELO Preprints]";
}

function scrapeSearch(html: string) {
  const searchResults: SearchResult[] = [];
  const $ = load(html);

  $(".results > .item").each(function () {
    const displayTitle = $(this).find(".line .title").text();
    const authorsNames: string[] = [];
    const abstracts: Abstracts = {};
    const pdf: { lang: string, url: string }[] = [];
    const text: { lang: string, url: string }[] = [];
    const authors: { name: string, url: string }[] = [];

    const thisSource: any = {
      periodico: undefined,
      date: '',
      details: []
    }

    $(this).find('.source > span, .source > small').each(function (i, element) {
      
      if(element.name == 'span') {
        const titleLocation = $(this).find('.showTooltip');
        if (titleLocation.length > 0) thisSource.periodico = titleLocation.text().trim();
        else if ($(this).attr('style') === 'margin: 0'){
          thisSource.date += $(this).text().trim().replace(',', ' ') + ' '
        } else {
          thisSource.details.push($(this).text().trim())
        }
      } else if (element.name == 'small') {
        thisSource.details.push($(this).text().trim())
      }
    })

    // Setting authors names
    $(this)
      .find(".authors > .author")
      .each(function () {
        const name = $(this).text().split(",");
        name[0] = name[0].toUpperCase();

        authorsNames.push(name.join(","));
      });

    $(this).find(".authors > a").not('.author').each(function (i, _) {
      authors.push({
        name: authorsNames[i],
        url: $(this).attr('href') ?? '',
      })
    })

    // Setting abstracts
    $(this)
      .find(".user-actions > .abstract")
      .each(function () {
        const lang = $(this).attr("id")?.slice(-2);
        if (lang) abstracts[lang] = trimUselessText($(this).text());
      });

    // Setting article's links and PDF links
    $(this)
      .find(".versions > span > a")
      .each(function () {
        const href = $(this).attr("href");
        if (!href || href === "#") return;

        if (href.includes("pdf")) pdf.push({ lang: $(this).attr('title')!, url: href })
        else text.push({ lang: $(this).attr('title')!, url: href })
      });

    searchResults.push({
      originalTitle: $(this).find(".line > a").attr("title"),
      displayTitle: displayTitle,
      isNotPreprint: isNotPreprint(displayTitle),
      id: $(this).attr("id"),
      url: $(this).find(".line > a").attr("href"),
      doi: $(this).find(".metadata a").attr("href"),
      source: thisSource,
      authors: authors,
      abstracts: abstracts,
      pdf: pdf,
      text: text
    });
  });

  return searchResults;
}

export default async function search(keywords: string) {
  const response = await fetch(searchUrl.replace("$keywords", keywords));
  const data = scrapeSearch(await response.text());

  return data;
}