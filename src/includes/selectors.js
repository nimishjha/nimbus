import { Nimbus } from "./Nimbus";
import { showMessageBig, showMessageError } from "./ui";
import { insertStyle, insertStyleHighlight } from "./style";
import { createElement } from "./element";
import { hasDirectChildrenOfType } from "./elementAndNodeTests";
import { markElement, getMarkedElements, unmarkAll, unmarkElement } from "./mark";
import { xPathSelect, getTextNodesUnderSelector, getXpathResultAsArray } from "./xpath";
import { getTextLength } from "./node";
import { escapeForRegExp } from "./misc";
import { BLOCK_TAGS_SET } from "./constants";

export function get(selector)
{
	let nodes;
	if(selector === "h") selector = "h1, h2, h3, h4, h5, h6";
	try
	{
		nodes = document.querySelectorAll(selector);
	}
	catch(error)
	{
		showMessageError("Invalid selector: " + selector);
		return false;
	}
	if(nodes.length)
		return Array.from(nodes);
	return false;
}

export function getOne(selector)
{
	return document.querySelector(selector);
}

export function count(selector)
{
	const elems = get(selector);
	const count = elems ? elems.length : 0;
	showMessageBig(count + " elements matching " + selector);
}

export function del(arg)
{
	if(!arg)
		return;
	if(arg.nodeType)
		arg.remove();
	else if(arg.length)
		if(typeof arg === "string")
			del(get(arg));
		else
			for(let i = 0, ii = arg.length; i < ii; i++)
				del(arg[i]);
}

export function getOrCreate(tagName, id, parent)
{
	const elem = getOne("#" + id);
	if(elem)
		return elem;
	const container = parent || document.body;
	const newElem = createElement(tagName, { id: id });
	container.appendChild(newElem);
	return newElem;
}

export function selectElementsStartingWithText(selector, text)
{
	const elems = get(selector);
	if(!elems) return;
	const selected = [];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(elem.textContent && elem.textContent.trim().indexOf(text) === 0)
			selected.push(elem);
	}
	return selected;
}

export function selectElementsEndingWithText(selector, text)
{
	const elems = get(selector);
	if(!elems) return;
	const textLength = text.length;
	const selected = [];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const elemText = elem.textContent.trim();
		if(elemText && elemText.length && elemText.lastIndexOf(text) === elemText.length - textLength)
			selected.push(elem);
	}
	return selected;
}

export function selectByTagNameMatching(text)
{
	const selected = [];
	const textUpper = text.toUpperCase();
	const e = Array.from( document.body.getElementsByTagName("*") );
	for(let i = 0, ii = e.length; i < ii; i++)
	{
		const elem = e[i];
		if(!elem || !elem.nodeType)
			continue;
		const elemTagName = elem.tagName;
		if(elemTagName && ~elemTagName.indexOf(textUpper))
			selected.push(elem);
	}
	return selected;
}

export function selectByClassOrIdContaining(str)
{
	const strLower = str.toLowerCase();
	const elems = get("body *");
	if(!elems) return;
	const selected = [];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const node = elems[i];
		if(node && ~node.className.toString().toLowerCase().indexOf(strLower) || ~node.id.toString().toLowerCase().indexOf(strLower))
			selected.push(node);
	}
	return selected;
}

export function selectByChildrenWithText(params)
{
	const { parentTagName, parentClass, childTagName, text, exactMatch } = params;
	let parentClause, childClause;
	if(parentTagName)
	{
		if(parentClass)
			parentClause = `/ancestor::${parentTagName}[contains(@class, '${parentClass}')]`;
		else
			parentClause = `/ancestor::${parentTagName}`;
	}
	if(childTagName && text)
	{
		if(exactMatch)
			childClause = `//${childTagName}[text()='${text}']`;
		else
			childClause = `//${childTagName}[contains(text(), '${text}')]`;
	}
	if(!(parentClause && childClause))
	{
		showMessageError("Invalid parameters");
		return false;
	}
	return xPathSelect(childClause + parentClause);
}

export function markByChildrenHavingTheExactText(...args)
{
	let parentTagName, parentClass, childTagName, text;
	const params = { exactMatch: true };
	switch(args.length)
	{
		case 3:
			parentTagName = args[0];
			childTagName = args[1];
			text = args[2];
			break;
		case 4:
			parentTagName = args[0];
			parentClass = args[1];
			childTagName = args[2];
			text = args[3];
			break;
		default:
			showMessageError("Invalid arguments");
			return false;
	}
	let isValid = false;
	if(parentTagName && childTagName && text)
	{
		params.parentTagName = parentTagName;
		params.childTagName = childTagName;
		params.text = text;
		isValid = true;
	}
	if(parentClass)
		params.parentClass = parentClass;
	if(isValid)
	{
		const elems = selectByChildrenWithText(params);
		let i = elems.length;
		showMessageBig(`Found ${i} elements`);
		while(i--)
			markElement(elems[i]);
		insertStyleHighlight();
	}
}

