import { Nimbus } from "./Nimbus";
import { showMessage, showMessageBig, showMessageError } from "./ui";
import { removeWhitespace } from "./string";
import { get, getOne, getNodeContainingSelection, selectBySelectorAndText, selectByTagNameAndText, selectBlockElementsContainingText, selectBySelectorAndNormalizedText, selectByClassOrIdContaining } from "./selectors";
import { getTextLength } from "./node";
import { makeClassSelector } from "./misc";
import { insertStyle, insertStyleHighlight, getAllCssRulesForElement } from "./style";
import { ylog } from "./log";
import { createSelector, createClassSelector } from "./element";
import { xPathSelect } from "./xpath";

export function markElements(elements)
{
	if(!elements)
	{
		showMessageBig("No elements found");
		return;
	}
	for(let i = 0, ii = elements.length; i < ii; i++)
		markElement(elements[i]);
	showMessageBig("Marked " + elements.length + " elements");
}

export function unmarkElements(elements)
{
	if(!elements) return;
	for(let i = 0, ii = elements.length; i < ii; i++)
		unmarkElement(elements[i]);
}

export function getMarkedElements()
{
	const markedElements = get(makeClassSelector(Nimbus.markerClass));
	return markedElements ? markedElements : [];
}

export function getFirstMarkedElement()
{
	const markedElement = getOne(makeClassSelector(Nimbus.markerClass));
	return markedElement ? markedElement : false;
}

export function forAllMarked(func)
{
	const elements = getMarkedElements();
	for(let i = 0, ii = elements.length; i < ii; i++)
		if(elements[i])
			func.call(null, elements[i]);
}

export function unmarkFromBeginningOrEnd(whichEnd = "end", n)
{
	const marked = getMarkedElements();
	if(!(marked && marked.length))
	{
		showMessageBig("No marked elements");
		return;
	}
	n = Math.max(0, Math.min(n, marked.length));
	if(whichEnd === "beginning")
	{
		for(let i = 0; i < n; i++)
			unmarkElement(marked[i]);
	}
	else
	{
		for(let i = 1; i < n + 1; i++)
			unmarkElement(marked[marked.length - i]);
	}
}

export function unmarkFromBeginning(n)
{
	unmarkFromBeginningOrEnd("beginning", n);
}

export function unmarkFromEnd(n)
{
	unmarkFromBeginningOrEnd("end", n);
}

export function modifyMark(action, keepSelection)
{
	let currentElement;
	const markedElements = getMarkedElements();
	if(markedElements && markedElements.length)
	{
		if(action === "previous")
			currentElement = markedElements[0];
		else
			currentElement = markedElements[markedElements.length - 1];
	}
	else
	{
		currentElement = document.body.firstElementChild;
	}
	if(!currentElement)
	{
		showMessageError("Couldn't get marked element");
		return;
	}
	let nextElement;
	switch(action)
	{
		case "expand": nextElement = currentElement.parentNode; break;
		case "contract": nextElement = currentElement.firstElementChild; break;
		case "previous": nextElement = currentElement.previousElementSibling; break;
		case "next": nextElement = currentElement.nextElementSibling; break;
	}
	if(!nextElement || (nextElement.tagName === 'MESSAGE' || nextElement.tagName === 'BODY'))
	{
		showMessageError("Couldn't get next element");
		return;
	}
	if(!keepSelection || action === "expand" || action === "contract")
		unmarkElement(currentElement);
	markElement(nextElement);
	showMarkedElementInfo(nextElement);
}

export function markByCssRule(prop, value, selector)
{
	const sel = selector || "*";
	const val = value.toLowerCase();
	const elems = get(sel);
	if(!elems) return;
	let i = elems.length;
	let count = 0;
	while(i--)
	{
		const elem = elems[i];
		const computedStyle = getComputedStyle(elem, null);
		if(computedStyle)
		{
			const propertyValue = computedStyle.getPropertyValue(prop);
			if(propertyValue.toLowerCase() === val)
			{
				markElement(elem);
				count++;
			}
		}
	}
	if(count)
	{
		showMessageBig("Found " + count + " elements with " + prop + ": " + val);
		insertStyleHighlight();
	}
}

export function markBySelector(selector)
{
	const elems = get(selector);
	if(!elems)
	{
		showMessageError("No elements matching " + selector);
		return;
	}
	const elemsArray = Array.isArray(elems) ? elems : [elems];
	markElements(elemsArray);
}

export function markBySelectorAndText(selector, str)
{
	markElements(selectBySelectorAndText(selector, str));
}

export function markBySelectorAndRegex(selector, regexString, boolInvertSelection = false)
{
	const selected = [];
	const selectedInverse = [];
	const elements = get(selector);
	if(!elements) return;
	const regex = new RegExp(regexString);
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		if(element.textContent && regex.test(element.textContent.trim()) && !element.querySelector(selector))
			selected.push(element);
		else
			selectedInverse.push(element);
	}
	if(boolInvertSelection === true)
		markElements(selectedInverse);
	markElements(selected);
}

