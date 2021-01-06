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
//	Copyright (C) 2008-2020 Nimish Jha
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

const noop = function(){};
let consoleLog = noop;
let consoleWarn = noop;
let consoleError = noop;

const Nimbus = {
	logString: "",
	messageTimeout: null,
	KEYCODES: {
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
		MINUS: 173,
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
	},
	availableFunctions: {
		addLinksToLargerImages: addLinksToLargerImages,
		annotate: annotate,
		appendMetadata: appendMetadata,
		buildGallery: buildGallery,
		buildSlideshow: buildSlideshow,
		cycleThroughDocumentHeadings: cycleThroughDocumentHeadings,
		cleanupAttributes: cleanupAttributes,
		cleanupAttributes_regex: cleanupAttributes_regex,
		cleanupGeneral: cleanupGeneral,
		cleanupGeneral_light: cleanupGeneral_light,
		cleanupHead: cleanupHead,
		cleanupHeadings: cleanupHeadings,
		cleanupLinks: cleanupLinks,
		convertDivsToParagraphs: convertDivsToParagraphs,
		createListsFromBulletedParagraphs: createListsFromBulletedParagraphs,
		groupMarkedElements: groupMarkedElements,
		copyAttribute: copyAttribute,
		createPagerFromSelect: createPagerFromSelect,
		createTagsByClassName: createTagsByClassName,
		cycleFocusOverFormFields: cycleFocusOverFormFields,
		del: del,
		deleteBySelectorAndText: deleteBySelectorAndText,
		deleteByClassOrIdContaining: deleteByClassOrIdContaining,
		deleteEmptyElements: deleteEmptyElements,
		deleteEmptyHeadings: deleteEmptyHeadings,
		deleteIframes: deleteIframes,
		deleteImages: deleteImages,
		deleteImagesSmallerThan: deleteImagesSmallerThan,
		deleteMessage: deleteMessage,
		deleteNodesBetweenMarkers: deleteNodesBetweenMarkers,
		deleteNonContentClasses: deleteNonContentClasses,
		deleteNonContentElements: deleteNonContentElements,
		deleteNonContentImages: deleteNonContentImages,
		deleteNonContentLists: deleteNonContentLists,
		deleteSmallImages: deleteSmallImages,
		deleteEmptyBlockElements: deleteEmptyBlockElements,
		delRange: delRange,
		deselect: deselect,
		disableConsoleLogs: disableConsoleLogs,
		edit: toggleContentEditable,
		editDocumentTitle: editDocumentTitle,
		enableConsoleLogs: enableConsoleLogs,
		enableClickToCollectUrls: enableClickToCollectUrls,
		disableClickToCollectUrls: disableClickToCollectUrls,
		fillForms: fillForms,
		fixBrsInHeadings: fixBrsInHeadings,
		fixCdnImages: fixCdnImages,
		fixEmptyAnchors: fixEmptyAnchors,
		fixHeadings: fixHeadings,
		fixParagraphs: fixParagraphs,
		fixPres: fixPres,
		focusButton: focusButton,
		forAll: forAll,
		forAllMarked: forAllMarked,
		forceReloadCss: forceReloadCss,
		formatEbook: formatEbook,
		generateTableOfContents: generateTableOfContents,
		getAllCssRulesMatching: getAllCssRulesMatching,
		getBestImageSrc: getBestImageSrc,
		getContentByParagraphCount: getContentByParagraphCount,
		markByChildrenHavingTheExactText: markByChildrenHavingTheExactText,
		markByClassOrIdContaining: markByClassOrIdContaining,
		markElementsWithChildSpanning: markElementsWithChildSpanning,
		retrieveBySelectorAndText: retrieveBySelectorAndText,
		retrieveLargeImages: retrieveLargeImages,
		getPagerLinks: getPagerLinks,
		listSelectorsWithLightBackgrounds: listSelectorsWithLightBackgrounds,
		persistStreamingImages: persistStreamingImages,
		highlightAllMatches: highlightAllMatches,
		highlightCode: highlightCode,
		highlightFirstParentByText: highlightFirstParentByText,
		highlightLinksInPres: highlightLinksInPres,
		highlightLinksWithHrefContaining: highlightLinksWithHrefContaining,
		highlightBySelectorAndText: highlightBySelectorAndText,
		markByTagNameAndText: markByTagNameAndText,
		highlightSelection: highlightSelection,
		highlightWithinPreformattedBlocks: highlightWithinPreformattedBlocks,
		htmlToText: htmlToText,
		ih: forceImageHeight,
		insertElementBeforeSelectionAnchor: insertElementBeforeSelectionAnchor,
		insertHrBeforeAll: insertHrBeforeAll,
		insertStyle: insertStyle,
		insertStyleHighlight: insertStyleHighlight,
		iw: forceImageWidth,
		groupAdjacentElements: groupAdjacentElements,
		joinMarkedElements: joinMarkedElements,
		joinParagraphsByLastChar: joinParagraphsByLastChar,
		logAllClassesFor: logAllClassesFor,
		logAllClassesForCommonElements: logAllClassesForCommonElements,
		makeButtonsReadable: makeButtonsReadable,
		makeHashLinksRelative: makeHashLinksRelative,
		makeHeadings: makeHeadings,
		splitByBrs: splitByBrs,
		replaceHeadingClassesByTextLength: replaceHeadingClassesByTextLength,
		makePlainText: makePlainText,
		makeReferencesSemantic: makeReferencesSemantic,
		mark: mark,
		showDivDepth: showDivDepth,
		markBySelector: markBySelector,
		markBlockElementsContainingText: markBlockElementsContainingText,
		markByCssRule: markByCssRule,
		markElementsWithSetWidths: markElementsWithSetWidths,
		markNavigationalLists: markNavigationalLists,
		markNumericElements: markNumericElements,
		markOverlays: markOverlays,
		highlightQuotes: highlightQuotes,
		highlightUserLinks: highlightUserLinks,
		numberTableRowsAndColumns: numberTableRowsAndColumns,
		markUppercaseElements: markUppercaseElements,
		numberDivs: numberDivs,
		om: toggleMutationObserver,
		regressivelyUnenhance: regressivelyUnenhance,
		remove: remove,
		removeAccessKeys: removeAccessKeys,
		removeAllHighlights: removeAllHighlights,
		removeAttributeOf: removeAttributeOf,
		removeClassFromAll: removeClassFromAll,
		removeColorsFromInlineStyles: removeColorsFromInlineStyles,
		removeEmojis: removeEmojis,
		removeEventListenerAttributes: removeEventListenerAttributes,
		removeHighlightsFromMarkedElements: removeHighlightsFromMarkedElements,
		removeInlineStyles: removeInlineStyles,
		removeQueryStringFromImageSources: removeQueryStringFromImageSources,
		removeQueryStringFromLinks: removeQueryStringFromLinks,
		removeSpanTags: removeSpanTags,
		replaceAudio: replaceAudio,
		replaceClass: replaceClass,
		replaceCommentsWithPres: replaceCommentsWithPres,
		replaceDiacritics: replaceDiacritics,
		replaceByClassOrIdContaining: replaceByClassOrIdContaining,
		replaceElementsBySelector: replaceElementsBySelector,
		replaceEmptyParagraphsWithHr: replaceEmptyParagraphsWithHr,
		replaceFontTags: replaceFontTags,
		replaceIframes: replaceIframes,
		replaceImagesWithTextLinks: replaceImagesWithTextLinks,
		replaceMarkedElements: replaceMarkedElements,
		replaceTables: replaceTables,
		normalizeAllWhitespace: normalizeAllWhitespace,
		normaliseWhitespaceForParagraphs: normaliseWhitespaceForParagraphs,
		replaceSpansWithTextNodes: replaceSpansWithTextNodes,
		replaceSpecialCharacters:replaceSpecialCharacters,
		rescueOrphanedTextNodes: rescueOrphanedTextNodes,
		restorePres: restorePres,
		retrieve: retrieve,
		revealEmptyLinks: revealEmptyLinks,
		revealLinkHrefs: revealLinkHrefs,
		sanitizeTitle: sanitizeTitle,
		setAttributeOf: setAttributeOf,
		setDocTitle: setDocTitle,
		setReplacementTag: setReplacementTag,
		simplifyClassNames: simplifyClassNames,
		forceImageWidth: forceImageWidth,
		showPrintLink: showPrintLink,
		showResources: showResources,
		showSavedStreamingImages: showSavedStreamingImages,
		showSelectorsFor: showSelectorsFor,
		showTags: showTags,
		toggleBlockEditMode: toggleBlockEditMode,
		toggleContentEditable: toggleContentEditable,
		toggleHighlightSelectionMode: toggleHighlightSelectionMode,
		toggleMutationObserver: toggleMutationObserver,
		toggleShowDocumentBlockStructure: toggleShowDocumentBlockStructure,
		toggleShowDocumentStructure: toggleShowDocumentStructure,
		toggleShowDocumentStructureWithNames: toggleShowDocumentStructureWithNames,
		toggleStyleGrey: toggleStyleGrey,
		toggleStyleNegative: toggleStyleNegative,
		toggleStyleShowClasses: toggleStyleShowClasses,
		toggleStyleWhite: toggleStyleWhite,
		unmark: unmark,
		unmarkAll: unmarkAll,
		wrapAnchorNodeInTag: wrapAnchorNodeInTag,
		xlog: xlog,
		xPathMark: xPathMark,
		ylog: ylog,
	},
	autoCompleteInputComponent: {
		matches: [],
		currentIndex: -1,
	},
	highlightTagName: "mark",
	highlightTagNameList: ["mark", "markyellow", "markred", "markgreen", "markblue", "markpurple", "markwhite"],
	smallImageThreshold: 50,
	smallImageThresholdList: [100, 200, 300, 400, 500, 600],
	trHighlightClass: {
		"mark": "trMark",
		"markyellow": "trMarkYellow",
		"markred": "trMarkRed",
		"markgreen": "trMarkGreen",
		"markblue": "trMarkBlue",
		"markpurple": "trMarkPurple",
		"markwhite": "trMarkWhite",
	},
	replacementTagName: "blockquote",
	markerClass: "nimbushl",
	minPersistWidth: 1000,
	HEADING_CONTAINER_TAGNAME: "documentheading",
	selectionHighlightMode: "sentence",
	BLOCK_ELEMENTS: ["DIV", "P", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "HEAD", "FIGURE", "FIGCAPTION", "PRE", "DT", "DD", "MESSAGE", "ANNOTATION", "TD", "QUOTE", "QUOTEAUTHOR", "PARTHEADING", "ASIDE", "SECTION", "ARTICLE", "NAV"],
};

const KEYCODES = Nimbus.KEYCODES;

//	Useful wrapper around document.querySelector() and document.querySelectorAll()
//	Returns an array of nodes except when the selector is an id selector, in which case it
//	returns a single node.
function get(selector)
{
	let nodes;
	if(!isNaN(selector))
		selector = "#i" + selector;
	try
	{
		nodes = document.querySelectorAll(selector);
	}
	catch(error)
	{
		showMessageError("Invalid selector: " + selector);
		return null;
	}
	if(selector.indexOf("#") === 0 && !~selector.indexOf(" ") && !~selector.indexOf("."))
		return document.querySelector(selector);
	if(nodes.length)
		return Array.from(nodes);
	return false;
}

function getOne(selector)
{
	return document.querySelector(selector);
}

//	This function is an ideal candidate for overloading, because deletion is a universal operation.
//	It will delete from the DOM tree anything that's passed to it, whether that's a node, an array of nodes,
//	a selector, or an array of selectors.
function del(arg)
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

function getOrCreate(tagName, id, parent)
{
	const elem = getOne("#" + id);
	if(elem)
		return elem;
	const container = parent || document.body;
	const newElem = createElement(tagName, { id: id });
	container.appendChild(newElem);
	return newElem;
}

function getTextNodes()
{
	return document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function getTextNodesAsArray()
{
	const nodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	let selected = new Array(nodes.snapshotLength);
	for(let i = 0, ii = selected.length; i < ii; i++)
		selected[i] = nodes.snapshotItem(i);
	return selected;
}

function xPathSelect(xpath, context)
{
	const xPathContext = context || document;
	const nodes = document.evaluate(xpath, xPathContext, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	let selected = new Array(nodes.snapshotLength);
	for(let i = 0, ii = selected.length; i < ii; i++)
		selected[i] = nodes.snapshotItem(i);
	return selected;
}

function xPathMark(xpath)
{
	const elements = xPathSelect(xpath);
	if(elements.length)
		markElements(elements);
	else
		showMessageBig("No matches found");
}

function markElements(elems)
{
	markOrUnmarkElements(elems, "mark");
}

function unmarkElements(elems)
{
	markOrUnmarkElements(elems, "unmark");
}

function markOrUnmarkElements(elems, action = "mark")
{
	const elements = elems.nodeType ? [elems] : elems;
	const func = action === "mark" ? "add" : "remove";
	if(!(elements && elements.length))
	{
		showMessageBig("No elements given");
		return;
	}
	for(let i = 0, ii = elements.length; i < ii; i++)
		elements[i].classList[func](Nimbus.markerClass);

	showMessageBig(`${action}ed <b>${elements.length}</b> elements`);
}

function highlightElements(elems)
{
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
	{
		showMessageError("highlightElements(): no elements given");
		return;
	}
	const BLOCK_ELEMENTS = Nimbus.BLOCK_ELEMENTS;
	const firstElement = elements[0];
	const highlightTagName = Nimbus.highlightTagName;
	//	Assumption: the elements are all of the same type
	if(firstElement.tagName === "TR")
	{
		highlightTableRows(elements);
		return;
	}
	else if(BLOCK_ELEMENTS.includes(firstElement.tagName))
	{
		for(let i = 0, ii = elements.length; i < ii; i++)
			wrapElementInner(elements[i], highlightTagName);
	}
	else
	{
		for(let i = 0, ii = elements.length; i < ii; i++)
			wrapElement(elements[i], highlightTagName);
	}
}

function deleteElements(elems)
{
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
		return;
	del(elements);
	showMessageBig(`Deleted <b>${elements.length}</b> elements`);
}

function retrieveElements(elems)
{
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
		return;
	const wrapper = document.createElement("div");
	for(let i = 0, ii = elements.length; i < ii; i++)
		wrapper.appendChild(elements[i]);
	emptyElement(document.body);
	del(["link", "script"]);
	document.body.appendChild(wrapper);
	showMessageBig(`Retrieved <b>${elements.length}</b> elements`);
}

function selectByTagNameMatching(text)
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

function selectByClassOrIdContaining(str)
{
	const strLower = str.toLowerCase();
	const e = get("*");
	const selected = [];
	for(let i = 0, ii = e.length; i < ii; i++)
	{
		const node = e[i];
		if(node && ~node.className.toString().toLowerCase().indexOf(strLower) || ~node.id.toString().toLowerCase().indexOf(strLower))
			selected.push(node);
	}
	return selected;
}

function selectByChildrenWithText(params)
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

function markByChildrenHavingTheExactText(...args)
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
			elems[i].classList.add(Nimbus.markerClass);
		insertStyleHighlight();
	}
}

//	Marks elements that contain exactly one child element of a given type
//	that "spans" the entire width of the parent
function markElementsWithChildSpanning(parentSelector, childSelector)
{
	const parents = get(parentSelector);
	let i = parents.length;
	while(i--)
	{
		const parent = parents[i];
		if(!parent.textContent)
			return;
		let textLength = parent.textContent.replace(/\s+/g, '').length;
		const children = parent.querySelectorAll(childSelector);
		if(children.length === 1)
		{
			const childText = children[0].textContent;
			if(childText && childText.replace(/\s+/g, '').length === textLength)
				parent.classList.add(Nimbus.markerClass);
		}
	}
}

function debounce(func, delay)
{
	var timeout;
	return function()
	{
		var context = this;
		var args = arguments;
		var debounced = function()
		{
			timeout = null;
			func.apply(context, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(debounced, delay);
	};
}

function forAll(selector, callback)
{
	const e = get(selector);
	let i = -1;
	const len = e.length;
	while(++i < len)
		callback(e[i]);
}

function getMarkedElements()
{
	const markedElements = get(Nimbus.markerClassSelector);
	return markedElements ? markedElements : [];
}

function forAllMarked(func)
{
	// const func = Nimbus.availableFunctions[callbackName];
	// if(!func)
	// {
	// 	showMessageError("callback is " + func);
	// 	return;
	// }
	const elements = getMarkedElements();
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		if(elements[i])
			func.call(null, elements[i]);
	}
}

function setAttributeOrProperty(element, key, value)
{
	const settableProperties = ["id", "className", "textContent", "innerHTML", "value"];
	if(settableProperties.includes(key))
		element[key] = value;
	else
		element.setAttribute(key, value);
}

function createElement(tag, props)
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

function removeLineBreaks(str)
{
	return str.replace(/[\r\n\s]+/g, " ");
}

function trim(str)
{
	if(!str)
		return null;
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

function trimNonAlphanumeric(str)
{
	if(!str)
		return null;
	return str.replace(/^[^A-Za-z0-9]+/, '').replace(/[^A-Za-z0-9]+$/, '');
}

function trimSpecialChars(str)
{
	if(!str)
		return null;
	return str.replace(/^[^A-Za-z0-9\(\)\[\]]+/, '').replace(/[^A-Za-z0-9\(\)\[\]]+$/, '');
}

function ltrim(str)
{
	return str.replace(/^\s+/, '');
}

function trimAt(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(0, index);
}

function trimAtInclusive(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(0, index + sub.length);
}

function trimStartingAt(str, sub)
{
	const index = str.indexOf(sub);
	if(index === -1)
		return str;
	return str.substring(index);
}

function trimBetween(str, sub1, sub2)
{
	const index1 = str.indexOf(sub1);
	const index2 = str.indexOf(sub2);
	if(!(~index1 && ~index2))
		return str;
	return str.substring(index1 + sub1.length, index2);
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

function normalizeWhitespace(str)
{
	return str.replace(/\s+/g, " ");
}

function removeWhitespace(str)
{
	return str.replace(/\s+/g, '');
}

function normalizeString(str)
{
	return removeWhitespace(str.toLowerCase());
}

function normalizeHTML(html)
{
	return html.replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
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

function containsAllOfTheStrings(s, arrStrings)
{
	if(!s || typeof s !== "string")
		return false;
	let i = arrStrings.length;
	let found = 0;
	while(i--)
		if(~s.indexOf(arrStrings[i]))
			found++;
	if(found === arrStrings.length)
		return true;
	return false;
}

function startsWithAnyOfTheStrings(s, arrStrings)
{
	if(!s || typeof s !== "string")
		return false;
	for(let i = 0, ii = arrStrings.length; i < ii; i++)
		if(s.indexOf(arrStrings[i]) === 0)
			return true;
	return false;
}

function removeNonAlpha(str)
{
	return str.replace(/[^A-Za-z]/g, '');
}

function fixBrsInHeadings()
{
	splitByBrs("h1, h2, h3", "div");
}

function splitByBrs(sel, strParentTagName)
{
	const selector = sel || makeClassSelector(Nimbus.markerClass);
	const parentTagName =  strParentTagName || "blockquote";
	const elems = get(selector);
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const tagName = elem.tagName;
		let elemHtml = elem.innerHTML;
		if(elemHtml.indexOf("<br") === -1)
			continue;
		elemHtml = elemHtml.replace(/<br [^>]+/g, "<br");
		const splat = elemHtml.split("<br>");
		const replacement = document.createElement(parentTagName);
		replacement.className = Nimbus.markerClass;
		for(let j = 0, jj = splat.length; j < jj; j++)
		{
			replacement.appendChild(createElement(tagName, { textContent: splat[j].replace(/<[^<>]+>/g, "") }));
		}
		elem.parentNode.replaceChild(replacement, elem);
	}
}

function replaceDiacritics(str)
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
	for(let i = 0, ii = diacritics.length; i < ii; i++)
		str = str.replace(diacritics[i],chars[i]);
	return str;
}

function replaceSpecialCharacters()
{
	const replacements = {
		"\xa0": " ",
		"\xa9": "(c)",
		"\xae": "(r)",
		"\xb7": "*",
		"\u2018": "'",
		"\u2019": "'",
		"\u2032": "'",
		"\u201c": '"',
		"\u201d": '"',
		"\u2026": "...",
		"\u2002": " ",
		"\u2003": " ",
		"\u2009": " ",
		"\u2013": "-",
		//"\u2014": "--",
		"\u2122": "(tm)"
	};

	const regularExpressions = {};
	const keys = Object.keys(replacements);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		regularExpressions[key] = new RegExp(key, 'g');
	}

	const textNodes = getTextNodesAsArray();
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		let nodeText = textNode.data;
		for(let j = 0, jj = keys.length; j < jj; j++)
		{
			const key = keys[j];
			nodeText = nodeText.replace(regularExpressions[key], replacements[key]);
		}
		textNode.data = nodeText;
	}
}

function replaceTables()
{
	replaceElementsBySelector("table, tbody, tr, td, th, thead", "div");
}

function sanitizeTitle(titleString)
{
	if(titleString === undefined || titleString === null)
		return;
	let sanitizedTitle;
	sanitizedTitle = titleString.toString();
	sanitizedTitle = replaceDiacritics(sanitizedTitle);

	sanitizedTitle = sanitizedTitle.replace(/&/g, " and ")
		.replace(/\u00df/g, 'SS')
		.replace(/\u0142/g, "'l")
		.replace(/\u2018/g, "'")
		.replace(/\u2019/g, "'")
		.replace(/[:|\?]/g, "_")
		.replace(/[\/]/g, "_")
		.replace(/[^\+\.\(\)0-9A-Za-z_!@\[\]\-\(\)'",]/g, " ")
		.replace(/_+/g, " - ")
		.replace(/\s+/g, " ");

	return trimSpecialChars(sanitizedTitle);
}

function escapeForRegExp(str)
{
	const specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g");
	return str.replace(specials, "\\$&");
}

function enableConsoleLogs()
{
	consoleLog = window.console.log;
	consoleWarn = window.console.warn;
	consoleError = window.console.error;
}

function disableConsoleLogs()
{
	consoleLog = consoleWarn = consoleError = noop;
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
					s += indentString + "<em>" + prop + "</em><i>" + "[" + arrayToString(o[prop]) + "]</i>" + indentStringClose;
					break;
				default:
					s += indentString + "<em>" + prop + "</em><i>" + o[prop] + "</i>" + indentStringClose;
					break;
			}
		}
	}
	return s;
}

