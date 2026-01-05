import { showMessageBig } from "./ui";
import { get, del, selectByClassOrIdContaining, selectBySelectorAndRegex, getNodeContainingSelection, selectBySelectorAndNormalizedText } from "./selectors";
import { getMarkedElements } from "./mark";
import { getXpathResultAsArray } from "./xpath";
import { getTextLength } from "./node";
import { markElements } from "./mark";
import { isEmptyTextNode } from "./elementAndNodeTests";
import { selectByRelativePosition, selectBySelectorAndRelativePosition, selectNodesBetweenMarkers, selectBySelectorAndText, selectBySelectorAndExactText } from "./selectors";

export function deleteMarkedElements()
{
	const markedElements = getMarkedElements();
	showMessageBig(`Deleting ${markedElements.length} elements`);
	del(markedElements);
}

export function deleteIframes()
{
	const iframes = get("iframe");
	if(iframes)
	{
		const numIframes = iframes.length;
		if(numIframes)
		{
			del("iframe");
			showMessageBig(numIframes + " iframes deleted");
		}
	}
	else
	{
		showMessageBig("No iframes found");
	}
	deleteBySelectorAndTextMatching("rp", "iframe:");
}

export function deleteImages()
{
	del(["svg", "canvas", "picture source"]);
	deleteEmptyElements("picture");
	const images = get("img");
	const imagePlaceholders = get("rt");
	if(images.length)
	{
		del(["img", "slideshow"]);
		showMessageBig("Deleted " + images.length + " images");
	}
	else if(imagePlaceholders.length)
	{
		del("rt");
		showMessageBig("Deleted " + imagePlaceholders.length + " image placeholders");
	}
	else
	{
		showMessageBig("No images found");
	}
}

export function deleteEmptyTextNodes(parentTagName)
{
	const parent = parentTagName || "body";
	const nodes = getXpathResultAsArray(`//${parent}//text()`);
	let count = 0;
	for(let i = 0, ii = nodes.length; i < ii; i++)
	{
		const node = nodes[i];
		if(isEmptyTextNode(node))
		{
			count++;
			node.remove();
		}
	}
	showMessageBig(`${count} empty text nodes removed`);
}

export function deleteEmptyElements(selector)
{
	const elems = get(selector);
	if(!elems) return;
	let count = 0;
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(elem.textContent)
		{
			if(getTextLength(elem) === 0 && !elem.getElementsByTagName("img").length && !elem.getElementsByTagName("video").length)
			{
				elem.remove();
				count++;
			}
		}
		else
		{
			if(!elem.getElementsByTagName("img").length && !elem.getElementsByTagName("video").length)
			{
				elem.remove();
				count++;
			}
		}
	}
	showMessageBig(`Deleted ${count} empty elements`);
}

export function deleteEmptyHeadings()
{
	const e = get("h1, h2, h3, h4, h5, h6");
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		if(getTextLength(elem) === 0)
			elem.remove();
	}
}

export function deleteEmptyBlockElements()
{
	del("noscript");
	const SELECTOR = "div, p, blockquote, h1, h2, h3, h4, h5, h6, li, figure, figcaption, pre, dl, dt, dd, message, annotation, quote, quoteauthor, aside, section, article, nav, ul, ol, fieldset, figure, header, footer, fieldset";
	deleteEmptyElements(SELECTOR);
}

export function delRange(m, n)
{
	const numBlockElements = get("header, footer, article, aside, section, div").length || 0;
	if(typeof n === "undefined")
		n = numBlockElements - 1;
	for(let i = m; i <= n; i++)
		del(`#i${i}`);
}

export function deleteNodesBeforeAnchorNode()
{
	deleteNodesRelativeToAnchorNode("before");
}

export function deleteNodesAfterAnchorNode()
{
	deleteNodesRelativeToAnchorNode("after");
}

export function deleteNodesRelativeToAnchorNode(beforeOrAfter = "after")
{
	const anchorNode = getNodeContainingSelection();
	if(anchorNode)
		deleteNodesByRelativePosition(anchorNode, beforeOrAfter);
}

export function deleteNodesByRelativePosition(anchorNode, beforeOrAfter)
{
	del(selectByRelativePosition(anchorNode, beforeOrAfter));
}

export function deleteNodesBySelectorAndRelativePosition(selector, beforeOrAfter)
{
	del(selectBySelectorAndRelativePosition(selector, beforeOrAfter));
}

export function deletePrecedingNodesBySelector(selector)
{
	del(selectBySelectorAndRelativePosition(selector, "before"));
}

export function deleteFollowingNodesBySelector(selector)
{
	del(selectBySelectorAndRelativePosition(selector, "after"));
}

export function markNodesBetweenMarkers(selector = "div, ol, ul, p")
{
	markElements(selectNodesBetweenMarkers(selector));
}

export function deleteNodesBetweenMarkers(selector = "div, ol, ul, p")
{
	deleteElements(selectNodesBetweenMarkers(selector));
}

export function deleteResources()
{
	del(["link", "style", "script", "message", "iframe"]);
	document.body.className = "xwrap pad100";
	document.documentElement.id = "nimbus";
}

export function deleteBySelectorAndTextMatching(selector, str)
{
	deleteBySelectorAndText(selector, str);
}

export function deleteBySelectorAndTextNotMatching(selector, str)
{
	deleteBySelectorAndText(selector, str, true);
}

export function deleteBySelectorAndText(selector, str, boolInvertSelection = false)
{
	let selected;
	if(typeof selector === "string")
	{
		if(typeof str === "string")
			selected = selectBySelectorAndText(selector, str, boolInvertSelection);
		else
			selected = get(selector);
	}
	if(selected)
		deleteElements(selected);
	else
		showMessageBig("deleteBySelectorAndText: no elements found");
}

export function deleteBySelectorAndExactText(selector, str, boolInvertSelection = false)
{
	const selected = selectBySelectorAndExactText(selector, str, boolInvertSelection);
	if(selected)
		deleteElements(selected);
	else
		showMessageBig("deleteBySelectorAndExactText: no elements found");
}

export function deleteBySelectorAndRegex(selector, regex, boolInvertSelection = false)
{
	const selected = selectBySelectorAndRegex(selector, regex, boolInvertSelection);
	if(selected)
		deleteElements(selected);
	else
		showMessageBig("deleteBySelectorAndRegex: no elements found");
}

export function deleteElements(elems)
{
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
		return;
	del(elements);
	showMessageBig(`Deleted ${elements.length} elements`);
}

export function deleteByClassOrIdContaining(str)
{
	deleteElements(selectByClassOrIdContaining(str));
}

export function deleteBySelectorAndNormalizedText(selector, str)
{
	del(selectBySelectorAndNormalizedText(selector, str));
}
