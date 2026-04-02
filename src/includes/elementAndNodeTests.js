import { BLOCK_TAGS_SET, INLINE_TAGS_SET, REGEXES_GLOBAL } from "./constants";
import { getTextLength } from "./node";

export function hasClassesContaining(element, arrStr)
{
	const classes = element.className.toLowerCase().replace(/[^a-z\-]+/g, "");
	let i = arrStr.length;
	while(i--)
	{
		const str = arrStr[i].toLowerCase();
		if(~classes.indexOf(str))
			return true;
	}
	return false;
}

export function hasClassesStartingWith(element, arrStr)
{
	const classes = element.className.toLowerCase();
	let i = arrStr.length;
	while(i--)
	{
		const str = arrStr[i].toLowerCase();
		if(classes.indexOf(str) === 0 || classes.indexOf(" " + str) !== -1)
			return true;
	}
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
		if(child.nodeType === 3 && child.data.replace(REGEXES_GLOBAL.SPACES, "").length > 0) return true;
	return false;
}

export function containsOnlyPlainText(node)
{
	return node.children.length === 0;
}

export function isBlockElement(node)
{
	if(node.nodeType !== 1) return false;
	if(INLINE_TAGS_SET.has(node.tagName)) return false;
	return true;
}

export function isEmptyTextNode(node)
{
	return node.data.replace(/\s+/g, "").length === 0;
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

export function hasAdjacentBlockElement(elem)
{
	for(const prop of ["previousSibling", "nextSibling"])
	{
		let node = elem[prop];
		if(node)
		{
			if(node.nodeType === Node.ELEMENT_NODE)
			{
				if(BLOCK_TAGS_SET.has(node.tagName)) return true;
			}
			else if(node.nodeType === Node.TEXT_NODE)
			{
				if(getTextLength(node) > 0) return false;
				node = node[prop];
				while(node)
				{
					if(node.nodeType === Node.ELEMENT_NODE)
						if(BLOCK_TAGS_SET.has(node.tagName)) return true;
					else if(node.nodeType === Node.TEXT_NODE)
						if(getTextLength(node) > 0) return false;
					node = node[prop];
				}
			}
		}
	}

	return false;
}
