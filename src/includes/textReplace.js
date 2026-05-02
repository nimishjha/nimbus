import { showMessageBig } from "./ui";
import { getTextNodesUnderSelector } from "./xpath";

export function createRegexFromString(str, isGlobal, isCaseInsensitive)
{
	const g = isGlobal ? "g" : "";
	const ci = isCaseInsensitive ? "i" : "";
	return new RegExp(str, g + ci);
}

export function replaceInTextNodesUnder(selector, searchString, replacementString)
{
	const textNodes = selector.startsWith(".") ? getTextNodesUnderSelector(null, selector.slice(1)) : getTextNodesUnderSelector(selector);
	let replCount = 0;
	for(const textNode of textNodes)
	{
		if(textNode.data.includes(searchString))
		{
			replCount++;
			textNode.data = textNode.data.replaceAll(searchString, replacementString);
		}
	}
	if(replCount)
		showMessageBig(`${replCount} occurrences of "${searchString}" replaced with "${replacementString}"`);
}

export function replaceInTextNodesRegex(selector, regex, replacement)
{
	const textNodes = selector.startsWith(".") ? getTextNodesUnderSelector(null, selector.slice(1)) : getTextNodesUnderSelector(selector);
	let replCount = 0;
	for(const textNode of textNodes)
	{
		if(regex.test(textNode.data))
		{
			replCount++;
			textNode.data = textNode.data.replace(regex, replacement);
		}
	}
	if(replCount)
		showMessageBig(`${replCount} occurrences of "${regex}" replaced with "${replacement}"`);
}

export function replaceInTextNodes(searchString, replacementString)
{
	replaceInTextNodesUnder("body", searchString, replacementString)
}

export function replaceInTextNodesRegexFromString(selector, str, replacement, g, ci)
{
	replaceInTextNodesRegex(selector, createRegexFromString(str, g, ci), replacement);
}
