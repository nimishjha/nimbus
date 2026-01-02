import { Nimbus } from "./Nimbus";
import { showMessageBig, showMessageError } from "./ui";
import { get, del, getNodeContainingSelection, getPreTextNodes, getFirstBlockParent, selectBySelectorAndText, selectByTagNameAndText } from "./selectors";
import { getMarkedElements, unmarkAll } from "./mark";
import { insertStyleHighlight } from "./style";
import { logString } from "./log";
import { getNext } from "./array";
import { getNodeText } from "./node";
import { containsOnlyPlainText } from "./elementAndNodeTests";
import { getTextNodesUnderSelector, getTextNodesUnderElement, xPathSelect } from "./xpath";
import { escapeForRegExp } from "./misc";
import { makePlainText, unwrapElement, deleteClass, createElement, unwrapAll, wrapElement, wrapElementInner, deleteLeadingAndTrailingEmptyTextNodes } from "./element";
import { normalizeHTML, removeLineBreaks } from "./string";
import { BLOCK_ELEMENTS } from "./constants";

export function highlightInPres(str, tagName = "markyellow")
{
	const regex = new RegExp(str, 'g');
	highlightCodeInPreTextNodes(regex, tagName);
}

export function highlightCodeInPreTextNodes(regex, tagName)
{
	const nodes = getPreTextNodes();
	if(!nodes) return;
	for(const node of nodes)
		highlightInTextNode(node, regex, tagName);
}

export function highlightCodePunctuation()
{
	highlightCodeInPreTextNodes(/[\{\}\[\]\(\)\|]/g, "xp");
	// highlightCodeInPreTextNodes(/[\{\}]/g, "xp");
	// highlightCodeInPreTextNodes(/[\[\]]/g, "x13");
	// highlightCodeInPreTextNodes(/[\(\)]/g, "x14");
	// highlightCodeInPreTextNodes(/\|\|/g, "x15");
}

export function highlightCodeStrings()
{
	highlightCodeInPreTextNodes(/''/g, "xs");
	highlightCodeInPreTextNodes(/""/g, "xs");
	highlightCodeInPreTextNodes(/'[^']+'/g, "xs");
	highlightCodeInPreTextNodes(/"[^"]+"/g, "xs");
}

export function highlightCodeKeywords(keywords)
{
	const keywordClause = '(' + keywords.join('|') + ')';
	const regex = new RegExp("\\b" + keywordClause + "\\b", "g");
	highlightCodeInPreTextNodes(regex, "xk");
}

export function highlightCodeComments()
{
	highlightCodeInPreTextNodes(/[^:]\/\/[^\n]+/g, "xc");
	highlightCodeInPreTextNodes(/[\s]\/\/[^\n]+/g, "xc");
	highlightCodeInPreTextNodes(/^\/\/[^\n]+/g, "xc");
	makePlainText("xc");
}

export function highlightInTextNodes(regex, tagName)
{
	const nodes = getTextNodesUnderSelector("body");
	if(!nodes) return;
	for(const node of nodes)
		highlightInTextNode(node, regex, tagName);
}

export function highlightMatchesUnderSelector(selector, str, isCaseSensitive = false)
{
	insertStyleHighlight();
	const textNodes = getTextNodesUnderSelector(selector);
	const regexFlags = isCaseSensitive ? "g" : "gi";
	const regex = new RegExp(escapeForRegExp(str), regexFlags);
	for(let i = 0, ii = textNodes.length; i < ii; i++)
		highlightInTextNode(textNodes[i], regex);
}

export function highlightMatchesInElementRegex(elem, regex)
{
	insertStyleHighlight();
	const textNodes = getTextNodesUnderElement(elem);
	for(let i = 0, ii = textNodes.length; i < ii; i++)
		highlightInTextNode(textNodes[i], regex);
}

export function highlightAllMatchesInDocument(str, isCaseSensitive = false)
{
	highlightMatchesUnderSelector("body", str, isCaseSensitive);
}

