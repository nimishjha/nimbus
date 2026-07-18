import { Nimbus } from "./Nimbus";
import { logSuccess, logError, logWarning, logYellow, logInfo } from "./log";
import { showMessageBig, showMessageError } from "./ui";
import { createLinksByHrefLookup } from "./link";
import { wrapElement, wrapElementInner } from "./element";
import { annotateElement } from "./dom";
import { get } from "./selectors";
import { REFERENCE_TAGNAME } from "./constants";

export function getSafePrefixForSequentialIDs(prefix)
{
	prefix = prefix.toLowerCase();
	const existingPrefixes = new Set();

	const elems = document.querySelectorAll("body *[id]");
	for(const elem of elems)
	{
		if(/^[a-z]+[0-9]/.test(elem.id))
		{
			const prefix = elem.id.match(/^[a-z]+/)[0];
			existingPrefixes.add(prefix);
		}
	}

	let charCode = 97;

	let prefixToTest = prefix;
	while(true)
	{
		if(existingPrefixes.has(prefixToTest))
		{
			prefixToTest = prefix + String.fromCharCode(charCode);
			charCode++;
			if(charCode > 122)
				return false;
		}
		else
			return prefixToTest;
	}
}

export function interlink(primaryLink, secondaryLink, text, id)
{
	primaryLink.textContent = secondaryLink.textContent = text;
	primaryLink.id = id;
	secondaryLink.id = id + "b";
	primaryLink.setAttribute("href", "#" + secondaryLink.id);
	secondaryLink.setAttribute("href", "#" + primaryLink.id);
}

export function interlinkMultiple(link, backlinks, text, id)
{
	let numInterlinked = 0;
	interlink(link, backlinks[0], text, id);
	numInterlinked++;

	for(let i = 1, ii = backlinks.length; i < ii; i++)
	{
		const refLink = backlinks[i];
		const dupRef = document.createElement(REFERENCE_TAGNAME);
		const dupRefLink = document.createElement("a");
		const dupRefLinkText = `${text}-${i + 1}`;
		const dupRefLinkID = id + "dup" + (i + 1).toString();
		interlink(dupRefLink, refLink, dupRefLinkText, dupRefLinkID);
		dupRef.appendChild(dupRefLink);
		link.insertAdjacentElement("afterend", dupRef);
		numInterlinked++;
	}

	return numInterlinked;
}

export function interlinkReferencesByIndex(footnoteRefs, nonFootnoteRefs)
{
	if(nonFootnoteRefs.length === footnoteRefs.length)
	{
		const prefix = getSafePrefixForSequentialIDs("ref");
		if(prefix)
		{
			for(let i = 0, ii = nonFootnoteRefs.length; i < ii; i++)
			{
				const index = (i + 1).toString();
				interlink(nonFootnoteRefs[i], footnoteRefs[i], index, prefix + index);
			}
			showMessageBig(`${nonFootnoteRefs.length} reference pairs interlinked`);
		}
		else
		{
			showMessageBig("Could not find a safe prefix; cannot interlink");
		}
	}
	else
	{
		showMessageError(`interlinkReferencesByIndex: ${nonFootnoteRefs.length} non-footnote refs, ${footnoteRefs.length} footnote refs; cannot interlink`);
	}
}

