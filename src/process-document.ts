import {
  Asciidoc,
  Epigraph,
  DocSection,
  Html,
  AsciidocConversionLog,
} from '@friends-library/types';
import { extractShortHeadings, extractHeading } from './headings';
import { extractEpigraphs } from './epigraphs';
import adocToHtml from './adoc-to-html';

export default function processDocument(
  adoc: Asciidoc,
): {
  epigraphs: Epigraph[];
  sections: DocSection[];
  logs: AsciidocConversionLog[];
} {
  const shortHeadings = extractShortHeadings(adoc);
  const [epigraphs, adocSansEpigraphs] = extractEpigraphs(adoc);
  const [completeHtml, logs] = adocToHtml(adocSansEpigraphs);
  // const [notes, htmlSansNotes] = extractNotes(completeHtml);
  return {
    epigraphs,
    sections: htmlToSections('@TODO delete? was `htmlSansNotes`', shortHeadings),
    logs,
  };
}

function htmlToSections(docHtml: Html, shortHeadings: Map<string, string>): DocSection[] {
  return docHtml
    .split(/(?=<div class="sect1[^>]+?>)/gim)
    .filter((html) => !!html.trim())
    .map(addSignedSectionClass)
    .map((html: Html, i: number) => ({ index: i, id: `section${i + 1}`, html }))
    .map((section) => extractHeading(section, shortHeadings));
}

function addSignedSectionClass(html: Html): Html {
  const has = html.match(/class="(signed-section|salutation|letter-heading)/gm)
    ? `has`
    : `no`;
  return html.replace(
    /^<div class="sect1/,
    `<div class="sect1 chapter--${has}-signed-section`,
  );
}
