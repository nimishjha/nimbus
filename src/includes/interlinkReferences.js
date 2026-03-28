import { createUniqueID } from "./misc";
import { logSuccess, logError } from "./log";

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
			{
				prefix += "_";
				charCode = 97;
			}
		}
		else
			return prefixToTest;
	}
	return false;
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
