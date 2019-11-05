// ==UserScript==
// @id             Nimbus
// @name           Nimbus
// @version        1.0
// @namespace      nimishjha.com
// @author         Nimish Jha
// @description    Swiss Army Knife for browsing
// @include        *
// @include        file:///*
// @run-at         document-end
// @grant		none
// ==/UserScript==

//
//	Nimbus
//	Copyright (C) 2008-2019 Nimish Jha
//
//	This program is free software: you can redistribute it and/or modify
//	it under the terms of the GNU General Public License as published by
//	the Free Software Foundation, either version 3 of the License, or
//	(at your option) any later version.
//
//	This program is distributed in the hope that it will be useful,
//	but WITHOUT ANY WARRANTY; without even the implied warranty of
//	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	GNU General Public License for more details.
//
//	You should have received a copy of the GNU General Public License
//	along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

"use strict";

const Nimbus = {
	logString: "",
	messageTimeout: null,
	availableFunctions: {
		addLinksToLargerImages: addLinksToLargerImages,
		convertDivsToParagraphs: convertDivsToParagraphs,
		annotate: annotate,
		appendInfo: appendInfo,
		buildSlideshow: buildSlideshow,
		chooseDocumentHeading: chooseDocumentHeading,
		cleanupAttributes: cleanupAttributes,
		cleanupAttributes_regex: cleanupAttributes_regex,
		cleanupBlogs: cleanupBlogs,
		cleanupGeneral: cleanupGeneral,
		cleanupGeneral_light: cleanupGeneral_light,
		cleanupHead: cleanupHead,
		cleanupHeadings: cleanupHeadings,
		cleanupUnicode: cleanupUnicode,
		cleanupWikipedia: cleanupWikipedia,
		createPagerFromSelect: createPagerFromSelect,
		createTagsByClassName: createTagsByClassName,
		del: del,
		delNewlines: delNewlines,
		delRange: delRange,
		deleteElementsContainingText: deleteElementsContainingText,
		deleteEmptyElements: deleteEmptyElements,
		deleteEmptyHeadings: deleteEmptyHeadings,
		deleteIframes: deleteIframes,
		deleteImages: deleteImages,
		deleteImagesBySrcContaining: deleteImagesBySrcContaining,
		deleteImagesSmallerThan: deleteImagesSmallerThan,
		deleteNonContentElements: deleteNonContentElements,
		deleteNonContentImages: deleteNonContentImages,
		deleteSmallImages: deleteSmallImages,
		deleteSpecificEmptyElements: deleteSpecificEmptyElements,
		deselect: deselect,
		edit: toggleContentEditable,
		fillForms: fillForms,
		fixHeadings: fixHeadings,
		fixParagraphs: fixParagraphs,
		fixPres: fixPres,
		focusButton: focusButton,
		focusFormElement: focusFormElement,
		forAll: forAll,
		forceReloadCss: forceReloadCss,
		formatEbook: formatEbook,
		getAllCssRulesMatching: getAllCssRulesMatching,
		getBestImageSrc: getBestImageSrc,
		getContentByParagraphCount: getContentByParagraphCount,
		getElementsContainingText: getElementsContainingText,
		getStreamingImages: getStreamingImages,
		buildGallery: buildGallery,
		getLargeImages: getLargeImages,
		getPagerLinks: getPagerLinks,
		getSelectorsWithLightBackgrounds: getSelectorsWithLightBackgrounds,
		handleBlockEditClick: handleBlockEditClick,
		hasClassesContaining: hasClassesContaining,
		highlightAllMatches: highlightAllMatches,
		highlightAllTableCellsInRow: highlightAllTableCellsInRow,
		highlightCode: highlightCode,
		highlightLinksInPres: highlightLinksInPres,
		highlightLinksWithHrefContaining: highlightLinksWithHrefContaining,
		highlightNodesContaining: highlightNodesContaining,
		highlightSelection: highlightSelection,
		highlightSpecificNodesContaining: highlightSpecificNodesContaining,
		highlightWithinPreformattedBlocks: highlightWithinPreformattedBlocks,
		insertStyle: insertStyle,
		insertStyleHighlight: insertStyleHighlight,
		iw: setImageWidth,
		logAllClasses: logAllClasses,
		makeHeadingFromSelection: makeHeadingFromSelection,
		makeHeadings: makeHeadings,
		makeHeadingsPlainText: makeHeadingsPlainText,
		makeHeadingsByTextLength: makeHeadingsByTextLength,
		makeLinkTextPlain: makeLinkTextPlain,
		mark: mark,
		markDivDepth: markDivDepth,
		markElementsBySelector: markElementsBySelector,
		markElementsWithCssRule: markElementsWithCssRule,
		markElementsWithSetWidths: markElementsWithSetWidths,
		markNavigationalLists: markNavigationalLists,
		markOverlays: markOverlays,
		markTableRowsAndColumns: markTableRowsAndColumns,
		markUppercaseParagraphs: markUppercaseParagraphs,
		markNumericParagraphs: markNumericParagraphs,
		numberDivs: numberDivs,
		toggleMutationObserver: toggleMutationObserver,
		om: toggleMutationObserver,
		parseCode: parseCode,
		remove: remove,
		removeAccesskeys: removeAccesskeys,
		regressivelyUnenhance: regressivelyUnenhance,
		removeAttribute: removeAttribute,
		removeClassFromAll: removeClassFromAll,
		removeEventListeners: removeEventListeners,
		removeInlineStyles: removeInlineStyles,
		removeSpanTags: removeSpanTags,
		cleanupLinks: cleanupLinks,
		replaceAudio: replaceAudio,
		replaceClass: replaceClass,
		replaceCommentsWithPres: replaceCommentsWithPres,
		replaceDiacritics: replaceDiacritics,
		replaceElementsByClassesContaining: replaceElementsByClassesContaining,
		replaceElementsBySelector: replaceElementsBySelector,
		replaceEmptyParagraphsWithHr: replaceEmptyParagraphsWithHr,
		replaceFontTags: replaceFontTags,
		replaceIframes: replaceIframes,
		replaceImagesWithTextLinks: replaceImagesWithTextLinks,
		replaceMarkedElements: replaceMarkedElements,
		replaceSpansWithTextNodes: replaceSpansWithTextNodes,
		restorePres: restorePres,
		retrieve: retrieve,
		revealEmptyLinks: revealEmptyLinks,
		revealLinkHrefs: revealLinkHrefs,
		sanitizeTitle: sanitizeTitle,
		setAttribute: setAttribute,
		setDocTitle: setDocTitle,
		setImageWidth: setImageWidth,
		showDocumentStructure2: showDocumentStructure2,
		showDocumentStructure: showDocumentStructure,
		showDocumentStructureWithNames: showDocumentStructureWithNames,
		showPrintLink: showPrintLink,
		showResources: showResources,
		showTextToHTMLRatio: showTextToHTMLRatio,
		toggleBlockEditMode: toggleBlockEditMode,
		toggleContentEditable: toggleContentEditable,
		toggleShowAriaAttributes: toggleShowAriaAttributes,
		toggleShowAriaProblems: toggleShowAriaProblems,
		toggleStyleGrey: toggleStyleGrey,
		toggleStyleNegative: toggleStyleNegative,
		toggleStyleShowClasses: toggleStyleShowClasses,
		toggleStyleWhite: toggleStyleWhite,
		unhighlightAll: unhighlightAll,
		wrapAnchorNodeInTag: wrapAnchorNodeInTag,
		xlog: xlog,
		ylog: ylog,
	},
	autoCompleteInputComponent: {
		matches: [],
		currentIndex: -1,
	},
};

const KEYCODES = {
	DELETE: 46,
	ZERO: 48,
	ONE: 49,
	TWO: 50,
	THREE: 51,
	FOUR: 52,
	FIVE: 53,
	SIX: 54,
	SEVEN: 55,
	EIGHT: 56,
	NINE: 57,
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90,
	F1: 112,
	F2: 113,
	F3: 114,
	F4: 115,
	F5: 116,
	F6: 117,
	F7: 118,
	F8: 119,
	F9: 120,
	F10: 121,
	F11: 122,
	F12: 123,
	NUMPAD0: 96,
	NUMPAD1: 97,
	NUMPAD2: 98,
	NUMPAD3: 99,
	NUMPAD4: 100,
	NUMPAD5: 101,
	NUMPAD6: 102,
	NUMPAD7: 103,
	NUMPAD8: 104,
	NUMPAD9: 105,
	NUMPAD_MULTIPLY: 106,
	NUMPAD_ADD: 107,
	NUMPAD_SUBTRACT: 109,
	NUMPAD_DECIMAL_POINT: 110,
	NUMPAD_DIVIDE: 111,
	FORWARD_SLASH: 191,
	TILDE: 192,
	SPACE: 32,
	UPARROW: 38,
	DOWNARROW: 40,
	LEFTARROW: 37,
	RIGHTARROW: 39,
	TAB: 9,
	ENTER: 13,
	ESCAPE: 27,
	SQUARE_BRACKET_OPEN: 219,
	SQUARE_BRACKET_CLOSE: 221
};

function get(s)
{
	let nodes;
	if(!isNaN(s))
		s = "#i" + s;
	try
	{
		nodes = document.querySelectorAll(s);
	}
	catch(error)
	{
		showMessageError("Invalid selector: " + s);
		return null;
	}
	if(s.indexOf("#") === 0 && !~s.indexOf(" ") && !~s.indexOf("."))
		return document.querySelector(s);
	if(nodes.length)
		return Array.from(nodes);
	return false;
}

function getOne(s)
{
	return document.querySelector(s);
}

function getOrCreate(tagName, id)
{
	const elem = getOne("#" + id);
	if (elem)
		return elem;
	const newElem = createElement(tagName, { id: id });
	document.body.appendChild(newElem);
	return newElem;
}

function del(arg)
{
	if(!arg)
		return;
	if(arg.nodeType)
		arg.parentNode.removeChild(arg);
	else if(arg.length)
		if(typeof arg === "string")
			del(get(arg));
		else
			for(let i = 0, ii = arg.length; i < ii; i++)
				del(arg[i]);
}

function emptyElement(elem)
{
	if(elem)
		elem.innerHTML = '';
}

function filterNodesByAttributeEqualTo(nodes, attribute, value)
{
	let i = nodes.length;
	let result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(trim(node.textContent) === value)
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

function filterNodesByAttributeNotEqualTo(nodes, attribute, value)
{
	let i = nodes.length;
	let result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(trim(node.textContent) !== value)
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

function filterNodesByAttributeContaining(nodes, attribute, value)
{
	let i = nodes.length;
	let result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.indexOf(value) !== -1)
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && node.getAttribute(attribute).indexOf(value) !== -1)
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeNotContaining(nodes, attribute, value)
{
	let i = nodes.length;
	let result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.indexOf(value) === -1)
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

function filterNodesByAttributeMatching(nodes, attribute, value)
{
	let i = nodes.length;
	let result = [];
	let regex = new RegExp(escapeForRegExp(value));
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.textContent.match(regex))
				result.push(node);
		}
	}
	else
	{
		while(i--)
		{
			const node = nodes[i];
			if(node.hasAttribute(attribute) && node.getAttribute(attribute).match(regex))
				result.push(node);
		}
	}
	return result;
}

function filterNodesByAttributeExistence(nodes, attribute)
{
	let i = nodes.length;
	let result = [];
	while(i--)
	{
		const node = nodes[i];
		if(node.hasAttribute(attribute))
			result.push(node);
	}
	return result;
}

function filterNodesByAttributeNonExistence(nodes, attribute)
{
	let i = nodes.length;
	let result = [];
	while(i--)
	{
		const node = nodes[i];
		if(!node.hasAttribute(attribute))
			result.push(node);
	}
	return result;
}

function filterNodesWithChildrenOfType(nodes, tagName)
{
	let result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(node.getElementsByTagName(tagName).length)
			result.push(node);
	}
	return result;
}

function filterNodesWithoutChildrenOfType(nodes, tagName)
{
	let result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(!node.getElementsByTagName(tagName).length)
			result.push(node);
	}
	return result;
}

function filterNodesWithParentOfType(nodes, tagName)
{
	let result = [];
	const tagNameUpper = tagName.toUpperCase();
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		let count = 0;
		let currentNode = node;
		while(currentNode.parentNode && count < 20)
		{
			count++;
			currentNode = currentNode.parentNode;
			if(currentNode.tagName && currentNode.tagName.toUpperCase() === tagNameUpper)
			{
				result.push(node);
				break;
			}
		}
	}
	return result;
}

function filterNodesWithoutParentOfType(nodes, tagName)
{
	let result = [];
	const tagNameUpper = tagName.toUpperCase();
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		let hasParentOfType = false;
		let count = 0;
		let currentNode = node;
		while(currentNode.parentNode && count < 20)
		{
			count++;
			currentNode = currentNode.parentNode;
			if(currentNode.tagName && currentNode.tagName.toUpperCase() === tagNameUpper)
			{
				hasParentOfType = true;
				break;
			}
		}
		if(!hasParentOfType)
			result.push(node);
	}
	return result;
}

function select(...args)
{
	const selector = args[0];
	const e = document.querySelectorAll(selector);
	if(e && e.length)
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
					return filterNodesByAttributeEqualTo(e, attribute, value);
				case "doesNotEqual":
				case "!=":
					return filterNodesByAttributeNotEqualTo(e, attribute, value);
				case "contains": return filterNodesByAttributeContaining(e, attribute, value);
				case "doesNotContain": return filterNodesByAttributeNotContaining(e, attribute, value);
				case "matches": return filterNodesByAttributeMatching(e, attribute, value);
				default: return false;
			}
		}
		else if(args.length === 3 && ["exists", "doesNotExist"].includes(args[2]))
		{
			const attribute = args[1];
			const operator = args[2];
			switch(operator)
			{
				case "exists": return filterNodesByAttributeExistence(e, attribute);
				case "doesNotExist": return filterNodesByAttributeNonExistence(e, attribute);
				default: return false;
			}
		}
		else if(args.length === 3)
		{
			const operator = args[1];
			const value = args[2];
			switch(operator)
			{
				case "hasChildrenOfType": return filterNodesWithChildrenOfType(e, value);
				case "doesNotHaveChildrenOfType": return filterNodesWithoutChildrenOfType(e, value);
				case "hasParentOfType": return get(value + " " + selector);
				case "doesNotHaveParentOfType": return filterNodesWithoutParentOfType(e, value);
				default: return false;
			}
		}
	}
}

function mark(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	let i = e.length;
	showMessageBig("Found " + i + " elements");
	while(i--)
		e[i].classList.add("hl");
	insertStyleHighlight();
}

function remove(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	showMessageBig("Removing " + e.length + " elements");
	del(e);
}

function isArray(o)
{
	return Object.prototype.toString.call(o) === '[object Array]';
}

function parseObject(o, indentLevel, parent)
{
	if(typeof indentLevel === "undefined")
		indentLevel = 0;
	let i;
	let s = "", type;
	let indentString = "<dd>";
	let indentStringParent = "<dd>";
	let indentStringClose = "";
	let indentStringParentClose = "";
	for(i = 0; i < indentLevel; i++)
	{
		indentString += "<blockquote>";
		indentStringClose += "</blockquote>";
	}
	for(i = 0; i < indentLevel - 1; i++)
	{
		indentStringParent += "<blockquote>";
		indentStringParentClose += "</blockquote>";
	}
	indentStringClose += "</dd>";
	indentStringParentClose += "</dd>";
	if(parent)
		s = indentStringParent + "<h2>" + parent + "</h2>" + indentStringParentClose;

	for(const prop in o)
	{
		if(o.hasOwnProperty(prop))
		{
			type = Object.prototype.toString.call(o[prop]);
			switch(type)
			{
				case "[object Object]":
					if(indentLevel < 2)
						s += parseObject(o[prop], indentLevel + 1, prop);
					else
						s += indentString + "<em>[object Object],</em><i>too many levels</i>" + indentStringClose;
					break;
				case "[object Array]":
					s += indentString + "<em>" + prop + "</em><i>" + "[" + printArray(o[prop]) + "]</i>" + indentStringClose;
					break;
				default:
					s += indentString + "<em>" + prop + "</em><i>" + o[prop] + "</i>" + indentStringClose;
					break;
			}
		}
	}
	return s;
}

function selectRandom(arr)
{
	if(!(arr && arr.length)) return;
	return arr[Math.floor(Math.random() * arr.length)];
}

function getSelectorsWithLightBackgrounds()
{
	const THRESHOLD = 200;
	const e = Array.from(document.getElementsByTagName("*"));
	let i = e.length;
	let count = 0;
	let str = "";
	for (i = 0, count = 0; i < e.length, count < 4000; i++, count++)
	{
		const elem = e[i];
		if(!elem)
			continue;
		count++;
		const bgColor = getComputedStyle(elem).getPropertyValue("background-color");
		const rgbValues = bgColor.match(/[0-9]+/g);
		if(rgbValues)
		{
			let average = (Number(rgbValues[0]) + Number(rgbValues[1]) + Number(rgbValues[2])) / 3;
			if(average > THRESHOLD)
				str += padRight(createSelector(elem), 100) + bgColor + "\r\n";
		}
	}
	console.log(str);
}

function highlightWithinPreformattedBlocks(str)
{
	const reg = new RegExp('([^\n]*' + str + '[^\n]+)', 'gi');
	const pres = get("pre");
	let i = pres.length;
	while(i--)
		pres[i].innerHTML = pres[i].innerHTML.replace(reg, "<mark>$1</mark>");
}

function markElementsWithCssRule(prop, val)
{
	const e = document.getElementsByTagName("*");
	let i = e.length;
	let count = 0;
	while(i--)
	{
		const computedStyle = getComputedStyle(e[i], null);
		if(computedStyle)
		{
			const s = computedStyle.getPropertyValue(prop);
			if(val && val === s)
			{
				e[i].classList.add("hl");
				count++;
			}
		}
		else
		{
			ylog("computedStyle is " + computedStyle);
		}
	}
	if(count)
	{
		showMessageBig("Found " + count + " elements with " + prop + ": " + val);
		insertStyleHighlight();
	}
}

function markTableRowsAndColumns()
{
	if(get("#styleShowTables"))
	{
		del("#styleShowTables");
		return;
	}
	const tr = get("tr");
	let td, i, ii, j, jj;
	for(i = 0, ii = tr.length; i < ii; i++)
	{
		tr[i].className = "row" + i;
		td = tr[i].getElementsByTagName("td");
		for(j = 0, jj = td.length; j < jj; j++)
		{
			td[j].className = "col" + j;
		}
		td = tr[i].getElementsByTagName("th");
		for(j = 0, jj = td.length; j < jj; j++)
		{
			td[j].className = "col" + j;
		}
	}
	insertStyle("table, tr, td { box-shadow: inset 1px 1px #444, inset -1px -1px #444; }", "styleShowTables", true);
}

function containsAnyOfTheStrings(s, arrStrings)
{
	if(!s || typeof s !== "string")
		return false;
	let i = arrStrings.length;
	while(i--)
		if(~s.indexOf(arrStrings[i]))
			return true;
	return false;
}

function toggleClass(element, className)
{
	const classList = element.classList;
	if(classList.contains(className))
		classList.remove(className);
	else
		classList.add(className);
}

function cycleClass(elem, arrClasses)
{
	let i, ii, found = false;
	for(i = 0, ii = arrClasses.length; i < ii; i++)
	{
		if(elem.classList.contains(arrClasses[i]))
		{
			if(i < ii-1)
			{
				elem.classList.remove(arrClasses[i]);
				elem.classList.add(arrClasses[i + 1]);
			}
			else
			{
				elem.classList.remove(arrClasses[i]);
				elem.classList.add(arrClasses[0]);
			}
			found = true;
			break;
		}
	}
	if(!found)
	{
		elem.classList.add(arrClasses[0]);
	}
}

