import { Nimbus } from "./Nimbus";
import { showMessageBig, showMessageError } from "./ui";
import { selectByClassOrIdContaining, selectByTagNameMatching, getNodeContainingSelection } from "./selectors";
import { getMarkedElements } from "./mark";
import { get } from "./selectors";
import { makeClassSelector } from "./misc";
import { getAlphanumericTextLength, createElement, createClassSelector } from "./element";
import { xlog, showLog } from "./log";
import { callFunctionWithArgs } from "./command";
import { BLOCK_ELEMENTS, INLINE_ELEMENTS } from "./constants";

export function replaceElementsByTagNameMatching(text, tagName)
{
	const newTagName = tagName || "blockquote";
	const elems = selectByTagNameMatching(text);
	for(let i = 0, ii = elems.length; i < ii; i++)
		replaceElement(elems[i], newTagName);
}

export function replaceElementsBySelectorHelper()
{
	if(getMarkedElements().length)
		callFunctionWithArgs("Replace elements by selector", replaceElementsBySelector, 2, makeClassSelector(Nimbus.markerClass) + " ");
	else
		callFunctionWithArgs("Replace elements by selector", replaceElementsBySelector, 2);
}

export function replaceElementsBySelector(selector, tagName)
{
	const toReplace = get(selector);
	if(!toReplace) return;
	if(toReplace.length)
	{
		showMessageBig(`Replacing ${toReplace.length} ${selector} with ${tagName}`);
		let deletedTextLength = 0;
		let i = toReplace.length;
		if(tagName === "hr" && toReplace[0].tagName !== "RT")
		{
			while(i--)
			{
				const elem = toReplace[i];
				const textLength = getAlphanumericTextLength(elem);
				if(textLength !== 0)
				{
					deletedTextLength += textLength;
					xlog(elem.textContent);
				}
				elem.parentNode.replaceChild(createElement(tagName), elem);
			}
			if(deletedTextLength)
			{
				showMessageError(`${deletedTextLength} characters of text were lost`);
				setTimeout(showLog, 100);
			}
		}
		else
		{
			while(i--)
			{
				replaceElementKeepingId(toReplace[i], tagName);
			}
		}
	}
	else if(toReplace && toReplace.parentNode)
	{
		showMessageBig("Replacing one " + selector);
		replaceElementKeepingId(toReplace, tagName);
	}
}

export function convertElement(elem, tagName)
{
	const replacement = document.createElement(tagName);
	const temp = elem.cloneNode(true);
	while(temp.firstChild)
		replacement.appendChild(temp.firstChild);
	if(elem.id)
		replacement.id = elem.id;
	return replacement;
}

export function cloneElement(elem) { return convertElement(elem, elem.tagName); }

export function replaceElement(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	elem.parentNode.replaceChild(replacement, elem);
}

export function replaceElementKeepingId(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	const elemId = elem.id;
	if(elemId)
		replacement.id = elemId;
	elem.parentNode.replaceChild(replacement, elem);
}

export function replaceElementsOfMarkedTypeWith(tagName)
{
	const marked = getMarkedElements();
	if(marked.length !== 1)
	{
		showMessageBig(`Expected 1 marked element; found ${marked.length}`);
		return;
	}
	if(!tagName)
	{
		showMessageBig('tagName is required');
		return;
	}
	const elem = marked[0];
	const classSelector = createClassSelector(elem);
	if(classSelector.length)
	{
		const selector = elem.tagName + classSelector;
		replaceElementsBySelector(selector, tagName);
	}
	else
	{
		showMessageBig("Selected node has no classes");
	}
}

export function replaceElements(toReplace, tagName)
{
	let i = toReplace.length;
	while(i--)
		replaceElement(toReplace[i], tagName);
}

export function replaceMarkedElements(tagName)
{
	const toReplace = getMarkedElements();
	let i = toReplace.length;
	while(i--)
		replaceElement(toReplace[i], tagName);
}

export function replaceByClassOrIdContaining(str, tagName)
{
	const toReplace = selectByClassOrIdContaining(str);
	showMessageBig(`Replacing ${toReplace.length} elements`);
	for(let i = 0, ii = toReplace.length; i < ii; i++)
		replaceElementKeepingId(toReplace[i], tagName);
}

export function replaceNonStandardElements()
{
	const elems = get("body *");
	if(!elems) return;
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(!elem.tagName)
			continue;
		if(!BLOCK_ELEMENTS[elem.tagName] && !INLINE_ELEMENTS[elem.tagName])
		{
			const replacement = convertElement(elem, "div");
			replacement.className = elem.tagName;
			if(elem.parentNode)
				elem.parentNode.replaceChild(replacement, elem);
		}
	}
}

export function replaceTables() { replaceElementsBySelector("table, tbody, tr, td, th, thead", "div"); }

export function replaceMarkedWithTextElement(tagName, text)
{
	const elems = getMarkedElements();
	if(!elems) return;
	if(tagName === "text")
	{
		for(const elem of elems)
		{
			elem.parentNode.replaceChild(document.createTextNode(text), elem);
		}
	}
	else
	{
		for(const elem of elems)
		{
			const replacement = document.createElement(tagName);
			replacement.textContent = text;
			elem.parentNode.replaceChild(replacement, elem);
		}
	}
}

//	If the user has selected some text, this function takes that selection's first block parent,
//	and replaces that element with an element of type tagName.
export function replaceSelectedElement(tagName)
{
	const node = getNodeContainingSelection();
	if(node)
	{
		const replacementTag = tagName ? tagName : Nimbus.replacementTagName1;
		replaceElementKeepingId(node, replacementTag);
	}
}

export function convertDivsToParagraphs()
{
	const elems = get("div");
	if(!elems) return;
	for(const elem of elems)
	{
		if(elem.querySelector("div") === null)
		{
			const fc = elem.firstChild;
			if(!fc) continue;
			if(fc.nodeType === 3 || INLINE_ELEMENTS[fc.tagName])
				replaceElementKeepingId(elem, "p");
		}
	}
}
