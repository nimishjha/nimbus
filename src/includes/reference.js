import { Nimbus } from "./Nimbus";
import { createLinksByHrefLookup, looksLikeReference } from "./link";
import { get, getOne } from "./selectors";
import { wrapElement, unwrapElement, unwrapAll } from "./element";
import { isEmptyElement } from "./elementAndNodeTests";
import { replaceElement, replaceElementKeepingId } from "./replaceElements";
import { showMessageBig, showMessageError } from "./ui";
import { logInfo, logError, logWarning, logSuccess } from "./log";
import { markElement } from "./mark";
import { getTextLength } from "./node";
import { interlinkReferencesByIndex } from "./interlinkReferences";
import { fixTextAroundReferences } from "./cleanup";

export function interlinkFootnoteAndNonFootnoteReferencesByIndexInSections()
{
	const sections = Array.from(document.getElementsByTagName("section"));
	for(let i = 0; i < sections.length; i++)
	{
		const section = sections[i];
		const sectionIndex = i + 1;

		const allRefs = section.querySelectorAll("reference a");
		const footnoteRefs = section.querySelectorAll("footnote reference a");
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
					const link1 = nonFootnoteRefs[j];
					const link2 = footnoteRefs[j];

					link1.id = `s${sectionIndex}r${refIndex}`;
					link2.id = `s${sectionIndex}r${refIndex}b`;

					link1.textContent = refIndex;
					link2.textContent = refIndex;

					link1.setAttribute("href", "#" + link2.id);
					link2.setAttribute("href", "#" + link1.id);

					link1.className = "statusOk";
					link2.className = "statusOk";
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

export function moveID(anchorSelector, recipientRelationship, recipientSelector)
{
	const validRelationships = new Set(["p", "s", "c", "ns", "ps"]);
	if(!(typeof recipientRelationship === "string" && validRelationships.has(recipientRelationship)))
	{
		showMessageError("recipientRelationship needs to be 1, 2, or 3");
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
				recipient.className = "statusOk";
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
			if(elem.tagName === "A" || elem.tagName === "SPAN" && getTextLength(elem) === 0)
				elem.remove();
			else
				elem.className = "statusWarning";
		}
		else
		{
			numRecipientsNotFound++;
			elem.className = "statusError";
		}
	}

	showMessageBig(`${numElementsWithIDs}/${elems.length} selected elements have IDs, ${numIDsMoved} IDs moved, ${numRecipientsNotFound} recipients not found`);
}

function cleanReferenceText(str)
{
	if(/[0-9]/.test(str))
		return str.replace(/[^0-9]+/g, "");
	return str;
}

export function createReferencesByTags()
{
	let numASup = 0;
	let numSupA = 0;
	let numFootnoteA = 0;

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
				wrapElement(link, "reference");
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
					replaceElement(sups[i], "reference");
				}
				else
				{
					replaceElementKeepingId(sups[i], "reference");
				}
				numSupA++;
			}
		}
	}

	if(document.querySelector("footnote a"))
	{
		const footnoteLinks = document.querySelectorAll("footnote a:first-child");
		for(let i = 0, ii = footnoteLinks.length; i < ii; i++)
		{
			if(looksLikeReference(footnoteLinks[i].textContent))
			{
				footnoteLinks[i].textContent = cleanReferenceText(footnoteLinks[i].textContent);
				wrapElement(footnoteLinks[i], "reference");
				numFootnoteA++;
			}
		}
	}

	unwrapAll("reference sup");
	unwrapAll("reference small");
	unwrapAll("reference span");
	unwrapAll("reference reference");

	showMessageBig(`${numASup} a > sup, ${numSupA} sup > a, ${numFootnoteA} footnote > a references created`);
}