function createUUID()
{
	return 'nimbus-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c)
	{
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

function printArray(arr)
{
	let s = "";
	for(let i = 0, ii = arr.length; i < ii; i++)
		s += arr[i] + ", ";
	return s.substring(0, s.length - 2);
}

function printArrayTyped(arr)
{
	let s = "";
	for(let i = 0, ii = arr.length; i < ii; i++)
	{
		if(typeof arr[i] === "string")
			s += '"' + arr[i] + '", ';
		else
			s += arr[i] + ", ";
	}
	return s.substring(0, s.length - 2);
}

function getPropValueSafe(obj, propName)
{
	const propValue = obj[propName];
	if(propValue)
		return propValue;
	return null;
}

function printPropOfObjectArray(arr, propName)
{
	let i = -1;
	const len = arr.length;
	let s = "";
	while(++i < len)
		s += getPropValueSafe(arr[i], propName) + "\n";
	console.log(s);
}

function createElement(tag, props)
{
	const elem = document.createElement(tag);
	if(props && typeof props === "object")
	{
		const keys = Object.keys(props);
		let i = keys.length;
		const settableProperties = ["id", "className", "textContent", "innerHTML", "value"];
		while(i--)
		{
			const key = keys[i];
			if(settableProperties.includes(key))
				elem[key] = props[key];
			else
				elem.setAttribute(key, props[key]);
		}
		return elem;
	}
	return elem;
}

function createElementWithChildren(tagName, ...children)
{
	const elem = document.createElement(tagName);
	for(let i = 0, ii = children.length; i < ii; i++)
		elem.appendChild(children[i]);
	return elem;
}

function createReplacementElement(tagName, sourceElement, propertyMapping)
{
	const settableProperties = ["id", "className", "textContent", "innerHTML", "value"];
	const elem = document.createElement(tagName);
	const keys = Object.keys(propertyMapping);
	let i = keys.length;
	while(i--)
	{
		const prop = keys[i];
		const value = propertyMapping[prop];
		if(settableProperties.includes(prop))
			elem[prop] = sourceElement[value];
		else
			elem.setAttribute(prop, sourceElement.getAttribute(value));
	}
	return elem;
}

function showResource(str, uuid)
{
	let strSanitized = str;
	if(str.indexOf("?") !== -1)
		strSanitized = str.substr(0, str.indexOf("?"));
	const resourceLink = createElement("a", { textContent: strSanitized, href: str });
	const resourceLinkWrapper = createElement("h6", { className: "xlog", id: "link" + uuid });
	const resourceDelete = createElement("span", { innerHTML: "[Delete]" });
	resourceDelete.setAttribute("data-delete", uuid);
	document.body.addEventListener('mouseup', deleteResource, false);
	resourceLinkWrapper.appendChild(resourceDelete);
	resourceLinkWrapper.appendChild(resourceLink);
	document.body.insertBefore(resourceLinkWrapper, document.body.firstChild);
}

function deleteResource(evt)
{
	if(!["h6", "span"].includes(evt.target.parentNode.tagName.toLowerCase()))
		return;
	evt.stopPropagation();
	evt.preventDefault();
	const idToDelete = evt.target.getAttribute("data-delete");
	del("#" + idToDelete);
	del("#link" + idToDelete);
}

function showResources()
{
	if(get(".xlog").length)
	{
		del(".xlog");
		del("#styleShowResources");
		return;
	}
	let count, uuid;
	let e = get("script");
	let i = e.length;
	count = 0;
	while(i--)
	{
		const elem = e[i];
		if(elem.src)
		{
			uuid = createUUID();
			elem.id = uuid;
			showResource(elem.src, uuid);
			count++;
		}
	}
	ylog(count + " scripts", "h3", true);
	e = get("link");
	i = e.length;
	count = 0;
	while(i--)
	{
		const elem = e[i];
		if( elem.href && elem.href.indexOf("css") !== -1 || elem.type && elem.type === "text/css" )
		{
			uuid = createUUID();
			elem.id = uuid;
			showResource(elem.href, uuid);
			count++;
		}
	}
	ylog(count + " styles", "h3", true);
	const s = '.xlog { background: #000; color: #FFF; margin: 0; padding: 5px 10px; z-index: 2000000000; font: 12px verdana; text-align: left; }' +
	'.xlog a { text-decoration: none; letter-spacing: 0; font: 12px verdana; text-transform: none; color: #09F; }' +
	'.xlog a:visited { color: #059; }' +
	'.xlog a:hover { color: #FFF; } h3.xlog:nth-of-type(1) {margin-top: 50px;}';
	insertStyle(s, "styleShowResources", true);
	window.scrollTo(0, 0);
}

function toggleBlockEditMode()
{
	const db = document.body;
	if(get("#styleToggleBlockEditMode"))
	{
		del("#styleToggleBlockEditMode");
		db.removeEventListener('mouseup', handleBlockEditClick, false);
		db.classList.remove("debug");
		showMessageBig("Block edit mode off");
	}
	else
	{
		db.addEventListener('mouseup', handleBlockEditClick, false);
		db.classList.add("debug");
		const s = 'html body.debug header, html body.debug footer, html body.debug article, html body.debug aside, html body.debug section, html body.debug div { border: 2px solid #666; margin: 5px; padding: 5px; }' +
			'html body.debug header:hover, html body.debug footer:hover, html body.debug article:hover, html body.debug aside:hover, html body.debug section:hover, html body.debug div:hover { border-color: #F00; } ' +
			'html body.debug>header, html body.debug>footer, html body.debug>article, html body.debug>aside, html body.debug>section, html body.debug>div { border-width: 10px 10px 10px 20px; }';
		insertStyle(s, "styleToggleBlockEditMode", true);
		showMessageBig("Block edit mode on");
	}
}

function showDocumentStructure()
{
	if(get("#view-document-structure"))
	{
		del("#view-document-structure");
	}
	else
	{
		const s = 'header, footer, article, aside, section, div, blockquote, canvas { box-shadow: inset 1px 1px #09F, inset -1px -1px #09F; }' +
		'form, input, button, label { box-shadow: inset 1px 1px #F90, inset -1px -1px #F90; background: rgba(255, 150, 0, 0.2); }' +
		'table, tr, td { box-shadow: inset 1px 1px #00F, inset -1px -1px #00F; }' +
		'ul, ol, li, span { box-shadow: inset 1px 1px #080, inset -1px -1px #080; }' +
		'h1, h2, h3, h4, h5, h6, p { box-shadow: inset 1px 1px #F0F, inset -1px -1px #F0F; }' +
		'a, a * { background: rgba(180, 255, 0, 0.25); }' +
		'img { background: #800; padding: 2px; box-sizing: border-box; }';
		insertStyle(s, "view-document-structure", true);
	}
}

function showDocumentStructure2()
{
	if(get("#view-document-structure"))
	{
		del("#view-document-structure");
	}
	else
	{
		insertStyle("div { background: linear-gradient(135deg, black, white); } h1, h2, h3, h4, h5, h6 { background: #F00; } p { background: #09F; } ol, ul { background: #00F; } table { background: #080; }", "view-document-structure", true);
	}
}

function showDocumentStructureWithNames()
{
	if(document.body.classList.contains("showdivs"))
	{
		del("x");
		del("#showDivs");
		document.body.classList.remove("showdivs");
		return;
	}
	const e = get("table, tr, td, div, ul, aside, header, footer, article, section");
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		const elemName = createSelector(elem);
		if(elem.firstChild)
			elem.insertBefore(createElement("x", { textContent: elemName }), elem.firstChild);
		else
			elem.appendChild(createElement("x", { textContent: elemName }));
	}
	document.body.classList.add("showdivs");
	const s = 'body { padding: 100px; }' +
	'div, aside, section, header, footer, aside, ul, ol { box-shadow: inset 2px 2px #000, inset -2px -2px #000; min-height: 30px; padding: 0 10px 10px 10px; margin-top: 10px; }' +
	'div::after { content: " "; display: block; clear: both; }' +
	'x { color: #FC0; background: #000; font: 12px Verdana; padding: 5px 10px; letter-spacing: 0; display: block; margin : 0 -10px 10px -10px; }';
	insertStyle(s, 'showDivs', true);
}

function highlightAllMatches(s)
{
	if(!(s && s.length))
		return;

	const linkHrefs = [];
	let links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		linkHrefs.push(links[i].href);
	const imageSources = [];
	let images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
		imageSources.push(images[i].src);

	let ss = escapeForRegExp(s);
	let tempHTML = document.body.innerHTML;
	let r = new RegExp(ss, "gi");
	tempHTML = tempHTML.replace(r, "<mark>" + s + "</mark>");
	document.body.innerHTML = tempHTML;

	links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		links[i].href = linkHrefs[i];
	images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
		images[i].src = imageSources[i];
}

function sortSources(a, b)
{
	if(a.size > b.size) return 1;
	if(a.size < b.size) return -1;
	return 0;
}

function getBestImageSrc()
{
	const e = get("img");
	if(!e)
		return;
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		const srcset = elem.srcset || elem.getAttribute("data-srcset");
		if(srcset)
		{
			let bestSource;
			let sources = srcset.split(',');
			let sourcesArray = [];
			for(let j = 0, jj = sources.length; j < jj; j++)
			{
				const splitted = trim(sources[j]).split(' ');
				const src = splitted[0];
				const size = parseInt(splitted[1], 10);
				if(!isNaN(size))
					sourcesArray.push({ size: size, src: src });
			}
			if(sourcesArray.length > 1)
			{
				sourcesArray = sourcesArray.sort(sortSources);
				bestSource = sourcesArray[sourcesArray.length - 1].src;
				elem.src = bestSource;
				elem.removeAttribute("srcset");
				elem.removeAttribute("data-srcset");
			}
		}
	}
}

function deleteNonContentImages()
{
	deleteImagesBySrcContaining("transparent.");
	deleteImagesBySrcContaining("pixel.");
	deleteImagesBySrcContaining("spacer.");
	deleteImagesBySrcContaining("nbb.org");
	deleteImagesBySrcContaining("qm.gif");
	deleteImagesBySrcContaining("avatar");
	deleteImagesBySrcContaining("doubleclick");
	deleteImagesBySrcContaining("bookmarking");
	deleteImagesBySrcContaining("adbrite");
	deleteImagesBySrcContaining("blogger.com");
	deleteImagesBySrcContaining("style_images");
	deleteImagesBySrcContaining("smilies");
	deleteImagesBySrcContaining("smiley");
	deleteImagesBySrcContaining("badges");
	deleteImagesBySrcContaining("adriver");
	deleteImagesBySrcContaining("/ads/");
	deleteImagesBySrcContaining("/delivery/");
	deleteImagesBySrcContaining("profile_images");
	deleteImagesBySrcContaining("reputation_");
	deleteImagesBySrcContaining("statusicons");
	deleteImagesBySrcContaining("mt-static");
	deleteImagesBySrcContaining("feed.");
	deleteImagesBySrcContaining("twitter.");
	deleteImagesBySrcContaining("bluesaint");
	deleteImagesBySrcContaining("board/images");
}

function cleanupBlogs()
{
	deleteElementsContainingText("div", "Join Date:");
	deleteElementsContainingText("div", "Joined:");
	deleteElementsContainingText("div", "Location:");
	deleteElementsContainingText("div", "Posts:");
	deleteElementsContainingText("div", "Thanks:");
	deleteElementsContainingText("div", "Thanked");
	deleteElementsContainingText("table", "Users Say Thank You to");
	deleteElementsContainingText("table", "View Public Profile");
	del(["#share", "#comments_posting"]);
}

function showStatus(id, str)
{
	getOrCreate("h3", id).textContent = id + ": " + str;
}

function showMessage(s, msgClass, persist)
{
	clearTimeout(Nimbus.messageTimeout);
	let e;
	msgClass = msgClass || "";
	const strStyle = 'message { display: block; background: #111; font: 12px Verdcode, Verdana; color: #555; padding: 0 1em; height: 30px; line-height: 30px; position: fixed; bottom: 0; left: 0; width: 100%; z-index: 2000000000; text-align: left; }' +
	'message.messagebig { font: 32px "Swis721 cn bt"; color: #FFF; height: 60px; line-height: 60px; font-weight: 500; }' +
	'message.messageerror { color: #F00; background: #500; }';

	if(!get("message"))
	{
		e = createElement("message", { className: msgClass });
		document.body.insertBefore(e, document.body.firstChild);
		if(!getOne("#styleMessage"))
		{
			insertStyle(strStyle, "styleMessage", true);
		}
	}
	else
	{
		e = getOne("message");
		e.className = msgClass;
	}
	e.textContent = s;
	if(!persist)
		Nimbus.messageTimeout = setTimeout(deleteMessage, 2000);
}

function showMessageBig(s)
{
	showMessage(s, "messagebig");
}

function showMessageError(s)
{
	showMessage(s, "messagebig messageerror");
}

function deleteMessage()
{
	del("message");
	del(".xalert");
	del("#styleMessage");
}

function parseCommand(s)
{
	let args = [];
	let arg = '';
	s = trim(s.replace(/\s+/g, ' '));
	for(let i = 0, ii = s.length; i < ii; i++)
	{
		switch(s[i])
		{
			case '"':
				i++;
				while(s[i] !== '"' && i < ii)
					arg += s[i++];
				break;
			case ' ':
				args.push(arg);
				arg = '';
				break;
			default:
				arg += s[i];
		}
	}
	args.push(arg);
	return args;
}

function runCommand(s)
{
	if(typeof s === "undefined" || !s.length)
		return;
	Nimbus.lastCommand = s;
	const commandSegments = parseCommand(s);
	if (!commandSegments.length)
		return;
	const funcName = commandSegments[0];
	if(Nimbus.availableFunctions[funcName])
	{
		const args = [];
		let n;
		let i, ii;
		for (i = 1, ii = commandSegments.length; i < ii; i++)
		{
			n = parseInt(commandSegments[i], 10);
			if (isNaN(n))
				args.push(commandSegments[i]);
			else args.push(n);
		}
		showMessageBig(funcName + "(" + printArrayTyped(args) + ")");
		Nimbus.availableFunctions[funcName].apply(this, args);
	}
	else
	{
		showMessageBig(funcName + ": not found");
	}
}

function openDialog(inputHandler)
{
	if(!get("#xxdialog"))
	{
		del("#style-xxdialog");
		const dialog = createElement("div", { id: "xxdialog" });
		const dialogInput = createElement("textarea", { id: "xxdialoginput" });
		dialog.appendChild(dialogInput);
		document.body.insertBefore(dialog, document.body.firstChild);
		const s = '#xxdialog { position: fixed; margin: auto; z-index: 10000; height: 60px; top: 0; left: 0px; bottom: 0px; right: 0; background: #111; color: #FFF; border: 10px solid #000; display: block; text-transform: none; width: 800px; }' +
		'#xxdialoginput { font: 32px "swis721 cn bt"; line-height: 60px; verdana; background: #000; color: #FFF; padding: 0; border: 0; width: 100%; height: 100%; overflow: hidden; }';
		insertStyle(s, "style-xxdialog", true);
		dialogInput.focus();
		if(inputHandler)
			dialogInput.addEventListener("keydown", inputHandler, false);
		else
			dialogInput.addEventListener("keydown", defaultDialogInputHandler, false);
	}
}

function closeDialog()
{
	const command = get("#xxdialoginput").value;
	del("#xxdialog");
	del("#style-xxdialog");
	return command;
}

function defaultDialogInputHandler(evt)
{
	evt.stopPropagation();
	switch(evt.keyCode)
	{
		case KEYCODES.ESCAPE: closeDialog(); break;
	}
}

function customPrompt(message)
{
	if(!get("#xxdialog"))
	{
		del("#style-xxdialog");
		const dialog = createElement("div", { id: "xxdialog" });
		const dialogHeading = createElement("heading", { textContent: message });
		const dialogInput = createElement("textarea", { id: "xxdialoginput" });
		dialog.appendChild(dialogHeading);
		dialog.appendChild(dialogInput);
		document.body.insertBefore(dialog, document.body.firstChild);
		const s = '#xxdialog { position: fixed; margin: auto; z-index: 10000; height: 90px; top: 0; left: 0px; bottom: 0px; right: 0; background: #111; color: #FFF; border: 10px solid #000; display: block; text-transform: none; width: 60vw; }' +
		'#xxdialog heading { height: 30px; line-height: 30px; padding: 0 10px; background: #111; display: block; margin: 0; }' +
		'#xxdialoginput { font: 32px "swis721 cn bt"; line-height: 60px; verdana; background: #000; color: #FFF; padding: 0 0; margin: 0; border-width: 0 10px; border-color: #000; width: 100%; height: 60px; overflow: hidden; box-sizing: border-box; }';
		insertStyle(s, "style-xxdialog", true);
		dialogInput.focus();
		return new Promise(function(resolve, reject){
			dialogInput.addEventListener("keydown", function handleCustomPromptInput(evt){
				evt.stopPropagation();
				switch(evt.keyCode)
				{
					case KEYCODES.ESCAPE:
						evt.preventDefault();
						reject(closeCustomPrompt());
						break;
					case KEYCODES.ENTER:
						evt.preventDefault();
						resolve(closeCustomPrompt());
						break;
					case KEYCODES.UPARROW:
						evt.preventDefault();
						restoreCustomPromptHistory(evt.target);
						break;
				}
			}, false);
		});
	}
}

function restoreCustomPromptHistory(inputElement)
{
	inputElement.focus();
	if(Nimbus.lastCommand)
		setTimeout(function(){ inputElement.value = Nimbus.lastCommand; }, 0);
}

function closeCustomPrompt()
{
	const command = get("#xxdialoginput").value;
	del("#xxdialog");
	del("#style-xxdialog");
	return command;
}

function getSelectionOrUserInput(promptMessage, callback, isUnary)
{
	if(window.getSelection().toString().length)
	{
		const s = window.getSelection().toString();
		callback(s);
		return;
	}
	if(isUnary)
	{
		customPrompt(promptMessage).then(callback);
		return;
	}
	customPrompt(promptMessage).then(function(userInput) {
		if(~userInput.indexOf(" ") || ~userInput.indexOf('"'))
		{
			const args = parseCommand(userInput);
			callback.apply(null, args);
		}
		else
		{
			callback.call(null, userInput);
		}
	});
}

function callFunctionWithArgs(promptMessage, callback, numArgs)
{
	customPrompt(promptMessage).then(function(userInput) {
		const args = parseCommand(userInput);
		if(numArgs && args.length !== numArgs)
		{
			showMessageBig(numArgs + " arguments are required");
			callFunctionWithArgs(promptMessage, callback, numArgs);
			return;
		}
		callback.apply(this, args);
	});
}

function annotate()
{
	const selection = window.getSelection();
	if(!selection) return;
	let node = selection.anchorNode;
	if(node.tagName === undefined) node = node.parentNode;
	if(node && node.parentNode)
	{
		const d = createElement("ruby");
		customPrompt("Enter annotation text").then(function(result){
			d.textContent = result;
			if(d.textContent.length)
				node.parentNode.insertBefore(d, node);
		});
	}
}

function annotateElement(elem, message)
{
	const annotation = createElement("annotationinfo", { textContent: message });
	elem.insertBefore(annotation, elem.firstChild);
}

function annotateElementWarning(elem, message)
{
	const annotation = createElement("annotationwarning", { textContent: message });
	elem.insertBefore(annotation, elem.firstChild);
}

function annotateElementError(elem, message)
{
	const annotation = createElement("annotationerror", { textContent: message });
	elem.insertBefore(annotation, elem.firstChild);
}

function handleCommandInput(evt)
{
	evt.stopPropagation();
	switch(evt.keyCode)
	{
		case KEYCODES.ESCAPE: closeDialog(); break;
		case KEYCODES.ENTER: runCommand(closeDialog()); break;
	}
}

function removeNonAlpha(s)
{
	return s.replace(/[^A-Za-z]/g, '');
}

function changePage(direction)
{
	const links = get("a");
	let i = links.length;
	let matchStrings = [];
	if(direction === "prev") matchStrings = ["prev", "previous"];
	else if(direction === "next") matchStrings = ["next", "nextpage", "»"];
	while(i--)
	{
		let s = links[i].textContent;
		if(s)
		{
			s = removeWhitespace(s).toLowerCase();
			if(containsAnyOfTheStrings(s, matchStrings))
			{
				links[i].click();
				return;
			}
		}
	}
}

function getAllInlineStyles()
{
	let styleText = "";
	const styleElements = get("style");
	if(!styleElements)
		return;
	for(let j = 0, jj = styleElements.length; j < jj; j++)
	{
		const styleElement = styleElements[j];
		const rules = styleElement.sheet.cssRules;
		for(let i = 0, ii = rules.length; i < ii; i++)
			styleText += rules[i].cssText + "\n";
	}
	return styleText;
}

function getAllCssRulesForElement(elem)
{
	const sheets = document.styleSheets;
	const rulesArray = [];
	let i = sheets.length;
	while(i--)
	{
		const sheet = sheets[i];
		if(sheet.href && sheet.href.indexOf(location.hostname) === -1)
			continue;
		const rules = sheets[i].cssRules;
		if(!rules) continue;
		let j = rules.length;
		while(j--)
			if(elem.matches(rules[j].selectorText))
				rulesArray.push(rules[j].cssText);
	}
	return rulesArray;
}

function getAllCssRulesMatching(s)
{
	const sheets = document.styleSheets;
	let i = sheets.length;
	const regex = new RegExp(s);
	while(i--)
	{
		const rules = sheets[i].cssRules;
		let j = rules.length;
		while(j--)
			if(~rules[j].cssText.indexOf(s))
				ylog(rules[j].cssText.replace(regex, "<mark>" + s + "</mark>"));
	}
}

function handleStackOverflowMutations(mutations)
{
	let i = mutations.length;
	while(i--)
	{
		const mutation = mutations[i];
		if(mutation.addedNodes.length)
		{
			del("link");
			del("script");
		}
	}
}

