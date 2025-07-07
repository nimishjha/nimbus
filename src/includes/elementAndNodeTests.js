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

export function hasAdjacentBlockElement(node)
{
	const BLOCK_ELEMENTS = BLOCK_ELEMENTS;
	const prevSib = node.previousSibling;
	const prevElemSib = node.previousElementSibling;
	const nextSib = node.nextSibling;
	const nextElemSib = node.nextElementSibling;
	if(prevSib && prevElemSib && prevSib === prevElemSib && BLOCK_ELEMENTS[prevElemSib.tagName])
		return true;
	if(nextSib && nextElemSib && nextSib === nextElemSib && BLOCK_ELEMENTS[nextElemSib.tagName])
		return true;
	return false;
}

export function isBlockElement(node)
{
	const NON_BLOCK_ELEMENTS = {
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
	if(NON_BLOCK_ELEMENTS[node.tagName]) return false;
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
