import { createUniqueID } from "./misc";
import { logSuccess, logError } from "./log";

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
		for(let i = 0, ii = nonFootnoteRefs.length; i < ii; i++)
		{
			const index = (i + 1).toString();
			interlink(nonFootnoteRefs[i], footnoteRefs[i], index, "ref" + index);
		}
		logSuccess(`${nonFootnoteRefs.length} reference pairs interlinked`);
	}
	else
	{
		logError(`interlinkReferencesByIndex: ${nonFootnoteRefs.length} non-footnote refs, ${footnoteRefs.length} footnote refs; cannot interlink`);
	}
}