function doStackOverflow()
{
	const sites = ["stackexchange", "stackoverflow", "superuser", "serverfault"];
	let found = false;
	if(containsAnyOfTheStrings(location.hostname, sites))
		found = true;
	// we only want to run this code on the individual question pages
	if(found && location.href.match(/questions\/[0-9]+/) !== null)
	{
		del(["#sidebar", ".signup-prompt", ".post-menu", ".user-gravatar32", "form", ".d-none", ".-flair"]);
		replaceElementsBySelector(".user-details", "h2");
		deleteElementsContainingText("h2", "Not the answer");
		retrieve("#content");
		cleanupGeneral();
		highlightCode(true);
		forAll("td", function f(x) {
			if(x.textContent && x.textContent.indexOf("up vote") !== -1)
				x.setAttribute("style", "width: 200px");
		});
		const observer = new MutationObserver(handleStackOverflowMutations);
		observer.observe(getOne("head"), { childList: true });
	}
}

function markElementsBySelector(s)
{
	if(!(s && s.length)) return;
	const e = get(s);
	if(!e)
	{
		showMessageError("No elements found for selector " + s);
		return;
	}
	if(e.length)
	{
		let i = e.length;
		while(i--)
			e[i].classList.add("hl");
		showMessageBig("Highlighted " + e.length + " elements");
	}
	else if(e)
		e.classList.add("hl");
	else
		showMessageError("No elements found for selector " + s);
	insertStyleHighlight();
}

function unmarkElement(elem)
{
	elem.classList.remove("hl");
}

function markOverlays()
{
	mark("div", "style", "contains", "z-index");
	mark("div", "class", "contains", "modal");
	mark("div", "aria-modal", "exists");
}

function unhighlightAll()
{
	const e = get(".hl");
	let i = e.length;
	while (i--)
		e[i].classList.remove("hl");
	const f = get(".hl2");
	i = f.length;
	while (i--)
		f[i].classList.remove("hl2");
	const g = get(".error");
	i = g.length;
	while (i--)
		g[i].classList.remove("error");
	del(["annotationinfo", "annotationwarning", "annotationerror"]);
}

function createSelector(elem)
{
	let s = elem.tagName ? elem.tagName.toLowerCase() : "";
	if(elem.id)
		s += "#" + elem.id + " ";
	if(elem.className)
		s += "." + Array.from(elem.classList).join('.');
	return s;
}

function markElementsWithSetWidths()
{
	showMessageBig("Finding divs with pixel widths...");
	const e = get("div");
	let i = e.length, j, cssRules;
	while(i--)
	{
		const elem = e[i];
		cssRules = getAllCssRulesForElement(elem);
		j = cssRules.length;
		while(j--)
		{
			if(cssRules[j].match(/width:[^;]*px/) !== null)
			{
				elem.classList.add("hl");
				elem.innerHTML = "<x>#" + elem.id + " ." + elem.className + " " + getComputedStyle(elem, null).getPropertyValue("width") + "</x>" + elem.innerHTML;
				ylog(cssRules[j]);
			}
		}
	}
	insertStyle("x { background: #000; color: #FFF; padding: 2px 4px; display: block; font: 12px verdana;  } .xlog { clear: both; }", "styleMarkElementsWithSetWidths", true);
	insertStyleHighlight();
}

function wrapAnchorNodeInTagHelper(tagName)
{
	if(tagName && tagName.length)
		wrapElementInner(Nimbus.currentNode, tagName);
}

function wrapAnchorNodeInTag()
{
	const selection = window.getSelection();
	if(!selection)
		return;
	let node = selection.anchorNode;
	if(node.tagName === undefined)
		node = node.parentNode;
	if(!node)
		return;
	Nimbus.currentNode = node;
	customPrompt("Enter tagName to wrap this node in").then(wrapAnchorNodeInTagHelper);
}

function highlightAnchorNode(tag)
{
	const t = tag? tag : "mark";
	const selection = window.getSelection();
	if(!selection)
		return;
	let node = selection.anchorNode;
	if(node.tagName === undefined)
		node = node.parentNode;
	if(node && node.parentNode)
		node.innerHTML = "<" + t + ">" + node.innerHTML + "</" + t + ">";
}

function makeHeadingFromSelection(tagname)
{
	const selection = window.getSelection();
	if(!selection) return;
	let node = selection.anchorNode;
	if(node.tagName === undefined)
		node = node.parentNode;
	if(node && node.parentNode && node.parentNode.tagName !== "body")
		node.parentNode.replaceChild(createElement(tagname, { innerHTML: node.innerHTML }), node);
	else
		xlog("Could not make heading");
}

function buildGallery()
{
	const images = get("img");
	if(!(images && images.length))
	{
		showMessageBig("No images found");
		return;
	}
	const db = document.body;
	const galleryElement = createElement("slideshow", { id: "nimbusGallery" });
	const uniques = [...new Set(images)];
	for(let i = 0, ii = uniques.length; i < ii; i++)
	{
		const image = images[i];
		let w = image.naturalWidth;
		let h = image.naturalHeight;
		let aspectRatioClass;
		if(w && h)
			aspectRatioClass = w / h > 16 / 9 ? "aspectRatioLandscape" : "aspectRatioPortrait";
		galleryElement.appendChild(createElement("img", { src: image.src, className: aspectRatioClass }));
	}
	del("img");
	cleanupHead();
	insertStyle("img { display: block; float: left; max-height: 300px; }", "styleGallery", true);
	db.insertBefore(galleryElement, db.firstChild);
}

function buildSlideshow()
{
	if(get("#styleSlideshow"))
	{
		del("#styleSlideshow");
		return;
	}
	if(!get("#nimbusGallery"))
		buildGallery();
	del("#styleGallery");
	const gallery = get("#nimbusGallery");
	const images = gallery.querySelectorAll("img");
	if(!(gallery && images))
		return;
	const s = 'body { margin: 0; padding: 0; }' +
	'#nimbusGallery { width: 100%; height: 100vh; background: #000; color: #999; position: absolute; top: 0; left: 0; z-index: 1999999999; }' +
	'#nimbusGallery img { position: absolute; top: -1000em; left: -1000em; z-index: 2000000000; }' +
	'#nimbusGallery img.currentImage { margin: auto; position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: block; }' +
	'#nimbusGallery img.currentImage.aspectRatioPortrait { height: 100vh; width: auto; }' +
	'#nimbusGallery img.currentImage.aspectRatioLandscape { width: 100vw; height: auto; }' +
	'#nimbusGallery a { color: #000; }';
	insertStyle(s, 'styleSlideshow', true);
	images[0].classList.add("currentImage");
	window.scrollTo(0, 0);
}

function changeGalleryImage(direction)
{
	if(!get("#styleSlideshow"))
		return;
	const gallery = get("#nimbusGallery");
	if(!gallery)
		return;
	const e = gallery.getElementsByTagName("img");
	let i, ii;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].classList.contains("currentImage"))
		{
			e[i].classList.remove("currentImage");
			if(direction === "prev")
			{
				if(i === 0) e[ii - 1].classList.add("currentImage");
				else e[i - 1].classList.add("currentImage");
				break;
			}
			else if(direction === "next")
			{
				if(i === ii-1) e[0].classList.add("currentImage");
				else e[i + 1].classList.add("currentImage");
				break;
			}
		}
	}
}

function deleteIframes()
{
	const numIframes = get("iframe").length;
	if(numIframes !== undefined)
	{
		del("iframe");
		showMessageBig(numIframes + " iframes deleted");
	}
	else
	{
		showMessageBig("No iframes found");
	}
	deleteElementsContainingText("rp", "iframe:");
}

function deleteImages()
{
	del("svg");
	const images = get("img");
	const imagePlaceholders = get("rt");
	if(images.length)
	{
		del("img");
		showMessageBig("Deleted " + images.length + " images");
	}
	else if(imagePlaceholders.length)
	{
		del("rt");
		showMessageBig("Deleted " + imagePlaceholders.length + " image placeholders");
	}
	else
	{
		showMessageBig("No images found");
	}
}

function deleteImagesSmallerThan(x, y)
{
	const images = document.getElementsByTagName('img');
	let i = images.length;
	while(i--)
	{
		if(images[i].naturalWidth < x || images[i].naturalHeight < y)
			del(images[i]);
	}
}

function deleteSmallImages()
{
	const images = get("img");
	const dimensions = [100, 200, 300, 400];
	let index = 0;
	let indexElement = get("#imagedimensionindex");
	if (indexElement)
	{
		index = indexElement.textContent || 0;
		index++;
		if (index > dimensions.length - 1) return;
	}
	else
	{
		index = 0;
	}
	del("#imagedimensionindex");
	indexElement = createElement("h6", { textContent: index, id: "imagedimensionindex" });
	document.body.appendChild(indexElement);
	const dimension = dimensions[index];
	showMessageBig("Deleting images smaller than " + dimension + " pixels");
	let i = images.length;
	while(i--)
		if (images[i].naturalWidth < dimension || images[i].naturalHeight < dimension)
			del(images[i]);
}

function replaceEmptyParagraphsWithHr()
{
	const paras = get("p");
	let i = paras.length;
	while(i--)
	{
		const para = paras[i];
		if(trim(para.textContent).length === 0)
		{
			let nextPara = paras[i - 1];
			while(nextPara && trim(nextPara.textContent).length === 0 && i > 0)
			{
				nextPara = paras[--i];
			}
			para.parentNode.replaceChild(document.createElement("hr"), para);
		}
	}
}

function replaceSpansWithTextNodes()
{
	const spans = get("span");
	let i = spans.length;
	while(i--)
	{
		const span = spans[i];
		if(span.innerHTML.indexOf("<") === -1)
			span.parentNode.replaceChild(document.createTextNode(span.textContent || ""), span);
	}
}

function removeSpanTags()
{
       let s = document.body.innerHTML;
       s = s.replace(/<\/{0,}span[^>]*>/g, "");
       document.body.innerHTML = s;
}

function deleteMarkedElements()
{
	del(".hl");
}

function replaceCommentsWithPres()
{
	let s = document.body.innerHTML;
	s = s.replace(/<!--/g, '<pre>');
	s = s.replace(/-->/g, '</pre>');
	document.body.innerHTML = s;
}

function replaceImagesWithTextLinks()
{
	let e, imageLink, imageReplacement, i;
	if(get("rt"))
	{
		e = get("rt");
		i = e.length;
		while(i--)
		{
			const elem = e[i];
			imageLink = createElement("img", { src: elem.querySelector("a").href });
			elem.parentNode.replaceChild(imageLink, elem);
		}
		del('#styleReplaceImages');
		return;
	}
	else if(get("img"))
	{
		e = get("img");
		for(i = 0; i < e.length; i++)
		{
			const elem = e[i];
			if(elem.src)
			{
				imageLink = createElement("a", { href: elem.src, textContent: elem.src });
				imageReplacement = createElementWithChildren("rt", imageLink);
				if(elem.parentNode.tagName.toLowerCase() === "a")
					elem.parentNode.parentNode.replaceChild(imageReplacement, elem.parentNode);
				else
					elem.parentNode.insertBefore(imageReplacement, elem);
			}
		}
		del("img");
		const s = 'rt { margin: 10px 0; padding: 20px; display: block; background: #181818; font: 12px verdana; }' +
		'rt a { color: #FFF; }' +
		'rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }';
		insertStyle(s, "styleReplaceImages");
	}
}

function replaceAudio()
{
	let sources = get("source");
	let i = sources.length;
	while(i--)
	{
		const source = sources[i];
		if(source.src)
		{
			const audioLink = createElement("a", { href: source.src, textContent: source.src });
			const audioLinkWrapper = createElementWithChildren("h2", audioLink);
			source.parentNode.replaceChild(audioLinkWrapper, source);
		}
	}
	replaceElementsBySelector("audio", "div");
}

function getLargeImages()
{
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		const linkHref = link.href;
		if(containsAnyOfTheStrings(linkHref.toLowerCase(), [".png", ".jpg", ".gif", ".jpe"]))
		{
			document.body.appendChild(createElement("img", { src: linkHref }));
			link.parentNode.replaceChild(createElement("img", { src: linkHref }), link);
		}
	}
}

function getStreamingImages()
{
	let imageContainer = getOne("#nimbusStreamingImageContainer");
	if(!imageContainer)
	{
		imageContainer = createElement("div", { id: "nimbusStreamingImageContainer" });
		document.body.appendChild(imageContainer);
		const style = "#nimbusStreamingImageContainer { position: fixed; top: 0; left: 0; width: 30vw; height: 100vh; overflow: hidden; }" +
			" #nimbusStreamingImageContainer img { height: 40px; width: auto; float: left; }";
		insertStyle(style, "styleGetStreamingImages", true);
	}
	if(!Nimbus.streamingImages)
		Nimbus.streamingImages = [];
	let images = Nimbus.streamingImages;
	var e = document.querySelectorAll("img:not(.alreadySaved)");
	for(var i = 0; i < e.length; i++)
	{
		const imgSrc = e[i].src;
		if(images.includes(imgSrc))
			continue;
		images.push(imgSrc);
		imageContainer.appendChild(createElement("img", { src: imgSrc, className: "alreadySaved" }));
	}
	setTimeout(getStreamingImages, 5000);
	showMessageBig(images.length + " unique images so far");
}

function addLinksToLargerImages()
{
	if(get("rt"))
		return;
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		const linkHref = link.href;
		if(containsAnyOfTheStrings(linkHref.toLowerCase(), [".png", ".jpg", ".jpeg", ".gif"]))
			link.parentNode.insertBefore(createElementWithChildren("rt", createElement("a", { href: linkHref, textContent: linkHref})), link);
	}
}

function cleanupGeneral()
{
	const t1 = performance.now();
	cleanupHead();
	getOne("body").removeAttribute("style");
	replaceIframes();
	deleteNonContentImages();
	addLinksToLargerImages();
	replaceIncorrectHeading();
	del(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "x", "canvas", "label", "svg", "video", "audio", "applet", "message"]);
	replaceElementsBySelector("center", "div");
	remove("a", "textContent", "equals", "Section");
	setDocTitle();
	cleanupAttributes();
	replaceSpansWithTextNodes();
	replaceAudio();
	markUserLinks();
	appendInfo();
	getBestImageSrc();
	Nimbus.candidateHeadingElements = [];
	Nimbus.candidateHeadingIndex = null;
	document.body.className = "pad100 xwrap";
	if(navigator.userAgent.indexOf("Chrome") !== -1)
	{
		toggleStyleNegative();
	}
	const t2 = performance.now();
	xlog(Math.round(t2 - t1) + " ms: cleanupGeneral");
}

function cleanupGeneral_light()
{
	const t1 = performance.now();
	deleteEmptyHeadings();
	cleanupHead();
	replaceIframes();
	del(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "x", "canvas", "label", "svg", "video", "audio", "applet", "message"]);
	replaceElementsBySelector("center", "div");
	setDocTitle();
	del("x");
	cleanupAttributes_regex();
	appendInfo();
	document.body.className = "pad100 xShowImages";
	const t2 = performance.now();
	xlog(Math.round(t2 - t1) + " ms: cleanupGeneral_light");
}

function replaceIframes()
{
	const e = get("iframe");
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		const iframereplacement = document.createElement("rp");
		const iframelink = document.createElement("a");
		let s = elem.src;
		if(containsAnyOfTheStrings(s, ["facebook", "twitter"]))
		{
			elem.parentNode.removeChild(elem);
			continue;
		}
		iframelink.href = s;
		if(s.indexOf("youtube") !== -1)
		{
			s = s.replace(/\/embed\//, '/watch?v=');
			const segments = s.split('?');
			iframelink.href = segments[0] + '?' + segments[1];
			if(s.indexOf(".") > 0)
				s = s.match(/:\/\/(.[^/]+)/)[1];
			iframelink.textContent = iframelink.href;
		}
		else
		{
			iframelink.textContent = "iframe: " + iframelink.href;
		}
		iframereplacement.appendChild(iframelink);
		elem.parentNode.replaceChild(iframereplacement, elem);
	}
}

function replaceElementsBySelector(selector, tagName)
{
	const toReplace = get(selector);
	if(toReplace.length)
	{
		showMessageBig("Replacing " + toReplace.length + " " + selector);
		let i = toReplace.length;
		while(i--)
		{
			const elem = toReplace[i];
			elem.parentNode.replaceChild(createElement(tagName, { innerHTML: elem.innerHTML }), elem);
		}
	}
	else if(toReplace && toReplace.parentNode)
	{
		showMessageBig("Replacing one " + selector);
		toReplace.parentNode.replaceChild(createElement(tagName, { innerHTML: toReplace.innerHTML }), toReplace);
	}
}

function replaceMarkedElements(tag)
{
	const e = get(".hl");
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		const regex = new RegExp(elem.tagName, "i");
		elem.outerHTML = elem.outerHTML.replace(regex, tag);
	}
	unhighlightAll();
}

function replaceElementsByClassesContaining(str, tagName)
{
	const e = get("div, p");
	let i, ii;
	if(e.length)
	{
		const toReplace = [];
		for (i = 0, ii = e.length; i < ii; i++)
			if(~e[i].className.indexOf(str))
				toReplace.push(e[i]);
		showMessageBig("Replacing " + toReplace.length + " elements");
		for (i = toReplace.length - 1; i >= 0; i--)
			toReplace[i].parentNode.replaceChild(createElement(tagName, { innerHTML: toReplace[i].innerHTML }), toReplace[i]);
	}
}

function cleanupHead()
{
	const head = getOne("head");
	if(!head)
		return;
	const tempTitle = document.title;
	emptyElement(head);
	document.title = tempTitle;
}

function regressivelyUnenhance()
{
	cleanupHead();
	del(["link", "style", "script"]);
	removeInlineStyles();
	cleanupLinks();
}

function removeInlineStyles()
{
	const e = document.getElementsByTagName("*");
	let i = e.length;
	while(i--)
	{
		e[i].removeAttribute("style");
	}
}

function forceReloadCss()
{
	showMessageBig("Force-reloading CSS");
	const styleLinks = document.getElementsByTagName('link');
	for (let i = 0; i < styleLinks.length; i++)
	{
		const styleSheet = styleLinks[i];
		if (styleSheet.rel.toLowerCase().indexOf('stylesheet') >= 0 && styleSheet.href)
		{
			const h = styleSheet.href.replace(/(&|%5C?)forceReload=\d+/, '');
			styleSheet.href = h + (h.indexOf('?') >= 0 ? '&' : '?') + 'forceReload=' + new Date().valueOf();
		}
	}
}

function insertStyle(str, identifier, important)
{
	if(identifier && identifier.length && get("#" + identifier))
		del("#" + identifier);
	if(important)
		str = str.replace(/;/g, " !important;");
	const head = getOne("head");
	const style = document.createElement("style");
	const rules = document.createTextNode(str);
	style.type = "text/css";
	if(style.styleSheet)
		style.styleSheet.cssText = rules.nodeValue;
	else
		style.appendChild(rules);
	if(identifier && identifier.length)
		style.id = identifier;
	head.appendChild(style);
}

function toggleStyle(str, identifier, important)
{
	if(identifier && identifier.length && get("#" + identifier))
	{
		del("#" + identifier);
		return;
	}
	insertStyle(str, identifier, important);
}

function setImageWidth(width)
{
	const s = "img { width: " + width + "px; height: auto; }";
	insertStyle(s, "styleImageWidth", true);
}

function insertStyleHighlight()
{
	del("#styleHighlight");
	const s = '.hl, .focused { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; padding: 2px; }' +
		'.hl2 { box-shadow: inset 2px 2px #00F, inset -2px -2px #00F; padding: 2px; }' +
		'.hl::after, .hl2::after { content: " "; display: block; clear: both; }';
	// let s = '.hl { filter: brightness(1.7); }';
	insertStyle(s, "styleHighlight", true);
}

function insertStyleAnnotations()
{
	const s = "annotationinfo, annotationwarning, annotationerror { display: inline-block; font: 14px helvetica; padding: 2px 5px; border-radius: 0; }" +
			"annotationinfo { background: #000; color: #0F0; }" +
			"annotationwarning { background: #000; color: #F90; }" +
			"annotationerror { background: #A00; color: #FFF; }";
	insertStyle(s, "styleAnnotations", true);
}

function insertStyleShowErrors()
{
	del("#styleShowErrors");
	const s = ".error { box-shadow: inset 2000px 2000px rgba(255, 0, 0, 1);";
	insertStyle(s, "styleShowErrors", true);
}

function toggleStyleSimpleNegative()
{
	const s = 'body, body[class] {background-color: #181818; }' +
	'*, *[class] { background-color: transparent; color: #CCC; border-color: transparent; }' +
	'h1, h2, h3, h4, h5, h6, b, strong, em, i {color: #FFF; }' +
	'mark {color: #FF0; }' +
	'a, a[class] *, * a[class] {color: #09F; }' +
	'a:hover, a:hover *, a[class]:hover *, * a[class]:hover {color: #FFF; }' +
	'a:visited, a:visited *, a[class]:visited *, * a[class]:visited {color: #048; }' +
	'button[class], input[class], textarea[class] { border: 2px solid #09F; }' +
	'button[class]:focus, input[class]:focus, textarea[class]:focus, button[class]:hover, input[class]:hover, textarea[class]:hover { border: 2px solid #FFF; }';
	toggleStyle(s, "styleSimpleNegative", true);
}

