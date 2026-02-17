import { unwrapAll, removeAttributeOf, makePlainText } from "./element";
import { get } from "./selectors";
import { replaceInlineStylesWithClasses, convertClassesToCustomElements } from "./cleanup";
import { preReplaceBrs } from "./preformatted";

export function highlightCode(shouldHighlightKeywords)
{
	removeAttributeOf("pre", "class");
	if(get("pre span[style]"))
	{
		replaceInlineStylesWithClasses();
		convertClassesToCustomElements("pre span", "x");
		unwrapAll("pre span");
		return;
	}
	if(get("pre span[class]"))
	{
		convertClassesToCustomElements("pre span", "x");
		unwrapAll("pre span");
		return;
	}
	else if(get("pre code[class]"))
	{
		convertClassesToCustomElements("pre code", "x");
		unwrapAll("pre code");
		return;
	}

	preReplaceBrs();
	makePlainText("pre");

	const preBlocks = get("pre");
	let i = preBlocks.length;
	while(i--)
	{
		const preElement = preBlocks[i];
		// delete the <pre>s that only contain line numbers
		if(preElement.textContent && !/[a-z]/.test(preElement.textContent))
		{
			preElement.remove();
			continue;
		}
	}
}
