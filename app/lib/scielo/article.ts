import { load, Element, Cheerio } from "cheerio";

type Type = "legacy" | "br" | "preprint";

interface Content {
  type: "text" | "image" | "table",
  value: string | null | undefined
}

interface Text extends Content {
  quote: boolean,
}

interface Image extends Content {
  id: string | undefined,
}

interface Table extends Image {
  isImage: boolean,
  label: {
    name: string,
    description: string,
  }
}

interface Section {
  title: string,
  isSubtitle: boolean,
  content: Array<Text | Image | Table>,
}

interface Abstract {
  title: string | undefined,
  text: string | undefined,
  keywords: {
    label: string | undefined,
    text: string | undefined
  },
}

interface Authors {
  name: string,
  id: string,
}

interface AuthorDescription {
  [key: string]: string,
}

function getSectionData(section: Element, host: string) {
  const $ = load(section);

  const thisSection: Section = {
    title: $('.sec, .sub-subsec').text(),
    isSubtitle: $('.sub-subsec').length != 0,
    content: new Array()
  };

  // Qualquer <p> dentro de um <div>
  // Qualquer div com a classe .table-wrap ou .figure
  // Qualquer <blockquote>
  $('div > p, .table-wrap, blockquote, .figure').each(function () {
    // Se o elemento não tiver uma classe ele pode ser tanto um blockquote quanto um p
    // Porém, o blockquote tem um p dentro dele, então eu verifico isso.
    const type = $(this).attr('class');

    switch (type) {
      case undefined:
        thisSection.content.push({
          type: "text",
          quote: $(this).has('p').length ? true : false,
          value: $(this).text()
        })
        break;
      case 'figure':
        thisSection.content.push({
          type: "image",
          id: $(this).find('a').first().attr('name'),
          value: host + $(this).find('img').attr('src')
        })
        break;
      case 'table-wrap':
        let table = $(this).find('.table').html();
        const isImage = !table;

        if (!table) table = host + $(this).find('img').attr('src');

        thisSection.content.push({
          type: "table",
          id: $(this).find('a').first().attr('name'),
          value: table,
          isImage: isImage,
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
    else if (i == 1) data.text = $(this).text();
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

  return {authors, descriptions};
}

function getPageHost(url: string) {
  return url.split('/')[2];
}

async function scrapeLegacyArticle(html: string, host: string): Promise<any> {
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
    title: $('.title').text(),
    altTitle: getTranslatedTitles($('.trans-title').toArray()),
    authors: authors,
    abstracts: abstracts,
    sections: sections
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
  const host = getPageHost(url);

  switch (type) {
    case 'br':
      return 'br';
    case 'legacy':
      return await scrapeLegacyArticle(html, host);
    case 'preprint':
      return await scrapePreprintArticle(html);
  }
}