function toggleStyleGrey()
{
	const s = 'body { background: #203040; color: #ABC; font: 24px "swis721 cn bt"; }' +
	'h1, h2, h3, h4, h5, h6 { background: #123; padding: 0.35em 10px; font-weight: normal; }' +
	'body.pad100 { padding: 100px; }' +
	'body.xwrap { width: 1000px; margin: 0 auto; }' +
	'mark { background: #049; color: #7CF; padding: 4px 2px; }' +
	'p { line-height: 135%; text-align: justify; }' +
	'blockquote { margin: 0 0 0 40px; padding: 10px 20px; border-left: 10px solid #123; }' +
	'a { text-decoration: none; color: #09F; }' +
	'em, i, strong, b { font-style: normal; font-weight: normal; color: #FFF; }' +
	'code { background: #012; color: #ABC; }' +
	'pre { background: #012; color: #ABC; padding: 20px; }' +
	'pre q1 { color: #57F; background: #024; }' +
	'pre q2 { color: #C7F; background: #214; }' +
	'pre c1 { font-style: normal; color: #F90; background: #331500; }' +
	'pre c2 { color: #F00; background: #400; }' +
	'pre b1 { color: #0F0; }' +
	'pre b2 { color: #FFF; }' +
	'pre b3 { color: #F90; }' +
	'pre xk { color: #29F; }' +
	'pre xh { color: #57F; }' +
	'pre xv { color: #F47; }';
	toggleStyle(s, "styleGrey", true);
}

function toggleStyleNegative()
{
	const s = 'html { background: #181818; }' +
	'html body { margin: 0; }' +
	'html body, html body[class] { color: #888; background: #242424; font-weight: normal; }' +
	'body.pad100 { padding: 100px 100px; }' +
	'body.pad100 table { width: 100%; }' +
	'body.pad100 td, body.pad100 th { padding: 3px 10px; }' +
	'body.pad100 img { display: block; max-width: 100%; height: auto; }' +
	'nav { background: #111; }' +
	'body.xdark { background: #111; }' +
	'body.xblack { background: #000; }' +
	'body.xwrap { width: 1400px; margin: 0 auto; padding: 100px 300px; }' +
	'html h1, html h2, html h3, html h4, html h5, html h6, html h1[class], html h2[class], html h3[class], html h4[class], html h5[class], html h6[class] { color: #AAA; padding: 10px 20px; line-height: 160%; margin: 2px 0; background: #141414; border: 0; }' +
	'html h1, html h1[class], div[class] h1 { font: 40px "Swis721 Cn BT", Calibri, sans-serif; color: #FFF; }' +
	'html h2, html h2[class], div[class] h2 { font: 28px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }' +
	'html h3, html h3[class], div[class] h3 { font: 24px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }' +
	'html h4, html h4[class], div[class] h4 { font: 20px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }' +
	'html h5, html h5[class], div[class] h5 { font: 16px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }' +
	'html h6, html h6[class], div[class] h6 { font: 14px Verdana, sans-serif; color: #999; }' +
	'html h5, html h6 { padding: 0.5em 10px; }' +
	'dl { border-left: 20px solid #111; }' +
	'dt { color: inherit; padding: 0.5em 10px; line-height: 160%; margin: 2px 0; background: #111; border: 0; border-left: 20px solid #0C0C0C; color: #AAA; }' +
	'dd { color: inherit; padding: 0.25em 10px; line-height: 160%; margin: 2px 0; background: #141414; border: 0; border-left: 20px solid #0C0C0C; }' +
	'button, select, textarea, html input, html input[class] { border: 0; padding: 5px 10px; background: #242424; box-shadow: inset 0 0 5px #000; color: #999; line-height: 150%; -moz-appearance: none; border-radius: 0; }' +
	'html input[type="checkbox"] { width: 24px; height: 24px; background: #242424; }' +
	'button, html input[type="submit"], html input[type="button"] { box-shadow: none; background: #111; }' +
	'button:hover, button:focus, html input[type="submit"]:hover, input[type="submit"]:focus, html input[type="button"]:hover, html input[type="button"]:focus { background: #000; color: #FFF; }' +
	'input div { color: #999; }' +
	'select:focus, textarea:focus, input:focus { color: #999; outline: 0; background: #0C0C0C; }' +
	'textarea:focus *, input:focus * { color: #999; }' +

	'html a, html a:link { color: #09F; text-decoration: none; text-shadow: none; font: inherit; }' +
	'html a:visited { color: #36A; text-decoration: none; }' +
	'html a:hover, html a:focus, html a:hover *, html a:focus * { color: #FFF; text-decoration: none; outline: 0; }' +
	'html a:active { color: #FFF; outline: none; }' +
	'html .pagination a:link { font: bold 30px "swis721 cn bt"; border: 0; background: #111; padding: 10px; }' +

	'main, article, section, header, footer, hgroup, nav, ins, small, big, aside, details, font, article, form, fieldset, label, span, span[class], blockquote, div, div[class], ul, ol, li, a, i, b, strong, dl { color: inherit; background: transparent none; line-height: inherit; font-family: inherit; font-size: inherit; font-weight: inherit; text-decoration: inherit; }' +
	'ul { list-style: none; margin: 0; padding: 10px 0 10px 20px; }' +
	'li { font-size: 14px; list-style-image: none; background-image: none; line-height: 150%; }' +
	'tbody, thead, th, tr, td, table { background: #202020; color: inherit; font: 22px "Swis721 Cn BT"; }' +
	'body.pad100 ul li { border-left: 5px solid #0C0C0C; padding: 0 0 0 10px; margin: 0 0 2px 0; }' +
	'cite, u, em, i, b, strong { font-weight: normal; font-style: normal; text-decoration: none; color: #CCC; font-size: inherit; }' +
	'a u, a em, a i, a b, a strong { color: inherit; }' +
	'small { font-size: 80%; }' +
	'input, input *, button, button *, div, td, p { font-size: 22px; font-family: "Swis721 Cn BT", sans-serif; line-height: 150%; }' +
	'p { margin: 0; padding: 5px 0; font-style: normal; font-weight: normal; line-height: 150%; color: inherit; background: inherit; border: 0; }' +
	'blockquote { margin: 0 0 0 20px; padding: 10px 0 10px 20px; border-style: solid; border-width: 10px 0 0 10px; border-color: #0C0C0C; }' +
	'blockquote blockquote { margin: 0 0 0 20px; padding: 0 0 0 20px; border-width: 0 0 0 10px; }' +

	'code { background: #0C0C0C; font-family: Verdcode, Consolas, sans-serif; padding: 1px 2px; }' +
	'pre { background: #0C0C0C; border-style: solid; border-width: 0 0 0 10px; border-color: #444; padding: 10px 20px; font: 14px Verdcode; }' +
	'pre, code { color: #999; }' +
	'pre p { margin: 0; padding: 0; font: 14px Verdcode, Consolas, sans-serif; }' +

	'pre q1 { color: #57F; background: #024; }' +
	'pre q2 { color: #C7F; background: #214; }' +
	'pre c1 { font-style: normal; color: #F90; background: #331500; }' +
	'pre c2 { color: #F00; background: #400; }' +
	'pre b1 { color: #0F0; }' +
	'pre b2 { color: #FFF; }' +
	'pre b3 { color: #F90; }' +
	'pre xk { color: #29F; }' +
	'pre xh { color: #57F; }' +
	'pre xv { color: #F47; }' +

	'a img { border: none; }' +
	'button img, input img { display: none; }' +
	'table { border-collapse: collapse; background: #141414; border: 0; }' +
	'td { vertical-align: top; border-width: 0px; }' +
	'caption, th { background: #111; border-color: #111; text-align: left; }' +
	'th, tr, tbody { border: 0; }' +
	'fieldset { border: 1px solid #111; margin: 0 0 1px 0; }' +
	'span, ul, ol, li, div { border: 0; }' +
	'hr { height: 2px; background: #111; border-style: solid; border-color: #000; border-width: 0; margin: 20px 0; }' +
	'legend { background: #181818; }' +
	'textarea, textarea div { font-family: Verdcode, Consolas, sans-serif; }' +
	'samp, mark, hl, kbd { background: #331500; color: #F90; padding: 2px 0; }' +
	'container { border: 2px solid #F00; margin: 10px; display: block; padding: 10px; }' +
	'samp a:link, mark a:link, a:link samp, a:link mark { background: #331500; color: #F90; }' +
	'samp a:visited, mark a:visited, a:visited samp, a:visited mark { color: #e68a00; }' +
	'mark a:hover, a:hover mark, samp a:hover, a:hover samp { background-color: #4d2000; color: #FFF; }' +
	'samp, mark mark { font: 24px "Swis721 Cn BT", Calibri, sans-serif; }' +
	'figure { border: 0; background: #181818; padding: 20px; }' +
	'figcaption { background: #181818; color: #888; }' +
	'ruby { margin: 10px 0; background: #000; color: #AAA; padding: 20px 40px; display: block; }' +
	'rp { margin: 10px 0; background: #181818; color: #888; padding: 40px; display: block; font: 24px "Swis721 Cn BT", Calibri, sans-serif; border-top: 50px solid #000; border-bottom: 50px solid #000; }' +
	'rt { margin: 10px 0; padding: 20px; display: block; background: #181818; }' +
	'rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }' +
	'body.xDontShowLinks a, body.xDontShowLinks a *, body.xDontShowLinks a:link { color: inherit; text-decoration: none; }' +
	'body.xDontShowLinks a:visited *, body.xDontShowLinks a:visited { color: inherit; text-decoration: none; }' +
	'body.xDontShowLinks a:hover *, body.xDontShowLinks a:focus *, body.xDontShowLinks a:hover, body.xDontShowLinks a:focus { color: #FFF; text-decoration: none; }' +
	'.hl { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; }' +
	'.hl2 { box-shadow: inset 2px 2px #00F, inset -2px -2px #00F; }' +
	'.hl::after, .hl2::after { content: " "; display: block; clear: both; }' +
	'user { background: #000; padding: 2px 10px; border-left: 10px solid #09F; margin: 0; }';

	toggleStyle(s, "styleNegative");
}

function toggleStyleWhite()
{
	const s = 'body, input, select, textarea { background: #FFF; color: #000; }' +
	'input, select, textarea { font: 12px verdana; }';
	toggleStyle(s, "styleWhite", true);
}

function toggleStyleShowClasses()
{
	if(get("#styleShowClasses"))
	{
		del("#styleShowClasses");
		return;
	}
	const s = 'body { background: #333; color: #BBB; }' +
	'a { color: #09F; text-decoration: none; }' +
	'div { padding: 0 0 0 10px; margin: 1px 1px 1px 10px; border: 2px solid #000; }' +
	'div::before, p::before { content:attr(class); color:#FF0; padding:0px 5px; background:#000; margin: 0 10px 0 0; }' +
	'div::after, p::after { content:attr(id); color:#0FF; padding:0px 5px; background:#000; margin: 0 10px 0 0; }' +
	'span::before { content:attr(class); color:#0F0; padding:0px 5px; background:#000; margin: 0 10px 0 0; }' +
	'select, textarea, input { background: #444; border: 1px solid red; }' +
	'button { background: #222; color: #AAA; }' +
	'nav { border: 6px solid #09F; padding: 20px; margin: 10px; background: #400; }' +
	'section { border: 6px solid #999; padding: 20px; margin: 10px; background: #040; }' +
	'main { border: 6px solid #DDD; padding: 20px; margin: 10px; background: #555; }' +
	'footer { border: 6px solid #555; padding: 20px; margin: 10px; background: #008; }' +
	'h1, h2, h3, h4, h5, h6 { position: relative; padding: 10px 10px 10px 5rem; background: #300; color: #FFF; }' +
	'h1::before { content: "h1"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }' +
	'h2::before { content: "h2"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }' +
	'h3::before { content: "h3"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }' +
	'h4::before { content: "h4"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }' +
	'h5::before { content: "h5"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }' +
	'h6::before { content: "h6"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }';
	insertStyle(s, "styleShowClasses", true);
}

function toggleContentEditable()
{
	const e = getOne(".hl");
	if(!e)
		return;
	let isEditable = e.getAttribute("contenteditable") === "true";
	e.setAttribute("contenteditable", isEditable ? "false" : "true");
	isEditable = !isEditable;
	if(isEditable)
	{
		showMessageBig("contentEditable ON");
		e.focus();
	}
	else
	{
		showMessageBig("contentEditable OFF");
		unhighlightAll();
	}
}

function getLinkAccessibleText(link)
{
	if(link.hasAttribute("aria-label"))
		return link.getAttribute("aria-label");
	if(link.hasAttribute("title"))
		return link.getAttribute("title");
	return null;
}

function showInaccessibleLinks()
{
	let countBadLinks = 0;
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		const linkText = link.textContent;
		let needsAriaLabel = false;
		if(link.textContent)
		{
			switch(trim(linkText.toLowerCase()))
			{
				case "read more": needsAriaLabel = true; break;
				case "click here": needsAriaLabel = true; break;
				case "learn more": needsAriaLabel = true; break;
				default: break;
			}
		}
		if(needsAriaLabel && getLinkAccessibleText(link) === linkText)
		{
			countBadLinks++;
			annotateElementError(link, "Needs descriptive title");
		}
	}
	showMessageBig(countBadLinks + " inaccessible links found");
}

function toggleShowAriaAttributes()
{
	if(document.body.classList.contains("showingAriaAttributes"))
	{
		document.body.classList.remove("showingAriaAttributes");
		unhighlightAll();
		return;
	}
	const e = get("main, nav, section, footer, aside, div, form");
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		if( elem.hasAttribute("role"))
		{
			if(["banner", "complementary", "contentinfo", "form", "main", "navigation", "region", "search"].includes(elem.getAttribute("role")))
			{
				elem.classList.add("hl");
				annotateElementError(elem, "role: " + elem.getAttribute("role"));
			}
			else
			{
				elem.classList.add("hl2");
				annotateElement(elem, "role: " + elem.getAttribute("role"));
			}
		}

		if(elem.attributes)
		{
			const attrs = elem.attributes;
			let j = attrs.length;
			while(j--)
				if(attrs[j].name.indexOf("aria-") === 0)
					elem.insertBefore(createElement("annotationwarning", { textContent: attrs[j].name + ": " + attrs[j].value }), elem.firstChild);
		}
	}

	insertStyleHighlight();
	insertStyleAnnotations();
	document.body.classList.add("showingAriaAttributes");
}

function checkAriaAttributes()
{
	const elems = Array.from( document.getElementsByTagName("*") );
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(elem.hasAttribute("aria-labelledby"))
		{
			const labelledById = "#" + elem.getAttribute("aria-labelledby");
			const labelElement = get(labelledById);
			if(!labelElement)
			{
				elem.classList.add("hl", "error");
				annotateElementError(elem, "aria-labelledby refers to missing ID");
				console.log("aria-labelledby refers to missing id: " + labelledById + " " + createSelector(elem));
			}
		}

		if(elem.hasAttribute("aria-describedby"))
		{
			const describedById = "#" + elem.getAttribute("aria-describedby");
			const labelElement = get(describedById);
			if(!labelElement)
			{
				elem.classList.add("hl", "error");
				annotateElementError(elem, "aria-describedby refers to missing ID");
				console.log("aria-describedby refers to missing id: " + describedById + " " + createSelector(elem));
			}
		}

		if(elem.hasAttribute("aria-expanded"))
		{
			if(elem.getAttribute("aria-expanded") !== "true" && elem.getAttribute("aria-expanded") !== "false")
			{
				elem.classList.add("hl", "error");
				annotateElementError(elem, "aria-expanded needs to be either true or false");
				console.log("aria-expanded needs to be either true or false: " + createSelector(elem));
			}
		}

		if(elem.hasAttribute("aria-selected"))
		{
			if(elem.getAttribute("aria-selected") !== "true" && elem.getAttribute("aria-selected") !== "false")
			{
				elem.classList.add("hl", "error");
				annotateElementError(elem, "aria-selected needs to be either true or false");
				console.log("aria-selected needs to be either true or false: " + createSelector(elem));
			}
		}

	}
}

function hasNoAriaText(button)
{
	if(button.textContent) return false;
	if(button.getAttribute("aria-label") && button.getAttribute("aria-label").length) return false;
	return true;
}

function showAriaButtonsWithNoText()
{
	const e = get("button");
	let i = e.length;
	while(i--)
	{
		const button = e[i];
		if(hasNoAriaText(button))
		{
			button.classList.add("hl", "error");
			button.textContent = "Button needs label";
			console.log("Button needs label");
		}
	}
}

function showAriaImagesWithMissingAltText()
{
	const e = get("img");
	let i = e.length;
	while(i--)
	{
		const image = e[i];
		if(!image.hasAttribute("alt"))
		{
			image.classList.add("hl", "error");
			image.setAttribute("title", "Image needs alt text");
			console.log("Image has no alt text: " + image.src);
		}
	}
}

function toggleShowAriaProblems()
{
	if(document.body.classList.contains("showingAriaProblems"))
	{
		document.body.classList.remove("showingAriaProblems");
		unhighlightAll();
		return;
	}
	checkAriaAttributes();
	showAriaButtonsWithNoText();
	showAriaImagesWithMissingAltText();
	showInaccessibleLinks();
	insertStyleHighlight();
	insertStyleShowErrors();
	document.body.classList.add("showingAriaProblems");
}

function removeEventListeners()
{
	let db = document.body;
	const tempBody = db.cloneNode(true);
	db.parentNode.replaceChild(tempBody, db);

	const elems = document.getElementsByTagName("*");
	let i = elems.length;
	while (i--)
	{
		const elem = elems[i];
		elem.removeAttribute("onmousedown");
		elem.removeAttribute("onmouseup");
		elem.removeAttribute("onmouseover");
		elem.removeAttribute("onclick");
	}
}

function chooseDocumentHeading()
{
	let documentHeading = '';
	deleteEmptyElements("h1");
	const headings1 = get("h1");
	const headings2 = get("h2");
	let candidateTags = [];
	if(headings1)
		candidateTags = candidateTags.concat(headings1);
	if(headings2)
		candidateTags = candidateTags.concat(headings2);
	if(!Nimbus.candidateHeadingElements)
		Nimbus.candidateHeadingElements = [];
	console.log({ candidateTags, candidateHeadingElements: Nimbus.candidateHeadingElements });
	for(let i = 0, ii = Math.min(10, candidateTags.length); i < ii; i++)
	{
		Nimbus.candidateHeadingElements.push(candidateTags[i]);
	}
	if(Nimbus.candidateHeadingElements.length)
	{
		Nimbus.candidateHeadingIndex = Nimbus.candidateHeadingIndex || 0;
		documentHeading = Nimbus.candidateHeadingElements[Nimbus.candidateHeadingIndex].textContent;
		Nimbus.candidateHeadingIndex++;
		if(Nimbus.candidateHeadingIndex >= Nimbus.candidateHeadingElements.length)
			Nimbus.candidateHeadingIndex = 0;
	}

	if(documentHeading.length < 3)
	{
		if(document.title)
			documentHeading = document.title;
		else
			documentHeading = window.location.hostname;
	}
	if(document.body.textContent.match(/Page [0-9]+ of [0-9]+/))
	{
		if(!documentHeading.match(/Page [0-9]+/i))
		{
			documentHeading = documentHeading+ " - " + document.body.textContent.match(/Page [0-9]+ of [0-9]+/)[0];
		}
	}
	return documentHeading;
}

function replaceDiacritics(s)
{
	const diacritics =[
		/[\300-\306]/g, /[\340-\346]/g,	// A, a
		/[\310-\313]/g, /[\350-\353]/g,	// E, e
		/[\314-\317]/g, /[\354-\357]/g,	// I, i
		/[\322-\330]/g, /[\362-\370]/g,	// O, o
		/[\331-\334]/g, /[\371-\374]/g,	// U, u
		/[\321]/g, /[\361]/g,		// N,
		/[\307]/g, /[\347]/g,		// C, c
	];
	const chars = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
	let i;
	for (i = 0; i < diacritics.length; i++)
		s = s.replace(diacritics[i],chars[i]);
	return s;
}