export function highlightAllMatchesInDocumentCaseSensitive(str)
{
	highlightAllMatchesInDocument(str, true);
}

export function highlightAllMatchesInDocumentRegex(regex)
{
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
		highlightInTextNode(textNodes[i], regex);
}

export function toggleHighlight()
{
	const markedElements = getMarkedElements();
	if(markedElements.length)
		removeHighlightsFromMarkedElements();
	else
		highlightSelectedElement();
}

export function moveLeadingAndTrailingReferencesOutOfHighlight(highlightElement)
{
	const firstChild = highlightElement.firstChild;
	if(firstChild && firstChild.nodeType === 1 && firstChild.tagName === "REFERENCE")
		highlightElement.insertAdjacentElement("beforebegin", firstChild);
	const lastChild = highlightElement.lastChild;
	if(lastChild && lastChild.nodeType === 1 && lastChild.tagName === "REFERENCE")
		highlightElement.insertAdjacentElement("afterend", lastChild);
}

export function highlightSelectedElement(tag)
{
	const MAX_LENGTH = 4000;
	let node = getNodeContainingSelection();
	if(node && node.parentNode && node.tagName !== "BODY" && node.textContent.length < MAX_LENGTH)
	{
		const highlightTagName = tag ? tag : Nimbus.highlightTagName;
		const element = getFirstBlockParent(node);
		if(element.firstChild && element.firstChild.nodeType === 1 && element.firstChild.tagName.toLowerCase() === highlightTagName)
			return;
		deleteLeadingAndTrailingEmptyTextNodes(element);
		wrapElementInner(element, highlightTagName);
		moveLeadingAndTrailingReferencesOutOfHighlight(element.firstChild);
	}
}

export function highlightLinksInPres()
{
	const pres = get("pre");
	const linkRegex = /(http[s]*:\/\/[^\s\r\n]+)/g;
	for(let i = 0, ii = pres.length; i < ii; i++ )
	{
		const pre = pres[i];
		if(linkRegex.test(pre.textContent))
			pre.innerHTML = pre.innerHTML.replace(linkRegex, '<a href="' + "$1" + '">' + "$1" + '</a>');
	}
}

export function removeAllHighlights()
{
	unwrapAll("mark, markyellow, markred, markgreen, markblue, markpurple, markwhite");
	deleteClass("trMark");
	deleteClass("trMarkYellow");
	deleteClass("trMarkRed");
	deleteClass("trMarkGreen");
	deleteClass("trMarkBlue");
	deleteClass("trMarkPurple");
	deleteClass("trMarkWhite");
}

export function removeHighlightsFromMarkedElements()
{
	const markedElements = getMarkedElements();
	for(let i = 0, ii = markedElements.length; i < ii; i++)
	{
		const element = getFirstBlockParent(markedElements[i]);
		const marks = element.querySelectorAll("mark, markyellow, markred, markgreen, markblue, markpurple, markwhite");
		for(let i = 0, ii = marks.length; i < ii; i++)
			unwrapElement(marks[i]);
	}
	unmarkAll();
}

