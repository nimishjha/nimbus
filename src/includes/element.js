import { Nimbus } from "./Nimbus";
import { showMessageBig, showMessageError } from "./ui";
import { get } from "./selectors";
import { createBulletAnchor, makeClassSelector } from "./misc";
import { removeLineBreaks } from "./string";
import { preReplaceBrs } from "./preformatted";

export function createElement(tag, props)
{
	const elem = document.createElement(tag);
	if(props && typeof props === "object")
	{
		const keys = Object.keys(props);
		let i = keys.length;
		while(i--)
		{
			const key = keys[i];
			const value = props[key];
			setAttributeOrProperty(elem, key, value);
		}
		return elem;
	}
	return elem;
}

export function createElementWithText(tag, text)
{
	const elem = document.createElement(tag);
	elem.textContent = text;
	return elem;
}

export function createElementWithChildren(tagName, ...children)
{
	const elem = document.createElement(tagName);
	for(let i = 0, ii = children.length; i < ii; i++)
		elem.appendChild(children[i]);
	return elem;
}

export function setAttributeOrProperty(element, key, value)
{
	const settableProperties = ["id", "className", "textContent", "innerHTML", "value"];
	if(settableProperties.includes(key))
		element[key] = value;
	else
		element.setAttribute(key, value);
}

export function removeColorsFromInlineStyles()
{
	const elems = get("div");
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(elem.hasAttribute("style"))
		{
			let styleText = elem.getAttribute("style");
			styleText = styleText.replace(/background/g, "XXX").replace(/color/g, "YYY");
			elem.setAttribute("style", styleText);
		}
	}
}

export function wrapElement(elem, tagName, className)
{
	const wrapper = createElement(tagName);
	if(className) wrapper.className = className;
	const newElem = elem.cloneNode(true);
	wrapper.appendChild(newElem);
	elem.parentNode.replaceChild(wrapper, elem);
}

export function wrapElementInner(elem, tagName)
{
	const wrapper = createElement(tagName);
	const newElem = document.createElement(elem.tagName);
	if(elem.tagName === "A" && elem.href && elem.href.length)
		newElem.href = elem.href;
	while(elem.firstChild)
		wrapper.appendChild(elem.firstChild);
	elem.appendChild(wrapper);
}

export function wrapAll(selector, tagName)
{
	const elems = get(selector);
	for(let i = 0, ii = elems.length; i < ii; i++)
		wrapElement(elems[i], tagName);
}

export function wrapAllInner(selector, tagName)
{
	const elems = get(selector);
	if(!elems && elems.length) return;
	for(let i = 0, ii = elems.length; i < ii; i++)
		wrapElementInner(elems[i], tagName);
}

export function unwrapAll(selector)
{
	const elems = get(selector);
	if(elems)
	{
		const numElems = elems.length || 0;
		let numIdsLost = 0;
		for(let i = 0, ii = numElems; i < ii; i++)
		{
			const elem = elems[i];
			if(elem.id) ++numIdsLost;
			unwrapElement(elem);
		}
		if(numIdsLost)
			showMessageError(`${numElems} ${selector} unwrapped; ${numIdsLost} ids lost`);
		else
			showMessageBig(`${numElems} ${selector} unwrapped`);
	}
}

export function unwrapAllExcept(selector)
{
	const elems = get("body *");
	if(!elems) return;
	for(const elem of elems)
	{
		if(!elem.matches(selector))
			unwrapElement(elem);
	}
}

export function unwrapElement(elem)
{
	const frag = document.createDocumentFragment();
	while(elem.firstChild)
		frag.appendChild(elem.firstChild);
	elem.parentNode.replaceChild(frag, elem);
}

export function convertToFragment(elem)
{
	const frag = document.createDocumentFragment();
	while(elem.firstChild)
		frag.appendChild(elem.firstChild);
	return frag;
}

export function copyAttribute(selector, sourceAttribute, targetAttribute)
{
	const elems = get(selector);
	if(!elems) return;
	let count = 0;
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const element = elems[i];
		const sourceAttributeValue = element[sourceAttribute] || element.getAttribute(sourceAttribute);
		if(sourceAttributeValue)
		{
			count++;
			if(typeof sourceAttributeValue !== "string")
				console.log("sourceAttributeValue is", Object.prototype.toString.call(sourceAttributeValue));
			setAttributeOrProperty(element, targetAttribute, sourceAttributeValue);
		}
	}
	showMessageBig(`Copied attribute ${sourceAttribute} to ${targetAttribute} on ${count} ${selector}s`);
}

export function setAttributeOf(selector, attribute, value)
{
	const elems = get(selector);
	if(!elems) return;
	let i = elems.length;
	while(i--)
		elems[i].setAttribute(attribute, value);
}

export function removeAttributeOf(selector, attribute)
{
	const elems = get(selector);
	if(!elems) return;
	let i = elems.length;
	while(i--)
		elems[i].removeAttribute(attribute);
}

export function removeAllAttributesOfType(type)
{
	removeAttributeOf("body *", type);
}

export function removeAllAttributesOfTypes(attrNames)
{
	for(const attrName of attrNames)
		removeAllAttributesOfType(attrName);
}

export function getAttributes(elem)
{
	const attributes = [];
	const attrs = elem.attributes;
	for(let i = 0, ii = attrs.length; i < ii; i++)
	{
		const attr = attrs[i];
		if(attr)
		{
			attributes.push({
				name: attr.name,
				value: attr.value
			});
		}
	}
	return attributes;
}