function sanitizeTitle(str)
{
	if(str === undefined || str === null)
		return;
	let s;
	s = str.toString();
	s = replaceDiacritics(s);

	s = s.replace(/&/g, " and ");
	s = s.replace(/\u00df/g, 'SS');
	s = s.replace(/\u0142/g, "'l");
	s = s.replace(/\u2018/g, "'");
	s = s.replace(/\u2019/g, "'");
	s = s.replace(/[:|\?]/g, " - ");
	s = s.replace(/[\/]/g, "-");
	s = s.replace(/[^\+\.\(\)0-9A-Za-z_!@\[\]\-\(\)'",]/g, " ");
	s = s.replace(/\s+/g, " ");

	return s;
}

function setDocTitleSimple(s)
{
	document.title = s;
	const heading = getOne("h1");
	if(!(heading && heading.innerHTML === s))
	{
		const h = createElement("h1", { textContent: s });
		document.body.insertBefore(h, document.body.firstChild);
	}
}

function setDocTitle(s)
{
	let i, labels, longestlabel, h;
	deleteEmptyElements("h1");
	deleteEmptyElements("h2");
	deleteEmptyElements("h3");

	if(!s)
		s = sanitizeTitle(chooseDocumentHeading());
	else
		s = sanitizeTitle(s);

	if(s.indexOf("Thread - ") !== -1)
		s = s.substr(s.indexOf("Thread - ") + 9);

	del(".candidateHeading");
	if(!(getOne("h1") && getOne("h1").innerHTML === s))
	{
		h = createElement("h1", { className: "candidateHeading", textContent: s });
		document.body.insertBefore(h, document.body.firstChild);
	}
	// Append domain name to title for easy searching
	if(location.hostname.length > 0)
	{
		let hn = location.hostname.replace(/www\./, '');
		hn = hn.replace(/\.com/, '');
		hn = hn.replace(/\.org/, '');
		hn = hn.replace(/\.net/, '');
		hn = hn.replace(/developer\./, '');
		hn = hn.replace(/\.wordpress/, '');
		hn = hn.replace(/\.blogspot/, '');
		labels = hn.split(".");
		i = labels.length;
		longestlabel = '';
		while (i--)
		{
			if(longestlabel.length < labels[i].length) longestlabel = labels[i];
		}
		if(s.indexOf(longestlabel) === -1)
			s += " [" + longestlabel + "]";
	}
	document.title = s;
}

function zeroPad(n)
{
	n += '';
	if(n.length < 2) n = '0' + n;
	return n;
}

function appendInfo()
{
	if(window.location.href.indexOf("file:///") >= 0) return;
	const headings4 = get("h4");
	if(headings4.length && headings4.length > 2 && headings4[headings4.length - 2].textContent.indexOf("URL:") === 0)
		return;

	const domainLinkWrapper = createElement("h4", { textContent: "Domain: " });
	const domainLink = document.createElement("a");
	const documentUrl = window.location.href.toString();
	const documentUrlSegments = documentUrl.split("/");
	domainLink.textContent = domainLink.href = documentUrlSegments[0] + "//" + documentUrlSegments[2];
	domainLinkWrapper.appendChild(domainLink);
	document.body.appendChild(domainLinkWrapper);

	const documentSaveUrl = createElement("h4", { textContent: "URL: " });
	const documentLink = document.createElement("a");
	let url = documentUrl;
	if(documentUrl.indexOf("?utm_source") > 0)
		url = url.substr(0, url.indexOf("?utm_source"));
	documentLink.textContent = documentLink.href = url;
	documentSaveUrl.appendChild(documentLink);
	document.body.appendChild(documentSaveUrl);

	const timestamp = getTimestamp();
	const saveTime = createElement("h4", { textContent: "Saved at " + timestamp });
	document.body.appendChild(saveTime);
}

function replaceFontTags()
{
	const f = document.getElementsByTagName("font");
	const replacements = [];
	let h;
	for (let i = 0, ii = f.length; i < ii; i++)
	{
		const fontElem = f[i];
		if(fontElem.getAttribute("size"))
		{
			let hl = fontElem.getAttribute("size");
			if(hl.indexOf("+") >= 0)
			{
				hl = hl[1];
			}
			switch (hl)
			{
				case '7': h = document.createElement("h1"); break;
				case '6': h = document.createElement("h2"); break;
				case '5': h = document.createElement("h3"); break;
				case '4': h = document.createElement("h4"); break;
				case '3': h = document.createElement("h5"); break;
				case '2': h = document.createElement("p"); break;
				case '1': h = document.createElement("p"); break;
				default: h = document.createElement("p"); break;
			}
			h.innerHTML = fontElem.innerHTML;
			replacements.push(h);
		}
		else
		{
			h = document.createElement("p");
			h.innerHTML = fontElem.innerHTML;
			replacements.push(h);
		}
	}
	for (let i = f.length - 1; i >= 0; i--)
	{
		const fontElem = f[i];
		fontElem.parentNode.replaceChild(replacements[i], fontElem);
	}
}

function cleanupAttributes()
{
	const t1 = performance.now();
	const elems = document.getElementsByTagName('*');
	document.body.removeAttribute("background");
	for (let i = 0; i < elems.length; i++)
	{
		const elem = elems[i];
		if(elem.attributes)
		{
			const attrs = elem.attributes;
			for (let j = attrs.length - 1; j >= 0; j--)
			{
				const attr = attrs[j];
				switch(attr.name)
				{
					case "href":
					case "src":
					case "srcset":
					case "name":
					case "colspan":
					case "rowspan":
						break;
					case "id":
						if(elem.tagName.toLowerCase() === 'a' || elem.tagName.toLowerCase() === 'li')
							break;
						else
							elem.removeAttribute("id");
						break;
					default:
						elem.removeAttribute(attr.name);
						break;
				}
			}
		}
	}
	const t2 = performance.now();
	xlog(t2 - t1 + "ms: cleanupAttributes");
}

function setAttribute(selector, attribute, value)
{
	const e = get(selector);
	let i = e.length;
	while(i--)
		e[i].setAttribute(attribute, value);
}

function removeAttribute(selector, attribute)
{
	const e = get(selector);
	var i = e.length;
	while(i--)
		e[i].removeAttribute(attribute);
}

function cleanupAttributes_regex()
{
	const t1 = performance.now();
	document.body.removeAttribute("background");
	document.body.innerHTML = document.body.innerHTML.replace(/(<[^ai][a-z0-9]*) [^>]+/gi, '$1');
	const t2 = performance.now();
	xlog(t2 - t1 + "ms: cleanupAttributes_regex");
}

function forAll(selector, callback)
{
	const e = get(selector);
	let i = -1;
	const len = e.length;
	while (++i < len)
		callback(e[i]);
}

function delNewlines()
{
	const paragraphs = document.getElementsByTagName("p");
	let i = paragraphs.length;
	while (i--)
	{
		const paragraph = paragraphs[i];
		const s = paragraph.textContent.replace(/\s/g, '');
		if(s.length === 0 && !paragraph.getElementsByTagName("img").length)
		{
			paragraph.parentNode.removeChild(paragraph);
		}
	}
}

function trim(s)
{
	return s.replace(/^\s+/, '').replace(/\s+$/, '');
}

function ltrim(str1)
{
	return str1.replace(/^\s+/, '');
}

function padLeft(str, width)
{
	let spaces = "";
	for(let i = 0, ii = width - str.length; i < ii; i++)
		spaces += " ";
	return spaces + str;
}

function padRight(str, width)
{
	let spaces = "";
	for(let i = 0, ii = width - str.length; i < ii; i++)
		spaces += " ";
	return str + spaces;
}

function normalizeWhitespace(s)
{
	return s.replace(/\s+/g, " ");
}

function cleanupHeadings()
{
	const headingElements = get("h1, h2, h3, h4, h5, h6");
	let i = headingElements.length;
	while(i--)
	{
		const heading = headingElements[i];
		let s = heading.innerHTML;
		s = s.replace(/<[^as\/][a-z0-9]*>/g, " ");
		s = s.replace(/<\/[^as][a-z0-9]*>/g, " ");
		heading.innerHTML = s.trim();
		if(trim(heading.textContent).length === 0)
		{
			heading.parentNode.removeChild(heading);
		}
	}
}

function convertDivsToParagraphs()
{
	const divs = get("div");
	let i = divs.length;
	while (i--)
	{
		const div = divs[i];
		if(div.getElementsByTagName("div").length) continue;
		let s = div.innerHTML;
		s = s.replace(/&nbsp;/g, ' ');
		s = s.replace(/\s+/g, '');
		if(s.length)
		{
			if(! (s[0] === '<' && s[1].toLowerCase() === "p")) div.innerHTML = '<p>' + div.innerHTML + '</p>';
		}
		else
		{
			div.parentNode.removeChild(divs[i]);
		}
	}
}

function makeHeadings()
{
	let e, i, j, tags, s, len;
	e = get("p");
	i = e.length;
	while(i--)
	{
		const elem = e[i];
		s = elem.textContent;
		s = s.replace(/\s+/g, '');
		len = s.length;
		if(len === 0)
		{
			if(!elem.getElementsByTagName("img").length)
			{
				elem.className = "deleteme";
				continue;
			}
		}
		else if( s.match(/[IVX\.]+/g) && s.match(/[IVX\.]+/g)[0] === s )
		{
			elem.className = "parah2";
			continue;
		}
		else if( len < 120 && s[len-1].match(/[0-9A-Za-z]/) )
		{
			if( !(e[i+1] && e[i+1].length < 120) )
			{
				elem.className = "parah3";
			}
		}
		tags = ["b", "strong", "em"];
		for (j = tags.length - 1; j >= 0; j--)
		{
			const tag = tags[j];
			if(elem.getElementsByTagName(tag).length === 1)
			{
				if(elem.querySelector(tag).textContent && removeWhitespace(elem.querySelector(tag).textContent) === s)
				{
					elem.className = "parah2";
				}
			}
		}
	}
	// Highlight users
	e = get("a");
	i = e.length;
	while(i--)
	{
		const elem = e[i];
		if(elem.href && containsAnyOfTheStrings(elem.href, ["profile", "member", "user", "/u/"]))
			elem.className = "highlightthis";
	}
	replaceElementsBySelector(".parah2", "h2");
	replaceElementsBySelector(".parah3", "h3");
	del(".deleteme");
	e = get(".highlightthis");
	i = e.length;
	while(i--)
		wrapElement(e[i], "h4");
}

function markNavigationalLists()
{
	const lists = get("ul, ol");
	let len = lists.length;
	let i = -1;
	while(++i < len)
	{
		const list = lists[i];
		if(removeWhitespace(list.textContent).length === 0 && list.getElementsByTagName("img").length === 0)
		{
			list.parentNode.removeChild(list);
			continue;
		}
		const links = list.querySelectorAll("a");
		let j = links.length;
		console.log("list has " + j + "links");
		let linkText = "";
		while (j--)
		{
			linkText += links[j].textContent.replace(/[^A-Za-z]+/g, "");
		}
		const listTextLength = list.textContent.replace(/[^A-Za-z]+/g, "").length;
		if(listTextLength === linkText.length)
			list.classList.add("hl");
	}
}

function removeWhitespace(s)
{
	return s.replace(/\s+/g, '');
}

function normalizeString(s)
{
	return removeWhitespace(s.toLowerCase());
}

function logout()
{
	switch (location.hostname)
	{
		case 'mail.google.com':
		case 'accounts.google.com':
			location.href = 'https://accounts.google.com/Logout';
			return;
	}
	let e, i, ii, found = false, s;
	e = get("a");
	i = e.length;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		const node = e[i];
		if(node.href)
		{
			s = normalizeString(node.href);
			if( s.indexOf("logout") >= 0 && s.indexOf("logout_gear") === -1 || s.indexOf("signout") >= 0)
			{
				found = true;
				showMessageBig(node.href);
				node.classList.add("hl");
				node.click();
				break;
			}
		}
		if(node.textContent)
		{
			s = normalizeString(node.textContent);
			if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
			{
				found = true;
				showMessageBig(node.href);
				node.classList.add("hl");
				node.click();
				break;
			}
		}
	}
	if(!found)
	{
		e = document.querySelectorAll("input", "button");
		for(i = 0, ii = e.length; i < ii; i++)
		{
			const node = e[i];
			if(node.value)
			{
				s = normalizeString(node.value);
				if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
				{
					found = true;
					showMessageBig("Logging out...");
					node.classList.add("hl");
					node.click();
					break;
				}
			}
			else if(node.textContent)
			{
				s = normalizeString(node.textContent);
				if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
				{
					found = true;
					showMessageBig("Logging out...");
					node.classList.add("hl");
					node.click();
					break;
				}
			}
		}

	}
	if(!found)
	{
		showMessageBig("Logout link not found");
	}
}

function showPrintLink()
{
	let i, found = false;
	const e = get("a");
	i = e.length;
	while(i--)
	{
		const href = e[i].href;
		if(href && href.toLowerCase().indexOf("print") >= 0)
		{
			found = true;
			const printLink = createElement("a", { href: href, textContent: "Print" });
			document.body.insertBefore(createElementWithChildren("h2", printLink), document.body.firstChild);
			printLink.focus();
			break;
		}
	}
	if(!found)
	{
		showMessageBig("Print link not found");
	}
}

function handleBlockEditClick(e)
{
	e.stopPropagation();
	let targ;
	let ctrlOrMeta = "ctrlKey";
	if(navigator.userAgent.indexOf("Macintosh") !== -1)
		ctrlOrMeta = "metaKey";
	if(!e) e = window.event;
	if(e.target)
	{
		targ = e.target;
	}
	const tn = targ.tagName.toLowerCase();
	// Get clicked element
	if(e[ctrlOrMeta] && e.shiftKey)
	{
		document.body.innerHTML = targ.innerHTML;
		toggleBlockEditMode();
		return;
	}
	// delete clicked element
	else if(e[ctrlOrMeta] && !e.shiftKey)
	{
		if(targ.tagName.toLowerCase() === 'body') return;
		if(tn === "li" || tn === "p")
		{
			targ = targ.parentNode;
		}
		targ.parentNode.replaceChild(document.createTextNode(""), targ);
		return false;
	}
	// append clicked element to a div
	else if(e.shiftKey)
	{
		if(!document.getElementById("newbody"))
		{
			const newbody = document.createElement("div");
			newbody.id = "newbody";
			document.body.appendChild(newbody);
		}
		if(targ.tagName.toLowerCase() === 'body')
			return;
		document.getElementById("newbody").appendChild(targ);
	}
	return true;
}

function parseCode(s)
{
	let t = "";
	let cur, prev, next;
	let phpVarRegex;
	let i, ii;
	for(i = 0, ii = s.length; i < ii; i++)
	{
		cur = s[i];
		prev = i > 0 ? s[i-1] : null;
		next = i < ii-1 ? s[i+1] : null;
		switch(cur)
		{
			// double quote strings
			case '"':
				t += '<q1>"';
				i++;
				while(s[i] && s[i]!== '"')
				{
					t += s[i];
					i++;
				}
				t += '"</q1>';
				break;
			// single quote strings
			case "'":
				t += "<q2>'";
				i++;
				while(s[i] && s[i]!== "'")
				{
					t += s[i];
					i++;
				}
				t += "'</q2>";
				break;
			// comments
			case '/':
				if(prev && prev === ":") // is a URL, don't highlight
				{
					t += cur;
				}
				else if(next === '/') // single-line comment
				{
					t += "<c1>/";
					i++;
					while(s[i] && s[i].match(/[\r\n]/) === null)
					{
						t += s[i];
						i++;
					}
					t += '</c1>\r\n';
				}
				else if(next === '*') // block comment
				{
					t += '<c2>' + cur;
					i++;
					while(s[i] && !(s[i] === '*' && s[i+1] === '/'))
					{
						t += s[i];
						i++;
					}
					t += '*/</c2>';
					i++;
				}
				else
				{
					t += cur;
				}
				break;
			// PHP variables
			case '$':
				phpVarRegex = new RegExp('[a-z0-9_\-]', 'i');
				if(next && next.match(phpVarRegex) !== null)
				{
					t += '<xv>' + cur;
					i++;
					if(s[i] && s[i].match(phpVarRegex) !== null)
					{
						while(s[i] && s[i].match(phpVarRegex) !== null)
						{
							t += s[i];
							i++;
						}
						i--;
					}
					else
					{
						t += cur;
					}
					t += '</xv>';
				}
				else
				{
					t += cur;
				}
				break;
			// brackets
			case '{':
			case '}':
				t += '<b1>' + cur + '</b1>';
				break;
			case '(':
			case ')':
				t += '<b2>' + cur + '</b2>';
				break;
			case '[':
			case ']':
				t += '<b3>' + cur + '</b3>';
				break;
			// no highlighting
			default:
				t += cur;
				break;
		}
	}
	return t;
}

function highlightCode(highlightKeywords)
{
	const t1 = performance.now();
	fixPres();
	restorePres();

	const preBlocks = get("pre");
	let i = preBlocks.length;
	while (i--)
	{
		const node = preBlocks[i];
		// delete the <pre>s that only contain line numbers
		if(node.textContent && node.textContent.match(/[a-z]/) === null)
		{
			node.parentNode.removeChild(node);
			continue;
		}

		let s = node.innerHTML, r;
		s = s.replace(/<span[^>]*>/g, "");
		s = s.replace(/<\/span>/g, "");

		s = parseCode(s);

		// Everything between angle brackets
		s = s.replace(/(&lt;\/?[^&\r\n]+&gt;)/g, '<xh>$1</xh>');
		// php opening and closing tags
		s = s.replace(/(&lt;\?php)/g, '<b1>$1</b1>');
		s = s.replace(/(\?&gt;)/g, '<b1>$1</b1>');

		if(highlightKeywords === true)
		{
			const keywords = [
				"abstract", "addEventListener", "appendChild", "object", "prototype", "break", "byte", "case", "catch", "char", "class", "const", "continue",
				"debugger", "default", "delete", "do", "document", "documentElement", "double",
				"else", "enum", "export", "extends", "false", "final", "finally", "firstChild", "float", "for", "function",
				"getElementsByClassName", "getElementsByID", "getElementsByTagName", "goto", "if", "implements", "import", "in", "insertBefore",
				"long", "NaN", "native", "new", "null", "onclick", "onload", "onmouseover", "package", "private", "protected", "public", "querySelector", "querySelectorAll", "return",
				"src", "static", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "type", "typeof", "undefined",
				"let", "void", "volatile", "while", "with", "window", "script", "javascript", "document", "createElement", "createTextNode", "getElementsByTagName"
			];
			let j = keywords.length;
			while (j--)
			{
				r = new RegExp("\\b" + keywords[j] + "\\b", "g");
				s = s.replace(r, "<xk>" + keywords[j] + "</xk>");
			}
		}
		node.innerHTML = s;
	}
	// un-highlight elements in comments
	forAll("c1", htmlToText);
	forAll("c2", htmlToText);
	const t2 = performance.now();
	xlog(t2 - t1 + "ms: highlightCode");
}

function htmlToText(elem)
{
	elem.innerHTML = elem.textContent;
}

function makeHeadingsPlainText()
{
	forAll("h1, h2, h3, h4, h5, h6", htmlToText);
}

function getElementsContainingText(selector, text)
{
	if(!selector.length)
		return;
	let i, ii;
	const e = get(selector);
	const tempNode = document.createElement("div");
	if(text && text.length)
	{
		for(i = 0, ii = e.length; i < ii; i++)
			if(e[i].textContent && e[i].textContent.indexOf(text) !== -1 && !e[i].querySelector(selector))
				tempNode.appendChild(e[i]);
	}
	else
	{
		if(e.length)
			for(i = 0, ii = e.length; i < ii; i++)
				tempNode.appendChild(e[i]);
		else
			tempNode.appendChild(e);
	}
	if(tempNode.innerHTML.length)
		document.body.innerHTML = tempNode.innerHTML;
	else
		showMessageBig("Not found");
}

function retrieve(selector)
{
	let i, ii;
	const e = get(selector);
	const tempNode = document.createElement("div");
	if(e.length)
	{
		for(i = 0, ii = e.length; i < ii; i++)
			tempNode.appendChild(e[i]);
	}
	else
	{
		tempNode.appendChild(e);
	}
	if(tempNode.innerHTML.length)
		document.body.innerHTML = tempNode.innerHTML;
	else
		showMessageBig("Not found");
}

function deleteNonContentElements()
{
	if(get(".hl").length)
	{
		del(".hl");
		cleanupGeneral();
		return;
	}
	const sClass = "toget";

	replaceElementsBySelector("article", "div");
	markNavigationalLists();
	deleteNonContentImages();
	deleteEmptyElements("p");
	deleteEmptyElements("div");
	return;

	// const e = get("p, img, h1, h2, pre, ol, cite");
	// for(let i = 0, ii = e.length; i < ii; i++)
	// 	if(e[i].parentNode)
	// 		e[i].parentNode.className = sClass;
	// document.body.classList.remove(sClass);
	// const divs = get("div");
	// let i = divs.length;
	// while(i--)
	// {
	// 	const div = divs[i];
	// 	if(div.className.indexOf(sClass) === -1 && !div.getElementsByClassName(sClass).length)
	// 		div.className = "hl";
	// }
	// document.body.className = "xwrap pad100";
}

function getContentByParagraphCount()
{
	if(get(".hl").length)
	{
		const title = document.title;
		retrieve(".hl");
		setDocTitleSimple(title);
		cleanupGeneral();
		return;
	}
	del(["nav", "footer"]);
	insertStyleHighlight();
	const paras = get("p");
	const totalNumParas = paras.length;
	let i = -1;
	let length = paras.length;
	let candidateDivs = [];
	while(++i < length)
	{
		const tempContainer = paras[i].closest("div");
		if(tempContainer)
			candidateDivs.push(tempContainer);
	}
	i = -1;
	length = candidateDivs.length;
	let numParas = 0;
	let highestNumParas = 0;
	let contentContainer;
	while(++i < length)
	{
		const div = candidateDivs[i];
		numParas = div.getElementsByTagName("p").length;
		div.setAttribute("data-pcount", numParas);
		if(numParas > highestNumParas)
		{
			highestNumParas = numParas;
			contentContainer = div;
		}
	}
	while(contentContainer.getElementsByTagName("p").length < totalNumParas * 0.8 && contentContainer.parentNode && contentContainer.parentNode.tagName !== "BODY")
		contentContainer = contentContainer.parentNode;
	contentContainer.classList.add("hl");
}

function expandMark()
{
	const e = getOne(".hl");
	if(e)
	{
		const ep = e.parentNode;
		if(ep.parentNode && ep.tagName !== 'BODY')
		{
			e.classList.remove("hl");
			ep.classList.add("hl");
			showMessageBig("Marked node is " + createSelector(ep));
		}
	}
}

function cycleThroughTopLevelElements(boolReverse)
{
	const hl = get(".hl");
	console.log(hl);
	if(hl.length && hl.length > 1)
	{
		showMessageError("More than one element is marked");
		return;
	}
	insertStyleHighlight();
	const candidateElements = get("body > div, body > section, body > main, body > nav, body > h1, body > h2");
	printPropOfObjectArray(candidateElements, "tagName");
	let found = false;
	if(boolReverse)
	{
		for(let i = 0, ii = candidateElements.length; i < ii; i++)
		{
			const e = candidateElements[i];
			if(e.classList.contains("hl"))
			{
				found = true;
				e.classList.remove("hl");
				if(i > 0)
					candidateElements[i - 1].classList.add("hl");
				else
					candidateElements[ii - 1].classList.add("hl");
				break;
			}
		}
	}
	else
	{
		for(let i = 0, ii = candidateElements.length; i < ii; i++)
		{
			const e = candidateElements[i];
			if(e.classList.contains("hl"))
			{
				found = true;
				e.classList.remove("hl");
				if(i < ii - 1)
					candidateElements[i + 1].classList.add("hl");
				else
					candidateElements[0].classList.add("hl");
				break;
			}
		}
	}
	if(!found)
		candidateElements[0].classList.add("hl");
}

function deleteSpecificEmptyElements()
{
	deleteEmptyElements("p, tr, li, div, figure");
	deleteEmptyHeadings();
}

function deleteEmptyElements(tag)
{
	const e = get(tag);
	let i = e.length;
	while(i--)
	{
		if( e[i].textContent )
		{
			if(removeWhitespace(e[i].textContent).length === 0 && !e[i].getElementsByTagName("img").length)
				e[i].parentNode.removeChild(e[i]);
		}
		else
		{
			if(!e[i].getElementsByTagName("img").length)
				e[i].parentNode.removeChild(e[i]);
		}
	}
}

function deleteEmptyHeadings()
{
	const e = get("h1, h2, h3, h4, h5, h6");
	let i = e.length;
	while (i--)
	{
		if(e[i].textContent)
		{
			if(removeWhitespace(e[i].textContent).length === 0)
				e[i].parentNode.removeChild(e[i]);
		}
		else
		{
			e[i].parentNode.removeChild(e[i]);
		}
	}
}

function escapeForRegExp(str)
{
	const specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g");
	return str.replace(specials, "\\$&");
}

function removeLineBreaks(s)
{
	s = s.replace(/\r\n/g, " ");
	s = s.replace(/\r/g, " ");
	s = s.replace(/\n/g, " ");
	s = s.replace(/\s+/g, " ");
	return s;
}

function escapeHTML(html)
{
	const escapeElem = createElement("textarea");
	escapeElem.textContent = html;
	return escapeElem.innerHTML;
}

function unescapeHTML(html)
{
	const escapeElem = createElement("textarea");
	escapeElem.innerHTML = html;
	return escapeElem.textContent;
}

function normalizeHTML(html)
{
	return html.replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
}

function highlightTextAcrossTags(node, searchString)
{
	searchString = escapeHTML(searchString.replace(/\s+/g, " "));
	let nodeHTML = node.innerHTML;
	if(~nodeHTML.indexOf(searchString))
	{
		node.innerHTML = nodeHTML.replace(searchString, "<mark>" + searchString + "</mark>");
		return;
	}
	let index1 = node.textContent.indexOf(searchString);
	if(index1 === -1)
	{
		showMessageBig(searchString + " not found in " + node.textContent);
		return;
	}
	let index2 = index1 + searchString.length;
	const childNodes = node.childNodes;
	let childNodeEnd = 0;
	const splitMatches = [];
	for(let j = 0, jj = childNodes.length; j < jj; j++)
	{
		const childNode = childNodes[j];
		const childNodeStart = childNodeEnd;
		childNodeEnd += childNode.textContent.length;
		let partialSearchString;
		let isMatch = false;
		if(index1 >= childNodeStart && index1 < childNodeEnd)
		{
			isMatch = true;
			partialSearchString = childNode.textContent.substring(index1 - childNodeStart, index1 - childNodeStart + searchString.length);
		}
		else if(index1 < childNodeStart && index2 > childNodeEnd)
		{
			isMatch = true;
			partialSearchString = childNode.textContent;
		}
		else if(index2 > childNodeStart && index2 <= childNodeEnd)
		{
			isMatch = true;
			partialSearchString = childNode.textContent.substring(0, index2 - childNodeStart);
		}
		if(isMatch && partialSearchString.length > 5)
		{
			if(childNode.nodeType === 1)
				childNode.innerHTML = "<mark>" + childNode.innerHTML + "</mark>";
			else
				splitMatches.push(partialSearchString);
		}
	}
	console.log(printArray(splitMatches));
	highlightAllMatchesInNode(node, splitMatches);
}

function highlightAllMatchesInNode(node, splitMatches)
{
	let nodeHTML = node.innerHTML;
	let i = splitMatches.length;
	while(i--)
	{
		const regex = new RegExp(splitMatches[i]);
		if(nodeHTML.match(regex))
			nodeHTML = nodeHTML.replace(regex, "<mark>" + splitMatches[i] + "</mark>");
		else
			nodeHTML = "<mark>" + nodeHTML + "</mark>";
	}
	node.innerHTML = nodeHTML;
}

function expandToWordBoundaries(node, selection)
{
	const text = node.textContent;
	let index1 = text.indexOf(selection);
	if(index1 === -1)
		return selection;
	let index2 = index1 + selection.length;
	while(text[index1].match(/[\w\.\?!]/) && index1 > 0)
		index1--;
	while(text[index2] && text[index2].match(/[\w\.\?!]/) && index2 < text.length)
		index2++;
	const expanded = trim(text.substring(index1, index2));
	return expanded;
}

function deselect()
{
	window.getSelection().removeAllRanges();
}

function highlightSelection()
{
	const selection = window.getSelection();
	if(!selection.toString().length)
		return;
	let node = selection.anchorNode;
	let selectionText = trim(removeLineBreaks(selection.toString()));
	while (node.parentNode && (node.textContent.length < selectionText.length || node.nodeType !== 1))
		node = node.parentNode;
	node.innerHTML = normalizeHTML(node.innerHTML);
	if(!node || node.tagName === undefined)
	{
		showMessageBig("Couldn't get anchorNode");
		return;
	}
	if(selectionText.length)
	{
		selectionText = expandToWordBoundaries(node, selectionText);
		highlightTextAcrossTags(node, selectionText);
	}
}

function markSelectionAnchorNode()
{
	const selection = window.getSelection();
	if(!selection.toString().length)
		return;
	let node = selection.anchorNode;
	while (node.parentNode && (node.textContent.length < selection.length || node.nodeType !== 1))
		node = node.parentNode;
	node.classList.add("hl");
	insertStyleHighlight();
	showMessageBig("Marked node is " + createSelector(node));
}

function highlightSelection_old()
{
	let index1, index2;
	let textBeforeSelection, textOfSelection, textAfterSelection;
	if(!window.getSelection().toString().length) return;
	let selection = window.getSelection();
	let node = selection.anchorNode;
	selection = trim(removeLineBreaks(selection.toString()));
	while (node.parentNode && (node.textContent.length < selection.length || node.nodeType !== 1))
		node = node.parentNode;
	if(!node || node.tagName === undefined)
	{
		showMessageBig("Couldn't get anchorNode");
		return;
	}
	let nodeHTML = node.innerHTML;
	nodeHTML = removeLineBreaks(nodeHTML);
	node.innerHTML = nodeHTML;
	if(selection.length)
	{
		index1 = nodeHTML.indexOf(selection);
		if(~index1)
		{
			index2 = index1 + selection.length;
			while(nodeHTML[index1].match(/[^ <>]/) && index1 > 0)
				index1--;
			if(index1 < 10)
				index1 = 0;
			while(nodeHTML[index2] && nodeHTML[index2].match(/[^ <>]/) && index2 < nodeHTML.length )
				index2++;
			if(nodeHTML.length - index2 < 10)
				index2 = nodeHTML.length;
			if(index1 > 0)
				textBeforeSelection = nodeHTML.substr(0, index1);
			else
				textBeforeSelection = "";
			textOfSelection = nodeHTML.substr(index1, index2 - index1);
			textAfterSelection = nodeHTML.substr(index2);
			nodeHTML = textBeforeSelection + "<mark>" + textOfSelection + "</mark>" + textAfterSelection;
			node.innerHTML = nodeHTML;
			return;
		}
		else
		{
			let selectionBegin = selection.substr(0, selection.length -1);
			let selectionEnd = selection.substr(-selection.length -1);
			// const step = Math.max(1, Math.round(selection.length / 20));
			const step = 1;
			while(nodeHTML.indexOf(selectionBegin) === -1 && selectionBegin.length > 1)
				selectionBegin = selectionBegin.substr(0, selectionBegin.length - step);
			while(nodeHTML.indexOf(selectionEnd) < 0 && selectionEnd.length > 1)
				selectionEnd = selectionEnd.substr(-(selectionEnd.length - step));
			index1 = nodeHTML.indexOf(selectionBegin);
			index2 = nodeHTML.indexOf(selectionEnd) + selectionEnd.length;
			if(~index1 && ~index2)
			{
				while(nodeHTML[index1].match(/[^<> ]/) && index1 > 0)
					index1--;
				while(nodeHTML[index2] && nodeHTML[index2].match(/[^<> ]/) && index2 < nodeHTML.length )
					index2++;
				if(index1 < 10)
					index1 = 0;
				if(index2 > nodeHTML.length * 0.9)
					index2 = nodeHTML.length;
				if(index1 > 0)
					textBeforeSelection = nodeHTML.substr(0, index1);
				else
					textBeforeSelection = "";
				textOfSelection = nodeHTML.substr(index1, index2 - index1);
				textAfterSelection = nodeHTML.substr(index2);
				nodeHTML = textBeforeSelection + "<mark>" + textOfSelection + "</mark>" + textAfterSelection;
				const testNode = createElement("div", { innerHTML: nodeHTML });
				if(testNode.textContent.length === node.textContent.length)
					node.innerHTML = nodeHTML;
				else
					showMessageError("highlightSelection failed");
				return;
			}
		}
	}
}

function fixHeadings()
{
	fixParagraphs();
	makeHeadings();
	cleanupHeadings();
}

function fixPres()
{
	replaceElementsBySelector('font', 'span');
	let e, i, s, temp;
	e = get("code");
	i = e.length;
	while(i--)
	{
		if(e[i].innerHTML.toLowerCase().indexOf("<br>") !== -1)
		{
			temp = document.createElement("pre");
			temp.innerHTML = e[i].innerHTML;
			e[i].parentNode.replaceChild(temp, e[i]);
		}
	}
	e = get("pre");
	i = e.length;
	while(i--)
	{
		// Remove any HTML code within the PREs
		s = e[i].innerHTML;
		s = s.replace(/&nbsp;/g, " ");
		s = s.replace(/<\/div>/g, "\r\n");
		s = s.replace(/<\/p>/g, "\r\n");
		//s = s.replace(/<br[^>]*>/g, "\r\n");
		s = s.replace(/<br>/g, "\r\n");
		s = s.replace(/<br\/>/g, "\r\n");
		s = s.replace(/<br \/>/g, "\r\n");
		s = s.replace(/<[^<>]+>/g, "");
		// Calculate spaces per tab
		if(s.match("\n  [^ ]")) {
			s = s.replace(/ {2}/g, "GYZYtab");
		} else if(s.match("\n   [^ ]")) {
			s = s.replace(/ {3}/g, "GYZYtab");
		} else if(s.match("\n    [^ ]")) {
			s = s.replace(/ {4}/g, "GYZYtab");
		} else {
			s = s.replace(/ {4}/g, "GYZYtab");
		}
		s = s.replace(/\t/g, "GYZYtab");
		s = s.replace(/\r\n/g, "GYZYnl");
		s = s.replace(/\n/g, "GYZYnl");
		e[i].innerHTML = s;
	}
}

function restorePres()
{
	const e = get("pre");
	let i, ii;
	for( i = 0, ii = e.length; i < ii; i++ )
	{
		e[i].innerHTML = e[i].innerHTML.replace(/GYZYtab/g, "\t");
		e[i].innerHTML = e[i].innerHTML.replace(/GYZYnl/g, "\n");
		e[i].innerHTML = e[i].innerHTML.replace(/\n+/g, "\n");
	}
}

function fixParagraphs()
{
	fixPres();
	convertDivsToParagraphs();
	let s = document.body.innerHTML;
	s = s.replace(/\s*<br>\s*/g, "<br>");
	s = s.replace(/<br>([a-z])/g, " $1");
	s = s.replace(/\s*<p>\s*/g, "<p>");
	s = s.replace(/\s*<\/p>\s*/g, "</p>");
	s = s.replace(/([a-z\-0-9,])<\/p>\s*<p>([A-Za-z0-9])/g, "$1 $2");
	s = s.replace(/<br>/g, "</p><p>");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/\s+/g, " ");
	//s = s.replace(/<p>\s*<\/p>/g, "");
	//s = s.replace(/<\/p>\s*<p>/g, "</p>\r\n<p>");
	s = s.replace(/<p/g, "\r\n<p");
	s = s.replace(/<div/g, "\r\n<div");
	document.body.innerHTML = s;
	restorePres();
	deleteEmptyElements("p");
	cleanupHeadings();
}

