import { Nimbus } from "./Nimbus";
import { createLinksByHrefLookup, looksLikeReference, getTargetElement } from "./link";
import { get, getOne } from "./selectors";
import { wrapElement, unwrapElement, unwrapAll } from "./element";
import { isEmptyElement } from "./elementAndNodeTests";
import { replaceElement, replaceElementKeepingId } from "./replaceElements";
import { showMessageBig, showMessageError } from "./ui";
import { logInfo, logError, logWarning, logSuccess } from "./log";
import { markElement } from "./mark";
import { getTextLength } from "./node";
import { interlinkReferencesByIndex, interlinkFootnoteAndNonFootnoteReferencesByIndexInSections } from "./interlinkReferences";
import { fixTextAroundReferences } from "./cleanup";
import { REGEXES, REFERENCE_TAGNAME } from "./constants";

export function moveID(anchorSelector, recipientRelationship, recipientSelector)
{
	const validRelationships = new Set(["p", "s", "c", "ns", "ps"]);
	if(!(typeof recipientRelationship === "string" && validRelationships.has(recipientRelationship)))
	{
		showMessageError("recipientRelationship needs to be one of [p, s, c, ns, ps]");
		return;
	}

	const elems = get(anchorSelector);

	let numElementsWithIDs = 0;
	let numRecipientAlreadyHasID = 0;
	let numIDsMoved = 0;
	let numRecipientsNotFound = 0;
	const linksByHref = createLinksByHrefLookup();

	function getParent(elem)
	{
		return elem.closest(recipientSelector);
	}

	function getChild(elem)
	{
		return elem.querySelector(recipientSelector);
	}

	function getSibling(elem)
	{
		const next = elem.nextElementSibling;
		if(next && next.matches(recipientSelector)) return next;
		const prev = elem.previousElementSibling;
		if(prev && prev.matches(recipientSelector)) return prev;
		return null;
	}

	function getNextSibling(elem)
	{
		const next = elem.nextElementSibling;
		if(next && next.matches(recipientSelector)) return next;
		return null;
	}

	function getPreviousSibling(elem)
	{
		const prev = elem.previousElementSibling;
		if(prev && prev.matches(recipientSelector)) return prev;
		return null;
	}

	let getRecipient;
	switch(recipientRelationship)
	{
		case "p": getRecipient = getParent; break;
		case "s": getRecipient = getSibling; break;
		case "ns": getRecipient = getNextSibling; break;
		case "ps": getRecipient = getPreviousSibling; break;
		case "c": getRecipient = getChild; break;
	}

	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(!elem.id)
			continue;

		numElementsWithIDs++;
		const linksToAnchor = linksByHref["#" + elem.id];

		const recipient = getRecipient(elem);
		if(recipient)
		{
			if(!recipient.id)
			{
				recipient.id = elem.id;
				numIDsMoved++;
			}
			else
			{
				if(linksToAnchor)
				{
					for(let j = 0, jj = linksToAnchor.length; j < jj; j++)
						linksToAnchor[j].setAttribute("href", "#" + recipient.id);
					numIDsMoved++;
				}
			}
			elem.removeAttribute("id");
			if((elem.tagName === "A" || elem.tagName === "SPAN") && getTextLength(elem) === 0)
				elem.remove();
			else
				elem.className = "statusOk";
		}
		else
		{
			numRecipientsNotFound++;
			elem.className = "statusError";
		}
	}

	if(numElementsWithIDs === 0)
		showMessageBig("None of the selected elements have IDs");
	else if(numElementsWithIDs === numIDsMoved)
		showMessageBig(`${numElementsWithIDs} IDs moved, none remaining`);
	else if(numRecipientsNotFound)
		showMessageBig(`${numIDsMoved} IDs moved, ${numRecipientsNotFound} recipients not found`);
}

export function cleanReferenceText(str)
{
	if(REGEXES.DIGITS_ENDING_IN_PERIOD.test(str))
		return str.slice(0, str.length - 1);
	if(REGEXES.DIGITS_IN_SQUARE_BRACKETS.test(str))
		return str.replace(/[\[\]]/g, "");
	if(REGEXES.DIGITS_IN_CURLY_BRACES.test(str))
		return str.replace(/[{}]/g, "");
	return str;
}