//	Marks elements that have children of a given type that contain all the parent's text
export function markElementsWithChildrenSpanning(parentSelector, childSelector)
{
	const parents = get(parentSelector);
	if(!parents) return;
	let i = parents.length;
	while(i--)
	{
		const parent = parents[i];
		if(!parent.textContent)
			continue;
		const children = Array.from(parent.querySelectorAll(childSelector));
		let parentTextLength = getTextLength(parent);
		const childrenTextLength = children.reduce((acc, child) => acc + getTextLength(child), 0);
		if(parentTextLength === childrenTextLength)
			markElement(parent);
	}
}

function filterNodesByAttributeEqualTo(nodes, attribute, value)
{
	if(typeof value === "number")
		value += "";
	value = value.trim();
	let i = nodes.length;
	const result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.trim() === value)
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && node.getAttribute(attribute) === value)
				result.push(node);
		}
	}
	return result;
}

export function filterNodesByAttributeNotEqualTo(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.trim() !== value)
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && node.getAttribute(attribute) !== value)
				result.push(node);
		}
	}
	return result;
}

export function filterNodesByAttributeValueLessThan(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	while(i--)
	{
		const node = nodes[i];
		const nodeAttr = node.hasAttribute(attribute) || node[attribute];
		if(nodeAttr)
		{
			const attrValue = parseInt(nodeAttr, 10);
			if(!isNaN(attrValue) && attrValue < value)
				result.push(node);
		}
	}
	return result;
}

export function filterNodesByAttributeValueGreaterThan(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	while(i--)
	{
		const node = nodes[i];
		const nodeAttr = node.hasAttribute(attribute) || node[attribute];
		if(nodeAttr)
		{
			const attrValue = parseInt(nodeAttr, 10);
			if(!isNaN(attrValue) && attrValue > value)
				result.push(node);
		}
	}
	return result;
}

export function filterNodesByAttributeContaining(nodes, attribute, value)
{
	const valueLower = value.toLowerCase();
	let i = nodes.length;
	const result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.toLowerCase().includes(valueLower))
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && ~node.getAttribute(attribute).indexOf(value))
				result.push(node);
		}
	}
	return result;
}

export function filterNodesByAttributeNotContaining(nodes, attribute, value)
{
	const valueLower = value.toLowerCase();
	let i = nodes.length;
	const result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.toLowerCase().indexOf(valueLower) === -1)
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && node.getAttribute(attribute).indexOf(value) === -1)
				result.push(node);
		}
	}
	return result;
}

export function filterNodesByAttributeMatching(nodes, attribute, value)
{
	let i = nodes.length;
	const result = [];
	let regex = new RegExp(escapeForRegExp(value));
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(regex.test(node.textContent))
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && regex.test(node.getAttribute(attribute)))
				result.push(node);
		}
	}
	return result;
}

export function filterNodesByAttributeExistence(nodes, attribute)
{
	let i = nodes.length;
	const result = [];
	while(i--)
	{
		const node = nodes[i];
		if(node.hasAttribute(attribute))
			result.push(node);
	}
	return result;
}

export function filterNodesByAttributeNonExistence(nodes, attribute)
{
	let i = nodes.length;
	const result = [];
	while(i--)
	{
		const node = nodes[i];
		if(!node.hasAttribute(attribute))
			result.push(node);
	}
	return result;
}

export function filterNodesWithChildrenOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(node.querySelector(selector))
			result.push(node);
	}
	return result;
}

export function filterNodesWithoutChildrenOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(!node.querySelector(selector))
			result.push(node);
	}
	return result;
}

export function filterNodesWithDirectChildrenOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(hasDirectChildrenOfType(node, selector))
			result.push(node);
	}
	return result;
}

export function filterNodesWithoutDirectChildrenOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(!hasDirectChildrenOfType(node, selector))
			result.push(node);
	}
	return result;
}

export function filterNodesWithFirstChildOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const firstChild = node.firstElementChild;
		if(firstChild && firstChild === node.firstChild && firstChild.matches(selector))
			result.push(node);
	}
	return result;
}

