import { Nimbus } from "./Nimbus";
import { createLinksByHrefLookup } from "./link";
import { get } from "./selectors";
import { unwrapElement } from "./element";
import { isEmptyElement } from "./elementAndNodeTests";

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
				for(let j = 0, jj = linksToAnchor.length; j < jj; j++)
					linksToAnchor[j].setAttribute("href", "#" + recipient.id);
				numIDsMoved++;
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

	console.log(`${numElementsWithIDs} IDs in ${elems.length} selected elements, ${numIDsMoved} IDs moved, ${numRecipientsNotFound} recipients not found`);
}
