import { load, Element, Cheerio, text } from "cheerio";

type Type = "legacy" | "br" | "preprint";

interface Content {
  type: "text" | "image" | "table",
  value: string | null | undefined,
  textBelow?: string | null | undefined,
}

export interface Text extends Content {
  quote: boolean,
}

export interface Image extends Content {
  id: string | undefined,
  label: {
    name: string,
    description: string,
  }
}

export interface Table extends Image {
  isImage: boolean,
}

export interface Section {
  title: string,
  isSubtitle: boolean,
  content: Array<Text | Image | Table>,
}

export interface Abstract {
  title: string | undefined,
  text: string | undefined,
  keywords: {
    label: string | undefined,
    text: string | undefined
  },
}

export interface Authors {
  name: string,
  id: string,
}

export interface AuthorDescription {
  [key: string]: string,
}

function getSectionData(section: Element, host: string) {
  const $ = load(section);

  const thisSection: Section = {
    title: $('.sec, .sub-subsec').first().text(),
    isSubtitle: $('.sub-subsec').length != 0,
    content: new Array()
  };

  // Qualquer <p> dentro de um <div>
  // Qualquer div com a classe .table-wrap ou .figure
  // Qualquer <blockquote>
  $('.section > p, .table-wrap, blockquote, .figure').each(function () {
    let parentTitle = $(this).parent().find('.sec, .sub-subsec').first().text();
    if (parentTitle != thisSection.title) return;
    // Se o elemento não tiver uma classe ele pode ser tanto um blockquote quanto um p
    // Porém, o blockquote tem um p dentro dele, então eu verifico isso.
    const type = $(this).attr('class');

    switch (type) {
      case undefined:
        thisSection.content.push({
          type: "text",
          quote: $(this).has('p').length ? true : false,
          value: $(this).html()
        })
        break;
      case 'figure':
        thisSection.content.push({
          type: "image",
          id: $(this).find('a').first().attr('name'),
          value: host + $(this).find('img').attr('src'),
          label: {
            name: $(this).find('.label').text(),
            description: $(this).find('.caption').text()
          }
        })
        break;
      case 'table-wrap':
        let table = $(this).find('.table').html();

        const isImage = !table;
        if (!table) table = host + $(this).find('img').attr('src');

        const textBelow = $(this).find('p').not('.label_caption, .label').html();

        thisSection.content.push({
          type: "table",
          id: $(this).find('a').first().attr('name'),
          value: table,
          isImage: isImage,
          textBelow: textBelow,
          label: {
            name: $(this).find('.label').text(),
            description: $(this).find('.caption').text()
          }
        })
        break;
    }
  })

  return thisSection;
}

function getAbstractData(abstract: Element): Abstract {
  const $ = load(abstract);

  let data: any = {};

  $('p').each(function (i) {
    if (i == 0) data.title = $(this).text();
    else if (i == 1) data.text = $(this).html();
    else {
      data.keywords = {
        label: $(this).find('b').text(),
        // Regex para remover o texto entre <b> </b> que pertence a label.
        text: ($(this).html() ?? '').replace(/<b>(.*)<\/b>/, ''),
      }
    }
  });

  return data;
}

function getAuthorsData(a: Cheerio<Element>, d: Cheerio<Element>) {
  const authors: Authors[] = [];
  const descriptions: AuthorDescription = {};

  d.each((_, element: any) => {
    const $ = load(element);
    const id = '#' + $('a').attr('name') as string;
    descriptions[id] = element.lastChild?.data ?? '';
  });

  a.each((_, element) => {
    const $ = load(element);
    const id = $('sup > a').attr('href') as string;
    authors.push({
      name: $('.author-name').text(),
      id: id,
    });
  });

  return { authors, descriptions };
}

function getPageHost(url: string) {
  const split = url.split('/');
  return split[0] + '//' + split[2];
}

async function scrapeLegacyArticle(html: string, host: string) {
  const $ = load(html);

  // Resumo em diversas línguas do artigo
  const abstracts: Abstract[] = [];
  // Todas as seções do texto
  const sections: Section[] = [];
  // Autores do artigo, junto com suas descrições;
  const authors = getAuthorsData($('.author'), $('.aff'));

  $('.abstract, .trans-abstract').each((_, abstractElement) => {
    abstracts.push(getAbstractData(abstractElement));
  });

  $('.section').each((_, sectionElement) => {
    sections.push(getSectionData(sectionElement, host));
  });

  return {
    type: "legacy",
    title: $('.title').html(),
    altTitle: getTranslatedTitles($('.trans-title').toArray()),
    authors: authors,
    abstracts: abstracts,
    sections: sections
  }
}

async function scrapePreprintArticle(html: string) {

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

export async function getTitle(url: string) {
  const html = await (await fetch(url)).text();
  const $ = load(html);
  return $('.title').text();
}

export default async function scrapeArticle(url: string) {
  const type = getTypeFromUrl(url);

  if (type == "br") return "br";

  const html = await (await fetch(url)).text();
  const host = getPageHost(url);

  switch (type) {
    case 'legacy':
      return await scrapeLegacyArticle(html, host);
    case 'preprint':
      return await scrapePreprintArticle(html);
  }
}