export function filterNodesWithLastChildOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const lastChild = node.lastElementChild;
		if(lastChild && lastChild === node.lastChild && lastChild.matches(selector))
			result.push(node);
	}
	return result;
}

export function filterNodesWithoutParentOfType(nodes, tagNameOrClass)
{
	const MAX_DEPTH = 20;
	const result = [];
	let i = nodes.length;
	if(tagNameOrClass.indexOf(".") === -1)
	{
		const tagNameUpper = tagNameOrClass.toUpperCase();
		while(i--)
		{
			const node = nodes[i];
			let hasParentOfType = false;
			let depth = 0;
			let currentNode = node;
			while(currentNode.parentNode && depth < MAX_DEPTH)
			{
				depth++;
				currentNode = currentNode.parentNode;
				if(currentNode.tagName && currentNode.tagName === tagNameUpper)
				{
					hasParentOfType = true;
					break;
				}
			}
			if(!hasParentOfType)
				result.push(node);
		}
	}
	else
	{
		const classSelector = tagNameOrClass;
		while(i--)
		{
			const node = nodes[i];
			let hasParentOfType = false;
			let depth = 0;
			let currentNode = node;
			while(currentNode.parentNode && depth < MAX_DEPTH)
			{
				depth++;
				currentNode = currentNode.parentNode;
				if(currentNode.classList.includes(classSelector))
				{
					hasParentOfType = true;
					break;
				}
			}
			if(!hasParentOfType)
				result.push(node);
		}
	}
	return result;
}

export function filterNodesWithTextLengthUnder(nodes, maxLength)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(getTextLength(node) < maxLength)
			result.push(node);
	}
	return result;
}

export function filterNodesWithTextLengthOver(nodes, maxLength)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(getTextLength(node) > maxLength)
			result.push(node);
	}
	return result;
}

export function filterNodesFollowingNodesOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		// const prevSibling = node.previousSibling;
		const prevElement = node.previousElementSibling;
		// if(prevElement && prevElement === prevSibling && prevElement.matches(selector))
		if(prevElement && prevElement.matches(selector))
			result.push(node);
	}
	return result;
}

export function filterNodesPrecedingNodesOfType(nodes, selector)
{
	const result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		// const nextSibling = node.nextSibling;
		const nextElement = node.nextElementSibling;
		// if(nextElement && nextElement === nextSibling && nextElement.matches(selector))
		if(nextElement && nextElement.matches(selector))
			result.push(node);
	}
	return result;
}

export function select(...args)
{
	const selector = args[0];
	const elems = document.querySelectorAll(selector);
	if(elems && elems.length)
	{
		if(args.length === 4)
		{
			const attribute = args[1];
			const operator = args[2];
			const value = args[3];
			switch(operator)
			{
				case "equals":
				case "=":
					return filterNodesByAttributeEqualTo(elems, attribute, value);
				case "doesNotEqual":
				case "!=":
					return filterNodesByAttributeNotEqualTo(elems, attribute, value);
				case "<": return filterNodesByAttributeValueLessThan(elems, attribute, value);
				case ">": return filterNodesByAttributeValueGreaterThan(elems, attribute, value);
				case "contains": return filterNodesByAttributeContaining(elems, attribute, value);
				case "doesNotContain": return filterNodesByAttributeNotContaining(elems, attribute, value);
				case "matches": return filterNodesByAttributeMatching(elems, attribute, value);
				default: return [];
			}
		}
		else if(args.length === 3 && ["hasAttribute", "doesNotHaveAttribute", "following", "preceding"].includes(args[1]))
		{
			const operator = args[1];
			const attribute = args[2];
			switch(operator)
			{
				case "hasAttribute": return filterNodesByAttributeExistence(elems, attribute);
				case "doesNotHaveAttribute": return filterNodesByAttributeNonExistence(elems, attribute);
				case "following": return filterNodesFollowingNodesOfType(elems, attribute);
				case "preceding": return filterNodesPrecedingNodesOfType(elems, attribute);
				default: return [];
			}
		}
		else if(args.length === 3)
		{
			const operator = args[1];
			const value = args[2];
			switch(operator)
			{
				case "hasChildrenOfType": return filterNodesWithChildrenOfType(elems, value);
				case "hasDirectChildrenOfType": return filterNodesWithDirectChildrenOfType(elems, value);
				case "doesNotHaveChildrenOfType": return filterNodesWithoutChildrenOfType(elems, value);
				case "doesNotHaveDirectChildrenOfType": return filterNodesWithoutDirectChildrenOfType(elems, value);
				case "hasFirstChildOfType": return filterNodesWithFirstChildOfType(elems, value);
				case "hasLastChildOfType": return filterNodesWithLastChildOfType(elems, value);
				case "hasParentOfType": return get(value + " " + selector);
				case "doesNotHaveParentOfType": return filterNodesWithoutParentOfType(elems, value);
				case "hasTextLengthUnder": return filterNodesWithTextLengthUnder(elems, value);
				case "hasTextLengthOver": return filterNodesWithTextLengthOver(elems, value);
				default: return [];
			}
		}
	}
}

