import { showMessageBig } from "./ui";
import { insertAfter, insertAsFirstChild } from "./dom";
import { createElement } from "./element";
import { get, getOne } from "./selectors";

export function generateTableOfContents(selector = "h1, h2, h3, h4, h5, h6", shouldUseHierarchicalHeadings = false)
{
	const headings = document.querySelectorAll(selector);
	const toc = document.createElement("section");
	toc.id = "tableOfContents";
	for (let i = 0, ii = headings.length; i < ii; i++)
	{
		const heading = headings[i];
		if(!isNaN(Number(heading.textContent)))
			continue;
		if(!heading.id)
			heading.id = `h${i + 1}`;
		const tocEntryLink = createElement("a", { textContent: heading.textContent, href: "#" + heading.id } );
		const indentLevel = parseInt(heading.tagName.substring(1), 10);
		const tocEntryHeading = shouldUseHierarchicalHeadings ? createElement("h" + indentLevel) : createElement("h6");
		const tocEntryIndent = document.createElement("d" + indentLevel);
		tocEntryHeading.appendChild(tocEntryLink);
		tocEntryIndent.appendChild(tocEntryHeading);
		toc.appendChild(tocEntryIndent);
	}
	const documentHeading = getOne("documentheading");
	if(documentHeading)
		insertAfter(documentHeading, toc);
	else
		insertAsFirstChild(document.body, toc);
}

//	Takes footnotes from the end of the document and puts them inline after the paragraph that references them.
//	Requirement: the footnotes have to be in <footnote> elements, references in <reference> elements, and
//	the references have to be numeric.
export function inlineFootnotes()
{
	const FOOTNOTE_TAGNAME = "FOOTNOTE";
	const REFERENCE_TAGNAME = "REFERENCE";
	let numFootnotesNotFound = 0;
	let numFootnotesFixed = 0;
	const paras = get("p, blockquote, quote, quoteauthor");
	for(let i = 0, ii = paras.length; i < ii; i++)
	{
		const para = paras[i];
		const paraRefs = para.querySelectorAll(REFERENCE_TAGNAME + " a");
		if(!paraRefs.length) continue;
		let j = paraRefs.length;
		while(j--)
		{
			const ref = paraRefs[j];
			if(isNaN(Number(ref.textContent)))
				continue;
			let footnote;
			const refTarget = getOne(ref.getAttribute("href"));
			if(refTarget)
			{
				if(refTarget.tagName === "A")
					footnote = refTarget.closest(FOOTNOTE_TAGNAME);
				else if(refTarget.tagName === FOOTNOTE_TAGNAME)
					footnote = refTarget;
			}
			if(footnote)
			{
				para.insertAdjacentElement("afterend", footnote);
				numFootnotesFixed++;
			}
			else
			{
				numFootnotesNotFound++;
			}
		}
	}
	showMessageBig(`Inlined ${numFootnotesFixed} footnotes, ${numFootnotesNotFound} footnote elements not found`);
}
