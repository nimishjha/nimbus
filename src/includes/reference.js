import { Nimbus } from "./Nimbus";
import { createLinksByHrefLookup } from "./link";
import { get } from "./selectors";
import { wrapElement, unwrapElement, unwrapAll } from "./element";
import { isEmptyElement } from "./elementAndNodeTests";
import { replaceElementKeepingId } from "./replaceElements";
import { showMessageBig } from "./ui";

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
			console.log(`Did not find any references in section ${sectionIndex}`, "background: #444; color: #aaa;");
			continue;
		}
		if(!footnoteRefs)
		{
			console.log(`Did not find any references inside footnotes in section ${sectionIndex}`, "background: #444; color: #aaa;");
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
				console.log(`%cSection ${sectionIndex}: ${allRefs.length} total refs, ${footnoteRefs.length} footnote refs, ${nonFootnoteRefs.length} non-footnote refs`, "background: #030; color: #0b0;");

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
				console.log(`%cSection ${sectionIndex}: lengths mismatch - ${footnoteRefs.length} footnote refs, ${nonFootnoteRefs.length} non-footnote refs`, "background: #420; color: #c90;");
				section.className = Nimbus.markerClass;
			}
		}
	}
}

export function moveID(anchorSelector, recipientRelationship, recipientSelector)
{
	const RELATIONSHIP = {
		PARENT: 1,
		SIBLING: 2,
		CHILD: 3
	};
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
		return next && next.matches(recipientSelector) ? next : null;
	}

	let getRecipient;
	switch(recipientRelationship)
	{
		case RELATIONSHIP.PARENT: getRecipient = getParent; break;
		case RELATIONSHIP.SIBLING: getRecipient = getSibling; break;
		case RELATIONSHIP.CHILD: getRecipient = getChild; break;
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
			if(isEmptyElement(elem))
				elem.remove();
			else if(recipientRelationship !== RELATIONSHIP.CHILD)
				unwrapElement(elem);
			else
				elem.removeAttribute("id");
		}
		else
		{
			numRecipientsNotFound++;
			elem.className = "statusError";
		}
	}

	showMessageBig(`${numElementsWithIDs}/${elems.length} selected elements have IDs, ${numIDsMoved} IDs moved, ${numRecipientsNotFound} recipients not found`);
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
			if(link.getElementsByTagName("sup").length && /^\d+$/.test(linkText))
			{
				link.textContent = linkText;
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
			if(sups[i].getElementsByTagName("a").length && /^\d+$/.test(sups[i].textContent.trim()))
			{
				replaceElementKeepingId(sups[i], "reference");
				numSupA++;
			}
		}
	}

	if(document.querySelector("footnote a"))
	{
		const footnoteLinks = document.querySelectorAll("footnote a:first-child");
		for(let i = 0, ii = footnoteLinks.length; i < ii; i++)
		{
			if(/^\d+$/.test(footnoteLinks[i].textContent.replaceAll(".", "").trim()))
			{
				wrapElement(footnoteLinks[i], "reference");
				numFootnoteA++;
			}
		}
	}

	unwrapAll("reference sup");
	unwrapAll("reference small");
	unwrapAll("reference span");

	showMessageBig(`${numASup} a > sup, ${numSupA} sup > a, ${numFootnoteA} footnote > a references created`);
}
