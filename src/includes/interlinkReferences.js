import { createUniqueID } from "./misc";
import { logSuccess, logError } from "./log";

export function interlinkReferencesByIndex(footnoteRefs, nonFootnoteRefs)
{
	if(nonFootnoteRefs.length === footnoteRefs.length)
	{
		for(let i = 0, ii = nonFootnoteRefs.length; i < ii; i++)
		{
			const index = i + 1;
			nonFootnoteRefs[i].textContent = footnoteRefs[i].textContent = index.toString();
			footnoteRefs[i].id = createUniqueID("r" + index.toString());
			nonFootnoteRefs[i].id = footnoteRefs[i].id + "b";
			nonFootnoteRefs[i].setAttribute("href", "#" + footnoteRefs[i].id);
			footnoteRefs[i].setAttribute("href", "#" + nonFootnoteRefs[i].id);
		}
		logSuccess(`${nonFootnoteRefs.length} reference pairs interlinked`);
	}
	else
	{
		logError(`interlinkReferencesByIndex: ${nonFootnoteRefs.length} non-footnote refs, ${footnoteRefs.length} footnote refs; cannot interlink`);
	}
}
