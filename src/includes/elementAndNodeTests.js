import { BLOCK_TAGS_SET, INLINE_TAGS_SET, REGEXES_GLOBAL } from "./constants";
import { getTextLength } from "./node";

export function getFirstElementOrNonEmptyTextNode(node, siblingType)
{
	let currentNode = node[siblingType];
	while(currentNode)
	{
		if(currentNode.nodeType === Node.ELEMENT_NODE)
			return currentNode;
		if(currentNode.nodeType === Node.TEXT_NODE && getTextLength(currentNode) > 0)
			return currentNode;
		currentNode = currentNode[siblingType];
	}
	return null;
}

function hasAdjacentElementSiblingOfType(elem, selector, previousOrNext)
{
	const sibling = getFirstElementOrNonEmptyTextNode(elem, previousOrNext);
	if(sibling)
	{
		if(sibling.nodeType === Node.TEXT_NODE)
			return false;
		return sibling.matches(selector);
	}
	return false;
}

export function hasAdjacentPrecedingElementSiblingOfType(elem, selector)
{
	return hasAdjacentElementSiblingOfType(elem, selector, "previousSibling");
}

export function hasAdjacentFollowingElementSiblingOfType(elem, selector)
{
	return hasAdjacentElementSiblingOfType(elem, selector, "nextSibling");
}

export function isBlockElement(node)
{
	if(node && node.nodeType === Node.ELEMENT_NODE)
		return BLOCK_TAGS_SET.has(node.tagName);
	return false;
}

export function hasAdjacentBlockElementPreceding(node)
{
	return isBlockElement(getFirstElementOrNonEmptyTextNode(node, "previousSibling"));
}

export function hasAdjacentBlockElementFollowing(node)
{
	return isBlockElement(getFirstElementOrNonEmptyTextNode(node, "nextSibling"));
}

export function hasAdjacentBlockElement(node)
{
	return hasAdjacentBlockElementPreceding(node) || hasAdjacentBlockElementFollowing(node);
}

export function hasClassesContaining(element, str)
{
	for(const className of element.classList)
		if(className.toLowerCase().includes(str))
			return true;
	return false;
}

export function hasClassesStartingWith(element, str)
{
	for(const className of element.classList)
		if(className.toLowerCase().startsWith(str))
			return true;
	return false;
}

export function containsPlainTextNodes(node)
{
	for(const child of node.childNodes)
		if(child.nodeType === 3) return true;
	return false;
}

export function containsNonEmptyPlainTextNodes(node)
{
	for(const child of node.childNodes)
		if(child.nodeType === Node.TEXT_NODE && child.data.replace(REGEXES_GLOBAL.SPACES, "").length > 0) return true;
	return false;
}

export function containsOnlyPlainText(node)
{
	return node.children.length === 0;
}

export function isEmptyTextNode(node)
{
	return getTextLength(node) === 0;
}

export function isEmptyElement(elem)
{
	return !(getTextLength(elem) || elem.getElementsByTagName("img").length);
}

export function hasChildrenOfType(elem, selector)
{
	return elem.querySelector(selector) === null ? false: true;
}

export function hasDirectChildrenOfType(elem, selector)
{
	const children = elem.children;
	if(!children.length) return false;
	for(let i = 0, ii = children.length; i < ii; i++)
		if(children[i].matches(selector)) return true;
	return false;
}

export function hasOnlyChildOfType(elem, selector)
{
	const children = elem.children;
	if(!children.length) return false;
	if(children.length !== 1) return false;
	if(children[0].matches(selector)) return true;
	return false;
}