function deleteLinksContainingText(str)
{
	const e = get("a");
	let i = e.length;
	while(i--)
	{
		if(~e[i].textContent.indexOf(str) || ~e[i].href.indexOf(str))
			del(e[i]);
	}
}

function deleteElementsContainingText(selector, str)
{
	if(!(typeof selector === "string" && selector.length))
		return;
	if(!(typeof str === "string" && str.length))
	{
		del(selector);
		return;
	}

	switch(selector)
	{
		case "img": deleteImagesBySrcContaining(str); return;
		case "a": deleteLinksContainingText(str); return;
	}

	const e = get(selector);
	if (e.length)
	{
		let i = e.length;
		while (i--)
		{
			if (e[i].querySelector(selector))
				continue;
			if (e[i].textContent.indexOf(str) >= 0)
				e[i].parentNode.removeChild(e[i]);
		}
	}
	else if (e.parentNode)
	{
		if (e.textContent.indexOf(str) >= 0)
			e.parentNode.removeChild(e);
	}
}

function deleteElementsWithClassContaining(str)
{
	const e = get("*");
	let i = e.length;
	while(i--)
	{
		const node = e[i];
		if(~node.className.indexOf(str))
			del(node);
	}
}

function highlightSpecificNodesContaining(searchString)
{
	showMessageBig("Highlight specific nodes containing text");
	if(!(searchString && searchString.length))
		return;
	const tagNames = ["p", "h1", "h2", "h3", "tr", "li"];
	for(let i = 0, ii = tagNames.length; i < ii; i++)
		highlightNodesContaining(tagNames[i], searchString);
}

function highlightAllTableCellsInRow(tr)
{
	const e = tr.querySelectorAll("td");
	let i = e.length;
	while(i--)
		e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
}

function highlightNodesContaining(selector, str)
{
	if(!(selector && str && selector.length && str.length))
		return;
	const e = get(selector);
	const markerTagOpen = "<mark>";
	const markerTagClose = "</mark>";
	let i = e.length;
	while (i--)
	{
		const node = e[i];
		if(node.querySelector(selector))
			continue;
		if(~node.textContent.indexOf(str))
		{
			switch(node.tagName.toLowerCase())
			{
				case "a":
					node.innerHTML = markerTagOpen + node.innerHTML + markerTagClose;
					break;
				case "tr":
					highlightAllTableCellsInRow(node);
					break;
				default:
					node.classList.add("hl");
					node.innerHTML = markerTagOpen + node.innerHTML + markerTagClose;
					break;
			}
		}
		if(node.tagName.toLowerCase() === "a" && node.href && ~node.href.indexOf(str))
			node.innerHTML = markerTagOpen + node.innerHTML + markerTagClose;
	}
	insertStyleHighlight();
}

function highlightLinksWithHrefContaining(str)
{
	const e = document.getElementsByTagName("a");
	let i = e.length;
	while (i--)
		if(e[i].href.indexOf(str) >= 0)
			e[i].innerHTML = "<mark>" + e[i].innerHTML + "</mark>";
}

function xlog(str, logTag)
{
	let tag;
	if(logTag && logTag.length)
		tag = logTag;
	else
		tag = "h6";
	Nimbus.logString += '<' + tag + ' class="xlog">' + str + '</' + tag + '>\r\n';
}

function ylog(str, tag, prepend)
{
	const tagName = tag || "h6";
	const logElement = createElement(tagName, { className: "xlog", innerHTML: str });
	if(prepend)
		document.body.insertBefore(logElement, document.body.firstChild);
	else
		document.body.appendChild(logElement);
}

function log2(str)
{
	document.body.appendChild(createElement("h2", { className: "xlog", innerHTML: str }));
}

function deleteImagesBySrcContaining(str)
{
	const elems = document.getElementsByTagName("img");
	let i = elems.length;
	while (i--)
	{
		if(elems[i].src.indexOf(str) >= 0)
		{
			xlog("Deleting image with src " + elems[i].src);
			elems[i].parentNode.removeChild(elems[i]);
		}
	}
}

function cleanupWikipedia()
{
	cleanupHead();
	const firstHeading = getOne("h1");
	document.title = firstHeading.textContent;
	del([
		"iframe",
		"script",
		"object",
		"embed",
		"link",
		"#siteNotice",
		"#contentSub",
		"#jump-to-nav",
		"#catlinks",
		"#toctitle",
		"#section_SpokenWikipedia",
		"#footer",
		"#column-one",
		".noprint",
		".rellink",
		".editsection",
		".metadata",
		".internal",
		".dablink",
		".messagebox",
		"#mw-articlefeedback",
		"form",
		"#mw-navigation",
		".mw-editsection",
		"input",
	]);
	replaceElementsBySelector(".thumb", "figure");
	replaceElementsBySelector(".thumbcaption", "figcaption");
	replaceElementsBySelector("sup", "small");
	getBestImageSrc();
	cleanupAttributes();
	document.body.className = "pad100 xwrap";
	insertStyle("img { width: 100%; }", "styleWikipedia", true);
}

function getKeys(obj)
{
	const keys = [];
	let key;
	for(key in obj)
		if(obj.hasOwnProperty && obj.hasOwnProperty(key))
			keys.push(key);
	return keys;
}

function getAttributes(targ)
{
	const divText = document.createElement('div');
	if(targ.tagName)
		divText.innerHTML = "\r\n<b>" + targ.tagName.toLowerCase() + "</b>";
	if(targ.attributes)
	{
		const ta = targ.attributes;
		let str = ' ';
		for (let i = 0; i < ta.length; i++)
		{
			if(ta[i])
			{
				str += "<em>" + ta[i].name + "</em> ";
				if(removeWhitespace(ta[i].value) !== "hovered")
				{
					str += '="' + ta[i].value + '" ';
					str = str.replace(/hovered/g, '');
				}
			}
		}
		divText.innerHTML += str;
		str = '';
		const k = getKeys(targ);
		for (let i = 0; i < k.length; i++)
			if(k[i] !== 'addEventListener') str += k[i] + ' ';
		const events = document.createElement('em');
		events.appendChild(document.createTextNode(str));
		divText.appendChild(events);
		const analyzerdiv = document.getElementById("analyzer");
		analyzerdiv.appendChild(divText);
	}
}

