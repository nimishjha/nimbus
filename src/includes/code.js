import { unwrapAll, removeAttributeOf, makePlainText } from "./element";
import { get } from "./selectors";
import { replaceInlineStylesWithClasses, convertClassesToCustomElements } from "./cleanup";
import { replaceBrsInPres } from "./preformatted";

export function highlightCode(shouldHighlightKeywords)
{
	removeAttributeOf("pre", "class");
	replaceBrsInPres();
	if(get("pre span[style]"))
	{
		replaceInlineStylesWithClasses();
		convertClassesToCustomElements("pre span", "x");
		unwrapAll("pre span");
	}
	else if(get("pre span[class]"))
	{
		convertClassesToCustomElements("pre span", "x");
		unwrapAll("pre span");
	}
	else if(get("pre code[class]"))
	{
		convertClassesToCustomElements("pre code", "x");
		unwrapAll("pre code");
	}
}

function deletePresWithoutLetters()
{
	const pres = get("pre");
	if(pres)
	{
		for(const pre of pres)
			if(!/[a-z]/.test(pre.textContent))
				pre.remove();
	}
}