export function mark(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	let i = e.length;
	showMessageBig("Found " + i + " elements");
	while(i--)
		markElement(e[i]);
	insertStyleHighlight();
}

export function unmark(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	let i = e.length;
	showMessageBig("Found " + i + " elements");
	while(i--)
		unmarkElement(e[i]);
	insertStyleHighlight();
}

export function remove(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	showMessageBig("Removing " + e.length + " elements");
	del(e);
}

export function getNonCodeTextNodes()
{
	function filter(node)
	{
		if (node.parentElement.closest('pre, code'))
		{
			return NodeFilter.FILTER_REJECT;
		}
		return NodeFilter.FILTER_ACCEPT;
	}
	const textNodes = [];
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, filter);
	let node;
	while ((node = walker.nextNode()))
	{
		textNodes.push(node);
	}
	return textNodes;
}

export function getPreTextNodes(directDescendantsOnly, markedOnly)
{
	const selectorPre = markedOnly ? "pre[contains(@class, 'markd')]" : "pre";
	if(directDescendantsOnly) return getXpathResultAsArray(`//${selectorPre}/text()`);
	return getXpathResultAsArray(`//${selectorPre}//text()`);
}

export function getNodeContainingSelection()
{
	const selection = window.getSelection();
	if(!selection)
	{
		showMessageError("Couldn't get selection");
		return false;
	}
	return getFirstBlockParent(selection.anchorNode);
}

export function selectNodesContainingSelection()
{
	const sel = window.getSelection();
	if(!window.getSelection().toString().length) return false;
	let firstNode = getFirstBlockParent(sel.anchorNode);
	let lastNode = getFirstBlockParent(sel.focusNode);
	if(firstNode === lastNode)
	{
		showMessageBig("Selection is contained within one node, it needs to span at least two");
		return;
	}
	const result = [];
	// swap first and last nodes if the user selected text backwards
	const relativePosition = lastNode.compareDocumentPosition(firstNode);
	if(relativePosition & Node.DOCUMENT_POSITION_FOLLOWING)
	{
		const temp = firstNode;
		firstNode = lastNode;
		lastNode = temp;
	}
	result.push(firstNode);
	let sibling = firstNode.nextElementSibling;
	while(sibling)
	{
		result.push(sibling);
		if(sibling === lastNode)
			break;
		sibling = sibling.nextElementSibling;
	}
	return result;
}

//	Returns an array of elements matching a selector and also containing or not containing the specified text.
//	For links and images, it matches the text against hrefs and image sources as well.
export function selectBySelectorAndText(selector, text, boolInvertSelection = false)
{
	if(!(typeof selector === "string" && selector.length))
		return;
	if(!(typeof text === "string" && text.length))
		return get(selector);

	text = text.toLowerCase();
	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && ~element.textContent.toLowerCase().indexOf(text) && !element.querySelector(selector))
		{
			selected.push(element);
		}
		else if(element.tagName === "A")
		{
			if(element.href && ~element.href.toLowerCase().indexOf(text))
				selected.push(element);
		}
		else if(element.tagName === "IMG")
		{
			if(element.src && ~element.src.toLowerCase().indexOf(text))
				selected.push(element);
		}
		else
		{
			selectedInverse.push(element);
		}
	}
	if(boolInvertSelection === true)
		return selectedInverse;
	return selected;
}

export function selectBySelectorAndExactText(selector, text, boolInvertSelection = false)
{
	if(!(typeof selector === "string" && selector.length))
		return;
	if(!(typeof text === "string" && text.length))
		return;

	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && element.textContent.trim() === text && !element.querySelector(selector))
			selected.push(element);
		else
			selectedInverse.push(element);
	}
	if(boolInvertSelection === true)
		return selectedInverse;
	return selected;
}

export function selectBySelectorAndNormalizedText(selector, str)
{
	const elems = get(selector);
	const selected = [];
	if(!elems) return;
	for(const elem of elems)
	{
		if(elem.querySelector(selector)) continue;
		if(~elem.textContent.replace(/[^A-Za-z0-9]/g, "").toLowerCase().indexOf(str))
			selected.push(elem);
	}
	return selected;
}