function parseQueryString(url)
{
	const index = url.indexOf("?");
	if(index === -1 || index > url.length - 4)
	{
		return;
	}
	const queryString = url.substring(index + 1);
	let queryStringSplat = queryString.split("&");
	const parsedParameters = [];
	for(let i = 0, ii = queryStringSplat.length; i < ii; i++)
	{
		const keyValuePairSplat = queryStringSplat[i].split("=");
		parsedParameters.push({
			key: keyValuePairSplat[0],
			value: keyValuePairSplat[1]
		});
	}
	return(parsedParameters);
}

function removeQueryParameter(url, parameterName)
{
	const parsedParameters = parseQueryString(url);
	if(!parsedParameters)
		return url;
	let baseUrl = trimAt(url, "?");
	let newQueryString = "";
	for(let i = 0, ii = parsedParameters.length; i < ii; i++)
	{
		const param = parsedParameters[i].key;
		const value = parsedParameters[i].value;
		if(param !== parameterName)
			newQueryString += `${param}=${value}&`;
	}
	if(newQueryString.length)
		return(`${baseUrl}?${newQueryString}`);
	return baseUrl;
}

function arrayToString(arr, separator)
{
	let sep = separator || " | ";
	let s = "";
	if(!arr.length)
		return "[empty array]";
	for(let i = 0, ii = arr.length; i < ii; i++)
		s += "\t" + arr[i] + sep;
	return s.substring(0, s.length - sep.length);
}

function arrayToStringTyped(arr, separator)
{
	let sep = separator || " | ";
	let s = "";
	for(let i = 0, ii = arr.length; i < ii; i++)
	{
		if(typeof arr[i] === "string")
			s += '"' + arr[i] + '"' + sep;
		else
			s += arr[i] + sep;
	}
	return s.substring(0, s.length - sep.length);
}

function printPropOfObjectArray(arr, propName)
{
	let i = -1;
	const len = arr.length;
	let strProps = "";
	while(++i < len)
		strProps += getPropValueSafe(arr[i], propName) + "\n";
	console.log(strProps);
}

function printPropsContaining(obj, arrStrings)
{
	const keys = Object.keys(obj);
	let strPropsWithValues = "";
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		if(containsAnyOfTheStrings(key, arrStrings))
			strPropsWithValues += key + ": " + obj[key] + "\n";
	}
	console.log(strPropsWithValues);
}

function logElements(elements)
{
	if(!isArray(elements))
	{
		showMessageError("Expected array, got " + elements);
		return;
	}
	let strElementSelectors = "";
	for(let i = 0, ii = elements.length; i < ii; i++)
		strElementSelectors += "\t" + createSelector(elements[i]) + "\n";
	console.log(strElementSelectors);
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
	{
		ylog("No logs");
	}
}

function htmlToText(elem)
{
	elem.textContent = elem.textContent;
}

function createSelector(elem)
{
	let s = elem.tagName ? elem.tagName.toLowerCase() : "";
	if(elem.id)
		s += "#" + elem.id + " ";
	if(elem.className)
		s += "." + Array.from(elem.classList).join('.');
	if(elem.name)
		s += " name: " + elem.name;
	return s;
}

function emptyElement(elem)
{
	if(elem)
		elem.textContent = '';
}

function isArray(o)
{
	return Object.prototype.toString.call(o) === '[object Array]';
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
	let found = false;
	for(let i = 0, ii = arrClasses.length; i < ii; i++)
	{
		const currClass = arrClasses[i];
		if(elem.classList.contains(currClass))
		{
			elem.classList.remove(currClass);
			const nextIndex = i < ii - 1 ? i + 1 : 0;
			elem.classList.add(arrClasses[nextIndex]);
			found = true;
			break;
		}
	}
	if(!found)
	{
		elem.classList.add(arrClasses[0]);
	}
}

function insertBefore(anchorElement, elementToInsert)
{
	anchorElement.insertAdjacentElement("beforebegin", elementToInsert);
}

function insertAfter(anchorElement, elementToInsert)
{
	anchorElement.insertAdjacentElement("afterend", elementToInsert);
}

function insertAsFirstChild(anchorElement, elementToInsert)
{
	anchorElement.insertAdjacentElement("afterbegin", elementToInsert);
}

function insertAsLastChild(anchorElement, elementToInsert)
{
	anchorElement.insertAdjacentElement("beforeend", elementToInsert);
}

function createElementWithChildren(tagName, ...children)
{
	const elem = document.createElement(tagName);
	for(let i = 0, ii = children.length; i < ii; i++)
		elem.appendChild(children[i]);
	return elem;
}

//	Takes a source element and a tagName, and returns an element of type tagName
//	with the source element's properties mapped across to the new element as specified
//	in the propertyMapping parameter. This could be used, for instance, to create an <a>
//	based upon an <img>, taking its textContent and href from the image's src attribute.
function createReplacementElement(tagName, sourceElement, propertyMapping)
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

function getPropValueSafe(obj, propName)
{
	const propValue = obj[propName];
	if(propValue)
		return propValue;
	return null;
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
			elem.remove();
			continue;
		}
		iframelink.href = s;
		if(~s.indexOf("youtube") && s.indexOf("subscribe_embed") === -1)
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

//	If the user has selected some text, this function takes that selection's first block parent,
//	and replaces that element with an element of type tagName.
function replaceSelectedElement(tagName)
{
	const node = getNodeContainingSelection();
	if(node)
	{
		const replacementTag = tagName ? tagName : Nimbus.replacementTagName;
		replaceElement(node, replacementTag);
	}
}

function replaceElementsByTagNameMatching(text, tagName)
{
	const replacementTagName = tagName || "blockquote";
	const e = selectByTagNameMatching(text);
	for(let i = 0, ii = e.length; i < ii; i++)
		replaceElement(e[i], replacementTagName);
}

function replaceElementsBySelectorHelper()
{
	if(getMarkedElements().length)
		callFunctionWithArgs("Replace elements by selector", replaceElementsBySelector, 2, Nimbus.markerClassSelector + " ");
	else
		callFunctionWithArgs("Replace elements by selector", replaceElementsBySelector, 2);
}

function replaceElementsBySelector(selector, tagName)
{
	const toReplace = get(selector);
	if(toReplace.length)
	{
		showMessageBig(`Replacing <b>${toReplace.length} ${selector}</b> with <b>${tagName}</b>`);
		let i = toReplace.length;
		if(tagName === "hr")
		{
			while(i--)
			{
				const elem = toReplace[i];
				elem.parentNode.replaceChild(createElement(tagName), elem);
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
		replaceElement(toReplace, tagName);
	}
}

function convertElement(elem, tagName)
{
	const replacement = document.createElement(tagName);
	const temp = elem.cloneNode(true);
	while(temp.firstChild)
		replacement.appendChild(temp.firstChild);
	return replacement;
}

function replaceElement(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	elem.parentNode.replaceChild(replacement, elem);
}

function replaceElementKeepingId(elem, tagName)
{
	const replacement = document.createElement(tagName);
	while(elem.firstChild)
		replacement.appendChild(elem.firstChild);
	const elemId = elem.id;
	if(elemId)
		replacement.id = elemId;
	elem.parentNode.replaceChild(replacement, elem);
}

function replaceMarkedElements(tagName)
{
	const toReplace = getMarkedElements();
	let i = toReplace.length;
	while(i--)
		replaceElement(toReplace[i], tagName);
}

function replaceByClassOrIdContaining(str, tagName)
{
	const toReplace = selectByClassOrIdContaining(str);
	showMessageBig(`Replacing <b>${toReplace.length}</b> elements`);
	for(let i = 0, ii = toReplace.length; i < ii; i++)
		replaceElementKeepingId(toReplace[i], tagName);
}

function deleteByClassOrIdContaining(str)
{
	deleteElements(selectByClassOrIdContaining(str));
}

function markByClassOrIdContaining(str)
{
	markElements(selectByClassOrIdContaining(str));
}

function rescueOrphanedTextNodes()
{
	const BLOCK_ELEMENTS = Nimbus.BLOCK_ELEMENTS;
	const REPLACEMENT_TAGNAME = "h2";
	const textNodes = getTextNodesAsArray();
	const nodeItems = [];
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		let hasBlockParent = false;
		const node = textNodes[i];
		const nodeText = node.data;
		if(removeWhitespace(nodeText).length)
		{
			let nodeParent = node;
			while(nodeParent.parentNode)
			{
				nodeParent = nodeParent.parentNode;
				if(BLOCK_ELEMENTS.includes(nodeParent.tagName))
				{
					hasBlockParent = true;
					break;
				}
			}
			nodeItems.push({ node, hasBlockParent });
		}
	}
	let consecutiveOrphans = [];
	for(let i = 0, ii = nodeItems.length; i < ii; i++)
	{
		const nodeItem = nodeItems[i];
		if(nodeItem.hasBlockParent)
		{
			if(consecutiveOrphans.length)
			{
				const parent = document.createElement(REPLACEMENT_TAGNAME);
				for(let j = 0, jj = consecutiveOrphans.length; j < jj; j++)
				{
					parent.appendChild(consecutiveOrphans[j].cloneNode());
				}
				parent.className = Nimbus.markerClass;
				consecutiveOrphans[0].parentNode.insertBefore(parent, consecutiveOrphans[0]);
				for(let j = 0, jj = consecutiveOrphans.length; j < jj; j++)
				{
					consecutiveOrphans[j].remove();
				}
				consecutiveOrphans = [];
			}
		}
		else
		{
			consecutiveOrphans.push(nodeItem.node);
		}
	}
	insertStyleHighlight();
}

function createListsFromBulletedParagraphs()
{
	const paras = get("p");
	let i = paras.length;
	while(i--)
	{
		const para = paras[i];
		if(para.textContent.match(/\u2022/))
		{
			para.classList.add(Nimbus.markerClass);
			para.innerHTML = para.innerHTML.replace(/\u2022/, "");
		}
	}

	const elems = getMarkedElements();
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		let nextElem = elem.nextElementSibling;
		const parent = document.createElement("ul");
		insertBefore(elem, parent);
		parent.appendChild(elem);
		while(nextElem && nextElem.classList.contains(Nimbus.markerClass))
		{
			i++;
			const nextElemTemp = nextElem.nextElementSibling;
			parent.appendChild(nextElem);
			nextElem = nextElemTemp;
		}
	}
}

function hasChildrenOfType(elem, tagName)
{
	return elem.getElementsByTagName(tagName).length ? true : false;
}

function removeClassFromAll(className)
{
	const e = get(makeClassSelector(className));
	let i = e.length;
	let count = i ? i : 0;
	while(i--)
		e[i].classList.remove(className);
	return count;
}

function hasClassesContaining(element, arrStr)
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

function hasClassesStartingWith(element, arrStr)
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

function getTimestamp()
{
	const d = new Date();
	const YYYY = d.getFullYear();
	const MO = zeroPad(d.getMonth() + 1);
	const DD = zeroPad(d.getDate());
	const HH = zeroPad(d.getHours());
	const MM = zeroPad(d.getMinutes());
	const SS = zeroPad(d.getSeconds());
	return `${YYYY}/${MO}/${DD} ${HH}:${MM}:${SS}`;
}

function toNumber(str)
{
	if(!(typeof str === "string" && str.length))
		return false;
	const noCommas = str.replace(/,/g, "");
	const n = Number(trim(noCommas));
	return !isNaN(n) ? n : false;
}

function selectRandom(arr)
{
	if(!(arr && arr.length)) return;
	return arr[Math.floor(Math.random() * arr.length)];
}

function debugVars(params)
{
	const keys = Object.keys(params);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		const value = params[key];
		if(isArray(value))
			console.log(key, '\n', arrayToString(value, "\n"));
		else
			console.log(key, '\n\t', value);
	}
}

function getNext(item, arr)
{
	// debugVars({ item, arr });
	let nextItem = arr[0];
	const index = arr.indexOf(item);
	if(~index)
	{
		const nextIndex = index < arr.length - 1 ? index + 1 : 0;
		nextItem = arr[nextIndex];
	}
	return nextItem;
}

function createUUID()
{
	return 'nimbus-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function(c)
	{
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
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

function logAllClassesForCommonElements()
{
	logAllClassesFor("div");
	logAllClassesFor("p");
	logAllClassesFor("span");
}

function logAllClassesFor(selector)
{
	console.log(selector);
	console.log("\t" + getAllClassesFor(selector).join("\n\t"));
}

function getAllClassesFor(selector)
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
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		result.push(classes[keys[i]]);
	}
	const t2 = performance.now();
	consoleLog(t2 - t1 + " ms: getAllClassesFor");
	return result;
}

function isIncorrectType(x, type)
{
	if(typeof x === type)
		return false;
	console.warn("Expected " + x + " to be " + type + "; got " + typeof x);
	return true;
}

function replaceClass(class1, class2)
{
	const e = document.querySelectorAll(makeClassSelector(class1));
	let i = e.length;
	showMessageBig(`Replacing <b>${class1}</b> with <b>${class2}</b> on <b>${i}</b> elements`);
	while(i--)
	{
		e[i].classList.remove(class1);
		e[i].classList.add(class2);
	}
}

function zeroPad(n)
{
	n += '';
	if(n.length < 2) n = '0' + n;
	return n;
}

function isCurrentDomainLink(url)
{
	const urlSegments = url.split("/");
	if(urlSegments[2] === location.hostname)
	{
		if(urlSegments.length === 3)
			return true;
		if(urlSegments.length === 4 && urlSegments[urlSegments.length - 1].length === 0)
			return true;
	}
	return false;
}

function makeClassSelector(className)
{
	if(className.indexOf(".") !== 0)
		return "." + trim(className);
	return trim(className);
}

function simplifyClassNames()
{
	const elems = get("div");
	const classMap = {};
	const baseClassName = "class";
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const oldClass = elem.className.replace(/[^a-zA-Z]+/g, "");
		if(!oldClass.length)
			continue;
		elem.className = oldClass;
		classMap[oldClass] = true;
	}
	let keys = Object.keys(classMap);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		const oldClass = key;
		const newClass = baseClassName + i;
		replaceClass(oldClass, newClass);
	}
}

function showStatus(id, str)
{
	getOrCreate("h3", id).textContent = id + ": " + str;
}

function refreshScreen()
{
	const elem = document.createElement("screenrefresh");
	document.body.appendChild(elem);
	setTimeout(function(){ elem.remove(); }, 100);
}

function showMessage(messageHtml, msgClass, persist)
{
	clearTimeout(Nimbus.messageTimeout);
	let messageContainer;
	msgClass = msgClass || "";
	const strStyle = `
		message { display: block; background: #111; font: 12px Verdcode, Verdana; color: #555; height: 30px; line-height: 30px; position: fixed; bottom: 0; left: 0; width: 100%; z-index: 2000000000; }
		messageinner { display: block; max-width: 1200px; margin: 0 auto; text-align: left; }
		message.messagebig { font: 32px "Swis721 cn bt"; color: #AAA; height: 60px; line-height: 60px; font-weight: 500; }
		message.messageerror { color: #FFF; background: #500; }
	`;
	if(!get("message"))
	{
		messageContainer = createElement("message", { className: msgClass });
		document.body.insertBefore(messageContainer, document.body.firstChild);
		if(!getOne("#styleMessage"))
			insertStyle(strStyle, "styleMessage", true);
	}
	else
	{
		messageContainer = getOne("message");
		messageContainer.className = msgClass;
	}
	messageContainer.innerHTML = "<messageinner>" + messageHtml + "</messageinner>";
	if(!persist)
		Nimbus.messageTimeout = setTimeout(deleteMessage, 2000);
}

function showMessageBig(messageHtml)
{
	showMessage(messageHtml, "messagebig");
}

function showMessageError(messageHtml)
{
	showMessage(messageHtml, "messagebig messageerror");
}