function removeClassFromAll(className)
{
	const e = document.querySelectorAll("." + className);
	let i = e.length;
	showMessageBig("Removing class " + className + " from " + i + " elements");
	while(i--)
		e[i].classList.remove(className);
}

function removeId(id)
{
	let idWithHash = id;
	if(idWithHash.indexOf("#") === -1)
		idWithHash = "#" + id;
	const elem = getOne(idWithHash);
	if(!elem)
	{
		showMessageBig(idWithHash + " not found");
		return;
	}
	elem.id = "";
}

function removeClassFromAllQuiet(className)
{
	const e = document.querySelectorAll("." + className);
	let i = e.length;
	while(i--)
		e[i].classList.remove(className);
}

function cleanupLinks()
{
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		const newLink = createElement("a", { innerHTML: link.innerHTML, href: link.href });
		link.parentNode.replaceChild(newLink, link);
	}
}

function replaceClass(class1, class2)
{
	const e = document.querySelectorAll("." + class1);
	let i = e.length;
	showMessageBig("Replacing " + class1 + " with " + class2 + " on " + i + "elements");
	while(i--)
	{
		e[i].classList.remove(class1);
		e[i].classList.add(class2);
	}
}

function analyze_mouseoverHandler(evt)
{
	const analyzerElem = document.getElementById("analyzer");
	emptyElement(analyzerElem);
	analyzerElem.appendChild(document.createTextNode(''));
	evt.stopPropagation();
	removeClassFromAllQuiet("hovered");
	let target = evt.target;
	target.classList.add("hovered");
	while(target)
	{
		getAttributes(target);
		target = target.parentNode;
	}
}

function cleanupUnicode()
{
	let s = document.body.innerHTML;
	s = s.replace(/\u00e2\u20ac\u0022/g, '"');
	s = s.replace(/\u00e2\u20ac\u2122/g, "'");
	s = s.replace(/\u00e2\u20ac\u00a6/g, "...");
	s = s.replace(/\u00e2\u20ac\u201d/g, "&mdash;");
	s = s.replace(/\u00e2\u20ac\u009d/g, '"');
	s = s.replace(/\u00e2\u20ac\u0153/g, '"');
	s = s.replace(/\u00e2\u20ac\u00a6/g, '"');
	s = s.replace(/\u00e2\u20ac\u02dc/g, "'");

	s = s.replace(/\u00c2/g, " ");
	s = s.replace(/\u00c4\u00fa/g, '"');
	s = s.replace(/\u00c4\u00f9/g, '"');
	s = s.replace(/\u00c4\u00f4/g, "'");
	s = s.replace(/\u00e2\u20ac/g, '"');
	s = s.replace(/\u00c3\u00a9/g, "&eacute;");
	s = s.replace(/\ufffd/g, "&mdash;");
	s = s.replace(/\u00cb\u0153/g, "'");
	s = s.replace(/\u0142/g, "'l");

	s = s.replace(/\s+/g, " ");
	document.body.innerHTML = s;
}

function analyze(onTop)
{
	if(!get("#analyzer"))
	{
		const b = document.createElement("div");
		b.id = "analyzer";
		if(onTop)
			b.className = "onTop";
		document.body.insertBefore(b, document.body.firstChild);
		document.body.addEventListener('mouseover', analyze_mouseoverHandler, false);
		document.body.addEventListener('click', analyze_clickHandler, false);
		document.body.classList.add("analyzer");

		const s = 'body.analyzer { padding-bottom: 300px; }' +
		'#analyzer { padding: 5px 10px; position:fixed; left:0; bottom: 0; width: 50%; min-width: 500px; height: 200px; overflow: hidden; background:#000; color:#aaa; text-align:left; z-index: 2000000000; font:12px verdana; letter-spacing: 0; }' +
		'#analyzer.onTop { bottom: auto; top: 0; }' +
		'#analyzer b { color:#09f; }' +
		'#analyzer em { font-style:normal; color:#F80; }' +
		'.hovered { background: rgba(0, 0, 0, 0.5); color: #FFF; }' +
		'div#analyzer { box-shadow: none; min-height: 200px; margin: 0; }' +
		'#analyzer div { box-shadow: none; margin: 0; padding: 0; }';

		insertStyle(s, "analyzer-style", true);
	}
	else
	{
		document.body.removeEventListener('mouseover', analyze_mouseoverHandler, false);
		document.body.removeEventListener('click', analyze_clickHandler, false);
		del('#analyzer');
		del('#analyzer-style');
		document.body.classList.remove("analyzer");
		removeClassFromAllQuiet("hovered");
	}
}

function analyze_clickHandler(e)
{
	e.stopPropagation();
	if(e.shiftKey && get("#analyzer"))
		prompt("", get("#analyzer").textContent);
}

function indentByDepth(node, depth)
{
	let indentOpen = "";
	let indentClose = "";
	let i = -1;
	while(++i < depth)
	{
		indentOpen += "<blockquote>";
		indentClose += "</blockquote>";
	}
	node.innerHTML = indentOpen + node.innerHTML + indentClose;
}

function wrapElement(node, tag, config)
{
	let s = node.outerHTML;
	let tagOpen = tag;
	if(config)
	{
		if(config.id)
			tagOpen += ' id="' + config.id + '" ';
		if(config.className)
			tagOpen += ' class="' + config.className + '" ';
	}
	s = "<" + tagOpen + ">" + s + "</" + tag + ">";
	node.outerHTML = s;
}

function wrapElementInner(node, tag, config)
{
	let s = node.innerHTML;
	let tagOpen = tag;
	if(config)
	{
		if(config.id)
			tagOpen += ' id="' + config.id + '" ';
		if(config.className)
			tagOpen += ' class="' + config.className + '" ';
	}
	s = "<" + tagOpen + ">" + s + "</" + tag + ">";
	node.innerHTML = s;
}

function isCurrentDomainLink(s)
{
	const urlSegments = s.split("/");
	if(urlSegments[2] === location.hostname)
	{
		if(urlSegments.length === 3)
			return true;
		if(urlSegments.length === 4 && urlSegments[urlSegments.length - 1].length === 0)
			return true;
	}
	return false;
}

function replaceIncorrectHeading()
{
	let heading1, heading1link, temp;
	if(get("h1"))
	{
		heading1 = getOne("h1");
		heading1link = heading1.querySelector("a");
		if(heading1link)
		{
			if(isCurrentDomainLink(heading1link.href))
			{
				temp = createElement("h3", { innerHTML: heading1.innerHTML });
				heading1.parentNode.replaceChild(temp, heading1);
			}
		}
	}
}

function focusField(elem)
{
	if(!elem)
		return;
	removeClassFromAllQuiet("focused");
	elem.focus();
	elem.classList.add("focused");
	showMessageBig(elem.tagName.toLowerCase() + " " + (elem.name || elem.id || elem.className));
	console.log(createSelector(document.activeElement));
}

function focusFormElement()
{
	let len, i, ii, found;
	let inputs = get("input");
	const e = [];
	len = inputs.length;
	if(len === 1)
	{
		focusField(inputs[0]);
		return;
	}
	for (i = 0; i < len; i++)
	{
		const input = inputs[i];
		if(input.name && input.name === "q")
		{
			input.focus();
			return;
		}
		if(input.type)
		{
			if(["hidden", "submit", "reset", "button", "radio", "checkbox", "image"].indexOf(input.type) === -1)
				e.push(input);
		}
		else
		{
			e.push(input);
		}
	}
	inputs = get("textarea");
	len = inputs.length;
	for (i = 0; i < len; i++)
		e.push(inputs[i]);
	found = false;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		if(e[i].classList.contains("focused"))
		{
			found = true;
			if(i < ii-1)
				focusField(e[i + 1]);
			else
				focusField(e[0]);
			break;
		}
	}
	if(!found)
		focusField(e[0]);
	console.log("document.activeElement is " + document.activeElement.name);
}

function focusButton()
{
	let candidateButtons = [];
	const inputElements = get("input");
	let len = inputElements.length;
	for(let i = 0; i < len; i++)
	{
		const inputElement = inputElements[i];
		if(inputElement.type && ["button", "submit"].includes(inputElement.type))
			candidateButtons.push(inputElement);
	}
	const buttonElements = get("button");
	candidateButtons = candidateButtons.concat(buttonElements);
	if(candidateButtons.length === 1)
	{
		focusField(candidateButtons[0]);
		return;
	}
	let found = false;
	for(let i = 0, ii = candidateButtons.length; i < ii; i++)
	{
		if(candidateButtons[i].classList.contains("focused"))
		{
			found = true;
			if(i < ii-1)
				focusField(candidateButtons[i+1]);
			else
				focusField(candidateButtons[0]);
			break;
		}
	}
	if(!found)
		focusField(candidateButtons[0]);
}

function showLog(prepend)
{
	let logDiv;
	if(Nimbus.logString.length > 0)
	{
		logDiv = document.createElement("log");
		logDiv.innerHTML = Nimbus.logString;
		if(prepend === true)
			document.body.insertBefore(logDiv, document.body.firstChild);
		else
			document.body.appendChild(logDiv);
		Nimbus.logString = "";
	}
	else
		ylog("No logs");
}

function highlightLinksInPres()
{
	fixPres();
	restorePres();
	const e = get("pre");
	let i, ii;
	for ( i = 0, ii = e.length; i < ii; i++ )
		if( e[i].textContent.match(/http[s]*:\/\/[^\s\r\n]+/g) )
			e[i].innerHTML = e[i].innerHTML.replace(/(http[s]*:\/\/[^\s\r\n]+)/g, '<a href="' + "$1" + '">' + "$1" + '</a>');
}

function fillForms()
{
	let i, j, jj, e, f, inputType, inputName;
	//
	//	Inputs
	//
	e = get("input");
	i = e.length;
	while(i--)
	{
		if(e[i].hasAttribute("type"))
		{
			inputType = e[i].type;
			if(inputType !== "button" && inputType !== "submit" && inputType !== "image" && inputType !== "hidden" && inputType !== "checkbox" && inputType !== "radio")
			{
				inputName = e[i].getAttribute("name") || e[i].getAttribute("id");
				inputName = inputName.toLowerCase();
				if(inputName)
				{
					if(inputName === "companyname") e[i].value = "";
					else if(inputName.indexOf("first") >= 0) e[i].value = "John";
					else if(inputName.indexOf("last") >= 0) e[i].value = "Doe";
					else if(inputName.indexOf("name") >= 0) e[i].value = "John Doe";
					else if(inputName.indexOf("email") >= 0) e[i].value = "test@test.com";
					else if(inputName.indexOf("day") >= 0) e[i].value = Math.floor(Math.random() * 28);
					else if(inputName.indexOf("year") >= 0) e[i].value = 1980 + Math.floor(Math.random() * 20);
					else if(inputName.indexOf("phone") >= 0) e[i].value = "(00) 0000 0000";
					else if(inputName.indexOf("mobile") >= 0) e[i].value = "0400222333";
					else if(inputName.indexOf("date") >= 0) e[i].value = "23/08/1991";
					else if(inputName.indexOf("suburb") >= 0) e[i].value = "Melbourne";
					else if(inputName.indexOf("postcode") >= 0) e[i].value = "3000";
					else if(inputName.indexOf("state") >= 0) e[i].value = "VIC";
					else if(inputType === "number") e[i].value = 42;
					else if(inputType === "text") e[i].value = e[i].name.replace(/_/g, ' ');
					else if(inputType === "checkbox") e[i].checked = true;
					else if(inputType === "radio") e[i].checked = true;
					else if(inputType !== 'file') e[i].value = inputName.replace(/_/g, ' ');
				}
			}
		}
	}

	//
	//	Textareas
	//
	e = get("textarea");
	i = e.length;
	while(i--)
	{
		e[i].value = "Line 1\r\nLine 2";
	}

	//
	//	Selects
	//
	e = get("select");
	i = e.length;
	while(i--)
	{
		f = e[i].getElementsByTagName("option");
		for(j = 0, jj = f.length; j < jj; j++)
		{
			f[j].removeAttribute("selected");
		}
		const optionIndex = 1 + Math.floor(Math.random() * (j-1));
		if(f[optionIndex])
			f[optionIndex].setAttribute("selected", "selected");
	}

	//
	//	Focus submit button
	//
	e = document.getElementsByTagName("input");
	i = e.length;
	while(i--)
	{
		if(e[i].getAttribute("type") === "submit")
		{
			e[i].focus();
			break;
		}
	}
}

function getElemPropSafe(elem, prop)
{
	if(!elem)
		return null;
	if(elem[prop])
		return elem[prop];
	if(elem.hasAttribute(prop))
		return elem.getAttribute(prop);
	return null;
}

function showTextToHTMLRatio()
{
	let text, html;
	const e = get("body > div, body > main, body > section");
	let i = e.length;
	while(i--)
	{
		text = e[i].textContent;
		html= e[i].innerHTML;
		if(text && html)
			e[i].innerHTML = "<mark>" + Math.floor( text.length / html.length * 100 ) + "</mark>" + e[i].innerHTML;
	}
}

function removeAccesskeys()
{
	const e = get("a");
	let i = e.length;
	while(i--)
		e[i].removeAttribute("accesskey");
}

function showPassword()
{
	const e = get("input");
	let i = e.length;
	while(i--)
	{
		if(e[i].type && e[i].type === "password" && !e[i].classList.contains("showPassword"))
		{
			e[i].addEventListener("keyup", echoPassword, false);
			e[i].classList.add("showPassword");
		}
	}
}

function echoPassword(e)
{
	showMessage(e.target.value, "none", true);
}

function getTimestamp()
{
	const d = new Date();
	return d.getFullYear() + "/" + zeroPad(d.getMonth() + 1) + "/" + zeroPad(d.getDate()) + " " + zeroPad(d.getHours()) + ":" + zeroPad(d.getMinutes()) + ":" + zeroPad(d.getSeconds());
}

function hasClassesContaining(element, arrStr)
{
	const classes = element.className;
	let i = arrStr.length;
	while(i--)
		if(~classes.indexOf(arrStr[i]))
			return true;
	return false;
}

function hasClassesStartingWith(element, strings)
{
	const classes = Array.from(element.classList);
	let i = classes.length;
	let j = strings.length;
	let count = 0;
	while(i-- && count < 1000)
	{
		while(j-- && count < 1000)
		{
			count++;
			if(classes[i].indexOf(strings[j]) === 0)
			{
				return true;
			}
		}
	}
	return false;
}

function looksLikeHeading(element)
{
	if(element.innerHTML.length > 80) return false;
	if(hasClassesStartingWith(element, ["chap", "cn", "ct", "fmh", "title", "h1", "h2"])) return true;
	if(hasClassesContaining(element, ["heading", "chapternumber", "chaptertitle", "h1", "h2"])) return true;
}

function looksLikeExtract(element)
{
	if(element.querySelectorAll("div, p").length > 5) return false;
	if(hasClassesStartingWith(element, ["block", "quote", "extract"])) return true;
	if(hasClassesContaining(element, ["quote", "extract"])) return true;
}

function replaceSingleElement(e, tag)
{
	e.parentNode.replaceChild(createElement(tag, { innerHTML: e.innerHTML }), e);
}

function createTagsByClassName()
{
	let element, e = document.querySelectorAll("div, p");
	let i = e.length;
	while (i--)
	{
		element = e[i];
		if(looksLikeHeading(element)) replaceSingleElement(element, "h2");
		else if (looksLikeExtract(element)) replaceSingleElement(element, "blockquote");
		else if (hasClassesContaining(element, ["index"])) replaceSingleElement(element, "dt");
		else if (hasClassesContaining(element, ["fmtx"])) replaceSingleElement(element, "p");
		else if (hasClassesContaining(element, ["image"])) replaceSingleElement(element, "figure");
		else if (hasClassesContaining(element, ["caption"])) replaceSingleElement(element, "figcaption");
		else if (hasClassesContaining(element, ["note"])) replaceSingleElement(element, "dt");
	}
	e = get("span");
	i = e.length;
	while (i--)
	{
		element = e[i];
		if (hasClassesContaining(element, ["bold"])) replaceSingleElement(element, "b");
		else if (hasClassesContaining(element, ["italic", "txit"])) replaceSingleElement(element, "b");
		else if (hasClassesContaining(element, ["small"])) replaceSingleElement(element, "small");
	}
}

function makeHeadingsByTextLength()
{
	let e = get("div, p");
	const classes = getAllClasses("div, p");
	let headingClasses = [];
	let strClass;
	let selector;
	let averageTextLength;
	for(let j = 0, jj = classes.length; j < jj; j++)
	{
		const className = classes[j];
		selector = "." + className;
		if(selector.length < 2) continue;
		let textLength = 0;
		e = get(selector);
		let i = e.length;
		while(i--)
		{
			if(e[i].textContent.length)
				textLength += e[i].textContent.length;
		}
		averageTextLength = Math.floor(textLength / e.length);
		if(averageTextLength < 80 && averageTextLength > 2 && e.length > 4)
		{
			headingClasses.push({
				className: className,
				averageTextLength: averageTextLength
			});
		}
	}
	console.table(headingClasses);
	headingClasses = headingClasses.sort(function(a, b){
		if(a.averageTextLength > b.averageTextLength) return 1;
		else if(a.averageTextLength < b.averageTextLength) return -1;
		else return 0;
	});
	let headingLevel = 1;
	for(let i = 0, ii = 6; i < ii; i++)
		replaceElementsBySelector("." + headingClasses[i].className, "h" + headingLevel++);
	for(let i = 6, ii = headingClasses.length; i < ii; i++)
		replaceElementsBySelector("." + headingClasses[i].className, "h3");
}

function formatEbook()
{
	createTagsByClassName();
	replaceEmptyParagraphsWithHr();
	makeHeadingsByTextLength();
}

function logMutations(mutations)
{
	let i, ii;
	for(i = 0, ii = mutations.length; i < ii; i++)
	{
		const mutation = mutations[i];
		if(mutation.type === "childList")
		{
			if(mutation.addedNodes.length)
			{
				for(let j = 0, jj = mutation.addedNodes.length; j < jj; j++)
					console.log(padRight("Mutation: added", 25) + createSelector(mutation.addedNodes[j]));
			}
			if(mutation.removedNodes.length)
			{
				for(let j = 0, jj = mutation.removedNodes.length; j < jj; j++)
					console.log(padRight("Mutation: removed", 25) + createSelector(mutation.removedNodes[j]));
			}
		}
		else if(mutation.type === "attributes")
		{
			console.log(padRight("Mutation: attribute", 25) + padRight(createSelector(mutation.target), 50) + "'" + mutation.attributeName + "' changed to '" + mutation.target.getAttribute(mutation.attributeName) + "'");
		}
	}
}

function toggleMutationObserver(watchAttributes)
{
	if(Nimbus.isObservingMutations)
	{
		Nimbus.observer.disconnect();
		Nimbus.isObservingMutations = false;
		showMessageBig("Stopped observing mutations");
		return;
	}
	Nimbus.observer = new MutationObserver(logMutations);
	let config = { childList: true };
	let message = "Observing mutations";
	if(watchAttributes)
	{
		config.attributes = true;
		config.subtree = true;
		message += " with attributes";
	}
	Nimbus.observer.observe(getOne("body"), config);
	showMessageBig(message);
	Nimbus.isObservingMutations = true;
}

function insertTab(evt)
{
	const targ = evt.target;
	evt.preventDefault();
	evt.stopPropagation();
	const iStart = targ.selectionStart;
	const iEnd = targ.selectionEnd;
	targ.value = targ.value.substr(0, iStart) + '\t' + targ.value.substr(iEnd, targ.value.length);
	targ.setSelectionRange(iStart + 1, iEnd + 1);
}

function handleConsoleInput(evt, consoleType)
{
	const userInputElement = getOne("#userInput");
	if(!userInputElement)
		return;
	const inputText = userInputElement.value;
	if (!inputText || !inputText.length)
		return;
	if(consoleType === "js")
		Nimbus.jsConsoleText = inputText;
	else if(consoleType === "css")
		Nimbus.cssConsoleText = inputText;
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	switch(evt.keyCode)
	{
		case KEYCODES.ENTER:
			if(evt[ctrlOrMeta])
			{
				if(consoleType === "js")
					eval(inputText);
				else if(consoleType === "css")
					insertStyle(inputText, "userStyle", true);
			}
			break;
		case KEYCODES.TAB:
			insertTab(evt);
			return false;
		case KEYCODES.ESCAPE:
			toggleConsole();
			break;
	}
}

function getConsoleHistory(consoleType)
{
	switch(consoleType)
	{
		case "css": return Nimbus.cssConsoleText || "";
		case "js": return Nimbus.jsConsoleText || "";
		default: return "";
	}
}

