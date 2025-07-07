import { Nimbus } from "./Nimbus";
import { createElement, createElementWithText, unwrapElement } from "./element";
import { showMessageBig } from "./ui";
import { getFirstMarkedElement, getMarkedElements, unmarkAll } from "./mark";
import { get, getNodeContainingSelection } from "./selectors";
import { forAll, makeClassSelector } from "./misc";
import { splitByBrs, fixBullets } from "./text";
import { groupAdjacentElements } from "./groupElements";
import { removeAttributeOf, removeAllAttributesOfTypes, copyAttribute } from "./element"

export function swapElementPositions()
{
	const marked = getMarkedElements();
	if(marked.length !== 2)
	{
		showMessageBig(`Expected 2 marked elements; found ${marked.length}`);
		return false;
	}
	const c0 = document.createElement("div");
	const c1 = document.createElement("div");
	marked[0].insertAdjacentElement("beforebegin", c1);
	marked[1].insertAdjacentElement("beforebegin", c0);
	c0.appendChild(marked[0]);
	c1.appendChild(marked[1]);
	unwrapElement(c0);
	unwrapElement(c1);
	unmarkAll();
}

export function moveElementUp(position)
{
	const elem = getFirstMarkedElement();
	if(!elem)
	{
		showMessageBig("Nothing marked");
		return;
	}
	const currentParent = elem.parentNode;
	if(currentParent)
	{
		if(position === "before") currentParent.insertAdjacentElement("beforebegin", elem);
		else if(position === "after") currentParent.insertAdjacentElement("afterend", elem);
	}
}

//	Takes two or more marked elements, and appends all but the first to the first
export function makeChildOf()
{
	const marked = getMarkedElements();
	if(marked.length < 2)
	{
		showMessageBig("Expected at least 2 marked elements, found " + marked.length);
		return;
	}
	for(let i = 1, ii = marked.length; i < ii; i++)
		marked[0].appendChild(marked[i]);
	unmarkAll();
}

export function toggleContentEditable()
{
	function makeNonEditable(elem) { elem.removeAttribute("contenteditable"); }
	const selectedNode = getNodeContainingSelection();
	const MAX_TEXT_LENGTH = 10000;
	if(!selectedNode)
		return;
	if(selectedNode.textContent.length > MAX_TEXT_LENGTH)
		return;
	let isEditable = selectedNode.getAttribute("contenteditable") === "true";
	selectedNode.setAttribute("contenteditable", isEditable ? "false" : "true");
	isEditable = !isEditable;
	if(isEditable)
	{
		showMessageBig("contentEditable ON");
		selectedNode.focus();
		Nimbus.isEditing = true;
	}
	else
	{
		showMessageBig("contentEditable OFF");
		// selectedNode.removeAttribute("contentEditable");
		forAll("*[contenteditable]", makeNonEditable);
		const tagName = selectedNode.tagName;
		if(tagName !== "PRE")
		{
			if(["H1", "H2", "H3", "H4", "H5", "H6"].includes(tagName))
				splitByBrs(selectedNode, "hgroup", tagName);
			else
				splitByBrs(selectedNode);
		}
		Nimbus.isEditing = false;
	}
}

export function makeUL() { makeList("ul"); }
export function makeOL() { makeList("ol"); }

export function makeList(listTagName)
{
	const groups = groupAdjacentElements(makeClassSelector(Nimbus.markerClass), listTagName, "li");
	if(groups.length)
	{
		for(let i = 0, ii = groups.length; i < ii; i++)
		{
			const elems = groups[i].querySelectorAll("li");
			if(elems)
				fixBullets(elems);
		}
	}
}

export function insertHrBeforeAll(selector)
{
	const elems = get(selector);
	if(!elems) return;
	for(let i = 0, ii = elems.length; i < ii; i++)
		insertBefore(elems[i], document.createElement("hr"));
}

export function insertBefore(anchorElement, elementToInsert) { anchorElement.insertAdjacentElement("beforebegin", elementToInsert); }
export function insertAfter(anchorElement, elementToInsert) { anchorElement.insertAdjacentElement("afterend", elementToInsert); }
export function insertAsFirstChild(anchorElement, elementToInsert) { anchorElement.insertAdjacentElement("afterbegin", elementToInsert); }
export function insertAsLastChild(anchorElement, elementToInsert) { anchorElement.insertAdjacentElement("beforeend", elementToInsert); }

export function insertAroundAll(selector, position, elemType, textContent)
{
	const elems = get(selector);
	if(!elems) return;
	const where = position === "after" ? "afterend" : "beforebegin";
	const tagName = elemType === "text" ? "span" : elemType;
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const elemToInsert = createElementWithText(tagName, textContent);
		elem.insertAdjacentElement(where, elemToInsert);
		if(elemType === "text")
			unwrapElement(elemToInsert);
	}
}

export function insertSpacesAround(selector)
{
	const elems = get(selector);
	if(!elems) return;
	for(const elem of elems)
	{
		const next = elem.nextSibling;
		if(next && next.nodeType === 3 && /^[a-z]/.test(next.data))
			next.data = " " + next.data;
		const prev = elem.previousSibling;
		if(prev && prev.nodeType === 3 && /[a-z]$/.test(prev.data))
			prev.data = prev.data + " ";
	}
}

export function replaceClass(class1, class2)
{
	const e = document.querySelectorAll(makeClassSelector(class1));
	let i = e.length;
	while(i--)
		e[i].classList.replace(class1, class2);
}

export function mapIdsToClasses()
{
	const elems = get("*[id]");
	for(const elem of elems)
		elem.className = elem.id.replace(/[^A-Za-z]+/g, "");
}

export function replaceInClassNames(str, repl)
{
	const elems = get("*");
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(typeof elem.className === "string" && elem.className.length)
			elem.className = elem.className.replaceAll(str, repl);
	}
}

export function moveDataTestIdToClassName()
{
	removeAllAttributesOfTypes(["class", "id"]);
	copyAttribute("body *", "data-testid", "class");
	removeAttributeOf("body *", "data-testid");
}

export function duplicateMarkedElement(num)
{
	const markedElements = getMarkedElements();
	if(markedElements.length !== 1)
	{
		showMessageBig(`Expected 1 marked element; found ${markedElements.length}`);
		return;
	}
	const marked = markedElements[0];
	marked.classList.remove(Nimbus.markerClass);
	const parent = marked.parentNode;
	if(parent)
	{
		let i = num;
		while(i--)
			parent.appendChild(marked.cloneNode(true));
	}
}