export function selectBySelectorAndRegex(selector, regex, boolInvertSelection = false)
{
	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && regex.test(element.textContent.trim()) && !element.querySelector(selector))
			selected.push(element);
		else
			selectedInverse.push(element);
	}
	if(boolInvertSelection === true)
		return selectedInverse;
	return selected;
}

//	This is optimised for the case when the selector is simply a tagName, excluding "img" or "a".
export function selectByTagNameAndText(tagName, text)
{
	tagName = tagName.toUpperCase();

	if(tagName === "A" || tagName === "IMG")
		return selectBySelectorAndText(tagName, text);

	text = text.toLowerCase();
	const MAX_DEPTH = 5;
	const textNodes = getTextNodesUnderSelector("body");
	const selected = [];
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(~textNode.data.toLowerCase().indexOf(text))
		{
			let parent = textNode;
			let depth = 0;
			let found = false;
			while(parent.parentNode && ++depth < MAX_DEPTH)
			{
				parent = parent.parentNode;
				if(parent.tagName === tagName)
				{
					found = true;
					break;
				}
			}
			if(found)
				selected.push(parent);
		}
	}
	return selected;
}

export function selectBlockElementsContainingText(text)
{
	const textNodes = getTextNodesUnderSelector("body");
	const escapedString = "(\\w*" + escapeForRegExp(text) + "\\w*)";
	let regex = new RegExp(escapedString, "i");
	const selected = [];
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(regex.test(textNode.data))
		{
			const parent = getFirstBlockParent(textNode);
			if(parent)
				selected.push(parent);
		}
	}
	return selected;
}

export function selectByRelativePosition(anchorNode, beforeOrAfter)
{
	const condition = beforeOrAfter === "after" ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING;
	const nodes = get("div, aside, section, article, ol, ul, p, h1, h2, h3, h5, h6, table, img, header, footer, blockquote, pre, hr, dl, dt");
	const selected = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const relativePosition = anchorNode.compareDocumentPosition(node);
		if(relativePosition & condition && !(relativePosition & Node.DOCUMENT_POSITION_CONTAINS))
			selected.push(node);
	}
	return selected;
}

export function selectBySelectorAndRelativePosition(selector, beforeOrAfter)
{
	const marked = getMarkedElements();
	if(marked.length !== 1)
	{
		showMessageBig(`Expected 1 marked element; found ${marked.length}`);
		return false;
	}
	const anchorNode = marked[0];
	const condition = beforeOrAfter === "after" ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING;
	const nodes = get(selector);
	const selected = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const relativePosition = anchorNode.compareDocumentPosition(node);
		if(relativePosition & condition && !(relativePosition & Node.DOCUMENT_POSITION_CONTAINS))
			selected.push(node);
	}
	return selected;
}

export function selectNodesBetweenMarkers(selector)
{
	const marked = getMarkedElements();
	if(marked.length !== 2)
	{
		showMessageBig("Expected 2 marked elements, found " + marked.length);
		return;
	}
	unmarkAll();
	const nodes = get(selector);
	const selected = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const positionRelativeToFirst = marked[0].compareDocumentPosition(node);
		const positionRelativeToSecond = marked[1].compareDocumentPosition(node);
		if(
			positionRelativeToFirst & Node.DOCUMENT_POSITION_FOLLOWING &&
			positionRelativeToSecond & Node.DOCUMENT_POSITION_PRECEDING &&
			!(positionRelativeToFirst & Node.DOCUMENT_POSITION_CONTAINS) &&
			!(positionRelativeToSecond & Node.DOCUMENT_POSITION_CONTAINS)
		)
			selected.push(node);
	}
	return selected;
}

export function getFirstBlockParent(node)
{
	const elem = node.nodeType === 1 ? node : node.parentNode;
	if(BLOCK_TAGS_SET.has(elem.tagName))
		return elem;
	else
		return elem.closest(Nimbus.blockElementSelector);
}

export function getFirstTextChild(elem)
{
	let child = elem.firstChild;
	while(child && child.nodeType !== 3)
		child = child.firstChild;
	return child;
}

export const getLinkAnchors = () => Array.from(document.querySelectorAll("a[id]")).filter(link => !link.href);
export const getSpanAnchors = () => Array.from(document.querySelectorAll("span[id]")).filter(span => !getTextLength(span));
export const getLinksToId = (id) => document.querySelectorAll(`a[href="#${id}"]`);