export function interlinkReferencesByIndexInSections()
{
	const sections = Array.from(document.getElementsByTagName("section"));
	for(let i = 0; i < sections.length; i++)
	{
		const section = sections[i];
		const sectionIndex = i + 1;

		const allRefs = section.querySelectorAll(REFERENCE_TAGNAME + " a");
		const footnoteRefs = section.querySelectorAll(`footnote ${REFERENCE_TAGNAME} a`);
		if(!allRefs)
		{
			logInfo(`Did not find any references in section ${sectionIndex}`);
			continue;
		}
		if(!footnoteRefs)
		{
			logInfo(`Did not find any references inside footnotes in section ${sectionIndex}`);
			continue;
		}

		const nonFootnoteRefs = [];
		for(const ref of allRefs)
			if(!ref.closest("footnote"))
				nonFootnoteRefs.push(ref);

		if(footnoteRefs.length > 0 && nonFootnoteRefs.length > 0)
		{
			if(footnoteRefs.length === nonFootnoteRefs.length)
			{
				logSuccess(`Section ${sectionIndex}: ${allRefs.length} total refs, ${footnoteRefs.length} footnote refs, ${nonFootnoteRefs.length} non-footnote refs`);

				for(let j = 0; j < nonFootnoteRefs.length; j++)
				{
					const refIndex = j + 1;
					interlink(nonFootnoteRefs[j], footnoteRefs[j], refIndex, `s${sectionIndex}r${refIndex}`);
				}
			}
			else
			{
				logWarning(`Section ${sectionIndex}: lengths mismatch - ${footnoteRefs.length} footnote refs, ${nonFootnoteRefs.length} non-footnote refs`);
				section.className = Nimbus.markerClass;
			}
		}
	}
}

function doesNotHaveFootnoteParent(elem)
{
	return !elem.closest("footnote");
}

export function interlinkReferencesByTextInSections()
{
	const sections = document.querySelectorAll("section");
	if(!sections.length)
	{
		showMessageError("Could not find any sections in document");
		return;
	}

	let numInterlinked = 0;
	let numFootnoteRefs = 0;
	let uniqueRefNumber = 0;

	for(let i = 0, ii = sections.length; i < ii; i++)
	{
		const section = sections[i];
		const footnoteRefLinks = section.querySelectorAll("footnote reference a");
		if(!footnoteRefLinks.length)
		{
			logInfo(`No footnote reference links in section ${i}`);
			continue;
		}

		numFootnoteRefs += footnoteRefLinks.length;

		const allRefs = Array.from(section.querySelectorAll("reference"));
		if(!allRefs.length)
		{
			logInfo(`No references in section ${i}`);
			continue;
		}

		const nonFootnoteRefs = allRefs.filter(doesNotHaveFootnoteParent);
		if(!nonFootnoteRefs.length)
		{
			logInfo(`No non-footnote references in section ${i}`);
			continue;
		}

		for(const ref of nonFootnoteRefs)
			if(!ref.querySelector("a"))
				wrapElementInner(ref, "a");

		const nonFootnoteRefLinksByText = {};
		for(const ref of nonFootnoteRefs)
		{
			const refText = ref.textContent.trim();
			const refLink = ref.querySelector("a");
			if(nonFootnoteRefLinksByText[refText])
				nonFootnoteRefLinksByText[refText].push(refLink);
			else
				nonFootnoteRefLinksByText[refText] = [refLink];
		}

		for(const link of footnoteRefLinks)
		{
			uniqueRefNumber++;
			const linkText = link.textContent.trim();
			const backlinks = nonFootnoteRefLinksByText[linkText];
			if(backlinks)
				numInterlinked += interlinkMultiple(link, backlinks, uniqueRefNumber, "ref" + uniqueRefNumber);
			else
				annotateElement(link.parentNode, "x", "no matching refs");
		}
	}

	showMessageBig(`${numInterlinked} reference pairs interlinked; ${numFootnoteRefs} footnote references total`);
}