export function createReferencesByTags()
{
	let numASup = 0;
	let numSupA = 0;
	let numFootnoteA = 0;
	let numNonAlphanumericA = 0;

	if(document.querySelector("a sup"))
	{
		const links = get("a");
		for(let i = 0, ii = links.length; i < ii; i++)
		{
			const link = links[i];
			const linkText = link.textContent.trim();
			if(link.getElementsByTagName("sup").length && looksLikeReference(linkText))
			{
				link.textContent = cleanReferenceText(linkText);
				wrapElement(link, REFERENCE_TAGNAME);
				numASup++;
			}
		}
	}

	if(document.querySelector("sup a"))
	{
		const sups = document.querySelectorAll("sup");
		for(let i = 0, ii = sups.length; i < ii; i++)
		{
			const supLink = sups[i].querySelector("a");
			if(supLink && looksLikeReference(supLink.textContent))
			{
				supLink.textContent = cleanReferenceText(supLink.textContent);
				if(sups[i].id && !supLink.id)
				{
					supLink.id = sups[i].id;
					replaceElement(sups[i], REFERENCE_TAGNAME);
				}
				else
				{
					replaceElementKeepingId(sups[i], REFERENCE_TAGNAME);
				}
				numSupA++;
			}
		}
	}

	if(document.querySelector("footnote a"))
	{
		if(document.querySelector("footnote span"))
		{
			logWarning("Footnotes contain spans, remove them before trying to create references from footnote links");
		}
		else
		{
			const footnoteLinks = document.querySelectorAll("footnote a:first-child");
			for(let i = 0, ii = footnoteLinks.length; i < ii; i++)
			{
				if(looksLikeReference(footnoteLinks[i].textContent) && !footnoteLinks[i].closest(REFERENCE_TAGNAME))
				{
					footnoteLinks[i].textContent = cleanReferenceText(footnoteLinks[i].textContent);
					wrapElement(footnoteLinks[i], REFERENCE_TAGNAME);
					numFootnoteA++;
				}
			}
		}
	}

	const links = get("a");
	for(const link of links)
	{
		if(link.closest(REFERENCE_TAGNAME) || link.querySelector("img"))
			continue;
		const str = link.textContent.trim();
		if(str.length > 0 && str.length < 4 && /^[^A-Za-z0-9]+$/.test(str))
		{
			wrapElement(link, REFERENCE_TAGNAME);
			numNonAlphanumericA++;
		}
	}

	unwrapAll(REFERENCE_TAGNAME + " sup");
	unwrapAll(REFERENCE_TAGNAME + " small");
	unwrapAll(REFERENCE_TAGNAME + " span");
	unwrapAll(REFERENCE_TAGNAME + " " + REFERENCE_TAGNAME);
	fixTextAroundReferences();

	showMessageBig(`${numASup} a sup, ${numSupA} sup a, ${numFootnoteA} footnote a, ${numNonAlphanumericA} non-alphanumeric references created`);
}