export function markByTagNameAndText(tagName, str)
{
	markElements(selectByTagNameAndText(tagName, str));
}

export function markElementsWithSetWidths()
{
	showMessageBig("Finding divs with pixel widths...");
	const elems = get("div");
	if(!elems) return;
	let i = elems.length, j, cssRules;
	while(i--)
	{
		const elem = elems[i];
		cssRules = getAllCssRulesForElement(elem);
		j = cssRules.length;
		while(j--)
		{
			if(/width:[^;]*px/.test(cssRules[j]))
			{
				markElement(elem);
				elem.innerHTML = "<x>#" + elem.id + " ." + elem.className + " " + getComputedStyle(elem, null).getPropertyValue("width") + "</x>" + elem.innerHTML;
				ylog(cssRules[j]);
			}
		}
	}
	insertStyle("x { background: #000; color: #FFF; padding: 2px 4px; display: block; font: 12px verdana;  } .xlog { clear: both; }", "styleMarkElementsWithSetWidths", true);
	insertStyleHighlight();
}

export function markNavigationalLists()
{
	const lists = get("ul, ol");
	if(!lists) return;
	let len = lists.length;
	let i = -1;
	while(++i < len)
	{
		const list = lists[i];
		if(removeWhitespace(list.textContent).length === 0 && list.getElementsByTagName("img").length === 0)
		{
			list.remove();
			continue;
		}
		const links = list.querySelectorAll("a");
		let j = links.length;
		let linkText = "";
		while(j--)
		{
			linkText += links[j].textContent.replace(/[^A-Za-z]+/g, "");
		}
		const listTextLength = list.textContent.replace(/[^A-Za-z]+/g, "").length;
		if(listTextLength === linkText.length)
			markElement(list);
	}
	insertStyleHighlight();
}

export function markSelectionAnchorNode()
{
	const node = getNodeContainingSelection();
	markElement(node);
	insertStyleHighlight();
	showMarkedElementInfo(node);
}

export function showMarkedElementInfo(node)
{
	const classSelector = createClassSelector(node);
	const fullSelector = createSelector(node);
	const tagName = node.tagName.toLowerCase();
	const elems = classSelector ? get(classSelector) : get(tagName);
	if(elems)
	{
		const count = elems.length;
		if(count === 1)
			showMessage(`${fullSelector}: unique`, "messageinner", true);
		else
			showMessage(`${fullSelector}: ${count} instances`, "messageinner", true);
	}
}

export function markUppercaseElements(selector)
{
	const elems = get(selector);
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		let s = elem.textContent;
		let cUpper = 0;
		let cLower = 0;
		cUpper = s.match(/[A-Z]/g);
		cLower = s.match(/[a-z]/g);
		if(cUpper && (!cLower || cUpper.length > cLower.length))
			markElement(elem);
	}
	insertStyleHighlight();
}

export function markNumericElements(selector)
{
	const elements = get(selector);
	let i = elements.length;
	while(i--)
	{
		const elem = elements[i];
		if(getTextLength(elem) === 0) continue;
		let elemText = elem.textContent.replace(/\s+/g, "");
		if(elemText && !isNaN(Number(elemText)))
			markElement(elem);
	}
	insertStyleHighlight();
}

export function unmarkAll()
{
	const marked = getMarkedElements();
	if(!marked) return;
	const count = marked.length;
	unmarkElements(marked);
	showMessageBig(`Unmarked ${count} elements`);
}

export function markElement(elem) { elem.classList.add(Nimbus.markerClass); }
export function unmarkElement(elem) { elem.classList.remove(Nimbus.markerClass); }

export function xPathMark(xpath)
{
	const elements = xPathSelect(xpath);
	if(elements.length)
		markElements(elements);
	else
		showMessageBig("No matches found");
}

export function markElementsWithSameClass()
{
	const marked = getOne(makeClassSelector(Nimbus.markerClass));
	if(!marked)
	{
		showMessageBig("Expected one marked element, found none");
		return;
	}
	marked.classList.remove(Nimbus.markerClass);
	if(marked.className === "")
	{
		showMessageBig("Marked element has no class");
		return;
	}
	const classSelector = "." + marked.className.replaceAll(" ", ".");
	markElements(get(classSelector));
}

export function setMarkerClass(str)
{
	Nimbus.markerClass = str;
}

export function markBlockElementsContainingText(text)
{
	markElements(selectBlockElementsContainingText(text));
}

export function markBySelectorAndNormalizedText(selector, str)
{
	markElements(selectBySelectorAndNormalizedText(selector, str));
}

export function markByClassOrIdContaining(str)
{
	markElements(selectByClassOrIdContaining(str));
}