export function saveIdsToElement(element, ids)
{
	if(ids.length === 1 && !element.id)
	{
		element.id = ids[0];
	}
	else
	{
		for(let j = 0, jj = ids.length; j < jj; j++)
			element.appendChild(createBulletAnchor(ids[j]));
	}
}

export function removeAllAttributesOf(elem)
{
	const attrs = elem.attributes;
	let i = attrs.length;
	while(i--)
	{
		const attr = attrs[i];
		if(attr)
			elem.removeAttribute(attr.name);
	}
}

export function removeAllAttributesExcept(selectorOrElement, attrToKeep)
{
	const attrToKeepLower = attrToKeep.toLowerCase();
	const elems = typeof selectorOrElement === "string" ? get(selectorOrElement) : [selectorOrElement];
	for(const elem of elems)
	{
		const attrs = elem.attributes;
		let i = attrs.length;
		while(i--)
		{
			const attr = attrs[i];
			if(attr && attr.name.toLowerCase() !== attrToKeepLower)
				elem.removeAttribute(attr.name);
		}
	}
}

//	Takes an element, an integer depth, and a tagName, and wraps that element in that many levels of <tagName>
export function wrapElementInLayers(elem, depth, tag)
{
	const parent = elem.parentNode;
	if(!parent) throw new Error("element has no parent");
	if(depth < 1) throw new Error("depth must be 1 or greater");
	const tagName = tag || "blockquote";
	let wrapper, deepestChild;
	wrapper = deepestChild = document.createElement(tagName);
	for(let i = 1; i < depth; i++)
	{
		const layer = document.createElement(tagName);
		deepestChild.appendChild(layer);
		deepestChild = layer;
	}
	deepestChild.appendChild(elem.cloneNode(true));
	parent.replaceChild(wrapper, elem);
}

export function deleteClass(className)
{
	const elems = get(makeClassSelector(className));
	let i = elems.length;
	let count = i ? i : 0;
	while(i--)
	{
		const elem = elems[i];
		elem.classList.remove(className);
		if(elem.className === "")
			elem.removeAttribute("class");
	}
	return count;
}

export function makeElementPlainText(elem)
{
	const tagName = elem.tagName.toLowerCase();
	switch(tagName)
	{
		case "a":
			if(!elem.getElementsByTagName("img").length)
				elem.textContent = removeLineBreaks(elem.textContent);
			break;
		case "pre":
			elem.textContent = elem.textContent.trim();
			break;
		default:
			elem.textContent = removeLineBreaks(elem.textContent);
			break;
	}
}

export function getAlphanumericTextLength(elem)
{
	if(!elem.textContent)
		return 0;
	return elem.textContent.replace(/[^a-zA-Z0-9]+/g, "").length;
}

export function emptyElement(elem) { if(elem) elem.textContent = ''; }

export function createSelector(elem)
{
	let s = elem.tagName ? elem.tagName.toLowerCase() : "";
	if(elem.id)
		s += "#" + elem.id + " ";
	if(elem.className && elem.className !== Nimbus.markerClass)
		s += createClassSelector(elem);
	if(elem.name)
		s += " name: " + elem.name;
	return s;
}

export function createClassSelector(elem)
{
	if(elem.className && elem.className !== Nimbus.markerClass)
		return "." + Array.from(elem.classList).join('.').replace(makeClassSelector(Nimbus.markerClass), "");
	return "";
}

export function toggleClass(element, className)
{
	const classList = element.classList;
	if(classList.contains(className))
		classList.remove(className);
	else
		classList.add(className);
}

export function cycleClass(elem, arrClasses)
{
	let found = false;
	for(let i = 0, ii = arrClasses.length; i < ii; i++)
	{
		const currClass = arrClasses[i];
		if(elem.classList.contains(currClass))
		{
			elem.classList.remove(currClass);
			const nextIndex = i < ii - 1 ? i + 1 : 0;
			const nextClass = arrClasses[nextIndex];
			elem.classList.add(nextClass);
			showMessageBig(nextClass);
			found = true;
			break;
		}
	}
	if(!found)
	{
		const nextClass = arrClasses[0];
		elem.classList.add(nextClass);
		showMessageBig(nextClass);
	}
}

export function getElemPropSafe(elem, prop)
{
	if(!elem)
		return null;
	if(elem[prop])
		return elem[prop];
	if(elem.hasAttribute(prop))
		return elem.getAttribute(prop);
	return null;
}

export function makePlainText(selector)
{
	const elements = get(selector);
	if(!elements) return;
	if(selector === "pre") preReplaceBrs();
	for(let i = 0, ii = elements.length; i < ii; i++)
		makeElementPlainText(elements[i]);
}

//	Takes a source element and a tagName, and returns an element of type tagName
//	with the source element's properties mapped across to the new element as specified
//	in the propertyMapping parameter.
export function createReplacementElement(tagName, sourceElement, propertyMapping)
{
	const elem = document.createElement(tagName);
	const keys = Object.keys(propertyMapping);
	let i = keys.length;
	while(i--)
	{
		const key = keys[i];
		const sourceProp = propertyMapping[key];
		const value = sourceElement[sourceProp] || sourceElement.getAttribute(sourceProp);
		if(value)
			setAttributeOrProperty(elem, key, value);
	}
	return elem;
}
