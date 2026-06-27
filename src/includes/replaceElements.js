import { Nimbus } from "./Nimbus";
import { showMessageBig, showMessageError } from "./ui";
import { selectByClassOrIdContaining, selectByTagNameMatching, getNodeContainingSelection, getOneMarked, selectByIDContaining, selectByTagNameAndClassMatchingRegex } from "./selectors";
import { getMarkedElements, unmarkAll } from "./mark";
import { get } from "./selectors";
import { makeClassSelector } from "./misc";
import { getAlphanumericTextLength, createElement, createClassSelector } from "./element";
import { callFunctionWithArgs } from "./command";

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

export function replaceElementsBySelectorSimple(selector, tagName)
{
	const elems = document.querySelectorAll(selector);
	for(const elem of elems)
		replaceElement(elem, tagName);
}

export function replaceElementsBySelector(selector, tagName)
{
	const toReplace = get(selector);
	if(!toReplace) return;
	let i = toReplace.length;
	if(tagName === "hr" && toReplace[0].tagName !== "RT" && toReplace[0].tagName !== "FIGURE")
	{
		let numNonEmptyElements = 0;
		while(i--)
		{
			const elem = toReplace[i];
			const textLength = getAlphanumericTextLength(elem);
			if(textLength === 0)
				elem.replaceWith(createElement(tagName));
			else
			{
				numNonEmptyElements++;
				elem.insertAdjacentElement("beforebegin", createElement(tagName));
				elem.className = "statusError";
			}
		}
		if(numNonEmptyElements)
		{
			showMessageError(`${numNonEmptyElements} non-empty elements would have been replaced`);
			const elem = document.querySelector(".statusError");
			elem.scrollIntoView();
		}
	}
	else
	{
		while(i--)
			replaceElementKeepingId(toReplace[i], tagName);
	}
}

export function replaceElementsWithIDContaining(str, tagName)
{
	const elems = selectByIDContaining(str);
	for(const elem of elems)
		replaceElement(elem, tagName);
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

export function replaceElement(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	elem.replaceWith(replacement);
}

export function replaceElementKeepingId(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	if(elem.id)
		replacement.id = elem.id;
	elem.replaceWith(replacement);
}

export function replaceElementKeepingIdAndClass(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	if(elem.id)
		replacement.id = elem.id;
	if(elem.className)
		replacement.className = elem.className;
	elem.replaceWith(replacement);
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
		if(!( Nimbus.BLOCK_TAGS_SET.has(elem.tagName) || Nimbus.INLINE_TAGS_SET.has(elem.tagName) ))
		{
			const replacement = convertElement(elem, "div");
			replacement.className = elem.tagName;
			if(elem.parentNode)
				elem.replaceWith(replacement);
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
			elem.replaceWith(document.createTextNode(text));
	}
	else
	{
		for(const elem of elems)
		{
			if(text.includes("|"))
			{
				const splat = text.split("|");
				const wrapper = document.createElement("hgroup");
				for(const str of splat)
				{
					const replacement = document.createElement(tagName);
					replacement.textContent = str;
					wrapper.appendChild(replacement);
				}
				elem.replaceWith(wrapper);
			}
			else
			{
				const replacement = document.createElement(tagName);
				replacement.textContent = text;
				elem.replaceWith(replacement);
			}
		}
	}
}

export function replaceMarkedWithString(str)
{
	replaceMarkedWithTextElement("kbd", str);
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
	if(elems)
	{
		for(const elem of elems)
		{
			if(elem.querySelector("div") === null)
			{
				const fc = elem.firstChild;
				if(!fc) continue;
				if(fc.nodeType === Node.TEXT_NODE || Nimbus.INLINE_TAGS_SET.has(fc.tagName))
					replaceElementKeepingIdAndClass(elem, "p");
			}
		}
	}
}


export function setReplacementTag1(tagName) { Nimbus.replacementTagName1 = tagName; }
export function setReplacementTag2(tagName) { Nimbus.replacementTagName2 = tagName; }
export function setItalicTag(tagName) { Nimbus.italicTag = tagName; }

export function replaceFirstLevelChildrenWith(tagName)
{
	if(document.querySelector(".markd"))
	{
		const elems = document.querySelectorAll(".markd > *");
		for(const elem of elems)
			if(!Nimbus.HEADING_TAGS_SET.has(elem.tagName))
				replaceElementKeepingId(elem, tagName);
		unmarkAll();
	}
	else
	{
		showMessageError("%cexpected one marked element, found none", "color: #a00; background: #400");
	}
}

export function replaceWithSpaces(selector)
{
	const elems = get(selector);
	for(let i = 0; i < elems.length; i++)
		elems[i].replaceWith(" ");
	showMessageBig(`${elems.length} ${selector} replaced`);
}

export function replaceInMarkedBySelector(selector, tagName)
{
	if(getOneMarked())
	{
		const markClass = makeClassSelector(Nimbus.markerClass);
		if(selector.includes(","))
		{
			const splat = selector.split(",");
			const arr = [];
			for(let i = 0; i < splat.length; i++)
				arr.push(markClass + " " + splat[i]);
			replaceElementsBySelector(arr.join(", "), tagName);
		}
		else
		{
			replaceElementsBySelector(".markd " + selector, tagName);
		}
	}
	else
	{
		showMessageError("Expected at least one marked element, found none");
	}
}

export function replaceByTagNameAndClassMatchingRegex(tagName, regex, newTagName)
{
	const elems = selectByTagNameAndClassMatchingRegex("p", /chap.*open/i);
	for(const elem of elems)
		replaceElementKeepingId(elem, newTagName);
}
