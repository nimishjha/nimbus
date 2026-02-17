import { BLOCK_TAGS_SET } from "./constants";
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
		if(child.nodeType === 3 && child.data.replace(/\s+/g, "").length > 0) return true;
	return false;
}

export function containsOnlyPlainText(node)
{
	return node.children.length === 0;
}

export function hasAdjacentBlockElement(elem)
{
	if(!elem) return false;

	let node = elem.previousSibling;
	if(node)
	{
		if(node.nodeType === Node.ELEMENT_NODE)
			return BLOCK_TAGS_SET.has(node.tagName);

		if(node.nodeType === Node.TEXT_NODE)
		{
			if(getTextLength(node) > 0)
				return false;

			while(node = node.previousSibling)
			{
				if(node.nodeType === Node.ELEMENT_NODE)
					return BLOCK_TAGS_SET.has(node.tagName);
				if(node.nodeType === Node.TEXT_NODE && getTextLength(node) > 0)
					return false;
			}
		}
	}

	node = elem.nextSibling;
	if(node)
	{
		if(node.nodeType === Node.ELEMENT_NODE)
			return BLOCK_TAGS_SET.has(node.tagName);

		if(node.nodeType === Node.TEXT_NODE)
		{
			if(getTextLength(node) > 0)
				return false;

			while(node = node.nextSibling)
			{
				if(node.nodeType === Node.ELEMENT_NODE)
					return BLOCK_TAGS_SET.has(node.tagName);
				if(node.nodeType === Node.TEXT_NODE && getTextLength(node) > 0)
					return false;
			}
		}
	}
	return false;
}

export function isBlockElement(node)
{
	const NON_BLOCK_TAGS = {
		A: true,
		B: true,
		BIG: true,
		SMALL: true,
		STRONG: true,
		I: true,
		EM: true,
		SPAN: true,
		TIME: true,
		MARK: true,
		MARKYELLOW: true,
		MARKRED: true,
		MARKGREEN: true,
		MARKBLUE: true,
		MARKPURPLE: true,
		MARKWHITE: true,
		CODE: true,
		USER: true
	}
	if(node.nodeType !== 1) return false;
	if(NON_BLOCK_TAGS[node.tagName]) return false;
	return true;
}

export function isEmptyTextNode(node)
{
	return node.data.replace(/\s+/g, "").length === 0;
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

export function hasNumericText(elem)
{
	return /^\d+$/.test(elem.textContent.replace(/\s+/g, ""));
}

export function hasNonAlphabeticalText(elem)
{
	return !/[a-zA-Z]/.test(elem.textContent);
}

export function hasNonAlphanumericText(elem)
{
	return !/[a-zA-Z0-9]/.test(elem.textContent);
}
