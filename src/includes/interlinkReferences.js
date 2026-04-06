import { createUniqueID } from "./misc";
import { logSuccess, logError, logWarning, logYellow } from "./log";
import { showMessageBig, showMessageError } from "./ui";
import { createLinksByHrefLookup } from "./link";
import { wrapElement } from "./element";
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

		const links = lookup["#" + primaryRefLink.id];
		if(links)
		{
			count++;
			primaryRefLink.id = prefix + index;
			primaryRefLink.textContent = index;
			interlink(primaryRefLink, links[0], primaryRefLink.textContent, primaryRefLink.id);
			if(links[0].parentNode.tagName !== REFERENCE_TAGNAME)
				wrapElement(links[0], REFERENCE_TAGNAME);

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
			logWarning("No links to #" + primaryRefLink.id);
		}
	}
	showMessageBig(`${count} reference groups interlinked`);
}
