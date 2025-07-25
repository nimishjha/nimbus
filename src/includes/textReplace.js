import { showMessageBig } from "./ui";
import { getTextNodesUnderSelector } from "./xpath";

export function replaceInTextNodes(searchString, replacementString)
{
	const textNodes = getTextNodesUnderSelector("body");
	for(const textNode of textNodes)
		textNode.data = textNode.data.replaceAll(searchString, replacementString);
}

function replaceInPreTextNodes(searchString, replacementString)
{
	const textNodes = getTextNodesUnderSelector("pre");
	for(const textNode of textNodes)
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