export function interlinkReferencesByChapterAndFootnoteContainerSelectors(chapterSelector, footnotesContainerSelector)
{
	const chapterElements = get(chapterSelector);
	const footnoteContainerElements = get(footnotesContainerSelector);

	if(!(chapterElements && footnoteContainerElements))
	{
		logError("Could not get containers");
		return;
	}

	if(chapterElements.length !== footnoteContainerElements.length)
	{
		logError("Container counts mismatch");
		return;
	}

	for(let i = 0, ii = chapterElements.length; i < ii; i++)
	{
		const chapterContainerIndex = i + 1;
		const chapterHeading = chapterElements[i].querySelector("h1, h2");
		const chapterHeadingText = chapterHeading ? chapterHeading.textContent : `CHAPTER_${chapterContainerIndex}_NO_HEADING`;
		const chapterRefLinks = chapterElements[i].querySelectorAll("reference a");
		const footnoteContainerRefLinks = footnoteContainerElements[i].querySelectorAll("reference a");

		if(chapterRefLinks.length === footnoteContainerRefLinks.length)
		{
			logInfo(`${chapterHeadingText}: ${chapterRefLinks.length} chapter references, ${footnoteContainerRefLinks.length} footnote references`);
		}
		else
		{
			logError(`${chapterHeadingText}: reference counts mismatch: ${chapterRefLinks.length} chapter references, ${footnoteContainerRefLinks.length} footnote references`);
			continue;
		}

		let numInterlinked = 0;
		for(let j = 0, jj = chapterRefLinks.length; j < jj; j++)
		{
			const index = j + 1;
			if(chapterRefLinks[j].textContent.trim() === footnoteContainerRefLinks[j].textContent.trim())
			{
				interlink(chapterRefLinks[j], footnoteContainerRefLinks[j], index, `r${i}_${index}`);
				numInterlinked++;
			}
			else
			{
				logWarning(`${chapterHeadingText}: reference texts do not match`);
				break;
			}
		}

		if(numInterlinked === chapterRefLinks.length)
			logSuccess(`Linked ${chapterRefLinks.length} references in chapter ${chapterContainerIndex}: ${chapterHeadingText}`);
		else
			logError(`Failed to interlink references in chapter ${chapterContainerIndex}: ${chapterHeadingText}`);
	}
}

export function interlinkReferencesUsingFootnoteReferences()
{
	const primaryRefLinks = document.querySelectorAll(`footnote ${REFERENCE_TAGNAME} a`);
	if(!primaryRefLinks)
	{
		logError("Did not find any footnote references");
		return;
	}

	const lookup = createLinksByHrefLookup();
	let count = 0;

	const prefix = getSafePrefixForSequentialIDs("ref");
	if(!prefix)
	{
		showMessageBig("Could not find a safe prefix; cannot proceed");
		return;
	}

	for(let i = 0, ii = primaryRefLinks.length; i < ii; i++)
	{
		const primaryRefLink = primaryRefLinks[i];
		const index = i + 1;

		if(!primaryRefLink.id.length)
		{
			logWarning(`ID for reference ${primaryRefLink.textContent} is empty`);
			primaryRefLink.className = "statusError";
		}
		else
		{
			const links = lookup["#" + primaryRefLink.id];
			if(links)
			{
				count++;
				primaryRefLink.id = prefix + index;
				primaryRefLink.textContent = index;
				interlink(primaryRefLink, links[0], primaryRefLink.textContent, primaryRefLink.id);
				if(links[0].parentNode.tagName !== REFERENCE_TAGNAME)
				{
					logInfo(`links[0].parentNode.tagName is ${links[0].parentNode.tagName}`);
					wrapElement(links[0], REFERENCE_TAGNAME);
				}

				if(links.length > 1)
				{
					logYellow(`${primaryRefLink.textContent} has ${links.length} links to it`);
					for(let j = 1, jj = links.length; j < jj; j++)
					{
						const dupRef = document.createElement(REFERENCE_TAGNAME);
						const dupRefLink = document.createElement("a");
						const dupRefLinkText = `${primaryRefLink.textContent}-${j + 1}`;
						const dupRefLinkID = primaryRefLink.id + "dup" + (j + 1).toString();
						interlink(dupRefLink, links[j], dupRefLinkText, dupRefLinkID);
						dupRef.appendChild(dupRefLink);
						primaryRefLink.parentNode.insertAdjacentElement("afterend", dupRef);
					}
				}
			}
			else
			{
				logWarning(`No links to ID "${primaryRefLink.id}"`);
				primaryRefLink.className = "statusWarning";
			}
		}
	}
	showMessageBig(`${count} reference groups interlinked`);
}