function deleteMessage()
{
	del("message");
	del("#styleMessage");
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

function getSelectionOrUserInput(promptMessage, callback, isUnary)
{
	if(window.getSelection().toString().length)
	{
		const selection = window.getSelection().toString();
		callback(selection);
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

function callFunctionWithArgs(promptMessage, callback, numArgs, initialValue)
{
	customPrompt(promptMessage, initialValue).then(function(userInput) {
		if(!numArgs || numArgs > 1)
		{
			const args = parseCommand(userInput);
			if(numArgs && args.length !== numArgs)
			{
				showMessageBig(numArgs + " arguments are required");
				callFunctionWithArgs(promptMessage, callback, numArgs);
				return;
			}
			callback.apply(null, args);
		}
		else
		{
			callback.call(null, userInput);
		}
	});
}

function handleConsoleInput(evt, consoleType)
{
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

	const userInputElement = getOne("#userInput");
	if(!userInputElement)
		return;
	const inputText = userInputElement.value;
	// if(!inputText || !inputText.length)
	// 	return;
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
				{
					eval(inputText);
					return;
				}
				else if(consoleType === "css")
				{
					insertStyle(inputText, "userStyle", true);
				}
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
		'#userInput { background: ' + consoleBackgroundColor + '; color: #FFF; font: bold 24px Consolas, monospace; width: 100%; height: 100%; padding: 10px; border: 0; outline: 0; }';
	insertStyle(dialogStyle, "styleUserInputWrapper", true);

	const inputTextareaWrapper = createElement("div", { id: "userInputWrapper" });
	const inputTextarea = createElement("textarea", { id: "userInput", value: getConsoleHistory(consoleType) });
	const handleKeyDown = function(event){ handleConsoleInput(event, consoleType); };
	inputTextarea.addEventListener("keydown", handleKeyDown);
	inputTextareaWrapper.appendChild(inputTextarea);
	document.body.appendChild(inputTextareaWrapper);
	inputTextarea.focus();
}

function parseCommand(commandString)
{
	let args = [];
	let arg = '';
	let cleanCommandString = trim(commandString.replace(/\s+/g, ' '));
	for(let i = 0, ii = cleanCommandString.length; i < ii; i++)
	{
		switch(cleanCommandString[i])
		{
			case '"':
				i++;
				while(cleanCommandString[i] !== '"' && i < ii)
					arg += cleanCommandString[i++];
				break;
			case ' ':
				args.push(arg);
				arg = '';
				break;
			default:
				arg += cleanCommandString[i];
		}
	}
	args.push(arg);
	return args;
}

function runCommand(commandString)
{
	if(typeof commandString === "undefined" || !commandString.length)
		return;
	Nimbus.lastCommand = commandString;
	const commandSegments = parseCommand(commandString);
	if(!commandSegments.length)
		return;
	const funcName = commandSegments[0];
	if(Nimbus.availableFunctions[funcName])
	{
		const args = [];
		for(let i = 1, ii = commandSegments.length; i < ii; i++)
		{
			const n = parseInt(commandSegments[i], 10);
			if(isNaN(n))
				args.push(commandSegments[i]);
			else args.push(n);
		}
		showMessageBig(funcName + "(" + arrayToStringTyped(args, ", ") + ")");
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
		const handler = inputHandler || defaultDialogInputHandler;
		dialogInput.addEventListener("keydown", handler, false);
		dialogInput.focus();
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

function customPrompt(message, initialValue)
{
	if(!get("#xxdialog"))
	{
		del("#style-xxdialog");
		const dialog = createElement("div", { id: "xxdialog" });
		const dialogHeading = createElement("heading", { textContent: message });
		const dialogInput = createElement("input", { id: "xxdialoginput" });
		if(initialValue)
			dialogInput.value = initialValue;
		dialog.appendChild(dialogHeading);
		dialog.appendChild(dialogInput);
		document.body.insertBefore(dialog, document.body.firstChild);
		const s = '#xxdialog { position: fixed; margin: auto; z-index: 10000; height: 90px; top: 0; left: 0px; bottom: 0px; right: 0; background: #111; color: #FFF; border: 10px solid #000; display: block; text-transform: none; width: 60vw; }' +
			'#xxdialog heading { height: 30px; line-height: 30px; padding: 0 10px; background: #111; display: block; margin: 0; }' +
			'#xxdialog #xxdialoginput { font: 32px "swis721 cn bt"; line-height: 60px; verdana; background: #000; color: #FFF; padding: 0 0; margin: 0; border-width: 0 10px; border-color: #000; width: 100%; height: 60px; overflow: hidden; box-sizing: border-box; }';
		insertStyle(s, "style-xxdialog", true);
		dialogInput.focus();
		const func = function(resolve, reject) {
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
		};
		return new Promise(func);
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

function autoCompleteInputBox()
{
	const inputComponent = Nimbus.autoCompleteInputComponent;

	function updateInputField()
	{
		if(~inputComponent.currentIndex && inputComponent.matches[inputComponent.currentIndex])
			getOne("#autoCompleteInput").value = inputComponent.matches[inputComponent.currentIndex];
	}

	function highlightPrevMatch()
	{
		if(inputComponent.currentIndex > 0)
			inputComponent.currentIndex--;
		renderMatches();
	}

	function highlightNextMatch()
	{
		if(inputComponent.currentIndex < inputComponent.matches.length - 1)
			inputComponent.currentIndex++;
		renderMatches();
	}

	function onAutoCompleteInputKeyUp(evt)
	{
		const inputText = getOne("#autoCompleteInput").value;
		if(!inputText)
		{
			clearMatches();
			return;
		}
		showMatches(inputText);
		switch(evt.keyCode)
		{
			case KEYCODES.TAB: updateInputField(); break;
			case KEYCODES.ENTER: updateInputField(); executeFunction(); break;
		}
	}

	function onAutoCompleteInputKeyDown(evt)
	{
		switch(evt.keyCode)
		{
			case KEYCODES.TAB: evt.preventDefault(); break;
			case KEYCODES.ESCAPE: evt.preventDefault(); close(); break;
			case KEYCODES.UPARROW: evt.preventDefault(); highlightPrevMatch(); break;
			case KEYCODES.DOWNARROW: evt.preventDefault(); highlightNextMatch(); break;
		}
	}

	function renderMatches()
	{
		let s = "";
		const numMatches = inputComponent.matches.length;
		if(numMatches === 1)
		{
			inputComponent.currentIndex = 0;
			updateInputField();
		}
		for(let i = 0, ii = numMatches; i < ii; i++)
		{
			if(inputComponent.currentIndex === i)
				s += '<match class="current">' + inputComponent.matches[i] + "</match>";
			else
				s += '<match>' + inputComponent.matches[i] + "</match>";
		}
		get("#autoCompleteMatches").innerHTML = s;
	}

	function showMatches(str)
	{
		if(!str || !str.length || str.length < 2)
		{
			emptyElement(get("#autoCompleteMatches"));
			inputComponent.currentIndex = -1;
			return;
		}
		str = str.toLowerCase();

		inputComponent.matches = [];
		const commands = Object.keys(Nimbus.availableFunctions);
		for(let i = 0, ii = commands.length; i < ii; i++)
		{
			if(~commands[i].toLowerCase().indexOf(str))
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
		const style = 'autocompleteinputwrapper { display: block; width: 800px; height: 40vh; position: fixed; left: 0; top: 0; right: 0; bottom: 0; margin: auto; z-index: 2000000000; font-family: "Swis721 Cn BT"; }' +
			'autocompleteinputwrapper input { width: 100%; height: 3rem; font-size: 32px; background: #000; color: #FFF; border: 0; outline: 0; display: block; font-family: inherit; }' +
			'autocompleteinputwrapper matches { display: block; background: #222; color: #CCC; }' +
			'autocompleteinputwrapper match { display: block; padding: 2px 10px; font-size: 24px; }' +
			'autocompleteinputwrapper match.current { background: #303030; color: #FFF; }' +
			'autocompleteinputwrapper em { display: inline-block; width: 200px; }';
		insertStyle(style, "styleAutoCompleteInputBox", true);
		const dialogWrapper = createElement("autocompleteinputwrapper", { id: "autoCompleteInputWrapper" });
		const inputElement = createElement("input", { id: "autoCompleteInput", autocomplete: "randomstring" });
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
		close();
		runCommand(command);
	}

	return { open, close };
}

function markByCssRule(prop, val)
{
	const e = document.getElementsByTagName("*");
	let i = e.length;
	let count = 0;
	while(i--)
	{
		const computedStyle = getComputedStyle(e[i], null);
		if(computedStyle)
		{
			const propertyValue = computedStyle.getPropertyValue(prop);
			if(propertyValue === val)
			{
				e[i].classList.add(Nimbus.markerClass);
				count++;
			}
		}
	}
	if(count)
	{
		showMessageBig("Found " + count + " elements with <b>" + prop + ": " + val + "</b>");
		insertStyleHighlight();
	}
}

function markBySelector(selector)
{
	markElements(get(selector));
}

function markByTagNameAndText(tagName, str)
{
	markElements(selectByTagNameAndText(tagName, str));
}

function highlightByTagNameAndText(tagName, str)
{
	highlightElements(selectByTagNameAndText(tagName, str));
}

function markBlockElementsContainingText(text)
{
	markElements(selectBlockElementsContainingText(text));
}

function markOverlays()
{
	mark("div", "style", "contains", "z-index");
	mark("div", "class", "contains", "modal");
	mark("div", "hasAttribute", "aria-modal");
}

function highlightQuotes()
{
	document.body.innerHTML = document.body.innerHTML.replace(/\u201C/g, '<markwhite>"').replace(/\u201D/g, '"</markwhite>');
}

function highlightTableRows(rows)
{
	const trHighlightClass = Nimbus.trHighlightClass[Nimbus.highlightTagName];
	for(let i = 0, ii = rows.length; i < ii; i++)
		rows[i].classList.add(trHighlightClass);
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
				elem.classList.add(Nimbus.markerClass);
				elem.innerHTML = "<x>#" + elem.id + " ." + elem.className + " " + getComputedStyle(elem, null).getPropertyValue("width") + "</x>" + elem.innerHTML;
				ylog(cssRules[j]);
			}
		}
	}
	insertStyle("x { background: #000; color: #FFF; padding: 2px 4px; display: block; font: 12px verdana;  } .xlog { clear: both; }", "styleMarkElementsWithSetWidths", true);
	insertStyleHighlight();
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
			list.classList.add(Nimbus.markerClass);
	}
	insertStyleHighlight();
}

function markSelectionAnchorNode()
{
	const node = getNodeContainingSelection();
	node.classList.add(Nimbus.markerClass);
	insertStyleHighlight();
	showMessage(createSelector(node), "messagebig", true);
}

function highlightUserLinks()
{
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		if(
			link.href &&
			link.textContent.replace(/\s+/g, "").length &&
			containsAnyOfTheStrings(link.pathname, ["/u/", "/user", "/member", "profile"]) &&
			link.parentNode && link.parentNode.tagName !== "USER"
		)
			wrapElement(link, "user");
	}
}

function highlightAuthors()
{
	replaceByClassOrIdContaining("author", "author");
	replaceByClassOrIdContaining("byline", "author");
	mark("author", "hasChildrenOfType", "author");
	replaceElementsBySelector(makeClassSelector(Nimbus.markerClass), "div");
}

//	If a superscript element contains a link, it's most likely a reference,
//	and should be distinguished from regular superscripts
function makeReferencesSemantic()
{
	const sups = get("sup");
	for(let i = 0, ii = sups.length; i < ii; i++)
	{
		const sup = sups[i];
		if(sup.getElementsByTagName("a").length)
		{
			replaceElement(sup, "reference");
		}
		else
		{
			const parent = sup.parentNode;
			if(parent.tagName === "A")
			{
				parent.textContent = parent.textContent;
				wrapElement(parent, "reference");
			}
		}
	}
	const refLinks = get("reference a");
	for(let i = 0, ii = refLinks.length; i < ii; i++)
	{
		const refLink = refLinks[i];
		refLink.textContent = refLink.textContent.replace(/[\[\]\{\}]/g, "");
	}
}

function markUppercaseElements(selector)
{
	const e = get(selector);
	let i = e.length;
	while(i--)
	{
		let s = e[i].textContent;
		let cUpper = 0;
		let cLower = 0;
		cUpper = s.match(/[A-Z]/g);
		cLower = s.match(/[a-z]/g);
		if(cUpper && (!cLower || cUpper.length > cLower.length))
			e[i].className = Nimbus.markerClass;
	}
	insertStyleHighlight();
}

function markNumericElements(selector)
{
	const elements = get(selector);
	let i = elements.length;
	while(i--)
	{
		const elem = elements[i];
		let elemText = elem.textContent;
		if(elemText && !isNaN(Number(elemText)))
			elem.className = Nimbus.markerClass;
	}
	insertStyleHighlight();
}

function showDivDepth()
{
	const divs = get("div");
	let i = divs.length;
	let node, level;
	while(i--)
	{
		node = divs[i];
		level = 0;
		while(node.parentNode)
		{
			node = node.parentNode;
			level++;
		}
		divs[i].className = "level" + level;
	}
	toggleShowDocumentStructureWithNames();
}

function numberDivs()
{
	const e = get("header, footer, article, aside, section, div");
	let i = e.length;
	while(i--)
		e[i].id = "i" + i;
	toggleShowDocumentStructureWithNames();
}

function showTags()
{
	const e = Array.from( document.body.getElementsByTagName("*") );
	const tags = {};
	for(let i = 0, ii = e.length; i < ii; i++)
	{
		const elem = e[i];
		if(!elem || !elem.nodeType)
			continue;
		const elemTagName = elem.tagName;
		if(elemTagName)
		{
			elem.setAttribute("data-tagname", elemTagName.toLowerCase());
			elem.classList.add("nimbusShowTags");
		}
	}
	const style = `
		.nimbusShowTags { padding: 10px; margin: 10px; box-shadow: inset 4px 4px #000, inset -4px -4px #000; }
		.nimbusShowTags::before { content: attr(data-tagname); color: #F90; background: #000; padding: 2px 5px; }
		`;
	insertStyle(style, "styleShowTags", true);
}

function unmarkAll()
{
	let count = 0;
	count += removeClassFromAll(Nimbus.markerClass);
	count += removeClassFromAll("error");
	del(["annotationinfo", "annotationwarning", "annotationerror"]);
	showMessageBig(`Unmarked <b>${count}</b> elements`);
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

function filterNodesByAttributeValueLessThan(nodes, attribute, value)
{
	let i = nodes.length;
	let result = [];
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

function filterNodesByAttributeValueGreaterThan(nodes, attribute, value)
{
	let i = nodes.length;
	let result = [];
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

function filterNodesByAttributeContaining(nodes, attribute, value)
{
	let i = nodes.length;
	let result = [];
	if(attribute === "text" || attribute === "textContent")
	{
		while(i--)
		{
			const node = nodes[i];
			if(~node.textContent.indexOf(value))
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
		let depth = 0;
		let currentNode = node;
		while(currentNode.parentNode && depth < 20)
		{
			depth++;
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

function filterNodesWithTextLengthUnder(nodes, maxLength)
{
	let result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(getTextLength(node) < maxLength)
			result.push(node);
	}
	return result;
}

function filterNodesWithTextLengthOver(nodes, maxLength)
{
	let result = [];
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		if(getTextLength(node) > maxLength)
			result.push(node);
	}
	return result;
}

function filterNodesFollowingNodesOfType(nodes, tagName)
{
	let result = [];
	const tagNameUpper = tagName.toUpperCase();
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const prevElement = node.previousElementSibling;
		if(prevElement && prevElement.tagName === tagNameUpper)
			result.push(node);
	}
	return result;
}

function filterNodesPrecedingNodesOfType(nodes, tagName)
{
	let result = [];
	const tagNameUpper = tagName.toUpperCase();
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const nextElement = node.nextElementSibling;
		if(nextElement && nextElement.tagName === tagNameUpper)
			result.push(node);
	}
	return result;
}

function select(...args)
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
				default: return false;
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
				default: return false;
			}
		}
		else if(args.length === 3)
		{
			const operator = args[1];
			const value = args[2];
			switch(operator)
			{
				case "hasChildrenOfType": return filterNodesWithChildrenOfType(elems, value);
				case "doesNotHaveChildrenOfType": return filterNodesWithoutChildrenOfType(elems, value);
				case "hasParentOfType": return get(value + " " + selector);
				case "doesNotHaveParentOfType": return filterNodesWithoutParentOfType(elems, value);
				case "hasTextLengthUnder": return filterNodesWithTextLengthUnder(elems, value);
				case "hasTextLengthOver": return filterNodesWithTextLengthOver(elems, value);
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
		e[i].classList.add(Nimbus.markerClass);
	insertStyleHighlight();
}

function unmark(...args)
{
	const e = select(...args);
	if(!(e && e.length))
		return;
	let i = e.length;
	showMessageBig("Found " + i + " elements");
	while(i--)
		e[i].classList.remove(Nimbus.markerClass);
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

function removeQueryStringFromImageSources()
{
	const images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		const image = images[i];
		image.src = trimAt(image.src, "?");
	}
	const imagePlaceholders = get("rt a");
	for(let i = 0, ii = imagePlaceholders.length; i < ii; i++)
	{
		const imagePlaceholder = imagePlaceholders[i];
		imagePlaceholder.href = trimAt(imagePlaceholder.href, "?");
		imagePlaceholder.textContent = imagePlaceholder.href;
	}
}

function removeQueryStringFromLinks()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		link.href = trimAt(link.href, "?");
	}
}

function deleteImagesSmallerThan(pixelArea)
{
	const images = get('img');
	let i = images.length;
	let count = 0;
	while(i--)
	{
		const image = images[i];
		if(image.naturalWidth * image.naturalHeight < pixelArea)
		{
			image.remove();
			count++;
		}
	}
	showMessageBig(`Deleted <b>${count}</b> images smaller than <b>${pixelArea}</b>`);
}

function deleteSmallImages()
{
	deleteBySelectorAndTextMatching("img", "data");
	const images = get("img");
	const nextThreshold = getNext(Nimbus.smallImageThreshold, Nimbus.smallImageThresholdList);
	Nimbus.smallImageThreshold = nextThreshold;
	deleteImagesSmallerThan(nextThreshold * nextThreshold);
}

function getBestImageSrc()
{
	function sortSources(a, b)
	{
		if(a.size > b.size) return 1;
		if(a.size < b.size) return -1;
		return 0;
	}

	const images = get("img");
	if(!images)
		return;
	let i = images.length;
	let count = 0;
	while(i--)
	{
		const elem = images[i];
		const set1 = typeof elem.srcset === "string" && elem.srcset.length ? elem.srcset : null;
		const set2 = elem.getAttribute("data-srcset");
		let srcset = set1 || set2;
		if(!srcset)
			continue;
		count++;
		srcset = srcset.replace(/, /g, "|");
		if(srcset)
		{
			let bestSource;
			let sources = srcset.split('|');
			let sourcesArray = [];
			for(let j = 0, jj = sources.length; j < jj; j++)
			{
				const splat = trim(sources[j]).split(' ');
				const src = splat[0];
				const size = parseInt(splat[1], 10);
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
	xlog(`Switched to best image source for ${count} images`);
}

function shortenImageSrc(src)
{
	const splat = src.split("/");
	let domain = "unknown domain";
	let imageFileName = "image";
	if(splat.length && splat.length > 2)
	{
		domain = splat[2];
		imageFileName = splat[splat.length - 1];
	}
	if(domain.length)
		return domain + " | " + imageFileName;
	return imageFileName;
}

function replaceImagesWithTextLinks()
{
	if(get("rt"))
	{
		const images = get("rt");
		let i = images.length;
		while(i--)
		{
			const elem = images[i];
			const imageLink = createElement("img", { src: elem.querySelector("a").href });
			elem.parentNode.replaceChild(imageLink, elem);
		}
		del('#styleReplaceImages');
		return;
	}
	else if(get("img"))
	{
		const images = get("img");
		let i = images.length;
		while(i--)
		{
			const elem = images[i];
			if(elem.src)
			{
				const imageLink = createElement("a", { href: elem.src, textContent: shortenImageSrc(elem.src) });
				const imageReplacement = createElementWithChildren("rt", imageLink);
				if(elem.parentNode.tagName === "A")
					insertBefore(elem.parentNode, imageReplacement);
				else
					insertBefore(elem, imageReplacement);
			}
		}
		del("img");
		const s = 'rt { margin: 10px 0; padding: 20px; display: block; background: #181818; font: 12px verdana; }' +
		'rt a { color: #FFF; }' +
		'rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }';
		insertStyle(s, "styleReplaceImages");
	}
}

function retrieveLargeImages()
{
	const links = get("a");
	let i = links.length;
	let count = 0;
	while(i--)
	{
		const link = links[i];
		const linkHref = link.href;
		if(containsAnyOfTheStrings(linkHref.toLowerCase(), [".png", ".jpg", ".gif", ".jpe"]))
		{
			if(link.parentNode)
			{
				link.parentNode.replaceChild(createElement("img", { src: linkHref }), link);
				count++;
			}
		}
	}
	showMessageBig(`Retrieved ${count} large images`);
}

function getImageWidth(image)
{
	return image.naturalWidth || image.clientWidth;
}

function getImageHeight(image)
{
	return image.naturalHeight || image.clientHeight;
}

function persistStreamingImages(minWidth)
{
	if(minWidth)
		Nimbus.minPersistWidth = minWidth;
	let imageContainer = getOne("#nimbusStreamingImageContainer");
	if(!imageContainer)
	{
		imageContainer = createElement("div", { id: "nimbusStreamingImageContainer" });
		document.body.appendChild(imageContainer);
		const style = `#nimbusStreamingImageContainer { z-index: 2000000000; position: fixed; bottom: 90px; left: 10px; width: 100%; height: 20vh; background: #000; overflow: auto; }
			#nimbusStreamingImageContainer img { height: 50px; width: auto; float: left; margin: 0 1px 1px 0; }`;
		insertStyle(style, "stylePersistStreamingImages", true);
	}
	if(!Nimbus.streamingImages)
		Nimbus.streamingImages = [];
	let images = Nimbus.streamingImages;
	const unsavedImages = document.querySelectorAll("img:not(.alreadySaved)");
	for(let i = 0; i < unsavedImages.length; i++)
	{
		const image = unsavedImages[i];
		const imgSrc = image.src;
		if(images.includes(imgSrc) || (getImageWidth(image) < Nimbus.minPersistWidth && getImageHeight(image) < Nimbus.minPersistWidth))
			continue;
		images.push(imgSrc);
		imageContainer.appendChild(createElement("img", { src: imgSrc, className: "alreadySaved" }));
	}
	let numImages = get(".alreadySaved").length;
	showMessage(`${numImages} unique images larger than ${Nimbus.minPersistWidth}px so far`, "messagebig", true);
	Nimbus.persistStreamingImagesTimeout = setTimeout(persistStreamingImages, 250);
}

function showSavedStreamingImages()
{
	clearTimeout(Nimbus.persistStreamingImagesTimeout);
	deleteImagesSmallerThan(100, 100);
	insertStyle("#nimbusStreamingImageContainer { height: 80vh; }", "temp", true);
	retrieve("#nimbusStreamingImageContainer");
	removeClassFromAll("alreadySaved");
	ylog(get("img").length + " images", "h2");
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
			link.parentNode.insertBefore(createElementWithChildren("rt", createElement("a", { href: linkHref, textContent: shortenImageSrc(linkHref) })), link);
	}
}

function forceImageWidth(width)
{
	if(width < 20)
		width *= 100;
	const s = "img { width: " + width + "px; height: auto; }";
	insertStyle(s, "styleImageWidth", true);
}

function forceImageHeight(height)
{
	if(height < 20)
		height *= 100;
	const s = "img { height: " + height + "px; width: auto; }";
	insertStyle(s, "styleImageHeight", true);
}

function buildGallery()
{
	const images = get("img");
	if(!(images && images.length))
	{
		showMessageBig("No images found");
		return;
	}
	const galleryElement = createElement("slideshow", { id: "nimbusGallery" });
	const doneImageSources = [];
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		const image = images[i];
		if(doneImageSources.includes(image.src))
			continue;
		let w = image.naturalWidth;
		let h = image.naturalHeight;
		let aspectRatioClass;
		if(w && h)
			aspectRatioClass = w / h > 16 / 9 ? "aspectRatioLandscape" : "aspectRatioPortrait";
		galleryElement.appendChild(createElement("img", { src: image.src, className: aspectRatioClass }));
		doneImageSources.push(image.src);
	}
	del("img");
	cleanupHead();
	insertStyle("img { display: block; float: left; max-height: 300px; }", "styleGallery", true);
	document.body.insertBefore(galleryElement, document.body.firstChild);
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

function slideshowChangeSlide(direction)
{
	if(!get("#styleSlideshow"))
		return;
	const gallery = get("#nimbusGallery");
	if(!gallery)
		return;
	const images = gallery.getElementsByTagName("img");
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		if(images[i].classList.contains("currentImage"))
		{
			images[i].classList.remove("currentImage");
			if(direction === "previous")
			{
				if(i === 0) images[ii - 1].classList.add("currentImage");
				else images[i - 1].classList.add("currentImage");
				break;
			}
			else if(direction === "next")
			{
				if(i === ii-1) images[0].classList.add("currentImage");
				else images[i + 1].classList.add("currentImage");
				break;
			}
		}
	}
}

function convertDivsToParagraphs()
{
	const divs = get("div");
	let i = divs.length;
	while(i--)
	{
		const div = divs[i];
		if(div.getElementsByTagName("div").length)
			continue;
		let s = div.innerHTML;
		s = s.replace(/&nbsp;/g, ' ').replace(/\s+/g, '');
		if(s.length)
		{
			if(! (s[0] === '<' && s[1].toLowerCase() === "p"))
				div.innerHTML = '<p>' + div.innerHTML + '</p>';
		}
		else
		{
			div.remove();
		}
	}
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

function replaceEmptyParagraphsWithHr()
{
	const paras = get("p");
	let i = paras.length;
	while(i--)
	{
		const para = paras[i];
		if(removeWhitespace(para.textContent).length === 0)
		{
			let nextPara = paras[i - 1];
			while(nextPara && removeWhitespace(nextPara.textContent).length === 0 && i > 0)
			{
				nextPara = paras[--i];
			}
			para.parentNode.replaceChild(document.createElement("hr"), para);
		}
	}
}

function makePlainText(metaSelector)
{
	let selector = metaSelector.toLowerCase();
	switch(metaSelector)
	{
		case "h": selector = "h1, h2, h3, h4, h5, h6"; break;
	}
	const elements = get(selector);
	let i = elements.length;
	if(selector === "a")
	{
		while(i--)
		{
			const elem = elements[i];
			if(!elem.getElementsByTagName("img").length)
				elem.textContent = removeLineBreaks(elem.textContent);
		}
	}
	else
	{
		while(i--)
		{
			const elem = elements[i];
			elem.textContent = removeLineBreaks(elem.textContent);
		}
	}
}

function makeHeadings()
{
	const MAX_LENGTH = 120;
	const paragraphs = get("p");
	let i = paragraphs.length;
	while(i--)
	{
		const paragraph = paragraphs[i];
		let text = paragraph.textContent;
		text = text.replace(/\s+/g, '');
		let len = text.length;
		if(len === 0)
		{
			if(!paragraph.getElementsByTagName("img").length)
				paragraph.remove();
		}
		else if( text.match(/[IVX\.]+/g) && text.match(/[IVX\.]+/g)[0] === text )
		{
			replaceElement(paragraph, "h2");
			continue;
		}
		else if(len < MAX_LENGTH && !text[len-1].match(/[.,!\?'"\u2018\u201C\u2019\u201D]/) )
		{
			replaceElement(paragraph, "h3");
		}
		const tags = ["b", "strong", "em"];
		for(let j = 0, jj = tags.length; j < jj; j++)
		{
			const tag = tags[j];
			if(paragraph.getElementsByTagName(tag).length === 1)
			{
				const childText = paragraph.querySelector(tag).textContent;
				if(childText && childText.length < MAX_LENGTH && removeWhitespace(childText) === text)
					replaceElement(paragraph, "h2");
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

function fixCdnImages()
{
	const images = get("img[src*='si-cdn']");
	for(let i = 0, ii = images.length; i < ii; i++)
	{
		let src = images[i].src;
		if(src.indexOf("/http"))
		{
			src = trimStartingAt(src, "/http").substring(1);
			images[i].src = src;
		}
	}
}

function reindentPreformatted(pre)
{
	let s = pre.innerHTML;
	s = s.replace(/&nbsp;/g, " ")
		.replace(/<\/div>/g, "\r\n")
		.replace(/<\/p>/g, "\r\n")
		.replace(/<br>/g, "\r\n")
		.replace(/<br\s*\/>/g, "\r\n");
	pre.innerHTML = tabifySpaces(s);
}

function tabifySpaces(s)
{
	if(s.match("\n  [^ ]")) {
		s = s.replace(/ {2}/g, "\t");
	} else if(s.match("\n   [^ ]")) {
		s = s.replace(/ {3}/g, "\t");
	} else if(s.match("\n    [^ ]")) {
		s = s.replace(/ {4}/g, "\t");
	} else {
		s = s.replace(/ {4}/g, "\t");
	}
	return s;
}

//	Some people use <br> elements to create line breaks inside pres.
//	"Only two things are infinite..."
function splitByBrsInPres()
{
	const brs = document.querySelectorAll("pre br");
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const br = brs[i];
		br.parentNode.replaceChild(document.createTextNode("\n"), br);
	}
}

function fixPres()
{
	replaceElementsBySelector('font', 'span');
	let s, temp;
	const codeElements = get("code");
	let i = codeElements.length;
	while(i--)
	{
		const codeElement = codeElements[i];
		if(~codeElement.innerHTML.toLowerCase().indexOf("<br>"))
		{
			temp = document.createElement("pre");
			temp.innerHTML = codeElement.innerHTML;
			codeElement.parentNode.replaceChild(temp, codeElement);
		}
	}
	const preElements = get("pre");
	i = preElements.length;
	while(i--)
	{
		const pre = preElements[i];
		// Remove any HTML code within the PREs
		s = pre.innerHTML;
		s = s.replace(/&nbsp;/g, " ");
		s = s.replace(/<\/div>/g, "\r\n");
		s = s.replace(/<\/p>/g, "\r\n");
		//s = s.replace(/<br[^>]*>/g, "\r\n");
		s = s.replace(/<br>/g, "\r\n");
		s = s.replace(/<br\s*\/>/g, "\r\n");
		s = s.replace(/<[^<>]+>/g, "");
		s = tabifySpaces(s);
		s = s.replace(/\t/g, "GYZYtab");
		s = s.replace(/\r\n/g, "GYZYnl");
		s = s.replace(/\n/g, "GYZYnl");
		pre.innerHTML = s;
	}
}

function restorePres()
{
	const pres = get("pre");
	let i, ii;
	for(i = 0, ii = pres.length; i < ii; i++)
	{
		const pre = pres[i];
		pre.innerHTML = pre.innerHTML.replace(/GYZYtab/g, "\t");
		pre.innerHTML = pre.innerHTML.replace(/GYZYnl/g, "\n");
		pre.innerHTML = pre.innerHTML.replace(/\n+/g, "\n");
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

function createTagsByClassName()
{
	replaceElementsBySelector(".calibre", "section");
	replaceElementsBySelector(".indent, .tx, .fmtx, .fmtx1", "p");
	replaceElementsBySelector(".cn, .ct, .cst", "h2");
	replaceElementsBySelector(".atx", "blockquote");
	const e = document.querySelectorAll("div, p");
	let i = e.length;
	let numReplaced = 0;
	const tagsCreated = {};
	while(i--)
	{
		const element = e[i];
		let replacementTagName = null;
		switch(true)
		{
			case hasClassesStartingWith(element, ["h1", "partno", "partnum", "parttitle", "part-title"]): replacementTagName = "h1"; break;
			case hasClassesStartingWith(element, ["chap", "fmtitle", "fmh", "h2"]): replacementTagName = "h2"; break;
			case hasClassesStartingWith(element, ["h3"]): replacementTagName = "h3"; break;
			case hasClassesStartingWith(element, ["ded", "epi"]): replacementTagName = "h4"; break;
			case looksLikeHeading(element): replacementTagName = "h2"; break;
			case looksLikeComment(element): replacementTagName = "comment"; break;
			case looksLikeExtract(element): replacementTagName = "blockquote"; break;
			case hasClassesContaining(element, ["image"]): replacementTagName = "figure"; break;
			case hasClassesContaining(element, ["caption"]): replacementTagName = "figcaption"; break;
		}
		if(replacementTagName)
		{
			if(tagsCreated[replacementTagName])
				tagsCreated[replacementTagName]++;
			else
				tagsCreated[replacementTagName] = 1;
			numReplaced++;
			replaceElement(element, replacementTagName);
		}
	}
	const elements = get("span");
	i = elements.length;
	while(i--)
	{
		const element = elements[i];
		let replacementTagName = null;
		switch(true)
		{
			case hasClassesStartingWith(element, ["ital"]): replacementTagName = "i"; break;
			case hasClassesContaining(element, ["bold", "txbf", "epub-b"]): replacementTagName = "b"; break;
			case hasClassesContaining(element, ["italic", "txit", "epub-i"]): replacementTagName = "i"; break;
			case hasClassesContaining(element, ["small"]): replacementTagName = "small"; break;
		}
		if(replacementTagName)
		{
			if(tagsCreated[replacementTagName])
				tagsCreated[replacementTagName]++;
			else
				tagsCreated[replacementTagName] = 1;
			numReplaced++;
			replaceElement(element, replacementTagName);
		}
	}
	showMessageBig(`createTagsByClassName: replaced <b>${numReplaced}</b> elements`);
	console.log(tagsCreated);
}

function replaceHeadingClassesByTextLength()
{
	let e = get("div, p");
	const classes = getAllClassesFor("div, p");
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
	cleanupHead();
	createTagsByClassName();
	replaceEmptyParagraphsWithHr();
	groupAdjacentElements("hr");
	fixEmptyAnchors();
	makeReferencesSemantic();
	// document.body.classList.add("ebook");
}

function looksLikeUrl(str)
{
	if(str.indexOf("http") === 0)
		return true;
	if(~str.indexOf("/"))
		return true;
}

function looksLikeHeading(element)
{
	if(element.innerHTML.length > 80) return false;
	if(hasClassesStartingWith(element, ["chap", "cn", "ct", "fmh", "title", "h1", "h2"])) return true;
	if(hasClassesContaining(element, ["heading", "chapternumber", "chaptertitle", "h1", "h2"])) return true;
}

function looksLikeComment(element)
{
	if(hasClassesContaining(element, ["omment"])) return true;
}

function looksLikeExtract(element)
{
	if(element.querySelectorAll("div, p").length > 5) return false;
	if(hasClassesStartingWith(element, ["block", "quote", "extract"])) return true;
	if(hasClassesContaining(element, ["quote", "extract"])) return true;
}

function setDocTitleSimple(newTitle)
{
	document.title = newTitle;
	const firstHeading = getOne("h1");
	if(!(firstHeading && trim(firstHeading.textContent) === newTitle))
	{
		const newHeading = createElement("h1", { textContent: newTitle });
		document.body.insertBefore(newHeading, document.body.firstChild);
	}
}

function filterHeadings(headings)
{
	if(!headings.length)
		return null;
	const filteredHeadings = [];
	for(let i = 0, ii = headings.length; i < ii; i++)
	{
		const heading = headings[i];
		if(!startsWithAnyOfTheStrings(heading.textContent, ["Share", "Comments"]))
			filteredHeadings.push(heading);
	}
	return filteredHeadings;
}

function cleanupTitle()
{
	const titleText = sanitizeTitle(document.title);
	const headings = document.querySelectorAll("h1, h2");
	if(headings && headings.length)
	{
		for(let i = 0, ii = headings.length; i < ii; i++)
		{
			const heading = headings[i];
			if(!heading.textContent || !heading.textContent.length)
				continue;
			const headingText = sanitizeTitle(heading.textContent);
			if(removeWhitespace(headingText).length === 0)
				continue;
			if(~titleText.indexOf(headingText) && headingText.length < titleText.length)
			{
				document.title = headingText;
				return;
			}
		}
	}
}

function editDocumentTitle()
{
	const currentHeading = chooseDocumentHeading();
	callFunctionWithArgs("Set document heading", setDocTitle, 1, currentHeading);
}

function chooseDocumentHeading()
{
	Nimbus.currentHeadingText = trim( document.title.replace(getBestDomainSegment(location.hostname), "") );
	return Nimbus.currentHeadingText;
}

function cycleThroughDocumentHeadings()
{
	const MAX_HEADINGS = 5;
	deleteEmptyHeadings();
	Nimbus.currentHeadingText = trim( document.title.replace(getBestDomainSegment(location.hostname), "") );
	del(Nimbus.HEADING_CONTAINER_TAGNAME + " h1");
	const headings = filterHeadings(get("h1, h2"));
	const candidateHeadingTexts = [];
	if(headings && headings.length)
	{
		for(let i = 0, ii = Math.min(MAX_HEADINGS, headings.length); i < ii; i++)
		{
			const heading = headings[i];
			if(heading.classList.contains("currentHeading"))
				continue;
			const text = sanitizeTitle(heading.textContent);
			if(text.length && !candidateHeadingTexts.includes(text))
				candidateHeadingTexts.push(text);
		}
	}
	if(candidateHeadingTexts.length && Nimbus.currentHeadingText)
		Nimbus.currentHeadingText = getNext(Nimbus.currentHeadingText, candidateHeadingTexts);

	const pageNumberStrings = document.body.textContent.match(/Page [0-9]+ of [0-9]+/);
	if(pageNumberStrings && !Nimbus.currentHeadingText.match(/Page [0-9]+/i))
			Nimbus.currentHeadingText = Nimbus.currentHeadingText + " - " + pageNumberStrings[0];
	setDocTitle(Nimbus.currentHeadingText);
	return Nimbus.currentHeadingText;
}

function setDocumentHeading(headingText)
{
	emptyElement(getOne(Nimbus.HEADING_CONTAINER_TAGNAME));
	const firstHeadingText = document.body.firstChild.textContent;
	if(firstHeadingText === headingText)
		return;
	let newHeading = createElement("h1", { textContent: headingText });
	let newHeadingWrapper = getOne(Nimbus.HEADING_CONTAINER_TAGNAME);
	if(!newHeadingWrapper)
	{
		newHeadingWrapper = createElement(Nimbus.HEADING_CONTAINER_TAGNAME);
		document.body.insertBefore(newHeadingWrapper, document.body.firstChild);
	}
	newHeadingWrapper.appendChild(newHeading);
	Nimbus.currentHeadingText = headingText;
}

function getBestDomainSegment(hostname)
{
	if(!hostname || !hostname.length)
		return "";
	const segmentsToReplace = ["www.", "developer.", ".com", ".org", ".net", ".wordpress"];
	let hostnameSanitized = hostname;
	for(let i = 0, ii = segmentsToReplace.length; i < ii; i++)
		hostnameSanitized = hostnameSanitized.replace(segmentsToReplace[i], "");
	let segments = hostnameSanitized.split(".");
	let longestSegment = '';
	let i = segments.length;
	while(i--)
	{
		let segment = segments[i];
		if(longestSegment.length < segment.length)
			longestSegment = segment;
	}
	return " [" + longestSegment + "]";
}

function setDocTitle(newTitle)
{
	let headingText = sanitizeTitle(newTitle || chooseDocumentHeading());
	setDocumentHeading(headingText);
	const domainSegment = getBestDomainSegment(location.hostname);
	document.title = headingText + domainSegment;
}

function removeColorsFromInlineStyles()
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

function cycleThroughTopLevelElements(boolReverse)
{
	const hl = getMarkedElements();
	consoleLog(hl);
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
			if(e.classList.contains(Nimbus.markerClass))
			{
				found = true;
				e.classList.remove(Nimbus.markerClass);
				if(i > 0)
					candidateElements[i - 1].classList.add(Nimbus.markerClass);
				else
					candidateElements[ii - 1].classList.add(Nimbus.markerClass);
				break;
			}
		}
	}
	else
	{
		for(let i = 0, ii = candidateElements.length; i < ii; i++)
		{
			const e = candidateElements[i];
			if(e.classList.contains(Nimbus.markerClass))
			{
				found = true;
				e.classList.remove(Nimbus.markerClass);
				if(i < ii - 1)
					candidateElements[i + 1].classList.add(Nimbus.markerClass);
				else
					candidateElements[0].classList.add(Nimbus.markerClass);
				break;
			}
		}
	}
	if(!found)
		candidateElements[0].classList.add(Nimbus.markerClass);
}

function deselect()
{
	window.getSelection().removeAllRanges();
}

function removeAccessKeys()
{
	const e = get("a");
	let i = e.length;
	while(i--)
		e[i].removeAttribute("accesskey");
}

function showPassword()
{
	const inputs = get("input");
	let i = inputs.length;
	while(i--)
	{
		const input = inputs[i];
		if(input.type && input.type === "password" && !input.classList.contains("showPassword"))
		{
			input.addEventListener("keyup", echoPassword, false);
			input.classList.add("showPassword");
		}
	}
}

function echoPassword(e)
{
	showMessage(e.target.value, "none", true);
}

function getPagerLinks()
{
	const links = get("a");
	const pagerWrapper = createElement("h1", { textContent: "Pages: " });
	let count = 0;
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		let linkText = link.textContent;
		if(linkText && trim(linkText).length && !isNaN(Number(linkText)))
		{
			count++;
			pagerWrapper.appendChild(createElement("a", { href: link.href, textContent: link.textContent || "[no text]" }));
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
	for(let j = 0, jj = selects.length; j < jj; j++)
	{
		const select = selects[j];
		for(let i = 0, ii = select.length; i < ii; i++)
		{
			const option = select[i];
			if(looksLikeUrl(option.value))
			{
				const pagerWrapper = createElement("h3");
				pagerWrapper.appendChild(createElement("a", { href: option.value, textContent: option.textContent || i + 1 }));
				document.body.appendChild(pagerWrapper);
			}
		}
	}
	document.body.appendChild(createElement("hr"));
}

function cycleFocusOverFormFields()
{
	let inputs = get("input, textarea");
	const len = inputs.length;
	if(len === 1)
	{
		focusField(inputs[0]);
		return;
	}
	const candidateInputs = [];
	for(let i = 0; i < len; i++)
	{
		const input = inputs[i];
		if(input.name && input.name === "q")
		{
			focusField(input);
			return;
		}
		if(input.type)
		{
			if(!["hidden", "submit", "reset", "button", "radio", "checkbox", "image"].includes(input.type))
				candidateInputs.push(input);
		}
		else
		{
			candidateInputs.push(input);
		}
	}
	let found = false;
	for(let i = 0, ii = candidateInputs.length; i < ii; i++)
	{
		if(candidateInputs[i].classList.contains("focused"))
		{
			found = true;
			if(i < ii-1)
				focusField(candidateInputs[i + 1]);
			else
				focusField(candidateInputs[0]);
			break;
		}
	}
	if(!found)
		focusField(candidateInputs[0]);
}

function focusField(elem)
{
	if(!elem)
		return;
	removeClassFromAll("focused");
	elem.focus();
	elem.classList.add("focused");
	showMessageBig(`Focused <b>${createSelector(elem)}</b>`);
	consoleLog("focusField: " + createSelector(document.activeElement));
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

function highlightCode(shouldHighlightKeywords)
{
	splitByBrsInPres();
	fixPres();
	restorePres();

	const preBlocks = get("pre");
	let i = preBlocks.length;
	while(i--)
	{
		const preElement = preBlocks[i];
		// delete the <pre>s that only contain line numbers
		if(preElement.textContent && preElement.textContent.match(/[a-z]/) === null)
		{
			preElement.remove();
			continue;
		}

		let nodeHTML = preElement.innerHTML;
		nodeHTML = nodeHTML.replace(/<span[^>]*>/g, "");
		nodeHTML = nodeHTML.replace(/<\/span>/g, "");
		nodeHTML = parseCode(nodeHTML);

		// Everything between angle brackets
		nodeHTML = nodeHTML.replace(/(&lt;\/?[^&\r\n]+&gt;)/g, '<xh>$1</xh>');
		// php/XML opening and closing tags
		nodeHTML = nodeHTML.replace(/(&lt;\?)/g, '<b1>$1</b1>');
		nodeHTML = nodeHTML.replace(/(\?&gt;)/g, '<b1>$1</b1>');

		if(shouldHighlightKeywords === true)
		{
			const keywords = [
				"abstract", "addEventListener", "appendChild",
				"break", "byte",
				"case", "catch", "char", "class", "const", "continue", "createElement", "createTextNode",
				"debugger", "default", "delete", "do", "document", "documentElement", "double",
				"else", "enum", "export", "extends",
				"false", "final", "finally", "firstChild", "float", "for", "function",
				"getElementsByClassName", "getElementsByID", "getElementsByTagName", "goto",
				"if", "implements", "import", "in", "insertBefore", "int",
				"let", "long",
				"NaN", "native", "new", "npm", "null",
				"object", "onclick", "onload", "onmouseover",
				"package", "private", "protected", "prototype", "public",
				"querySelector", "querySelectorAll",
				"return",
				"script", "src", "static", "String", "struct", "switch", "synchronized",
				"this", "throw", "throws", "transient", "true", "try", "type", "typeof",
				"undefined",
				"var", "void", "volatile",
				"yarn",
				"while", "window", "with"
			];
			let j = keywords.length;
			while(j--)
			{
				const regex = new RegExp("\\b" + keywords[j] + "\\b", "g");
				nodeHTML = nodeHTML.replace(regex, "<xk>" + keywords[j] + "</xk>");
			}
		}
		preElement.innerHTML = nodeHTML;
	}
}

function getNodeContainingSelection()
{
	const selection = window.getSelection();
	if(!selection)
	{
		showMessageError("Couldn't get selection");
		return false;
	}
	return getFirstBlockParent(selection.anchorNode);
}

function toggleContentEditable()
{
	const selectedNode = getNodeContainingSelection();
	if(!selectedNode)
		return;
	let isEditable = selectedNode.getAttribute("contenteditable") === "true";
	selectedNode.setAttribute("contenteditable", isEditable ? "false" : "true");
	isEditable = !isEditable;
	if(isEditable)
	{
		showMessageBig("contentEditable ON");
		selectedNode.focus();
	}
	else
	{
		showMessageBig("contentEditable OFF");
	}
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
		const field = e[i];
		if(field.hasAttribute("type"))
		{
			inputType = field.type;
			if(inputType !== "button" && inputType !== "submit" && inputType !== "image" && inputType !== "hidden" && inputType !== "checkbox" && inputType !== "radio")
			{
				inputName = field.getAttribute("name") || field.getAttribute("id");
				inputName = inputName.toLowerCase();
				if(inputName)
				{
					if(inputName === "companyname") field.value = "";
					else if(inputName.indexOf("first") >= 0) field.value = "John";
					else if(inputName.indexOf("last") >= 0) field.value = "Doe";
					else if(inputName.indexOf("name") >= 0) field.value = "John Doe";
					else if(inputName.indexOf("email") >= 0) field.value = "test@test.com";
					else if(inputName.indexOf("day") >= 0) field.value = Math.floor(Math.random() * 28);
					else if(inputName.indexOf("year") >= 0) field.value = 1980 + Math.floor(Math.random() * 20);
					else if(inputName.indexOf("phone") >= 0) field.value = "(00) 0000 0000";
					else if(inputName.indexOf("mobile") >= 0) field.value = "0400222333";
					else if(inputName.indexOf("date") >= 0) field.value = "23/08/1991";
					else if(inputName.indexOf("suburb") >= 0) field.value = "Melbourne";
					else if(inputName.indexOf("postcode") >= 0) field.value = "3000";
					else if(inputName.indexOf("state") >= 0) field.value = "VIC";
					else if(inputType === "number") field.value = 42;
					else if(inputType === "text") field.value = field.name.replace(/_/g, ' ');
					else if(inputType === "checkbox") field.checked = true;
					else if(inputType === "radio") field.checked = true;
					else if(inputType !== 'file') field.value = inputName.replace(/_/g, ' ');
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
		const optionIndex = 1 + Math.floor(Math.random() * (j - 1));
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

function revealLinkHrefs()
{
	const style = "a::after { content: attr(href); background: #000; color: #F90; padding: 2px 10px; }";
	insertStyle(style, "styleShowLinkHrefs", true);
}

function humanizeUrl(url)
{
	const matches = url.match(/[0-9A-Za-z_\-\+]+/g);
	if(!matches)
		return url;
	let i = matches.length;
	let longestMatch = matches[i - 1];
	while(i--)
		if(matches[i].length > longestMatch.length)
			longestMatch = matches[i];
	return longestMatch;
}

function revealEmptyLinks()
{
	const links = get("a");
	let i = links.length;
	let count = 0;
	while(i--)
	{
		const link = links[i];
		if(!(link.textContent.length || link.getElementsByTagName("img").length))
		{
			count++;
			link.textContent = humanizeUrl(link.href || link.id || link.className);
			link.classList.add(Nimbus.markerClass);
		}
	}
	showMessageBig("Revealed " + count + " empty links");
}

//	Replaces empty, invisible anchor links by taking their IDs and
//	applying the IDs to either an adjacent link if one exists, or to a
//	<cite> element that is appended to the block parent
function fixEmptyAnchors()
{
	const CHAR_BULLET = '\u2022';
	const links = get("a");
	let emptyLinksToDelete = [];
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		if(!(link.textContent.length || link.getElementsByTagName("img").length))
		{
			if(!link.id)
				continue;
			const prevElem = link.previousElementSibling;
			const nextElem = link.nextElementSibling;
			if(prevElem && prevElem.tagName && prevElem.tagName === "A")
			{
				prevElem.id = link.id;
			}
			else if(nextElem && nextElem.tagName && nextElem.tagName === "A")
			{
				nextElem.id = link.id;
			}
			else
			{
				const parent = getFirstBlockParent(link);
				if(parent)
					parent.appendChild(createElement("cite", { textContent: CHAR_BULLET, id: link.id }));
			}
			emptyLinksToDelete.push(link);
		}
	}
	del(emptyLinksToDelete);
}

function changePageByUrl(direction)
{
	const url = window.location.href;
	const urlPageMatch = url.match(/page\/[0-9]+/);
	if(urlPageMatch)
	{
		let page = parseInt(urlPageMatch[0].split('/')[1], 10);
		let currentPage = page;
		switch(direction)
		{
			case "previous": page--; break;
			case "next": page++; break;
		}
		if(page < 1)
			page = 1;
		showMessageBig(`Found page ${currentPage} in URL, Going to page ${page}`);
		const newUrl = url.replace(urlPageMatch[0], `page/${page}`);
		consoleLog(newUrl);
		location.href = newUrl;
		return true;
	}

	const queryParams = parseQueryString(url);
	if(!queryParams)
		return false;
	let found = false;
	let page;
	let currentPage;
	for(let i = 0, ii = queryParams.length; i < ii; i++)
	{
		if(["page", "p"].includes(queryParams[i].key))
		{
			found = true;
			page = parseInt(queryParams[i].value, 10);
			currentPage = page;
			switch(direction)
			{
				case "previous": page--; break;
				case "next": page++; break;
			}
			if(page < 1)
				page = 1;
			queryParams[i].value = page;
			break;
		}
	}
	if(found)
	{
		showMessageBig(`Found page ${currentPage} in query string, going to page ${page}`);
		let newQueryString = "";
		for(let i = 0, ii = queryParams.length; i < ii; i++)
			newQueryString += `${queryParams[i].key}=${queryParams[i].value}&`;
		let baseUrl = trimAt(url, "?");
		const newUrl = `${baseUrl}?${newQueryString}`;
		consoleLog(newUrl);
		location.href = newUrl;
		return true;
	}
	return false;
}

function changePage(direction)
{
	const canChangePageByUrl = changePageByUrl(direction);
	if(canChangePageByUrl)
		return;
	const links = get("a");
	let matchStrings = [];
	if(direction === "previous")
		matchStrings = ["previous", "previous", "previouspage", "\u00AB"];
	else if(direction === "next")
		matchStrings = ["next", "nextpage", "\u00BB"];

	let i = links.length;
	while(i--)
	{
		const link = links[i];
		let linkText = link.textContent;
		if(linkText)
		{
			linkText = linkText.replace(/[^a-zA-Z0-9\u00AB\u00BB]/g, "").toLowerCase();
			if(matchStrings.includes(linkText) || containsAnyOfTheStrings(linkText, matchStrings))
			{
				link.innerHTML = "<mark>" + link.innerHTML + "</mark>";
				location.href = link.href;
				return;
			}
		}
	}
}

function cycleHighlightTag()
{
	const nextTag = getNext(Nimbus.highlightTagName, Nimbus.highlightTagNameList);
	showMessageBig(`<${nextTag}>Highlight tag is ${nextTag}</${nextTag}>`);
	Nimbus.highlightTagName = nextTag;
}

function resetHighlightTag()
{
	const nextTag = Nimbus.highlightTagNameList[0];
	showMessageBig(`<${nextTag}>Highlight tag is ${nextTag}</${nextTag}>`);
	Nimbus.highlightTagName = nextTag;
}

function setReplacementTag(tagName)
{
	Nimbus.replacementTagName = tagName;
}

//	This function is for the use case where a document contains adjacent elements that should
//	be grouped inside a parent element, like a list or a blockquote.
function groupMarkedElements(tagName)
{
	const parentTagName = tagName || "ul";
	let childTagName = "li";
	switch(parentTagName)
	{
		case "blockquote": childTagName = "p"; break;
		case "dl": childTagName = "dt"; break;
		case "ol": childTagName = "li"; break;
		case "ul": childTagName = "li"; break;
	}
	const elemsToJoin = getMarkedElements();
	if(!elemsToJoin.length)
		return;
	const wrapper = document.createElement(parentTagName);
	for(let i = 0, ii = elemsToJoin.length; i < ii; i++)
	{
		const child = document.createElement(childTagName);
		child.innerHTML = elemsToJoin[i].innerHTML;
		wrapper.appendChild(child);
	}
	insertBefore(elemsToJoin[0], wrapper);
	del(makeClassSelector(Nimbus.markerClass));
	deleteMessage();
}

function groupAdjacentElements(selector)
{
	const elems = get(selector);
	const tagName = elems[0].tagName;
	if(["BLOCKQUOTE", "LI", "P"].includes(tagName))
	{
		let parentTagName = "";
		let childTagName = "";
		switch(tagName)
		{
			case "BLOCKQUOTE":
				parentTagName = "blockquote";
				childTagName = "p";
				break;
			case "LI":
				parentTagName = "ul";
				childTagName = "li";
				break;
			case "P":
				parentTagName = "blockquote";
				childTagName = "P";
				break;
			default:
				parentTagName = "blockquote";
				childTagName = "p";
				break;
		}
		for(let i = 0, ii = elems.length; i < ii; i++)
		{
			const elem = elems[i];
			const parent = document.createElement(parentTagName);
			parent.appendChild(convertElement(elem, childTagName));
			let nextElem = elem.nextElementSibling;
			while(nextElem && elems.includes(nextElem))
			{
				i++;
				const nextElemTemp = nextElem.nextElementSibling;
				parent.appendChild(convertElement(nextElem, childTagName));
				nextElem.remove();
				nextElem = nextElemTemp;
			}
			elem.parentNode.replaceChild(parent, elem);
		}
	}
	else
	{
		for(let i = 0, ii = elems.length; i < ii; i++)
		{
			const elem = elems[i];
			let nextElem = elem.nextElementSibling;
			while(nextElem && nextElem.tagName === tagName)
			{
				i++;
				while(nextElem.firstChild)
					elem.appendChild(nextElem.firstChild);
				const appendedElem = nextElem;
				nextElem = nextElem.nextElementSibling;
				appendedElem.remove();
			}
		}
	}
}

function joinParagraphsByLastChar()
{
	const MINLENGTH = 20;
	const paras = get("p");
	let i = paras.length;
	while(i--)
	{
		const para = paras[i];
		const paraText = trim(para.textContent);
		if(!paraText || paraText.length < MINLENGTH)
			continue;
		if(paraText[paraText.length - 1].match(/[a-z,\-]/i))
		{
			const nextPara = para.nextElementSibling;
			if(nextPara && nextPara.tagName === "P")
			{
				para.classList.add(Nimbus.markerClass);
				para.appendChild(document.createTextNode(" "));
				while(nextPara.firstChild)
					para.appendChild(nextPara.firstChild);
			}
		}
	}
}

//	This function fixes the problem where two adjacent elements should in fact be one element.
//	Useful for joining, say, a paragraph that has erroneously been split into two paragraphs.
function joinMarkedElements()
{
	const elemsToJoin = getMarkedElements();
	if(!elemsToJoin.length)
		return;
	const wrapperTagName = elemsToJoin[0].tagName;
	const wrapper = document.createElement(wrapperTagName);
	for(let i = 0, ii = elemsToJoin.length; i < ii; i++)
	{
		const originalElement = elemsToJoin[i];
		while(originalElement.firstChild)
		{
			wrapper.appendChild(originalElement.firstChild);
			wrapper.appendChild(document.createTextNode(" "));
		}
	}
	insertBefore(elemsToJoin[0], wrapper);
	del(Nimbus.markerClassSelector);
	deleteMessage();
}

//	I find it hard to believe the number of website creators who think a logout button should be hidden behind two or more clicks.
function logout()
{
	switch(location.hostname)
	{
		case 'mail.google.com':
		case 'accounts.google.com':
			location.href = 'https://accounts.google.com/Logout';
			return;
	}
	let found = false;
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const node = links[i];
		if(node.href)
		{
			const s = normalizeString(node.href);
			if((~s.indexOf("logout") && s.indexOf("logout_gear") === -1) || ~s.indexOf("signout"))
			{
				found = true;
				showMessageBig(node.href);
				node.classList.add(Nimbus.markerClass);
				node.click();
				break;
			}
		}
		if(node.textContent)
		{
			const s = normalizeString(node.textContent);
			if(~s.indexOf("logout") || ~s.indexOf("signout"))
			{
				found = true;
				showMessageBig(node.href);
				node.classList.add(Nimbus.markerClass);
				node.click();
				break;
			}
		}
	}
	if(!found)
	{
		const inputsButtons = document.querySelectorAll("input, button");
		for(let i = 0, ii = inputsButtons.length; i < ii; i++)
		{
			const element = inputsButtons[i];
			const s = normalizeString(element.value || element.textContent);
			if(s.indexOf("logout") >= 0 || s.indexOf("signout") >= 0)
			{
				found = true;
				showMessageBig("Logging out...");
				element.classList.add(Nimbus.markerClass);
				element.click();
				break;
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

function insertStyleHighlight()
{
	const s = `
		.nimbushl { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; padding: 2px; }
		.focused { box-shadow: inset 0px 1000px #000; color: #FFF; }
		.nimbushl2 { box-shadow: inset 2px 2px #00F, inset -2px -2px #00F; padding: 2px; }
		.nimbushl::after, .nimbushl2::after { content: " "; display: block; clear: both; }
		a.nimbushl::after, span.nimbushl::after { content: ""; display: inline; clear: none; }
	`;
	insertStyle(s, "styleHighlight", true);
}

function insertStyleAnnotations()
{
	const s = `
		annotationinfo, annotationwarning, annotationerror { display: inline-block; font: 14px helvetica; padding: 2px 5px; border-radius: 0; }
		annotationinfo { background: #000; color: #0F0; }
		annotationwarning { background: #000; color: #F90; }
		annotationerror { background: #A00; color: #FFF; }
	`;
	insertStyle(s, "styleAnnotations", true);
}

function insertStyleShowErrors()
{
	const s = ".error { box-shadow: inset 2000px 2000px rgba(255, 0, 0, 1);";
	insertStyle(s, "styleShowErrors", true);
}

function toggleScreenRefresh()
{
	const style = `
		@keyframes move {
			0% { top: 0; background: #141414;  }
			50% { background: #999; }
			100% { top: 100%; background: #141414; }
		}
		html:after { content: ""; position: fixed; left: 0; top: 0; width: 100%; height: 100px; background: #888; animation: move 40s linear alternate infinite; z-index: -1; }
	`;
	toggleStyle(style, "styleScreenRefresh");
}

function toggleStyleSimpleNegative()
{
	const s = `
		html, body, body[class] {background: #000; }
		*, *[class] { background-color: rgba(0,0,0,0.4); color: #CCC; border-color: transparent; }
		h1, h2, h3, h4, h5, h6, b, strong, em, i {color: #FFF; }
		mark {color: #FF0; }
		a, a[class] *, * a[class] {color: #09F; }
		a:hover, a:hover *, a[class]:hover *, * a[class]:hover {color: #FFF; }
		a:visited, a:visited *, a[class]:visited *, * a[class]:visited {color: #048; }
		button[class], input[class], textarea[class] { border: 2px solid #09F; }
		button[class]:focus, input[class]:focus, textarea[class]:focus, button[class]:hover, input[class]:hover, textarea[class]:hover { border: 2px solid #FFF; }
		`;
	toggleStyle(s, "styleSimpleNegative", true);
}

function toggleStyleGrey()
{
	const s = `
		body { background: #203040; color: #ABC; font: 24px "swis721 cn bt"; }
		h1, h2, h3, h4, h5, h6 { background: #123; padding: 0.35em 10px; font-weight: normal; }
		body.pad100 { padding: 100px; }
		body.xwrap { width: 1000px; margin: 0 auto; }
		mark { background: #049; color: #7CF; padding: 4px 2px; }
		p { line-height: 135%; text-align: justify; }
		blockquote { margin: 0 0 0 40px; padding: 10px 20px; border-left: 10px solid #123; }
		a { text-decoration: none; color: #09F; }
		em, i, strong, b { font-style: normal; font-weight: normal; color: #FFF; }
		code { background: #012; color: #ABC; }
		pre { background: #012; color: #ABC; padding: 20px; }
		pre q1 { color: #57F; background: #024; }
		pre q2 { color: #C7F; background: #214; }
		pre c1 { font-style: normal; color: #F90; background: #331500; }
		pre c2 { color: #F00; background: #400; }
		pre b1 { color: #0F0; }
		pre b2 { color: #FFF; }
		pre b3 { color: #F90; }
		pre xk { color: #29F; }
		pre xh { color: #57F; }
		pre xv { color: #F47; }
	`;
	toggleStyle(s, "styleGrey", true);
}

function toggleStyleNegative()
{
	const s = `
		html { background: #181818; }
		html body { margin: 0; }
		html body, html body[class] { color: #888; background: #242424; font-weight: normal; }
		body.pad100 { padding: 100px 100px; }
		body.pad100 table { width: 100%; }
		body.pad100 td, body.pad100 th { padding: 3px 10px; }
		body.pad100 img { display: block; max-width: 100%; height: auto; }
		nav { background: #111; }
		body.xdark { background: #111; }
		body.xblack { background: #000; }
		body.xwrap { width: 1400px; margin: 0 auto; padding: 100px 300px; }
		html h1, html h2, html h3, html h4, html h5, html h6, html h1[class], html h2[class], html h3[class], html h4[class], html h5[class], html h6[class] { color: #AAA; padding: 10px 20px; line-height: 160%; margin: 2px 0; background: #141414; border: 0; }
		html h1, html h1[class], div[class] h1 { font: 40px "Swis721 Cn BT", Calibri, sans-serif; color: #FFF; }
		html h2, html h2[class], div[class] h2 { font: 28px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }
		html h3, html h3[class], div[class] h3 { font: 24px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }
		html h4, html h4[class], div[class] h4 { font: 20px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }
		html h5, html h5[class], div[class] h5 { font: 16px "Swis721 Cn BT", Calibri, sans-serif; color: #AAA; }
		html h6, html h6[class], div[class] h6 { font: 14px Verdana, sans-serif; color: #999; }
		html h5, html h6 { padding: 0.5em 10px; }
		dl { border-left: 20px solid #111; }
		dt { color: inherit; padding: 0.5em 10px; line-height: 160%; margin: 2px 0; background: #111; border: 0; border-left: 20px solid #0C0C0C; color: #AAA; }
		dd { color: inherit; padding: 0.25em 10px; line-height: 160%; margin: 2px 0; background: #141414; border: 0; border-left: 20px solid #0C0C0C; }
		button, select, textarea, html input, html input[class] { border: 0; padding: 5px 10px; background: #242424; box-shadow: inset 0 0 5px #000; color: #999; line-height: 150%; -moz-appearance: none; border-radius: 0; }
		html input[type="checkbox"] { width: 24px; height: 24px; background: #242424; }
		button, html input[type="submit"], html input[type="button"] { box-shadow: none; background: #111; }
		button:hover, button:focus, html input[type="submit"]:hover, input[type="submit"]:focus, html input[type="button"]:hover, html input[type="button"]:focus { background: #000; color: #FFF; }
		input div { color: #999; }
		select:focus, textarea:focus, input:focus { color: #999; outline: 0; background: #0C0C0C; }
		textarea:focus *, input:focus * { color: #999; }

		html a, html a:link { color: #09F; text-decoration: none; text-shadow: none; font: inherit; }
		html a:visited { color: #36A; text-decoration: none; }
		html a:hover, html a:focus, html a:hover *, html a:focus * { color: #FFF; text-decoration: none; outline: 0; }
		html a:active { color: #FFF; outline: none; }
		html .pagination a:link { font: bold 30px "swis721 cn bt"; border: 0; background: #111; padding: 10px; }

		main, article, section, header, footer, hgroup, nav, ins, small, big, aside, details, font, article, form, fieldset, label, span, span[class], blockquote, div, div[class], ul, ol, li, a, i, b, strong, dl { color: inherit; background: transparent none; line-height: inherit; font-family: inherit; font-size: inherit; font-weight: inherit; text-decoration: inherit; }
		ul { list-style: none; margin: 0; padding: 10px 0 10px 20px; }
		li { font-size: 14px; list-style-image: none; background-image: none; line-height: 150%; }
		tbody, thead, th, tr, td, table { background: #202020; color: inherit; font: 12px Verdana; }
		body.pad100 ul li { border-left: 5px solid #0C0C0C; padding: 0 0 0 10px; margin: 0 0 2px 0; }
		cite, u, em, i, b, strong { font-weight: normal; font-style: normal; text-decoration: none; color: #CCC; font-size: inherit; }
		a u, a em, a i, a b, a strong { color: inherit; }
		small { font-size: 80%; }
		input, input *, button, button *, div, td, p { font-size: 12px; font-family: Verdana, sans-serif; line-height: 150%; }
		p { margin: 0; padding: 5px 0; font-style: normal; font-weight: normal; line-height: 150%; color: inherit; background: inherit; border: 0; }
		blockquote { margin: 0 0 0 20px; padding: 10px 0 10px 20px; border-style: solid; border-width: 10px 0 0 10px; border-color: #0C0C0C; }
		blockquote blockquote { margin: 0 0 0 20px; padding: 0 0 0 20px; border-width: 0 0 0 10px; }

		@media (min-width: 2048px)
		{
			tbody, thead, th, tr, td, table { background: #202020; color: inherit; font: 22px "Swis721 Cn BT"; }
			input, input *, button, button *, div, td, p { font-size: 22px; font-family: "Swis721 Cn BT", sans-serif; line-height: 150%; }
			li { font-size: 22px; }
			pre { font-size: 22px; }
		}

		code { background: #0C0C0C; font-family: Verdcode, Consolas, sans-serif; padding: 1px 2px; }
		pre { background: #0C0C0C; border-style: solid; border-width: 0 0 0 10px; border-color: #444; padding: 10px 20px; font: 14px Verdcode; }
		pre, code { color: #999; }
		pre p { margin: 0; padding: 0; font: 14px Verdcode, Consolas, sans-serif; }

		pre q1 { color: #57F; background: #024; }
		pre q2 { color: #C7F; background: #214; }
		pre c1 { font-style: normal; color: #F90; background: #331500; }
		pre c2 { color: #F00; background: #400; }
		pre b1 { color: #0F0; }
		pre b2 { color: #FFF; }
		pre b3 { color: #F90; }
		pre xk { color: #29F; }
		pre xh { color: #57F; }
		pre xv { color: #F47; }

		markgreen { background: #040; color: #0F0; padding: 2px 0; line-height: inherit; }
		markred { background: #400; color: #F00; padding: 2px 0; line-height: inherit; }
		markblue { background: #036; color: #09F; padding: 2px 0; line-height: inherit; }
		markpurple { background: #404; color: #F0F; padding: 2px 0; line-height: inherit; }
		markyellow { background: #440; color: #FF0; padding: 2px 0; line-height: inherit; }
		markwhite { background: #000; color: #FFF; padding: 2px 0; line-height: inherit; }

		a img { border: none; }
		button img, input img { display: none; }
		table { border-collapse: collapse; background: #141414; border: 0; }
		td { vertical-align: top; border-width: 0px; }
		caption, th { background: #111; border-color: #111; text-align: left; }
		th, tr, tbody { border: 0; }
		fieldset { border: 1px solid #111; margin: 0 0 1px 0; }
		span, ul, ol, li, div { border: 0; }
		hr { height: 2px; background: #999; border-style: solid; border-color: #999; border-width: 0; margin: 20px 0; }
		legend { background: #181818; }
		textarea, textarea div { font-family: Verdcode, Consolas, sans-serif; }
		samp, mark, hl, kbd { background: #331500; color: #F90; padding: 2px 0; }
		container { border: 2px solid #F00; margin: 10px; display: block; padding: 10px; }
		samp a:link, mark a:link, a:link samp, a:link mark { background: #331500; color: #F90; }
		samp a:visited, mark a:visited, a:visited samp, a:visited mark { color: #e68a00; }
		mark a:hover, a:hover mark, samp a:hover, a:hover samp { background-color: #4d2000; color: #FFF; }
		samp, mark mark { font: 24px "Swis721 Cn BT", Calibri, sans-serif; }
		figure { border: 0; background: #181818; padding: 20px; }
		figcaption { background: #181818; color: #888; }
		ruby { margin: 10px 0; background: #000; color: #CCC; padding: 20px 40px; display: block; border-left: 10px solid #F90; }
		rp { margin: 10px 0; background: #181818; color: #888; padding: 40px; display: block; font: 24px "Swis721 Cn BT", Calibri, sans-serif; border-top: 50px solid #000; border-bottom: 50px solid #000; }
		rt { margin: 10px 0; padding: 20px; display: block; background: #181818; }
		rt:before { content: ""; display: block; width: 10px; height: 15px; border: 2px solid #AAA; float: left; margin: -3px 20px 0 0; }
		body.xDontShowLinks a, body.xDontShowLinks a *, body.xDontShowLinks a:link { color: inherit; text-decoration: none; }
		body.xDontShowLinks a:visited *, body.xDontShowLinks a:visited { color: inherit; text-decoration: none; }
		body.xDontShowLinks a:hover *, body.xDontShowLinks a:focus *, body.xDontShowLinks a:hover, body.xDontShowLinks a:focus { color: #FFF; text-decoration: none; }
		.nimbushl { box-shadow: inset 2px 2px #F00, inset -2px -2px #F00; }
		.nimbushl2 { box-shadow: inset 2px 2px #00F, inset -2px -2px #00F; }
		.nimbushl::after, .nimbushl2::after { content: " "; display: block; clear: both; }
		a.nimbushl::after, span.nimbushl::after { content: ""; display: inline; clear: none; }
		table.nimbushl { outline: 2px solid red; }
		tr.nimbushl td, tr.nimbushl th { box-shadow: inset 0 -1000px #700; }
		tr.trMark td, tr.trMark th { box-shadow: inset 0 -1000px #F90; }
		tr.trMarkYellow td, tr.trMarkYellow th { box-shadow: inset 0 -1000px #FF0; }
		tr.trMarkRed td, tr.trMarkRed th { box-shadow: inset 0 -1000px #800; }
		tr.trMarkGreen td, tr.trMarkGreen th { box-shadow: inset 0 -1000px #070; }
		tr.trMarkBlue td, tr.trMarkBlue th { box-shadow: inset 0 -1000px #038; }
		tr.trMarkPurple td, tr.trMarkPurple th { box-shadow: inset 0 -1000px #707; }
		tr.trMarkWhite td, tr.trMarkWhite th { box-shadow: inset 0 -1000px #000; }

		user { background: #000; padding: 2px 10px; border-left: 10px solid #09F; margin: 0; }
		author { display: block; font-size: 24px; background: #111; color: #FFF; padding: 2px 10px; border-left: 10px solid #AF0; margin: 0; }
		reference { background: #000; color: #AAA; padding: 1px 5px; }
		comment { display: block; padding: 5px 10px; border-left: 10px solid #555; background: #222; }
		ind { display: block; padding-left: 50px; }
	`;

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
	const s = `
		body { background: #333; color: #BBB; }
		a { color: #09F; text-decoration: none; }
		header, footer, article, aside, section, div, blockquote, canvas { box-shadow: inset 2px 2px #999, inset -2px -2px #999; padding: 0 0 0 10px; margin: 1px 1px 1px 10px; }
		form, input, button, label { box-shadow: inset 1px 1px #F90, inset -1px -1px #F90; background: rgba(255, 150, 0, 0.2); }
		table, tr, td { box-shadow: inset 1px 1px #00F, inset -1px -1px #00F; }
		ul, ol { box-shadow: inset 1px 1px #0F0, inset -1px -1px #0F0; }
		li { box-shadow: inset 1px 1px #080, inset -1px -1px #080; }
		span { box-shadow: inset 1px 1px #C50, inset -1px -1px #C50; }
		h1, h2, h3, h4, h5, h6 { box-shadow: inset 1px 1px #F0F, inset -1px -1px #F0F; }
		p { box-shadow: inset 1px 1px #F0F, inset -1px -1px #F0F; }
		div::before, p::before, li::before, ul::before, td::before { content: attr(class); color:#FF0; padding:0px 5px; background:#000; margin: 0 10px 0 1px; }
		div::after, p::after, li::after, ul::after, td::after { content: attr(id); color:#0FF; padding:0px 5px; background:#000; margin: 0 10px 0 1px; }
		span::before { content: attr(class); color:#0F0; padding:0px 5px; background:#000; margin: 0 10px 0 0; }
		select, textarea, input { background: #444; border: 1px solid red; }
		button { background: #222; color: #AAA; }
		nav { border: 6px solid #09F; padding: 20px; margin: 10px; background: #400; }
		section { border: 6px solid #999; padding: 20px; margin: 10px; background: #040; }
		main { border: 6px solid #DDD; padding: 20px; margin: 10px; background: #555; }
		footer { border: 6px solid #555; padding: 20px; margin: 10px; background: #008; }
		h1, h2, h3, h4, h5, h6 { position: relative; padding: 10px 10px 10px 5rem; background: #300; color: #FFF; }
		h1::before { content: "h1"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }
		h2::before { content: "h2"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }
		h3::before { content: "h3"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }
		h4::before { content: "h4"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }
		h5::before { content: "h5"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }
		h6::before { content: "h6"; display: block; position: absolute; top: 0; left: 0; background: #A00; color: #FFF; padding: 10px; }
	`;
	toggleStyle(s, "styleShowClasses", true);
}

function toggleStyleShowClasses2()
{
	const style = `
		header::before, footer::before, article::before, aside::before, section::before, div::before, blockquote::before { content: attr(class); color: #F90; background: #000; }
		p::before { content: attr(class); color: #F0F; background: #000; }
		span { box-shadow: inset 0 -100px rgba(0,128,0,0.5); }
		span::before { content: attr(class); color: #0F0; background: #000; padding: 2px 5px; }
	`;
	toggleStyle(style, "styleShowClasses2", true);
}

function toggleShowDocumentStructureWithNames()
{
	const style = `
		header, footer, article, aside, section, div, blockquote { box-shadow: inset 4px 4px #000, inset -4px -4px #000; margin: 10px; padding: 10px; }
		header::before, footer::before, article::before, aside::before, section::before, div::before, blockquote::before { content: attr(tag)"#"attr(id)" ."attr(class) ; color: #F90; background: #000; padding: 2px 5px; }
		p::before { content: attr(tag)"#"attr(id)" ."attr(class) ; color: #F0F; background: #000; padding: 2px 5px; }
		span { box-shadow: inset 0 -100px rgba(0,128,0,0.5); }
		span::before { content: attr(tag)"#"attr(id)" ."attr(class) ; color: #0F0; background: #000; padding: 2px 5px; }
		`;
	toggleStyle(style, "styleShowDocumentStructureWithNames", true);
}

//	Returns an array of elements matching a selector and also containing or not containing the specified text.
//	For links and images, it matches the text against hrefs and image sources as well.
function selectBySelectorAndText(selector, text, boolInvertSelection = false)
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

//	This is optimised for the case when the selector is simply a tagName, excluding "img" or "a".
function selectByTagNameAndText(tagName, text)
{
	tagName = tagName.toUpperCase();

	if(tagName === "A" || tagName === "IMG")
		return(selectBySelectorAndText(tagName, text));

	text = text.toLowerCase();
	const MAX_DEPTH = 5;
	const textNodes = getTextNodesAsArray();
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

function getFirstBlockParent(node)
{
	const BLOCK_ELEMENTS = Nimbus.BLOCK_ELEMENTS;
	const MAX_DEPTH = 10;
	let found = false;
	let parent = node;
	let depth = 0;
	if(!parent.nodeType)
		parent = node.parentNode;
	while(parent.parentNode && ++depth < MAX_DEPTH)
	{
		if(BLOCK_ELEMENTS.includes(parent.tagName))
		{
			found = true;
			break;
		}
		else
		{
			parent = parent.parentNode;
		}
	}
	if(found)
		return parent;
	else
		return false;
}

function getFirstParentOfType(node, tagName)
{
	const MAX_DEPTH = 20;
	const tagNameUpper = tagName.toUpperCase();
	let found = false;
	let parent = node.parentNode;
	let depth = 0;
	if(!parent.nodeType)
		parent = parent.parentNode;
	while(parent.parentNode && ++depth < MAX_DEPTH)
	{
		if(parent.tagName === tagNameUpper)
			return parent;
		parent = parent.parentNode;
	}
	return false;
}

function selectBlockElementsContainingText(text)
{
	const textNodes = getTextNodesAsArray();
	const escapedString = "(\\w*" + escapeForRegExp(text) + "\\w*)";
	let regex = new RegExp(escapedString, "i");
	const selected = [];
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(textNode.data.match(regex))
		{
			const parent = getFirstBlockParent(textNode);
			if(parent)
				selected.push(parent);
		}
	}
	return selected;
}

//	To be used once all the container elements on a page have been given numeric IDs.
//	Useful to delete all the cruft after the main content.
function delRange(m, n)
{
	const numBlockElements = get("header, footer, article, aside, section, div").length || 0;
	if(typeof n === "undefined")
		n = numBlockElements - 1;
	for(let i = m; i <= n; i++)
		del(`#i${i}`);
}

function deleteNodesBeforeSelected()
{
	deleteNodesRelativeToSelected("before");
}

function deleteNodesAfterSelected()
{
	deleteNodesRelativeToSelected("after");
}

function deleteNodesRelativeToSelected(predicate = "after")
{
	const condition = predicate === "after" ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING;
	const anchorNode = getNodeContainingSelection();
	if(!anchorNode)
		return;
	const nodes = get("ol, ul, p, div");
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const relativePosition = anchorNode.compareDocumentPosition(node);
		if(relativePosition & condition && !(relativePosition & Node.DOCUMENT_POSITION_CONTAINS))
		{
			node.remove();
		}
	}
}

function deleteNodesBetweenMarkers()
{
	const marked = getMarkedElements();
	if(marked.length !== 2)
		return;
	unmarkAll();
	const nodes = get("ol, ul, p, div");
	let i = nodes.length;
	while(i--)
	{
		const node = nodes[i];
		const positionRelativeToFirst = marked[0].compareDocumentPosition(node);
		const positionRelativeToSecond = marked[1].compareDocumentPosition(node);
		if(
			positionRelativeToFirst & Node.DOCUMENT_POSITION_FOLLOWING
			&& positionRelativeToSecond & Node.DOCUMENT_POSITION_PRECEDING
			&& !(positionRelativeToFirst & Node.DOCUMENT_POSITION_CONTAINS)
			&& !(positionRelativeToSecond & Node.DOCUMENT_POSITION_CONTAINS)
		)
		{
			node.remove();
		}
	}
}

//	Removes all attributes from all elements, excluding the essential ones. It's surprising how
//	much a page's file size can be reduced simply by removing classes and other attributes.
function cleanupAttributes()
{
	const t1 = performance.now();
	const elems = document.getElementsByTagName('*');
	document.body.removeAttribute("background");
	for(let i = 0; i < elems.length; i++)
	{
		const elem = elems[i];
		const tagName = elem.tagName.toLowerCase();
		if(elem.attributes)
		{
			const attrs = elem.attributes;
			for(let j = attrs.length - 1; j >= 0; j--)
			{
				const attr = attrs[j];
				switch(attr.name)
				{
					//	These attributes are essential
					case "href":
					case "src":
					case "srcset":
					case "name":
					case "colspan":
					case "rowspan":
					case "id":
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

function cleanupAttributes_regex()
{
	const t1 = performance.now();
	document.body.removeAttribute("background");
	document.body.innerHTML = document.body.innerHTML.replace(/(<[^ai][a-z0-9]*) [^>]+/gi, '$1');
	const t2 = performance.now();
	xlog(t2 - t1 + "ms: cleanupAttributes_regex");
}

function cleanupHeadings()
{
	const headingElements = get("h1, h2, h3, h4, h5, h6");
	let i = headingElements.length;
	while(i--)
	{
		const heading = headingElements[i];
		let headingHTML = heading.innerHTML;
		headingHTML = headingHTML.replace(/<[^as\/][a-z0-9]*>/g, " ")
			.replace(/<\/[^as][a-z0-9]*>/g, " ");
		heading.innerHTML = trim(headingHTML);
		if(heading.textContent && trim(heading.textContent).length === 0)
			heading.remove();
	}
}

function deleteNonContentImages()
{
	const srcSubstrings = [
		"transparent.",
		"pixel.",
		"spacer.",
		"nbb.org",
		"qm.gif",
		"avatar",
		"doubleclick",
		"bookmarking",
		"adbrite",
		"blogger.com",
		"style_images",
		"smilies",
		"smiley",
		"badges",
		"adriver",
		"/ads/",
		"/delivery/",
		"profile_images",
		"reputation_",
		"statusicons",
		"mt-static",
		"feed.",
		"twitter.",
		"bluesaint",
		"board/images"
	];
	for(let i = 0, ii = srcSubstrings.length; i < ii; i++)
	{
		deleteBySelectorAndTextMatching("img", srcSubstrings[i]);
	}
}

//	This function "cleans up" a webpage and optimises it for saving locally.
function cleanupGeneral()
{
	const t1 = performance.now();
	cleanupHead();
	cleanupTitle();
	document.body.removeAttribute("style");
	replaceIframes();
	deleteNonContentImages();
	addLinksToLargerImages();
	replaceIncorrectHeading();
	del(["link", "style", "iframe", "script", "input", "select", "textarea", "button", "x", "canvas", "label", "svg", "video", "audio", "applet", "message"]);
	replaceSpecialCharacters();
	replaceElementsBySelector("center", "div");
	setDocTitle();
	cleanupAttributes();
	replaceSpansWithTextNodes();
	replaceAudio();
	highlightUserLinks();
	appendMetadata();
	getBestImageSrc();
	insertStyleHighlight();
	forceImageWidth(1200);
	document.body.className = "pad100 xwrap";
	if(~navigator.userAgent.indexOf("Chrome"))
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
	appendMetadata();
	document.body.className = "pad100 xShowImages";
	const t2 = performance.now();
	xlog(Math.round(t2 - t1) + " ms: cleanupGeneral_light");
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

function deleteResources()
{
	del(["link", "style", "script"]);
}

function removeInlineStyles()
{
	const e = get("*");
	let i = e.length;
	while(i--)
		e[i].removeAttribute("style");
}

function deleteBySelectorAndTextMatching(selector, str)
{
	deleteBySelectorAndText(selector, str);
}

function deleteBySelectorAndTextNotMatching(selector, str)
{
	deleteBySelectorAndText(selector, str, true);
}

function deleteBySelectorAndText(selector, str, boolInvertSelection = false)
{
	let selected;
	if(typeof selector === "string")
	{
		if(typeof str === "string")
			selected = selectBySelectorAndText(selector, str, boolInvertSelection);
		else
			selected = get(selector);
	}
	if(selected)
		deleteElements(selected);
	else
		showMessageBig("Not found");
}

//	Potential improvement: add another function that scans comments for over-use of emojis to flag the poster as an idiot.
function removeEmojis()
{
	const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
	const textNodes = getTextNodesAsArray();
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		textNode.data = textNode.data.replace(regex, "");
	}
}

function normalizeAllWhitespace()
{
	const textNodes = getTextNodesAsArray();
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		textNode.data = textNode.data.replace(/\s+/g, " ");
	}
}

function normaliseWhitespaceForParagraphs()
{
	const textNodes = getTextNodesAsArray();
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		const blockParent = getFirstBlockParent(textNode);
		if(blockParent && blockParent.tagName === "P")
			textNode.data = normalizeWhitespace(textNode.data);
	}
}

function deleteEmptyElements(selector)
{
	const elems = get(selector);
	let count = 0;
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		if(elem.textContent)
		{
			if(getTextLength(elem) === 0 && !elem.getElementsByTagName("img").length && !elem.getElementsByTagName("video").length)
			{
				elem.remove();
				count++;
			}
		}
		else
		{
			if(!elem.getElementsByTagName("img").length && !elem.getElementsByTagName("video").length)
			{
				elem.remove();
				count++;
			}
		}
	}
	showMessageBig(`Deleted ${count} empty elements`);
}

function deleteEmptyHeadings()
{
	const e = get("h1, h2, h3, h4, h5, h6");
	let i = e.length;
	while(i--)
	{
		const elem = e[i];
		if(getTextLength(elem) === 0)
			elem.remove();
	}
}

function deleteEmptyBlockElements()
{
	del("noscript");
	const SELECTOR = "div, p, blockquote, h1, h2, h3, h4, h5, h6, li, figure, figcaption, pre, dt, dd, message, annotation, quote, quoteauthor, partheading, aside, section, article, nav, ul, ol";
	deleteEmptyElements(SELECTOR);
}

//	For those ancient webpages that still use <font size...> tags to denote headings.
function replaceFontTags()
{
	const fontElements = get("font");
	const replacements = [];
	let replacementHeading;
	for(let i = 0, ii = fontElements.length; i < ii; i++)
	{
		const fontElem = fontElements[i];
		if(fontElem.getAttribute("size"))
		{
			let headingLevel = fontElem.getAttribute("size");
			if(headingLevel.indexOf("+") >= 0)
			{
				headingLevel = headingLevel[1];
			}
			switch(headingLevel)
			{
				case '7': replacementHeading = document.createElement("h1"); break;
				case '6': replacementHeading = document.createElement("h2"); break;
				case '5': replacementHeading = document.createElement("h3"); break;
				case '4': replacementHeading = document.createElement("h4"); break;
				case '3': replacementHeading = document.createElement("h5"); break;
				case '2': replacementHeading = document.createElement("p"); break;
				case '1': replacementHeading = document.createElement("p"); break;
				default: replacementHeading = document.createElement("p"); break;
			}
			replacementHeading.innerHTML = fontElem.innerHTML;
			replacements.push(replacementHeading);
		}
		else
		{
			replacementHeading = document.createElement("p");
			replacementHeading.innerHTML = fontElem.innerHTML;
			replacements.push(replacementHeading);
		}
	}
	for(let i = 0, ii = fontElements.length; i < ii; i++)
	{
		const fontElem = fontElements[i];
		fontElem.parentNode.replaceChild(replacements[i], fontElem);
	}
}

//	This function replaces all links on a page with ones that are identical except that all event handlers have been removed.
function cleanupLinks()
{
	const links = get("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		let newLink;
		if(link.id)
			newLink = createElement("a", { innerHTML: link.innerHTML, href: link.href, id: link.id });
		else
			newLink = createElement("a", { innerHTML: link.innerHTML, href: link.href });
		link.parentNode.replaceChild(newLink, link);
	}
}

function logHrefsOnClick(evt)
{
	evt.preventDefault();
	evt.stopPropagation();
	const MAX_DEPTH = 5;
	let link = evt.target;
	let depth = 0;
	while(link.tagName !== "A" && link.parentNode && ++depth < MAX_DEPTH)
		link = link.parentNode;
	if(link.tagName !== "A")
		return;
	wrapElement(link, Nimbus.highlightTagName);
	const href = link.href;
	if(href)
	{
		ylog(href);
		showMessageBig(href);
	}
	return false;
}

//	Useful when you want to grab a bunch of links from a webpage (to pass to a download manager, for instance)
function enableClickToCollectUrls()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		links[i].setAttribute("onclick", "return false");
	document.body.addEventListener("mouseup", logHrefsOnClick);
	showMessageBig("Clicking links will now log their hrefs");
}

function disableClickToCollectUrls()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		links[i].removeAttribute("onclick");
	document.body.removeEventListener("mouseup", logHrefsOnClick);
	showMessageBig("Clicking links will now work normally");
}

//	When saving webpages that have internal links (to references/footnotes), the browser converts those links to absolute URLs (with "file:///").
//	If you then move the saved HTML files to a new location, all those links break. This function makes those links relative.
function makeHashLinksRelative()
{
	const links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
	{
		const link = links[i];
		const linkHref = link.href;
		if(linkHref && linkHref.indexOf("file:///") === 0 && ~linkHref.indexOf("#"))
		{
			const splitHref = linkHref.split("#");
			if(splitHref.length)
			{
				const hash = "#" + splitHref[splitHref.length - 1];
				link.href = hash;
			}
		}
	}
}

//	Lots of documents have useless spans sprinkled throughout the HTML.
//	This function replaces them with plain text nodes.
//	Make sure you're replaced the .italics and .bolds, etc. with the appropriate tags first.
function replaceSpansWithTextNodes()
{
	const spans = get("span");
	let i = spans.length;
	while(i--)
	{
		const span = spans[i];
		//	Don't replace spans that contain other HTML elements, as this will cause loss of information.
		if(span.innerHTML.indexOf("<") === -1)
			span.parentNode.replaceChild(document.createTextNode(span.textContent || ""), span);
	}
}

//	This function does a brute-force removal of all <span> tags in a document.
function removeSpanTags()
{
	const numSpans = get("span").length;
	let s = document.body.innerHTML;
	s = s.replace(/<\/{0,}span[^>]*>/g, "");
	document.body.innerHTML = s;
	showMessageBig(numSpans + " span tags removed");
}

//	You'll be amazed at some of the things people put in HTML comments.
function replaceCommentsWithPres()
{
	let s = document.body.innerHTML;
	s = s.replace(/<!--/g, '<pre>');
	s = s.replace(/-->/g, '</pre>');
	document.body.innerHTML = s;
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
	replaceElementsBySelector("audio", "h2");
}

function getMetadata()
{
	const headings4 = get("h4");
	const len = headings4.length;
	if(len < 3)
		return false;
	const lastHeading4 = headings4[len - 1];
	if(!lastHeading4 || lastHeading4.textContent.indexOf("Saved at") !== 0)
		return false;

	const fields = headings4.splice(len - 3);
	const domain = fields[0].textContent;
	const pageUrl = fields[1].textContent;
	const saveTimestamp = fields[2].textContent;
	return {
		domain,
		pageUrl,
		saveTimestamp
	};
}

//	Append useful information to a webpage, including a link to the parent domain, a link to the webpage URL, and a timestamp
function appendMetadata()
{
	const existingMetadata = getMetadata();
	const loc = window.location;
	if(loc.protocol === "file:" || existingMetadata)
		return;

	const urlWithoutHash = loc.protocol + "//" + loc.hostname + loc.pathname + loc.search;
	const documentUrl = removeQueryParameter(urlWithoutHash, "utm_source");

	const domainLinkWrapper = createElement("h4", { textContent: "Domain: " });
	const domainLink = createElement("a", { textContent: loc.hostname, href: loc.protocol + "//" + loc.hostname });
	domainLinkWrapper.appendChild(domainLink);
	document.body.appendChild(domainLinkWrapper);

	const documentLinkWrapper = createElement("h4", { textContent: "URL: " });
	const documentLink = createElement("a", { textContent: documentUrl, href: documentUrl });
	documentLinkWrapper.appendChild(documentLink);
	document.body.appendChild(documentLinkWrapper);

	const saveTime = createElement("h4", { textContent: "Saved at " + getTimestamp() });
	document.body.appendChild(saveTime);
}

function deleteNonContentLists()
{
	const lists = get("ul");
	for(let i = 0, ii = lists.length; i < ii; i++)
	{
		const list = lists[i];
		const listText = list.textContent;
		if(listText && (containsAllOfTheStrings(listText, ["witter", "acebook"]) || containsAllOfTheStrings(listText, ["hare", "weet"])))
			list.remove();
	}
}

function deleteNonContentClasses()
{
	const nonContentClassSubstrings = [
		"social",
		"related",
		"sponsor",
		"recomm",
		"sidebar",
		"follow",
		"share",
		"sharing",
		"float",
		"overlay",
		"modal",
		"signup",
	];
	for(let i = 0, ii = nonContentClassSubstrings.length; i < ii; i++)
		deleteByClassOrIdContaining(nonContentClassSubstrings[i]);
}

function deleteNonContentElements()
{
	if(get(Nimbus.markerClassSelector).length)
	{
		del(Nimbus.markerClassSelector);
		cleanupGeneral();
		return;
	}
	replaceElementsBySelector("article", "div");
	deleteNonContentClasses();
	markNavigationalLists();
	deleteNonContentImages();
	deleteNonContentLists();
	deleteEmptyElements("p");
	deleteEmptyElements("div");
	return;
}

function deleteMarkedElements()
{
	const markedElements = getMarkedElements();
	showMessageBig(`Deleting ${markedElements.length} elements`);
	del(markedElements);
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
	deleteBySelectorAndTextMatching("rp", "iframe:");
}

function deleteImages()
{
	del(["svg", "canvas"]);
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

//	This function takes a selector and replaces the document's content with elements that match that selector.
//	Useful for marking content blocks and deleting everything else, for instance.
function retrieve(selector)
{
	retrieveElements(get(selector));
}

function retrieveBySelectorAndText(selector, text)
{
	retrieveElements(selectBySelectorAndText(selector, text));
}

function getContentByParagraphCount()
{
	const LONG_PARAGRAPH_THRESHOLD = 100;
	if(get(Nimbus.markerClassSelector).length)
	{
		const title = document.title;
		retrieve(Nimbus.markerClassSelector);
		if(title)
			setDocTitleSimple(title);
		cleanupGeneral();
		deleteIframes();
		deleteEmptyBlockElements();
		return;
	}
	del(["nav", "footer"]);
	deleteNonContentLists();
	insertStyleHighlight();
	const paragraphs = get("p");
	if(!paragraphs)
	{
		showMessageError("No paragraphs found");
		return;
	}
	const longParagraphs = [];
	for(let i = 0, ii = paragraphs.length; i < ii; i++)
	{
		const paragraph = paragraphs[i];
		if(paragraph.textContent && normalizeString(paragraph.textContent).length > LONG_PARAGRAPH_THRESHOLD)
		{
			paragraph.classList.add("longParagraph");
			longParagraphs.push(paragraph);
		}
	}
	let candidateDivs = [];
	for(let i = 0, ii = longParagraphs.length; i < ii; i++)
	{
		const tempContainer = longParagraphs[i].closest("div");
		if(tempContainer)
			candidateDivs.push(tempContainer);
	}
	let highestNumParagraphs = 0;
	let contentDiv;
	for(let i = 0, ii = candidateDivs.length; i < ii; i++)
	{
		const div = candidateDivs[i];
		let numParagraphs = div.getElementsByClassName("longParagraph").length;
		if(numParagraphs > highestNumParagraphs)
		{
			highestNumParagraphs = numParagraphs;
			contentDiv = div;
		}
	}
	while(
		contentDiv &&
		contentDiv.parentNode &&
		contentDiv.parentNode.tagName !== "BODY" &&
		contentDiv.getElementsByClassName("longParagraph").length < longParagraphs.length * 0.8
	)
	{
		contentDiv = contentDiv.parentNode;
	}
	const HEADINGS_SELECTOR = "h1, h2";
	if(document.querySelectorAll(HEADINGS_SELECTOR).length > 0 && contentDiv.querySelectorAll(HEADINGS_SELECTOR).length === 0)
	{
		while(
			contentDiv &&
			contentDiv.parentNode &&
			contentDiv.parentNode.tagName !== "BODY" &&
			contentDiv.querySelectorAll(HEADINGS_SELECTOR).length === 0
		)
		{
			contentDiv = contentDiv.parentNode;
		}
	}
	if(contentDiv)
		contentDiv.classList.add(Nimbus.markerClass);
	else
		showMessageError("Could not find content");
}


function cleanupStackOverflow()
{
	function handleMutations(mutations)
	{
		for(let i = 0, ii = mutations.length; i < ii; i++)
			if(mutations[i].addedNodes.length)
				del(["link", "script"]);
	}

	const sites = ["stackexchange", "stackoverflow", "superuser", "serverfault"];
	if(containsAnyOfTheStrings(location.hostname, sites) && location.href.match(/questions\/[0-9]+/) !== null)
	{
		del(["#sidebar", ".signup-prompt", ".post-menu", ".user-gravatar32", "form", ".d-none", ".-flair"]);
		replaceElementsBySelector(".user-details", "h2");
		replaceElementsBySelector(".answercell", "dt");
		replaceElementsBySelector(".votecell", "h6");
		deleteBySelectorAndTextMatching("h2", "Not the answer");
		retrieve("#content");
		cleanupGeneral();
		highlightCode(true);
		const observer = new MutationObserver(handleMutations);
		observer.observe(getOne("head"), { childList: true });
	}
}

function showResource(str, uuid)
{
	let strSanitized = trimAt(str, "?");
	const resourceLink = createElement("a", { textContent: strSanitized, href: str });
	const resourceLinkWrapper = createElement("h6", { className: "xlog", id: "link" + uuid });
	const resourceDelete = createElement("span", { textContent: "[Delete]" });
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

//	Displays a list of all external resources at the top of the page, and lets you delete the
//	resources you don't want. Useful if you want to save a page with some JS/CSS files but not others.
function showResources()
{
	if(get(".xlog").length)
	{
		del(".xlog");
		del("#styleShowResources");
		return;
	}
	const images = get("img");
	const numImages = images ? images.length : 0;
	ylog(numImages + " images", "h3", true);
	const iframes = get("iframe");
	const numIframes = iframes ? iframes.length : 0;
	ylog(numIframes + " iframes", "h3", true);

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
		if(elem.href && ~elem.href.indexOf("css") || elem.type && elem.type === "text/css")
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

function handleBlockEditClick(evt)
{
	evt.stopPropagation();
	let targ;
	let ctrlOrMeta = "ctrlKey";
	if(~navigator.userAgent.indexOf("Macintosh"))
		ctrlOrMeta = "metaKey";
	if(!evt)
		evt = window.event;
	if(evt.target)
		targ = evt.target;
	const tagNameLower = targ.tagName.toLowerCase();
	// Retrieve clicked element
	if(evt[ctrlOrMeta] && evt.shiftKey)
	{
		document.body.innerHTML = targ.innerHTML;
		toggleBlockEditMode();
		return;
	}
	// delete clicked element
	else if(evt[ctrlOrMeta] && !evt.shiftKey)
	{
		if(tagNameLower === 'body')
			return;
		if(tagNameLower === "li" || tagNameLower === "p" && targ.parentNode && targ.parentNode !== document.body)
			targ = targ.parentNode;
		targ.remove();
		return false;
	}
	// append clicked element to a div
	else if(evt.shiftKey)
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

//	This function toggles "block edit mode," in which you can:
//		- ctrl-shift-click to retrieve the clicked element
//		- ctrl-click to delete the clicked element
//		- shift-click to move the clicked element to a container div at the end of the document, which you can later retrieve using ctrl-shift-click
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
		const style = `
			html body.debug header, html body.debug footer, html body.debug article, html body.debug aside, html body.debug section, html body.debug div { border: 2px solid #666; margin: 5px; padding: 5px; }
			html body.debug header:hover, html body.debug footer:hover, html body.debug article:hover, html body.debug aside:hover, html body.debug section:hover, html body.debug div:hover { border-color: #FFF; }
			html body.debug>header, html body.debug>footer, html body.debug>article, html body.debug>aside, html body.debug>section, html body.debug>div { border-width: 10px 10px 10px 20px; }
		`;
		insertStyle(style, "styleToggleBlockEditMode", true);
		showMessageBig("Block edit mode on");
	}
}

function toggleShowDocumentStructure()
{
	const styleId = "viewDocumentStructure";
	if(get("#" + styleId))
	{
		del("#" + styleId);
		return;
	}
	const style = `
		header, footer, article, aside, section, div, blockquote, canvas { box-shadow: inset 1px 1px #09F, inset -1px -1px #09F; }
		form, input, button, label { box-shadow: inset 1px 1px #F90, inset -1px -1px #F90; background: rgba(255, 150, 0, 0.2); }
		table, tr, td { box-shadow: inset 1px 1px #00F, inset -1px -1px #00F; }
		ul, ol { box-shadow: inset 1px 1px #0F0, inset -1px -1px #0F0; }
		li { box-shadow: inset 1px 1px #080, inset -1px -1px #080; }
		font, small, span, abbr, cite { box-shadow: inset 1px 1px #C50, inset -1px -1px #C50; }
		h1, h2, h3, h4, h5, h6 { box-shadow: inset 1px 1px #F0F, inset -1px -1px #F0F; }
		p { box-shadow: inset 1px 1px #F0F, inset -1px -1px #F0F; }
		mark, markyellow, markred, markgreen, markblue, markpurple, markwhite { box-shadow: inset 1px 1px #FF0, inset -1px -1px #FF0; }
		a, a * { background: rgba(180, 255, 0, 0.25); }
		img { background: #800; padding: 2px; box-sizing: border-box; }
	`;
	insertStyle(style, styleId, true);
}

function toggleShowDocumentBlockStructure()
{
	const styleId = "viewDocumentStructure2";
	if(get("#" + styleId))
	{
		del("#" + styleId);
		return;
	}
	const style = `
		div { background: linear-gradient(135deg, black, white); }
		h1, h2, h3, h4, h5, h6 { background: #F00; }
		p { background: #09F; }
		ol, ul { background: #00F; }
		table { background: #080; }
	`;
	insertStyle(style, styleId, true);
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
		for(let i = 0; i < ta.length; i++)
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
		const keys = Object.keys(targ);
		for(let i = 0, ii = keys.length; i < ii; i++)
			str += keys[i] + ' ';
		const events = document.createElement('em');
		events.appendChild(document.createTextNode(str));
		divText.appendChild(events);
		const inspectordiv = document.getElementById("inspector");
		inspectordiv.appendChild(divText);
	}
}

function inspect_mouseoverHandler(evt)
{
	const inspectorElem = document.getElementById("inspector");
	emptyElement(inspectorElem);
	inspectorElem.appendChild(document.createTextNode(''));
	evt.stopPropagation();
	removeClassFromAll("hovered");
	let target = evt.target;
	target.classList.add("hovered");
	while(target)
	{
		getAttributes(target);
		target = target.parentNode;
	}
}

//	*Much* faster than any browser's devtools inspector.
function inspect(onTop)
{
	if(!get("#inspector"))
	{
		const b = document.createElement("div");
		b.id = "inspector";
		if(onTop)
			b.className = "onTop";
		document.body.insertBefore(b, document.body.firstChild);
		document.body.addEventListener('mouseover', inspect_mouseoverHandler, false);
		document.body.addEventListener('click', inspect_clickHandler, false);
		document.body.classList.add("inspector");

		const s = 'body.inspector { padding-bottom: 300px; }' +
		'#inspector { padding: 5px 10px; position:fixed; left:0; bottom: 0; width: 50%; min-width: 500px; height: 200px; overflow: hidden; background:#000; color:#aaa; text-align:left; z-index: 2000000000; font:12px verdana; letter-spacing: 0; }' +
		'#inspector.onTop { bottom: auto; top: 0; }' +
		'#inspector b { color:#09f; }' +
		'#inspector em { font-style:normal; color:#F80; }' +
		'.hovered { background: rgba(0, 0, 0, 0.5); color: #FFF; }' +
		'div#inspector { box-shadow: none; min-height: 200px; margin: 0; }' +
		'#inspector div { box-shadow: none; margin: 0; padding: 0; }';

		insertStyle(s, "inspector-style", true);
	}
	else
	{
		document.body.removeEventListener('mouseover', inspect_mouseoverHandler, false);
		document.body.removeEventListener('click', inspect_clickHandler, false);
		del('#inspector');
		del('#inspector-style');
		document.body.classList.remove("inspector");
		removeClassFromAll("hovered");
	}
}

function inspect_clickHandler(e)
{
	e.stopPropagation();
	if(e.shiftKey && get("#inspector"))
		prompt("", get("#inspector").textContent);
}

//	Takes an element and an integer depth, and wraps that element in that many levels of elements of type <tag>
function indentByDepth(node, depth, tag)
{
	const tagName = tag || "blockquote";
	const indentTagOpen = `<${tagName}>`;
	const indentTagClose = `</${tagName}>`;
	let indentOpen = "";
	let indentClose = "";
	let i = -1;
	while(++i < depth)
	{
		indentOpen += indentTagOpen;
		indentClose += indentTagClose;
	}
	node.innerHTML = indentOpen + node.innerHTML + indentClose;
}

function listSelectorsWithLightBackgrounds()
{
	const THRESHOLD = 200;
	const e = Array.from(document.getElementsByTagName("*"));
	let i = e.length;
	let count = 0;
	let str = "";
	for(i = 0, count = 0; i < e.length, count < 4000; i++, count++)
	{
		const elem = e[i];
		if(!elem)
			continue;
		const bgColor = getComputedStyle(elem).getPropertyValue("background-color");
		const rgbValues = bgColor.match(/[0-9]+/g);
		if(rgbValues)
		{
			let average = (Number(rgbValues[0]) + Number(rgbValues[1]) + Number(rgbValues[2])) / 3;
			if(average > THRESHOLD)
			{
				str += createSelector(elem) + "\r\n";
				// str += padRight(createSelector(elem), 100) + bgColor + "\r\n";
			}
		}
	}
	console.log(str);
}

//	Gives each cell in a table a unique id
function numberTableRowsAndColumns()
{
	if(get("#styleShowTables"))
	{
		del("#styleShowTables");
		return;
	}
	const tr = get("tr");
	for(let i = 0, ii = tr.length; i < ii; i++)
	{
		const tableRow = tr[i];
		tableRow.className = "row" + i;
		const tableCells = tableRow.getElementsByTagName("td");
		for(let j = 0, jj = tableCells.length; j < jj; j++)
			tableCells[j].className = "col" + j;
		const tableHeaderCells = tableRow.getElementsByTagName("th");
		for(let j = 0, jj = tableHeaderCells.length; j < jj; j++)
			tableHeaderCells[j].className = "col" + j;
	}
	insertStyle("table, tr, td { box-shadow: inset 1px 1px #444, inset -1px -1px #444; }", "styleShowTables", true);
}

//	Logs all mutations. Useful for things like finding out what's changing in the DOM when, for instance,
//	you hover over an element and a popup appears, or similar things that regular developer tools are no good for.
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

//	Useful when, say, you want to see the classes and ids for all <input> elements
function showSelectorsFor(tagName)
{
	const styleId = 'styleShowClassesBySelector';
	del("#" + styleId);
	let style = `${tagName}::before { content: attr(id); background: #000; color: #FF0; padding: 1px 2px; font: 14px verdana; }` +
		`${tagName}::after { content: attr(class); background: #000; color: #F90; padding: 1px 2px; font: 14px verdana; }` +
		`${tagName} { border: 2px solid #000; }`;
	insertStyle(style, styleId, true);
}

function removeEventListenerAttributes()
{
	let db = document.body;
	const tempBody = db.cloneNode(true);
	db.parentNode.replaceChild(tempBody, db);

	const elems = document.getElementsByTagName("*");
	let i = elems.length;
	while(i--)
	{
		const elem = elems[i];
		elem.removeAttribute("onmousedown");
		elem.removeAttribute("onmouseup");
		elem.removeAttribute("onmouseover");
		elem.removeAttribute("onclick");
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
	const styleSheets = document.styleSheets;
	const rulesArray = [];
	let i = styleSheets.length;
	while(i--)
	{
		const styleSheet = styleSheets[i];
		if(styleSheet.href && styleSheet.href.indexOf(location.hostname) === -1)
			continue;
		const rules = styleSheet.cssRules;
		if(!rules)
			continue;
		let j = rules.length;
		while(j--)
			if(elem.matches(rules[j].selectorText))
				rulesArray.push(rules[j].cssText);
	}
	return rulesArray;
}

function getAllCssRulesMatching(selectorOrPropertyOrValue)
{
	const styleSheets = document.styleSheets;
	let i = styleSheets.length;
	while(i--)
	{
		const styleSheet = styleSheets[i];
		if(styleSheet.href && styleSheet.href.indexOf(location.hostname) === -1)
			continue;
		const rules = styleSheet.cssRules;
		if(!rules)
			continue;
		let j = rules.length;
		while(j--)
			if(~rules[j].cssText.indexOf(selectorOrPropertyOrValue))
				ylog(rules[j].cssText.replace(selectorOrPropertyOrValue, "<mark>" + selectorOrPropertyOrValue + "</mark>"));
	}
}

function forceReloadCss()
{
	showMessageBig("Force-reloading CSS");
	const styleLinks = document.getElementsByTagName('link');
	for(let i = 0; i < styleLinks.length; i++)
	{
		const styleSheet = styleLinks[i];
		if(styleSheet.rel.toLowerCase().indexOf('stylesheet') >= 0 && styleSheet.href)
		{
			const h = styleSheet.href.replace(/(&|%5C?)forceReload=\d+/, '');
			styleSheet.href = h + (h.indexOf('?') >= 0 ? '&' : '?') + 'forceReload=' + new Date().valueOf();
		}
	}
}

function modifyMark(direction, keepSelection)
{
	let currentElement;
	const markedElements = getMarkedElements();
	if(markedElements && markedElements.length)
		currentElement = markedElements[markedElements.length - 1];
	else
		currentElement = document.body.firstElementChild;
	if(!currentElement)
	{
		showMessageError("Couldn't get marked element");
		return;
	}
	let nextElement;
	switch(direction)
	{
		case "expand": nextElement = currentElement.parentNode; break;
		case "contract": nextElement = currentElement.firstElementChild; break;
		case "previous": nextElement = currentElement.previousElementSibling; break;
		case "next": nextElement = currentElement.nextElementSibling; break;
	}
	if(nextElement && (nextElement.nodeType !== 1 || nextElement.tagName === "MESSAGE"))
		nextElement = document.body.firstElementChild;
	if(!nextElement)
	{
		showMessageError("Couldn't get next element");
		return;
	}
	if(nextElement.tagName === 'BODY')
		nextElement = nextElement.firstElementChild;
	if(!keepSelection)
		currentElement.classList.remove(Nimbus.markerClass);
	nextElement.classList.add(Nimbus.markerClass);
	showMessage(createSelector(nextElement), "messagebig", true);
}

function wrapElement(node, tagName)
{
	const wrapper = createElement(tagName);
	const newNode = node.cloneNode(true);
	wrapper.appendChild(newNode);
	node.parentNode.replaceChild(wrapper, node);
}

function wrapElementInner(node, tagName)
{
	const wrapper = createElement(tagName);
	const newNode = document.createElement(node.tagName);
	if(node.tagName === "A" && node.href && node.href.length)
		newNode.href = node.href;
	while(node.firstChild)
		wrapper.appendChild(node.firstChild);
	node.appendChild(wrapper);
}

function makeButtonsReadable()
{
	const buttons = get("button");
	let count = 0;
	for(let i = 0, ii = buttons.length; i < ii; i++)
	{
		const button = buttons[i];
		if(button.hasAttribute("aria-label"))
		{
			count++;
			button.textContent = trimAt(button.getAttribute("aria-label"), " ");
		}
	}
	showMessageBig(`Labeled ${count} buttons`);
}

function copyAttribute(selector, sourceAttribute, targetAttribute)
{
	const elements = get(selector);
	if(!elements)
		return;
	let count = 0;
	for(let i = 0, ii = elements.length; i < ii; i++)
	{
		const element = elements[i];
		const sourceAttributeValue = element[sourceAttribute] || element.getAttribute(sourceAttribute);
		if(sourceAttributeValue)
		{
			count++;
			setAttributeOrProperty(element, targetAttribute, sourceAttributeValue);
		}
	}
	showMessageBig(`Copied attribute ${sourceAttribute} to ${targetAttribute} on ${count} ${selector}s`);
}

function setAttributeOf(selector, attribute, value)
{
	const e = get(selector);
	let i = e.length;
	while(i--)
		e[i].setAttribute(attribute, value);
}

function removeAttributeOf(selector, attribute)
{
	const e = get(selector);
	let i = e.length;
	while(i--)
		e[i].removeAttribute(attribute);
}

function insertElementNextToAnchor(tagName, position)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
	{
		switch(position)
		{
			case "before": insertBefore(node, createElement(tag)); break;
			case "after": insertAfter(node, createElement(tag)); break;
		}
	}
}

function insertElementBeforeSelectionAnchor(tagName)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
		insertBefore(node, createElement(tag));
}

function insertElementAfterSelectionAnchor(tagName)
{
	const tag = tagName || "hr";
	const node = getNodeContainingSelection();
	if(node)
		insertAfter(node, createElement(tag));
}

function annotate(position = "before")
{
	let node = getNodeContainingSelection();
	if(node && node.parentNode)
	{
		customPrompt("Enter annotation text").then(function(result) {
			const annotation = document.createElement("annotation");
			annotation.textContent = result;
			if(annotation.textContent.length)
				if(position === "after")
					insertAfter(node, annotation);
				else
					insertBefore(node, annotation);
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

function wrapAnchorNodeInTagHelper(tagName)
{
	if(tagName && tagName.length)
		wrapElement(Nimbus.currentNode, tagName);
}

function wrapAnchorNodeInTag()
{
	const node = getNodeContainingSelection();
	if(!node)
		return;
	Nimbus.currentNode = node;
	customPrompt("Enter tagName to wrap this node in").then(wrapAnchorNodeInTagHelper);
}

function generateTableOfContents()
{
	const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
	const toc = document.createElement('div');
	for (let i = 0, ii = headings.length; i < ii; i++)
	{
		const heading = headings[i];
		const id = createUUID();
		const newAnchor = createElement("a", { id: id });
		const tocEntryLink = createElement("a", { textContent: heading.textContent, href: "#" + id } );
		const tocEntryHeading = createElement(heading.tagName);
		const tocEntryWrapper = document.createElement("div");
		tocEntryHeading.appendChild(tocEntryLink);
		tocEntryWrapper.appendChild(tocEntryHeading);
		const indentLevel = parseInt(heading.tagName.substring(1), 10);
		indentByDepth(tocEntryWrapper, indentLevel, "ind");
		heading.parentNode.insertBefore(newAnchor, heading);
		toc.appendChild(tocEntryWrapper);
	}
	const documentHeading = getOne("documentheading");
	if(documentHeading)
		insertAfter(documentHeading, toc);
	else
		insertAsFirstChild(document.body, toc);
}

function insertHrBeforeAll(selector)
{
	const elems = get(selector);
	for(let i = 0, ii = elems.length; i < ii; i++)
		insertBefore(elems[i], document.createElement("hr"));
}

function getTextLength(elem)
{
	if(!elem.textContent)
		return 0;
	return elem.textContent.replace(/[^A-zÀ-ÿ0-9\^\*]/g, "").length;
}

function toggleHighlightSelectionMode()
{
	Nimbus.selectionHighlightMode = Nimbus.selectionHighlightMode === "sentence" ? "word" : "sentence";
	showMessageBig(`Highlight mode is <b>${Nimbus.selectionHighlightMode}</b>`);
}

function highlightSelection()
{
	const selection = window.getSelection();
	if(!selection.toString().length)
		return;
	let node = selection.anchorNode;
	let selectionText = trim(removeLineBreaks(selection.toString()));
	while(node.parentNode && (node.textContent.length < selectionText.length || node.nodeType !== 1))
		node = node.parentNode;
	node.innerHTML = normalizeHTML(node.innerHTML);
	if(!node || node.tagName === undefined)
	{
		showMessageBig("Couldn't get anchorNode");
		return;
	}
	if(selectionText.length)
	{
		if(Nimbus.selectionHighlightMode === "sentence")
			selectionText = expandSelectionToSentenceBoundaries(node, selectionText);
		else
			selectionText = expandSelectionToWordBoundaries(node, selectionText);
		highlightTextAcrossTags(node, selectionText);
	}
}

function highlightFirstParentByText(str)
{
	const highlightTagName = Nimbus.highlightTagName;
	const textNodes = getTextNodesAsArray();
	const escapedString = "(\\w*" + escapeForRegExp(str) + "\\w*)";
	let regex = new RegExp(escapedString, "gi");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(textNode.data.match(regex))
			wrapElementInner(textNode.parentNode, highlightTagName);
	}
}

function highlightFirstBlockParentByText(str)
{
	const highlightTagName = Nimbus.highlightTagName;
	const textNodes = getTextNodesAsArray();
	const escapedString = "(\\w*" + escapeForRegExp(str) + "\\w*)";
	let regex = new RegExp(escapedString, "gi");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(textNode.data.match(regex))
		{
			const blockParent = getFirstBlockParent(textNode);
			if(blockParent)
				wrapElement(blockParent, highlightTagName);
		}
	}
}

function highlightBySelectorAndText(selector, str)
{
	const elements = selectBySelectorAndText(selector, str);
	const highlightTagName = Nimbus.highlightTagName;
	let i = elements.length;
	showMessageBig(`Found ${i} elements`);
	if(!i)
		return;
	if(elements[0].tagName === "TR")
		while(i--)
			elements[i].classList.add(Nimbus.trHighlightClass[Nimbus.highlightTagName]);
	else
		highlightElements(elements);
	insertStyleHighlight();
}

function highlightLinksWithHrefContaining(str)
{
	const highlightTagName = Nimbus.highlightTagName;
	const links = document.getElementsByTagName("a");
	let i = links.length;
	while(i--)
	{
		const link = links[i];
		if(~link.href.indexOf(str))
			wrapElementInner(link, highlightTagName);
	}
}

function expandSelectionToWordBoundaries(node, selection)
{
	const text = node.textContent;
	let index1 = text.indexOf(selection);
	if(index1 === -1)
		return selection;
	let index2 = index1 + selection.length;
	const regexLeft = /[\w\.\?!,'"\(\)\u2018\u201C]/;
	const regexRight = /[\w\.\?!,'"\(\)\u2019\u201D]/;
	while(text[index1].match(regexLeft) && index1 > 0)
		index1--;
	while(text[index2] && text[index2].match(regexRight) && index2 < text.length)
		index2++;
	const expanded = trim(text.substring(index1, index2));
	consoleLog("expanded: " + expanded);
	return expanded;
}

function expandSelectionToSentenceBoundaries(node, selection)
{
	const text = node.textContent;
	let index1 = text.indexOf(selection);
	if(index1 === -1)
		return selection;
	let index2 = index1 + selection.length;
	const regexLeft = /[\.\?!]/;
	const regexRight = /[\.\?!]/;
	while(!text[index1].match(regexLeft) && index1 > 0)
		index1--;
	while(text[index2] && !text[index2].match(regexRight) && index2 < text.length)
		index2++;
	index1++;
	if(index1 < 10)
		index1 = 0;
	if(index2 < text.length - 1)
		index2++;
	if(index2 > text.length - 10)
		index2 = text.length;
	const expanded = trim(text.substring(index1, index2));
	consoleLog("expanded: " + expanded);
	return expanded;
}

function highlightAllMatchesInNode(node, splitMatches)
{
	let nodeHTML = node.innerHTML;
	let lastIndex = 0;
	const highlightTagOpen = "<" + Nimbus.highlightTagName + ">";
	const highlightTagClose = "</" + Nimbus.highlightTagName + ">";
	for(let i = 0, ii = splitMatches.length; i < ii; i++)
	{
		let htmlToSearch = "";
		let index;
		const textToReplace = splitMatches[i];
		if(lastIndex)
		{
			htmlToSearch = nodeHTML.substring(lastIndex);
			index = htmlToSearch.indexOf(textToReplace) + lastIndex;
		}
		else
		{
			index = nodeHTML.indexOf(textToReplace);
		}
		if(~index)
		{
			const replacementHtml = highlightTagOpen + textToReplace + highlightTagClose;
			lastIndex = index;
			if(htmlToSearch.length)
			{
				let htmlToSkip = nodeHTML.substring(0, lastIndex);
				let htmlToReplace = nodeHTML.substring(lastIndex).replace(textToReplace, replacementHtml);
				nodeHTML = htmlToSkip + htmlToReplace;
			}
			else
			{
				nodeHTML = nodeHTML.replace(textToReplace, replacementHtml);
			}
		}
	}
	node.innerHTML = nodeHTML;
}

//	This function solves the problem of highlighting text in an HTML element when that text
//	spans other HTML elements, such as span, b, or em tags. The way it works is by finding the
//	starting and ending indices of the search string in the textContent of the parent element,
//	then comparing those indices to the indices of each childNode of the parent element. Using
//	this, we can split the search string into substrings that are fully contained by the parent
//	element's childNodes. We can then highlight each split substring inside the childNodes.
function highlightTextAcrossTags(node, searchString)
{
	searchString = escapeHTML(searchString.replace(/\s+/g, " "));
	let nodeHTML = node.innerHTML;
	const highlightTagOpen = "<" + Nimbus.highlightTagName + ">";
	const highlightTagClose = "</" + Nimbus.highlightTagName + ">";
	if(~nodeHTML.indexOf(searchString))
	{
		node.innerHTML = nodeHTML.replace(searchString, highlightTagOpen + searchString + highlightTagClose);
		return;
	}
	let index1 = node.textContent.indexOf(searchString);
	if(index1 === -1)
	{
		showMessageError('Not found');
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
		if(["I", "B", "EM", "STRONG", "REFERENCE", "CITE"].includes(childNode.tagName))
			continue;
		//	The childNode contains the beginning of the search string
		if(index1 >= childNodeStart && index1 < childNodeEnd)
		{
			isMatch = true;
			partialSearchString = childNode.textContent.substring(index1 - childNodeStart, index1 - childNodeStart + searchString.length);
		}
		//	The childNode is entirely contained within the search string
		else if(index1 < childNodeStart && index2 > childNodeEnd)
		{
			wrapElement(childNode, Nimbus.highlightTagName);
		}
		//	The childNode contains the end of the search string
		else if(index2 > childNodeStart && index2 <= childNodeEnd)
		{
			isMatch = true;
			partialSearchString = childNode.textContent.substring(0, index2 - childNodeStart);
		}
		if(isMatch && partialSearchString.length > 5)
		{
			//	If the childNode is an element node
			if(childNode.nodeType === 1)
			{
				consoleLog("childNode is an element node");
				consoleLog(childNode);
				wrapElementInner(childNode, Nimbus.highlightTagName);
			}
			else
			{
				splitMatches.push(partialSearchString);
			}
		}
	}
	highlightAllMatchesInNode(node, splitMatches);
}

function highlightAllMatches(str)
{
	if(!(str && str.length))
		return;

	const highlightTagOpen = "<" + Nimbus.highlightTagName + ">";
	const highlightTagClose = "</" + Nimbus.highlightTagName + ">";
	const linkHrefs = [];
	let links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		linkHrefs.push(links[i].href);
	const imageSources = [];
	let images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
		imageSources.push(images[i].src);

	const escapedString = "(\\w*" + escapeForRegExp(str) + "\\w*)";
	let regex = new RegExp(escapedString, "gi");
	let tempHTML = document.body.innerHTML;
	tempHTML = tempHTML.replace(regex, `${highlightTagOpen}$1${highlightTagClose}`);
	document.body.innerHTML = tempHTML;

	links = get("a");
	for(let i = 0, ii = links.length; i < ii; i++)
		links[i].href = linkHrefs[i];
	images = get("img");
	for(let i = 0, ii = images.length; i < ii; i++)
		images[i].src = imageSources[i];
}

function highlightWithinPreformattedBlocks(str)
{
	const reg = new RegExp('([^\n]*' + str + '[^\n]+)', 'gi');
	const pres = get("pre");
	let i = pres.length;
	while(i--)
		pres[i].innerHTML = pres[i].innerHTML.replace(reg, "<mark>$1</mark>");
}

function toggleHighlight()
{
	const markedElements = getMarkedElements();
	if(markedElements.length)
		removeHighlightsFromMarkedElements();
	else
		highlightSelectedElement();
}

function highlightSelectedElement(tag)
{
	let node = getNodeContainingSelection();
	if(node && node.parentNode && node.tagName !== "BODY")
	{
		const highlightTag = tag ? tag : Nimbus.highlightTagName;
		wrapElementInner(getFirstBlockParent(node), highlightTag);
	}
}

function highlightLinksInPres()
{
	fixPres();
	restorePres();
	const pres = get("pre");
	const regex = /(http[s]*:\/\/[^\s\r\n]+)/g;
	for(let i = 0, ii = pres.length; i < ii; i++ )
	{
		const pre = pres[i];
		if(pre.textContent.match(regex))
			pre.innerHTML = pre.innerHTML.replace(regex, '<a href="' + "$1" + '">' + "$1" + '</a>');
	}
}

function removeAllHighlights()
{
	const markerSelectors = Nimbus.highlightTagNameList.join(",");
	replaceElementsBySelector(markerSelectors, "span");
	removeSpanTags();
	removeClassFromAll("trMark");
	removeClassFromAll("trMarkYellow");
	removeClassFromAll("trMarkRed");
	removeClassFromAll("trMarkGreen");
	removeClassFromAll("trMarkBlue");
	removeClassFromAll("trMarkPurple");
	removeClassFromAll("trMarkWhite");
}

function removeHighlightsFromMarkedElements()
{
	const markedElements = getMarkedElements();
	for(let i = 0, ii = markedElements.length; i < ii; i++)
	{
		const element = getFirstBlockParent(markedElements[i]);
		element.innerHTML = element.innerHTML.replace(/<\/?mark[^>]*>/g, "");
	}
	unmarkAll();
}

function inject()
{
	document.body.classList.add("nimbusDark");
	document.body.removeAttribute("style");
	document.addEventListener("keydown", handleKeyDown, false);
	getBestImageSrc();
	showPassword();
	removeAccessKeys();
	insertStyleHighlight();
	insertStyleAnnotations();
	xlog("Referrer: " + document.referrer);
	xlog("Page loaded at " + getTimestamp());
	cleanupStackOverflow();
	Nimbus.autoCompleteCommandPrompt = autoCompleteInputBox();
	Nimbus.markerClassSelector = makeClassSelector(Nimbus.markerClass);
}

function handleKeyDown(e)
{
	let shouldPreventDefault = true;
	let ctrlOrMeta = "ctrlKey";
	if(~navigator.userAgent.indexOf("Macintosh"))
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
		switch(k)
		{
			case KEYCODES.TILDE: highlightSelection(); break;
			case KEYCODES.NUMPAD1: fillForms(); break;
			case KEYCODES.NUMPAD3: toggleContentEditable(); break;
			case KEYCODES.NUMPAD4: forceReloadCss(); break;
			case KEYCODES.NUMPAD5: toggleHighlightSelectionMode(); break;
			case KEYCODES.NUMPAD7: groupMarkedElements("blockquote"); break;
			case KEYCODES.NUMPAD8: toggleScreenRefresh(); break;
			case KEYCODES.NUMPAD9: refreshScreen(); break;
			case KEYCODES.NUMPAD0: deleteResources(); break;
			case KEYCODES.F1: customPrompt("Enter replacement tag name").then(setReplacementTag); break;
			case KEYCODES.F2: replaceSelectedElement("h2"); break;
			case KEYCODES.F3: replaceSelectedElement("h3"); break;
			case KEYCODES.F12: highlightCode(); break;
			case KEYCODES.ONE: cleanupGeneral(); break;
			case KEYCODES.TWO: deleteImages(); break;
			case KEYCODES.THREE: toggleClass(db, "xwrap"); break;
			case KEYCODES.FOUR: deleteSmallImages(); break;
			case KEYCODES.FIVE: buildGallery(); break;
			case KEYCODES.SIX: deleteIframes(); break;
			case KEYCODES.SEVEN: replaceCommentsWithPres(); break;
			case KEYCODES.EIGHT: toggleBlockEditMode(); break;
			case KEYCODES.NINE: toggleStyleShowClasses(); break;
			case KEYCODES.ZERO: cycleThroughDocumentHeadings(); break;
			case KEYCODES.A: cycleClass(db, ["xDontShowLinks", "xHE", "none"]); break;
			case KEYCODES.C: getContentByParagraphCount(); break;
			case KEYCODES.D: deleteEmptyBlockElements(); break;
			case KEYCODES.E: cycleHighlightTag(); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements (optionally containing text)", deleteBySelectorAndTextMatching); break;
			case KEYCODES.I: toggleConsole("css"); break;
			case KEYCODES.J: regressivelyUnenhance(); break;
			case KEYCODES.K: toggleConsole("js"); break;
			case KEYCODES.L: showLog(); break;
			case KEYCODES.M: customPrompt("Enter command").then(runCommand); break;
			case KEYCODES.N: numberDivs(); break;
			case KEYCODES.O: getSelectionOrUserInput("Highlight all occurrences of string", highlightAllMatches, true); break;
			case KEYCODES.P: fixParagraphs(); break;
			case KEYCODES.Q: fixHeadings(); break;
			case KEYCODES.R: toggleHighlight(); break;
			case KEYCODES.U: del("ul"); del("dl"); break;
			case KEYCODES.W: cleanupGeneral_light(); break;
			case KEYCODES.X: removeEmojis(); break;
			case KEYCODES.Y: callFunctionWithArgs("Mark elements by tag name containing text", markByTagNameAndText, 2); break;
			case KEYCODES.Z: replaceSpecialCharacters(); break;
			case KEYCODES.FORWARD_SLASH: showPassword(); cycleFocusOverFormFields(); break;
			case KEYCODES.DELETE: deleteMarkedElements(); break;
			case KEYCODES.SQUARE_BRACKET_OPEN: modifyMark("previous"); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: modifyMark("next"); break;
			case KEYCODES.MINUS: insertElementBeforeSelectionAnchor(); break;
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
		switch(k)
		{
			// case KEYCODES.ZERO: getSelectionOrUserInput("Enter document title", setDocTitle, true); break;
			case KEYCODES.ZERO: editDocumentTitle(); break;
			case KEYCODES.ONE: showResources(); break;
			case KEYCODES.TWO: replaceImagesWithTextLinks(); break;
			case KEYCODES.FOUR: deleteImagesSmallerThan(100, 100); break;
			case KEYCODES.FIVE: buildSlideshow(); break;
			case KEYCODES.A: annotate(); break;
			case KEYCODES.C: deleteNonContentElements(); break;
			case KEYCODES.D: del("log"); break;
			case KEYCODES.E: resetHighlightTag(); break;
			case KEYCODES.G: callFunctionWithArgs("Retrieve elements by selector (optionally containing text)", retrieveBySelectorAndText); break;
			case KEYCODES.J: joinMarkedElements(); break;
			case KEYCODES.K: showPrintLink(); break;
			case KEYCODES.L: logout(); break;
			case KEYCODES.N: callFunctionWithArgs("Delete numbered divs in range", delRange); break;
			case KEYCODES.P: getPagerLinks(); break;
			case KEYCODES.Q: rescueOrphanedTextNodes(); break;
			case KEYCODES.R: replaceSelectedElement(); break;
			case KEYCODES.W: cleanupAttributes(); break;
			case KEYCODES.Y: callFunctionWithArgs("Highlight elements by tag name containing text", highlightByTagNameAndText, 2); break;
			case KEYCODES.FORWARD_SLASH: focusButton(); break;
			case KEYCODES.F12: highlightCode(true); break;
			case KEYCODES.MINUS: callFunctionWithArgs("Insert HR before all (selector)", insertHrBeforeAll); break;
			case KEYCODES.SQUARE_BRACKET_OPEN: slideshowChangeSlide("previous"); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: slideshowChangeSlide("next"); break;
		}
	}
	//
	//	Ctrl-Alt or Meta-Alt
	//
	else if(e.altKey && e[ctrlOrMeta] && !e.shiftKey)
	{
		shouldPreventDefault = true;
		switch(k)
		{
			case KEYCODES.SQUARE_BRACKET_OPEN: changePage("previous"); break;
			case KEYCODES.SQUARE_BRACKET_CLOSE: changePage("next"); break;
			case KEYCODES.UPARROW: modifyMark("expand"); break;
			case KEYCODES.DOWNARROW: modifyMark("contract"); break;
			case KEYCODES.LEFTARROW: modifyMark("previous"); break;
			case KEYCODES.RIGHTARROW: modifyMark("next"); break;
			case KEYCODES.ONE: toggleStyleNegative(); break;
			case KEYCODES.TWO: toggleStyleSimpleNegative(); break;
			case KEYCODES.THREE: toggleStyleGrey(); break;
			case KEYCODES.FOUR: toggleStyleWhite(); break;
			case KEYCODES.FIVE: toggleStyleShowClasses2(); break;
			case KEYCODES.A: deleteEmptyElements("a"); break;
			case KEYCODES.B: toggleShowDocumentStructureWithNames(); break;
			case KEYCODES.E: replaceElementsBySelectorHelper(); break;
			case KEYCODES.F: del(["object", "embed", "video", "iframe"]); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements with class or id containing the string", deleteByClassOrIdContaining); break;
			case KEYCODES.H: callFunctionWithArgs("Mark elements by selector", markBySelector, 1); break;
			case KEYCODES.J: deleteNodesBeforeSelected(); break;
			case KEYCODES.K: deleteNodesAfterSelected(); break;
			case KEYCODES.L: deleteNodesBetweenMarkers(); break;
			// case KEYCODES.L: callFunctionWithArgs("Mark elements by CSS property value", markByCssRule, 2); break;
			case KEYCODES.M: Nimbus.autoCompleteCommandPrompt.open(); break;
			case KEYCODES.N: toggleShowDocumentBlockStructure(); break;
			case KEYCODES.O: customPrompt("Highlight first parent with text matching").then(highlightFirstBlockParentByText); break;
			case KEYCODES.R: wrapAnchorNodeInTag(); break;
			case KEYCODES.S: callFunctionWithArgs("Mark block elements containing text", markBlockElementsContainingText, 1); break;
			case KEYCODES.T: numberTableRowsAndColumns(); break;
			case KEYCODES.V: toggleShowDocumentStructure(); break;
			case KEYCODES.X: customPrompt("Enter xPath").then(xPathMark); break;
			case KEYCODES.Y: replaceElementsByTagNameMatching("ytd"); break;
			case KEYCODES.Z: markSelectionAnchorNode(); break;
			case KEYCODES.MINUS: insertElementAfterSelectionAnchor(); break;
			case KEYCODES.F12: inspect(); break;
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
			case KEYCODES.A: annotate("after"); break;
			case KEYCODES.D: deselect(); break;
			case KEYCODES.G: callFunctionWithArgs("Delete elements not containing text", deleteBySelectorAndTextNotMatching, 2); break;
			case KEYCODES.Z: deselect(); break;
			case KEYCODES.E: callFunctionWithArgs("Replace elements by class or id containing", replaceByClassOrIdContaining, 2); break;
			case KEYCODES.F: formatEbook(); break;
			case KEYCODES.H: unmarkAll(); break;
			case KEYCODES.M: markOverlays(); break;
			case KEYCODES.R: rescueOrphanedTextNodes(); break;
			case KEYCODES.S: forceReloadCss(); break;
			case KEYCODES.F12: inspect(true); break;
			case KEYCODES.UPARROW: modifyMark("expand", true); break;
			case KEYCODES.DOWNARROW: modifyMark("contract", true); break;
			case KEYCODES.LEFTARROW: modifyMark("previous", true); break;
			case KEYCODES.RIGHTARROW: modifyMark("next", true); break;
		}
	}
	window.focus();
}

function main()
{
	setTimeout(inject, 200);
}

main();