export function highlightElements(elems)
{
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
	{
		showMessageError("highlightElements(): no elements given");
		return;
	}
	const firstElement = elements[0];
	const highlightTagName = Nimbus.highlightTagName;
	//	Assumption: the elements are all of the same type
	if(firstElement.tagName === "TR")
	{
		highlightTableRows(elements);
		return;
	}
	else if(BLOCK_ELEMENTS[firstElement.tagName])
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

export function toggleHighlightSelectionMode()
{
	Nimbus.selectionHighlightMode = Nimbus.selectionHighlightMode === "sentence" ? "word" : "sentence";
	showMessageBig(`Highlight mode is ${Nimbus.selectionHighlightMode}`);
}

export function stripTrailingReferenceNumber(str)
{
	return str.replace(/([\."'])\d+$/, "$1");
}

export function expandSelectionToWordBoundaries(node, selection)
{
	const text = node.textContent.replace(/\s+/g, " ");
	let index1 = text.indexOf(selection);
	if(index1 === -1)
		return selection;
	let index2 = index1 + selection.length;
	const regexLeft = /[\w\.\?!,'"\(\)\u2018\u201C]/;
	const regexRight = /[\w\.\?!,;'"\(\)\u2019\u201D]/;
	while(regexLeft.test(text[index1]) && index1 > 0)
		index1--;
	if(text[index1] === "\u2014") // em dash
		index1++;
	while(text[index2] && regexRight.test(text[index2]) && index2 < text.length)
		index2++;
	const expandedSelection = text.substring(index1, index2).replace(/\s+/g, " ").trim();
	return stripTrailingReferenceNumber(expandedSelection);
}

export function expandSelectionToSentenceBoundaries(node, selection)
{
	const text = node.textContent.replace(/\s+/g, " ");
	let index1 = text.toLowerCase().indexOf(selection.toLowerCase());
	if(index1 === -1)
		return selection;
	let index2 = index1 + selection.length;
	const regexLeft = /[\.\?!]/;
	const regexRight = /[\.\?!]/;
	while(!regexLeft.test(text[index1]) && index1 > 0)
		index1--;
	while(text[index2] && !regexRight.test(text[index2]) && index2 < text.length)
		index2++;
	if(index2 < text.length - 1 && /['"\)]/.test(text[index2 + 1]) )
		index2++;
	index1++;
	if(/['"\)]/.test(text[index1]))
		index1++;
	if(index1 < 4)
		index1 = 0;
	if(index2 < text.length - 1)
		index2++;
	if(index2 > text.length - 4)
		index2 = text.length;
	const expandedSelection = text.substring(index1, index2).replace(/\s+/g, " ").trim();
	return stripTrailingReferenceNumber(expandedSelection);
}

export function highlightSelection(mode = "sentence")
{
	const selection = window.getSelection();
	if(!selection.toString().length)
	{
		showMessageBig("Nothing selected");
		return;
	}
	const element = getFirstBlockParent(selection.anchorNode);
	let selectionText = removeLineBreaks(selection.toString()).trim();
	if(element.tagName !== "PRE")
		element.innerHTML = normalizeHTML(element.innerHTML);
	if(!element || element.tagName === undefined)
	{
		showMessageBig("Couldn't get anchorNode");
		return;
	}
	if(selectionText.length)
	{
		if(Nimbus.selectionHighlightMode === "sentence" && mode !== "word")
			selectionText = expandSelectionToSentenceBoundaries(element, selectionText);
		else
			selectionText = expandSelectionToWordBoundaries(element, selectionText);
		highlightTextInElement(element, selectionText);
	}
}

export function highlightTextInElement(element, searchString)
{
	const isPlainTextMatch = highlightInElementTextNodes(element, searchString);
	if(!isPlainTextMatch) highlightTextAcrossTags(element, searchString);
}

export function highlightInElementTextNodes(element, searchString)
{
	const colors = Nimbus.logColors;
	const nodes = getTextNodesUnderElement(element);
	for(const node of nodes)
	{
		const index = node.data.indexOf(searchString);
		if(index !== -1)
		{
			const textBeforeMatch = node.data.substring(0, index);
			const textOfMatch = node.data.substring(index, index + searchString.length);
			const textAfterMatch = node.data.substring(index + searchString.length);
			console.log(`%c${textBeforeMatch}%c${textOfMatch}%c${textAfterMatch}`, colors.gray, colors.yellow, colors.gray);
			const replacement = document.createDocumentFragment();
			const highlight = document.createElement(Nimbus.highlightTagName);
			highlight.appendChild(document.createTextNode(textOfMatch));
			if(textBeforeMatch)
				replacement.appendChild(document.createTextNode(textBeforeMatch));
			replacement.appendChild(highlight);
			if(textAfterMatch)
				replacement.appendChild(document.createTextNode(textAfterMatch));
			node.parentNode.replaceChild(replacement, node);
			return true;
		}
	}
	return false;
}

//	This function solves the problem of highlighting text in an HTML element when that text
//	spans other HTML elements, such as span, b, or em tags. It works by finding the
//	starting and ending indices of the search string in the textContent of the parent element,
//	using those indices to figure out which nodes are spanned by the search string, and then
//	highlighting the text across those nodes.
export function highlightTextAcrossTags(element, searchString)
{
	const colors = Nimbus.logColors;
	logString(searchString, "highlightTextAcrossTags");
	searchString = searchString.replace(/\s+/g, " ");
	const nodeText = element.textContent.replace(/\s+/g, " ");
	const index1 = nodeText.toLowerCase().indexOf(searchString.toLowerCase());
	if(index1 === -1)
	{
		showMessageError("highlightTextAcrossTags: string not found in text");
		logString(searchString, "searchString");
		logString(nodeText, "nodeText");
		return;
	}
	const index2 = index1 + searchString.length;
	console.log(`%c ${index1} %c ... %c ${index2} `, colors.blue, colors.gray, colors.blue);
	const childNodes = element.childNodes;
	let childNodeEnd = 0;
	const highlightElement = document.createElement(Nimbus.highlightTagName);
	const replacement = document.createDocumentFragment();
	let toReplace;
	const toDelete = [];

	const isIndivisibleElement = {
		A: true,
		B: true,
		I: true,
		EM: true,
		STRONG: true,
		REFERENCE: true
	};

	for(let i = 0, ii = childNodes.length; i < ii; i++)
	{
		const childNode = childNodes[i];
		const childNodeStart = childNodeEnd;
		const childNodeText = getNodeText(childNode);
		childNodeEnd += childNodeText.length;

		if(childNodeEnd < index1)
			continue;

		const containsTheBeginning = index1 >= childNodeStart && index1 < childNodeEnd && index2 > childNodeEnd;
		const isContained = index1 < childNodeStart && index2 > childNodeEnd;
		const containsTheEnd = index2 >= childNodeStart && index2 <= childNodeEnd;
		const contains = index1 >= childNodeStart && index2 <= childNodeEnd;

		if(contains)
		{
			console.log(`%c ${childNodeStart} %c${childNodeText}%c ${childNodeEnd} %ccontains the entire string: %c${searchString}`, colors.blue, colors.gray, colors.blue, colors.green, colors.yellow);
			highlightTextAcrossTags(childNode, searchString);
			break;
		}
		else if(containsTheBeginning)
		{
			const substring = searchString.substring(0, childNodeEnd - index1);
			console.log(`%c ${childNodeStart} %c${childNodeText}%c ${childNodeEnd} %ccontains the beginning: %c${substring}`, colors.blue, colors.gray, colors.blue, colors.green, colors.yellow);
			if(childNode.nodeType === 1)
			{
				const childNodeTagName = childNode.tagName;
				if(containsOnlyPlainText(childNode) && !isIndivisibleElement[childNodeTagName])
				{
					const splitIndex = index1 - childNodeStart;
					if(splitIndex === 0)
					{
						highlightElement.appendChild(childNode.cloneNode(true));
					}
					else
					{
						const textBeforeMatch = childNodeText.substring(0, splitIndex);
						const textOfMatch = childNodeText.substring(splitIndex);
						replacement.appendChild(createElement(childNodeTagName, { textContent: textBeforeMatch}));
						highlightElement.appendChild(document.createTextNode(textOfMatch));
					}
				}
				else
				{
					highlightElement.appendChild(childNode.cloneNode(true));
				}
			}
			else
			{
				const splitIndex = index1 - childNodeStart;
				const textBeforeMatch = childNodeText.substring(0, splitIndex);
				const textOfMatch = childNodeText.substring(splitIndex);
				console.log(`%c${textBeforeMatch}%c${textOfMatch}`, colors.gray, colors.yellow);
				replacement.appendChild(document.createTextNode(textBeforeMatch));
				highlightElement.appendChild(document.createTextNode(textOfMatch));
			}
			replacement.appendChild(highlightElement);
			toReplace = childNode;
		}
		else if(isContained)
		{
			const substring = searchString.substring(childNodeStart - index1, childNodeEnd - index1);
			console.log(`%c ${childNodeStart} %c${childNodeText}%c ${childNodeEnd} %cis contained: %c${substring}`, colors.blue, colors.gray, colors.blue, colors.green, colors.yellow);
			console.log(`%c${childNodeText}`, colors.yellow);
			highlightElement.appendChild(childNode.cloneNode(true));
			toDelete.push(childNode);
		}
		else if(containsTheEnd)
		{
			const substring = searchString.substr(-(index2 - childNodeStart));
			// handle the problem of extra spaces added by the browser when a selection contains child elements
			const offset = childNodeText.indexOf(substring);
			const adjustedEndIndex = index2 + offset;
			console.log(`%c ${childNodeStart} %c${childNodeText}%c ${childNodeEnd} %ccontains the end: %c${substring}`, colors.blue, colors.gray, colors.blue, colors.green, colors.yellow);
			if(childNode.nodeType === 1)
			{
				const childNodeTagName = childNode.tagName;
				if(containsOnlyPlainText(childNode) && !isIndivisibleElement[childNodeTagName])
				{
					const childNodeTagName = childNode.tagName;
					const splitIndex = adjustedEndIndex - childNodeStart;
					if(splitIndex === childNodeText.length)
					{
						highlightElement.appendChild(childNode.cloneNode(true));
					}
					else
					{
						const textOfMatch = childNodeText.substring(0, splitIndex);
						const textAfterMatch = childNodeText.substring(splitIndex);
						highlightElement.appendChild(document.createTextNode(textOfMatch));
						replacement.appendChild(createElement(childNodeTagName, { textContent: textAfterMatch}));
					}
				}
				else
				{
					highlightElement.appendChild(childNode.cloneNode(true));
				}
			}
			else
			{
				const splitIndex = adjustedEndIndex - childNodeStart;
				const textOfMatch = childNodeText.substring(0, splitIndex);
				const textAfterMatch = childNodeText.substring(splitIndex);
				console.log(`%c${textOfMatch}%c${textAfterMatch}`, colors.yellow, colors.gray);
				highlightElement.appendChild(document.createTextNode(textOfMatch));
				replacement.appendChild(document.createTextNode(textAfterMatch));
			}
			toDelete.push(childNode);
			break;
		}
	}
	if(toReplace)
	{
		element.replaceChild(replacement, toReplace);
		moveLeadingAndTrailingReferencesOutOfHighlight(highlightElement);
		del(toDelete);
	}
}

export function highlightInTextNode(textNode, regex, highlightTagName)
{
	const tagName = highlightTagName || Nimbus.highlightTagName;
	const nodeText = textNode.data;
	if(nodeText.search(regex) === -1)
		return;
	const parentNode = textNode.parentNode;
	if(!parentNode)
		return;
	const matches = nodeText.matchAll(regex);
	const replacementNodes = [];
	let lastIndex = 0;
	for(const match of matches)
	{
		const matchedString = match[0];
		const matchIndex = match.index;
		if(matchIndex > lastIndex)
			replacementNodes.push(document.createTextNode(nodeText.substring(lastIndex, matchIndex)));
		replacementNodes.push(createElement(tagName, { textContent: matchedString }));
		lastIndex = matchIndex + matchedString.length;
	}
	if(lastIndex < nodeText.length)
		replacementNodes.push(document.createTextNode(nodeText.substring(lastIndex)));
	const frag = document.createDocumentFragment();
	for(const node of replacementNodes)
		frag.appendChild(node);
	parentNode.replaceChild(frag, textNode);
}

export function highlightAllStrings(...args)
{
	for(const arg of args)
		highlightAllMatchesInDocument(arg);
}

export function highlightByTagNameAndText(tagName, str)
{
	const elems = selectByTagNameAndText(tagName, str);
	if(elems && elems.length)
		highlightElements(elems);
}

export function highlightQuotes()
{
	const UTF8_SINGLEQUOTEOPEN = '\u2018';
	const UTF8_SINGLEQUOTECLOSE = '\u2019';
	document.body.innerHTML = document.body.innerHTML.replace(/\u201C/g, '<markwhite>"').replace(/\u201D/g, '"</markwhite>');
}

export function highlightTableRows(rows)
{
	const trHighlightClass = Nimbus.trHighlightClass[Nimbus.highlightTagName];
	for(let i = 0, ii = rows.length; i < ii; i++)
		rows[i].classList.add(trHighlightClass);
}

export function highlightFirstParentByText(str)
{
	const highlightTagName = Nimbus.highlightTagName;
	const textNodes = getTextNodesUnderSelector("body");
	const escapedString = "(\\w*" + escapeForRegExp(str) + "\\w*)";
	let regex = new RegExp(escapedString, "gi");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		if(regex.test(textNode.data))
			wrapElementInner(textNode.parentNode, highlightTagName);
	}
}

export function highlightAllTextNodesMatching(str)
{
	insertStyleHighlight();
	str = str.toLowerCase();
	const textNodes = xPathSelect(`//body//text()[not(ancestor::${Nimbus.highlightTagName})]`);
	let count = 0;
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		const nodeText = textNode.data;
		const parentNode = textNode.parentNode;
		if(~nodeText.toLowerCase().indexOf(str) && parentNode)
		{
			const repl = document.createElement(Nimbus.highlightTagName);
			repl.textContent = nodeText;
			parentNode.replaceChild(repl, textNode);
			count++;
		}
	}
	if(count)
		showMessageBig(count + " text nodes containing " + str + " highlighted");
}

export function highlightOnMutation(str)
{
	const HIGHLIGHT_TAGNAME = Nimbus.highlightTagName.toUpperCase();

	highlightAllTextNodesMatching(str);

	function handleMutations(mutationRecords)
	{
		let shouldHandleThisMutation = true;
		for(const mutationRecord of mutationRecords)
		{
			if(mutationRecord.addedNodes)
			{
				for(const addedNode of mutationRecord.addedNodes)
				{
					if((addedNode.tagName && addedNode.tagName === HIGHLIGHT_TAGNAME) || (addedNode.className && addedNode.classList.contains("excludeFromMutations")))
					{
						shouldHandleThisMutation = false;
						break;
					}
				}
			}
			if(!shouldHandleThisMutation)
				break;
		}

		if(shouldHandleThisMutation)
			highlightAllTextNodesMatching(str);
	}
	const observer = new MutationObserver(handleMutations);
	const config = { childList: true, subtree: true };
	observer.observe(document.querySelector("body"), config);
}

export function highlightBySelectorAndText(selector, str)
{
	const highlightTagName = Nimbus.highlightTagName;
	const elements = selectBySelectorAndText(selector, str);
	let i = elements.length;
	showMessageBig(`Found ${i} elements`);
	if(!i)
		return;
	if(elements[0].tagName === "TR")
		while(i--)
			elements[i].classList.add(Nimbus.trHighlightClass[highlightTagName]);
	else
		highlightElements(elements);
	insertStyleHighlight();
}

export function highlightLinksWithHrefContaining(str)
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

export function cycleHighlightTag()
{
	const nextTag = getNext(Nimbus.highlightTagName, Nimbus.highlightTagNameList);
	showMessageBig({ text: `Highlight tag is ${nextTag}`, tag: nextTag });
	Nimbus.highlightTagName = nextTag;
}

export function resetHighlightTag()
{
	const nextTag = Nimbus.highlightTagNameList[0];
	if(Nimbus.highlightTagName === nextTag)
		return;
	showMessageBig({ text: `Highlight tag is ${nextTag}`, tag: nextTag });
	Nimbus.highlightTagName = nextTag;
}