export function analyzeReferences()
{
	if(getOne("footnote"))
	{
		const footnoteLinks = document.querySelectorAll("footnote a");
		let numEmptyFootnoteLinks = 0;
		for(const link of footnoteLinks)
		{
			if(getTextLength(link) === 0)
				numEmptyFootnoteLinks++;
		}
		if(numEmptyFootnoteLinks)
			logError(`${numEmptyFootnoteLinks} empty links inside footnotes`);
		else
			logSuccess("No empty links inside footnotes");

		let numSectionsWithReferences = 0;
		const sections = get("section");
		for(const section of sections)
			if(section.querySelector("footnote") !== null)
				numSectionsWithReferences++;
		if(numSectionsWithReferences === 1)
			logInfo("All footnotes are contained within one section");
		else if(numSectionsWithReferences > 1)
			logInfo("More than one section contains footnotes");
	}

	const allRefs = document.querySelectorAll(REFERENCE_TAGNAME + " a");
	const footnoteRefs = document.querySelectorAll(`footnote ${REFERENCE_TAGNAME} a`);

	if(allRefs.length === 0)
	{
		logInfo("Could not find any references");
		return;
	}
	if(footnoteRefs.length === 0)
	{
		logInfo("Could not find any footnote references");
		return;
	}

	const nonFootnoteRefs = [];
	for(const ref of allRefs)
		if(!ref.closest("footnote"))
			nonFootnoteRefs.push(ref);

	if(nonFootnoteRefs.length === footnoteRefs.length)
		logSuccess(`${nonFootnoteRefs.length} non-footnote refs, ${footnoteRefs.length} footnote refs`);
	else
		logError(`${nonFootnoteRefs.length} non-footnote refs, ${footnoteRefs.length} footnote refs: cannot interlink by index`);

	const footnotes = document.querySelectorAll("footnote");
	if(footnotes.length === footnoteRefs.length)
		logSuccess(`${footnotes.length} footnotes, ${footnoteRefs.length} footnote references`);
	else
		logWarning(`${footnotes.length} footnotes, ${footnoteRefs.length} footnote references`);

	let numNonMatchingText = 0;
	for(let i = 0; i < Math.max(footnoteRefs.length, nonFootnoteRefs.length); i++)
	{
		const fRef = footnoteRefs[i];
		const nfRef = nonFootnoteRefs[i];
		if(fRef && nfRef)
		{
			const fRefText = fRef.textContent.trim()
			const nfRefText = nfRef.textContent.trim()
			if(fRefText !== nfRefText)
			{
				numNonMatchingText++;
				if(numNonMatchingText === 1)
				{
					logError(`\t footnote reference ${fRefText} and non-footnote reference ${nfRefText} text mismatch`);
					markElement(fRef);
					markElement(nfRef);
					break;
				}
			}
		}
		else
		{
			if(fRef)
			{
				markElement(fRef);
				logError(`index ${i}: footnote ref has text ${fRef.textContent}, non-footnote ref is undefined`);
			}
			else
			{
				markElement(nfRef);
				logError(`index ${i}: non-footnote ref has text ${nfRef.textContent}, footnote ref is undefined`);
			}
		}
	}

	if(numNonMatchingText)
		logError(`At least one footnote and non-footnote references have differing text. The first such pair has been marked.`);
	else if(nonFootnoteRefs.length === footnoteRefs.length)
	{
		showMessageBig(`All footnote and non-footnote references have matching text; interlinking`);
		interlinkReferencesByIndex(footnoteRefs, nonFootnoteRefs);
	}
}

export function orderFootnotesByNonFootnoteRefs()
{
	const allRefs = document.querySelectorAll(REFERENCE_TAGNAME + " a");
	const footnoteRefs = document.querySelectorAll(`footnote ${REFERENCE_TAGNAME} a`);

	if(allRefs && footnoteRefs)
	{
		const footnotes = get("footnote");
		if(footnotes)
		{
			for(const footnote of footnotes)
			{
				if(footnote.querySelector(REFERENCE_TAGNAME) === null)
				{
					showMessageError("Some footnotes don't have references, cannot proceed");
					return;
				}
			}
		}
		else
		{
			showMessageError("No footnotes in document, cannot proceed");
			return;
		}

		const nonFootnoteRefs = [];
		for(const ref of allRefs)
			if(!ref.closest("footnote"))
				nonFootnoteRefs.push(ref);

		if(nonFootnoteRefs.length === footnoteRefs.length)
		{
			let numNoTarget = 0
			let numNoFootnote = 0;
			let numNonLinkTargets = 0;

			const footnoteWrapper = document.createElement("article");
			const footnotesInOrder = [];

			for(let i = 0, ii = nonFootnoteRefs.length; i < ii; i++)
			{
				const nfRef = nonFootnoteRefs[i];
				const refIndex = (i + 1).toString();
				const fRef = getTargetElement(nfRef);
				if(fRef)
				{
					if(fRef.tagName === "A")
					{
						const footnote = fRef.closest("footnote");
						if(footnote)
						{
							nfRef.textContent = fRef.textContent = refIndex;
							footnotesInOrder.push(footnote);
						}
						else
						{
							numNoFootnote++;
							fRef.className = "statusWarning";
						}
					}
					else
					{
						numNonLinkTargets++;
					}
				}
				else
				{
					numNoTarget++;
					nfRef.className = "statusError";
				}
			}

			if(numNoTarget === 0 && numNoFootnote === 0 && numNonLinkTargets === 0)
			{
				for(const footnote of footnotesInOrder)
					footnoteWrapper.appendChild(footnote);
				document.body.appendChild(footnoteWrapper);
			}
			else
			{
				logError(`${numNoTarget} targets not found, ${numNonLinkTargets} non-link targets, ${numNoFootnote} footnotes not found; cannot place footnotes in order`);
			}
		}
		else
		{
			logError(`${nonFootnoteRefs.length} non-footnote refs, ${footnoteRefs.length} footnote refs`);
		}
	}
	else
	{
		if(!allRefs)
			logError("Could not find any references");
		if(!footnoteRefs)
			logError("Could not find any footnote references");
	}

}