function toggleConsole(consoleType)
{
	if(get("#userInputWrapper"))
	{
		del("#userInputWrapper");
		del("#styleUserInputWrapper");
		return;
	}
	if(!consoleType || !["css", "js"].includes(consoleType))
	{
		showMessageError("toggleConsole needs a consoleType");
		return;
	}
	let dialogStyle;
	const consoleBackgroundColor = consoleType === "css" ? "#036" : "#000";
	dialogStyle = '#userInputWrapper { position: fixed; bottom: 0; left: 0; right: 0; height: 30vh; z-index: 1000000000; }' +
		'#userInput { background: ' + consoleBackgroundColor + '; color: #FFF; font: bold 18px Consolas, monospace; width: 100%; height: 100%; padding: 10px; border: 0; outline: 0; }';
	insertStyle(dialogStyle, "styleUserInputWrapper", true);

	const inputTextareaWrapper = createElement("div", { id: "userInputWrapper" });
	const inputTextarea = createElement("textarea", { id: "userInput", value: getConsoleHistory(consoleType) });
	const handleKeyDown = function(event){ handleConsoleInput(event, consoleType); };
	inputTextarea.addEventListener("keydown", handleKeyDown);
	inputTextareaWrapper.appendChild(inputTextarea);
	document.body.appendChild(inputTextareaWrapper);
	inputTextarea.focus();
}

function markUserLinks()
 {
	forAll("a", function(link){
		if(link.href && containsAnyOfTheStrings(link.href, ["/u/", "/user", "/member"]) && link.parentNode && link.parentNode.tagName !== "USER")
			wrapElement(link, "user");
	});
 }

function markUppercaseParagraphs()
{
	const e = get("p");
	let i = e.length;
	while(i--)
	{
		var s = e[i].textContent;
		var cUpper = 0,
			cLower = 0;
		cUpper = s.match(/[A-Z]/g);
		cLower = s.match(/[a-z]/g);
		if (cUpper && (!cLower || cUpper.length > cLower.length))
			e[i].className = "hl";
	}
	insertStyleHighlight();
}

function markNumericParagraphs()
{
	const e = get("p");
	let i = e.length;
	while(i--)
	{
		var s = e[i].textContent;
		if(s && !isNaN(Number(s)))
			e[i].className = "hl";
	}
	insertStyleHighlight();
}

function markDivDepth()
{
	const divs = get("div");
	let i = divs.length;
	let node, level;
	while(i--)
	{
		node= divs[i];
		level = 0;
		while(node.parentNode)
		{
			node = node.parentNode;
			level++;
		}
		divs[i].className = "level" + level;
	}
	showDocumentStructureWithNames();
}

function numberDivs()
{
	const e = get("section, div");
	let i = e.length;
	while(i--)
		e[i].id = "i" + i;
	showDocumentStructureWithNames();
}

function delRange(m, n)
{
	const numDivs = get("div").length || 0;
	if(typeof n === "undefined")
		n = numDivs - 1;
	for(let i = m; i <= n; i++)
		del("#i" + i);
}

function toNumber(s)
{
	if(!(typeof s === "string" && s.length))
		return false;
	const noCommas = s.replace(/,/g, "");
	const n = Number(trim(noCommas));
	return !isNaN(n) ? n : false;
}

function getPagerLinks()
{
	const e = get("a");
	let i, ii;
	const pagerWrapper = createElement("h1", { textContent: "Pages: " });
	let count = 0;
	for(i = 0, ii = e.length; i < ii; i++)
	{
		let s = e[i].textContent;
		if(trim(s).length && !isNaN(Number(s)))
		{
			count++;
			pagerWrapper.appendChild(createElement("a", { href: e[i].href, textContent: e[i].textContent || "[no text]" }));
			pagerWrapper.appendChild(document.createTextNode(" "));
		}
	}
	if(count)
	{
		document.body.appendChild(pagerWrapper);
		pagerWrapper.querySelector("a").focus();
	}
	else
		showMessageBig("No pager links found");
	createPagerFromSelect();
}

function createPagerFromSelect()
{
	const selects = get("select");
	let j = selects.length;
	let i, ii;
	while (j--)
	{
		const select = selects[j];
		for (i = 0, ii = select.length; i < ii; i++)
		{
			const pagerWrapper = createElement("h3");
			pagerWrapper.appendChild(createElement("a", { href: select[i].value, textContent: select[i].textContent || i + 1 }));
			document.body.appendChild(pagerWrapper);
		}
	}
	document.body.appendChild(createElement("hr"));
}

function logAllClasses(selector)
{
	console.log(getAllClasses(selector).join("\n"));
}

function getAllClasses(selector)
{
	const t1 = performance.now();
	let sel = "*";
	if(selector && selector.length)
		sel = selector;
	const nodes = get(sel);
	const classes = {};
	let i = nodes.length;
	while(i--)
	{
		const classList = Array.from(nodes[i].classList);
		if(!classList.length)
		{
			continue;
		}
		const elementClasses = classList.join('.');
		const elementClassesSanitized = elementClasses.replace(/[^a-zA-Z0-9]+/g, '');
		classes[elementClassesSanitized] = elementClasses;
	}
	const keys = Object.keys(classes);
	let result = [];
	for(let j = 0, jj = keys.length; j < jj; j++)
	{
		result.push(classes[keys[j]]);
	}
	const t2 = performance.now();
	console.log(t2 - t1 + " ms: getAllClasses");
	return result;
}

function revealLinkHrefs()
{
	const e = get("a");
	let i = e.length;
	while(i--)
	{
		const link = e[i];
		if(link.getElementsByTagName("img").length)
			continue;
		link.textContent = link.getAttribute("href");
	}
}

function humanizeUrl(s)
{
	const matches = s.match(/[0-9A-Za-z_\-\+]+/g);
	if(!matches)
		return s;
	let i = matches.length;
	let longestMatch = matches[i - 1];
	while(i--)
		if(matches[i].length > longestMatch.length)
			longestMatch = matches[i];
	return longestMatch;
}

function revealEmptyLinks()
{
	const e = get("a");
	let i = e.length;
	while(i--)
	{
		const link = e[i];
		if(!link.textContent.length && link.href.length)
			link.textContent = humanizeUrl(link.href);
	}
}

function makeLinkTextPlain()
{
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		if(!link.getElementsByTagName("img").length && link.innerHTML !== link.textContent)
			link.innerHTML = link.textContent;
	}
}

function inject()
{
	document.body.classList.add("nimbusDark");
	document.addEventListener("keydown", handleKeyDown, false);
	showPassword();
	removeAccesskeys();
	insertStyleHighlight();
	insertStyleAnnotations();
	xlog("Referrer: " + document.referrer);
	xlog("Page loaded at " + getTimestamp());
	doStackOverflow();
	showMessageBig("Nimbus loaded");
}

function isIncorrectType(x, type)
{
	if(typeof x === type)
		return false;
	console.warn("Expected " + x + " to be " + type + "; got " + typeof x);
	return true;
}

function timer(identifier, durationSeconds)
{
	let errorLog = '';
	if(isIncorrectType(identifier, "string") || identifier.match(/[^a-zA-Z0-9]/)) errorLog += 'Invalid argument: identifier\r\n';
	if(isIncorrectType(durationSeconds, "number")) errorLog += 'Invalid argument: durationSeconds\r\n';
	if(getOne("#" + identifier + "Wrapper") || getOne("#" + identifier + "Element")) errorLog += 'Error: element with that id already exists\r\n';
	if(errorLog.length)
	{
		console.warn(errorLog);
		return;
	}

	const id = identifier;
	let timeCreated = new Date().getTime();
	let durationMs = durationSeconds * 1000;
	let timerInterval;

	const timerWrapper = createElement("progressbar", { id: id + "Wrapper", className: "progressBarContainer" });
	const timerElement = createElement("progressbar", { id: id + "Element", className: "progressBar" });
	timerWrapper.appendChild(timerElement);
	document.body.appendChild(timerWrapper);
	const style = 'progressbar { display: block; height: 20px; }' +
		'.progressBarContainer { border: 2px solid #AAA; background: #000; width: 200px; }' +
		'.progressBar { background: #AAA; width: 0; }';
	insertStyle(style, "styleTimerProgressBar", false);

	function start()
	{
		timeCreated = new Date().getTime();
		timerInterval = setInterval(update, 1000);
	}

	function stop()
	{
		clearInterval(timerInterval);
	}

	function update()
	{
		const timeElapsedMs = new Date() - new Date(timeCreated);
		const percentage = Math.min(100, 100 * timeElapsedMs / durationMs);
		getOne("#" + id + "Element").setAttribute("style", "width: " + percentage + "%");
		if(percentage >= 100)
		{
			stop();
		}
	}

	function reset(durationSeconds)
	{
		if(typeof durationSeconds === "number")
			durationMs = durationSeconds * 1000;
		timeCreated = new Date().getTime();
	}

	function destroy()
	{
		stop();
		del("#" + id + "Wrapper");
	}

	return { start, stop, update, reset, destroy };
}

const autoCompleteInputBox = (function(){

	const inputComponent = Nimbus.autoCompleteInputComponent;

	function updateInputField()
	{
		if (inputComponent.currentIndex !== -1)
		{
			if(inputComponent.matches[inputComponent.currentIndex])
				getOne("#autoCompleteInput").value = inputComponent.matches[inputComponent.currentIndex];
		}
	}

	function highlightPrevMatch()
	{
		if (inputComponent.currentIndex > 0)
		{
			inputComponent.currentIndex--;
		}
		renderMatches();
	}

	function highlightNextMatch()
	{
		if (inputComponent.currentIndex < inputComponent.matches.length - 1)
		{
			inputComponent.currentIndex++;
		}
		renderMatches();
	}

	function onAutoCompleteInputKeyUp(evt)
	{
		var inputText = getOne("#autoCompleteInput").value;
		if (!inputText)
		{
			clearMatches();
			return;
		}
		showMatches(inputText);
		switch (evt.keyCode)
		{
			case 9: updateInputField(); break;
			case 13: updateInputField(); executeFunction(); break;
		}
	}

	function onAutoCompleteInputKeyDown(evt)
	{
		switch (evt.keyCode)
		{
			case 9: evt.preventDefault(); break;
			case 27: close(); break;
			case 38: highlightPrevMatch(); break;
			case 40: highlightNextMatch(); break;
		}
	}

	function renderMatches()
	{
		let s = "";
		for (let i = 0, ii = inputComponent.matches.length; i < ii; i++)
		{
			if (inputComponent.currentIndex === i) s += '<match class="current">' + inputComponent.matches[i] + "</match>";
			else s += '<match>' + inputComponent.matches[i] + "</match>";
		}
		get("#autoCompleteMatches").innerHTML = s;
	}

	function showMatches(str)
	{
		if (!str || !str.length || str.length < 2)
		{
			emptyElement(get("#autoCompleteMatches"));
			inputComponent.currentIndex = -1;
			return;
		}
		str = str.toLowerCase();

		inputComponent.matches = [];
		const commands = Object.keys(Nimbus.availableFunctions);
		for (var i = 0, ii = commands.length; i < ii; i++)
		{
			if (~commands[i].toLowerCase().indexOf(str))
				inputComponent.matches.push(commands[i]);
		}
		renderMatches();
	}

	function clearMatches()
	{
		inputComponent.matches = [];
		inputComponent.currentIndex = -1;
		renderMatches();
	}

	function open()
	{
		const style = 'autocompleteinputwrapper { display: block; width: 800px; height: 40vh; position: fixed; left: 0; top: 0; right: 0; bottom: 0; margin: auto; }' +
			'autocompleteinputwrapper input { width: 100%; height: 2rem; font-size: 32px; background: #000; color: #FFF; border: 0; outline: 0; }' +
			'autocompleteinputwrapper matches { display: block; background: #222; color: #CCC; }' +
			'autocompleteinputwrapper match { display: block; padding: 2px 10px; font-size: 24px; }' +
			'autocompleteinputwrapper match.current { background: #303030; color: #FFF; }' +
			'autocompleteinputwrapper em { display: inline-block; width: 200px; }';
		insertStyle(style, "styleAutoCompleteInputBox", true);
		const dialogWrapper = createElement("autocompleteinputwrapper", { id: "autoCompleteInputWrapper" });
		const inputElement = createElement("input", { id: "autoCompleteInput" });
		const optionsList = createElement("matches", { id: "autoCompleteMatches" });
		inputElement.addEventListener("keyup", onAutoCompleteInputKeyUp);
		inputElement.addEventListener("keydown", onAutoCompleteInputKeyDown);
		dialogWrapper.appendChild(inputElement);
		dialogWrapper.appendChild(optionsList);
		document.body.appendChild(dialogWrapper);
		inputElement.focus();
	}

	function close()
	{
		del("#autoCompleteInputWrapper");
	}

	function executeFunction()
	{
		const command = getOne("#autoCompleteInput").value;
		clearMatches();
		runCommand(command);
		close();
	}

	return {
		open: open,
		close: close,
	};

}()); //	End autoCompleteInputBox

function main()
{
	let load = true;
	if(location.hostname)
	{
		switch (location.hostname)
		{
			case "maps.google.com.au":
			case "maps.google.com":
				load = false;
				break;
			case "en.wikipedia.org":
			case "secure.wikimedia.org":
				cleanupWikipedia();
				break;
			case "en.m.wikipedia.org":
				location.href = location.href.replace(/en\.m\./, "en.");
				break;
		}
	}
	if(load)
		setTimeout(inject, 200);
	else
		showMessageBig("Not injected");
}

//
//
//	Keyboard shortcuts
//
//
function handleKeyDown(e)
{
	let shouldPreventDefault = true;
	let ctrlOrMeta = "ctrlKey";
	if(navigator.userAgent.indexOf("Macintosh") !== -1)
		ctrlOrMeta = "metaKey";
	if(!(e.altKey || e.shiftKey || e[ctrlOrMeta]))
	{
		return;
	}
	const db = document.body;
	const k = e.keyCode;
	//
	//	Alt
	//
	if(e.altKey && !e.shiftKey && !e[ctrlOrMeta])
	{
		switch (k)
		{
			case KEYCODES.TILDE: highlightSelection(); break;
			case KEYCODES.NUMPAD1: fillForms(); break;
			case KEYCODES.NUMPAD2: autoCompleteInputBox.open(); break;
			case KEYCODES.NUMPAD4: forceReloadCss(); break;
			case KEYCODES.F1: makeHeadingFromSelection("h1"); break;
			case KEYCODES.F2: makeHeadingFromSelection("h2"); break;
			case KEYCODES.F3: makeHeadingFromSelection("h3"); break;
			case KEYCODES.ONE: cleanupGeneral(); break;
			case KEYCODES.TWO: deleteImages(); break;
			case KEYCODES.THREE: toggleClass(db, "xwrap"); break;
			case KEYCODES.FOUR: deleteSmallImages(); break;
			case KEYCODES.FIVE: buildGallery(); break;
			case KEYCODES.SIX: deleteIframes(); break;
			case KEYCODES.SEVEN: replaceCommentsWithPres(); break;
			case KEYCODES.EIGHT: toggleBlockEditMode(); break;
			case KEYCODES.NINE: toggleStyleShowClasses(); break;
			case KEYCODES.ZERO: setDocTitle(); break;
			case KEYCODES.I: toggleConsole("css"); break;
			case KEYCODES.A: cycleClass(db, ["xDontShowLinks", "xHE", ""]); break;
			case KEYCODES.C: getContentByParagraphCount(); break;
			case KEYCODES.D: deleteSpecificEmptyElements(); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements (optionally containing text)", deleteElementsContainingText); break;
			case KEYCODES.J: regressivelyUnenhance(); break;
			case KEYCODES.K: toggleConsole("js"); break;
			case KEYCODES.L: showLog(); break;
			case KEYCODES.M: autoCompleteInputBox.open(); break;
			case KEYCODES.N: numberDivs(); break;
			case KEYCODES.O: getSelectionOrUserInput("Highlight all occurrences of string", highlightAllMatches, true); break;
			case KEYCODES.P: fixParagraphs(); break;
			case KEYCODES.Q: fixHeadings(); break;
			case KEYCODES.R: highlightAnchorNode(); break;
			case KEYCODES.U: del("ul"); del("dl"); break;
			case KEYCODES.W: cleanupGeneral_light(); break;
			case KEYCODES.X: toggleClass(db, "xShowImages"); break;
			case KEYCODES.Y: callFunctionWithArgs("Highlight elements containing text", highlightNodesContaining); break;
			case KEYCODES.Z: cleanupUnicode(); break;
			case KEYCODES.F12: highlightCode(); break;
			case KEYCODES.FORWARD_SLASH: showPassword(); focusFormElement(); break;
			case KEYCODES.DELETE: deleteMarkedElements(); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: cycleThroughTopLevelElements(); break;
			case KEYCODES.SQUARE_BRACKET_OPEN: cycleThroughTopLevelElements(true); break;
			default: shouldPreventDefault = false;
		}
		if(shouldPreventDefault)
			e.preventDefault();
	}
	//
	//	Alt-Shift
	//
	else if(e.altKey && e.shiftKey && !e[ctrlOrMeta])
	{
		e.preventDefault();
		switch (k)
		{
			case KEYCODES.ZERO: getSelectionOrUserInput("Enter document title", setDocTitle, true); break;
			case KEYCODES.ONE: showResources(); break;
			case KEYCODES.TWO: replaceImagesWithTextLinks(); break;
			case KEYCODES.FIVE: buildSlideshow(); break;
			case KEYCODES.G: callFunctionWithArgs("Retrieve elements (optionally containing text)", getElementsContainingText); break;
			case KEYCODES.A: annotate(); break;
			case KEYCODES.C: deleteNonContentElements(); break;
			case KEYCODES.D: del("log"); break;
			case KEYCODES.P: getPagerLinks(); break;
			case KEYCODES.R: highlightAnchorNode("blockquote"); break;
			case KEYCODES.K: showPrintLink(); break;
			case KEYCODES.L: logout(); break;
			case KEYCODES.W: cleanupAttributes(); break;
			case KEYCODES.FORWARD_SLASH: focusButton(); break;
			case KEYCODES.F12: highlightCode(true); break;
		}
	}
	//
	//	Ctrl-Alt or Meta-Alt
	//
	else if(e.altKey && e[ctrlOrMeta] && !e.shiftKey)
	{
		shouldPreventDefault = true;
		switch (k)
		{
			case KEYCODES.SQUARE_BRACKET_OPEN: changeGalleryImage("prev"); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: changeGalleryImage("next"); break;
			case KEYCODES.LEFTARROW: changePage("prev"); break;
			case KEYCODES.RIGHTARROW: changePage("next"); break;
			case KEYCODES.UPARROW: expandMark(); break;
			case KEYCODES.ONE: toggleStyleNegative(); break;
			case KEYCODES.TWO: toggleStyleSimpleNegative(); break;
			case KEYCODES.THREE: toggleStyleGrey(); break;
			case KEYCODES.FOUR: toggleStyleWhite(); break;
			case KEYCODES.A: toggleShowAriaAttributes(); break;
			case KEYCODES.E: callFunctionWithArgs("Replace elements by selector", replaceElementsBySelector, 2); break;
			case KEYCODES.F: del(["object", "embed", "video"]); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements with class containing the string", deleteElementsWithClassContaining); break;
			case KEYCODES.H: getSelectionOrUserInput("Mark elements by selector", markElementsBySelector, true); break;
			case KEYCODES.L: callFunctionWithArgs("Mark elements by CSS property value", markElementsWithCssRule, 2); break;
			case KEYCODES.V: showDocumentStructure(); break;
			case KEYCODES.B: showDocumentStructureWithNames(); break;
			case KEYCODES.N: showDocumentStructure2(); break;
			case KEYCODES.M: customPrompt("Enter command").then(runCommand); break;
			case KEYCODES.O: customPrompt("Highlight block elements containing").then(highlightSpecificNodesContaining); break;
			case KEYCODES.R: wrapAnchorNodeInTag(); break;
			case KEYCODES.T: markTableRowsAndColumns(); break;
			case KEYCODES.W: markElementsWithSetWidths(); break;
			case KEYCODES.Z: markSelectionAnchorNode(); break;
			case KEYCODES.F12: analyze(); break;
			default: shouldPreventDefault = false; break;
		}
		if(shouldPreventDefault)
			e.preventDefault();
	}
	//
	//	Ctrl-Alt-Shift
	//
	else if(e.altKey && e[ctrlOrMeta] && e.shiftKey)
	{
		e.preventDefault();
		switch(k)
		{
			case KEYCODES.A: toggleShowAriaProblems(); break;
			case KEYCODES.D: deselect(); break;
			case KEYCODES.Z: deselect(); break;
			case KEYCODES.E: callFunctionWithArgs("Replace elements by classes containing", replaceElementsByClassesContaining, 2); break;
			case KEYCODES.F: createTagsByClassName(); break;
			case KEYCODES.H: unhighlightAll(); break;
			case KEYCODES.M: markOverlays(); break;
			case KEYCODES.S: forceReloadCss(); break;
			case KEYCODES.F12: analyze(true); break;
		}
	}
	window.focus();
}

main();
