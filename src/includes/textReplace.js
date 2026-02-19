import { showMessageBig } from "./ui";
import { getTextNodesUnderSelector } from "./xpath";

export function replaceInTextNodes(searchString, replacementString)
{
	const textNodes = getTextNodesUnderSelector("body");
	for(const textNode of textNodes)
		if(textNode.data.includes(searchString))
			textNode.data = textNode.data.replaceAll(searchString, replacementString);
}

export function replaceInTextNodesUnder(selector, searchString, replacementString)
{
	const textNodes = selector.startsWith(".") ? getTextNodesUnderSelector(null, selector.slice(1)) : getTextNodesUnderSelector(selector);
	for(const textNode of textNodes)
		if(textNode.data.includes(searchString))
			textNode.data = textNode.data.replaceAll(searchString, replacementString);
}

export function replaceInTextNodesRegex(selector, regex, replacement)
{
	const textNodes = getTextNodesUnderSelector(selector);
	let replCount = 0;
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(regex.test(textNode.data))
		{
			replCount++;
			textNode.data = textNode.data.replace(regex, replacement);
		}
	}
	if(replCount)
		showMessageBig(`${replCount} occurrences of "${regex}" replaced with "${replacement}"`);
}
