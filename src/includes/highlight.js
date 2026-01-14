import { Nimbus } from "./Nimbus";
import { showMessageBig, showMessageError } from "./ui";
import { get, del, getNodeContainingSelection, getPreTextNodes, getFirstBlockParent, selectBySelectorAndText, selectByTagNameAndText } from "./selectors";
import { getMarkedElements, unmarkAll } from "./mark";
import { insertStyleHighlight } from "./style";
import { logString } from "./log";
import { getNext } from "./array";
import { getNodeText, getTextLength } from "./node";
import { containsOnlyPlainText } from "./elementAndNodeTests";
import { getTextNodesUnderSelector, getTextNodesUnderElement, xPathSelect } from "./xpath";
import { escapeForRegExp } from "./misc";
import { makePlainText, unwrapElement, deleteClass, createElement, unwrapAll, wrapElement, wrapElementInner, deleteLeadingAndTrailingEmptyTextNodes } from "./element";
import { normalizeHTML, removeLineBreaks } from "./string";
import { BLOCK_ELEMENTS } from "./constants";

const { green, blue, black, gray, yellow, purple } = Nimbus.logColors;
const { styleHeading } = Nimbus.logStyles;

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
		highlightInTextNodeRegex(node, regex, tagName);
}

export function highlightCodePunctuation()
{
	highlightCodeInPreTextNodes(/[\{\}\[\]\(\)\|]/g, "xp");
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
		highlightInTextNodeRegex(node, regex, tagName);
}

export function highlightMatchesUnderSelector(selector, str, isCaseSensitive = false)
{
	insertStyleHighlight();
	const textNodes = getTextNodesUnderSelector(selector);
	const regexFlags = isCaseSensitive ? "g" : "gi";
	const regex = new RegExp(escapeForRegExp(str), regexFlags);
	for(let i = 0, ii = textNodes.length; i < ii; i++)
		highlightInTextNodeRegex(textNodes[i], regex);
}

export function highlightMatchesInElementRegex(elem, regex)
{
	insertStyleHighlight();
	const textNodes = getTextNodesUnderElement(elem);
	for(let i = 0, ii = textNodes.length; i < ii; i++)
		highlightInTextNodeRegex(textNodes[i], regex);
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
		highlightInTextNodeRegex(textNodes[i], regex);
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

function stripLeadingAndTrailingReferenceNumbers(str)
{
	return str.replace(/([\."'])\d+$/, "$1").replace(/^\d+ ([A-Z])/, "$1");
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
	return stripLeadingAndTrailingReferenceNumbers(expandedSelection).trim();
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
	return stripLeadingAndTrailingReferenceNumbers(expandedSelection).trim();
}

function getFirstElementParent(node)
{
	if(node.nodeType === Node.ELEMENT_NODE)
		return node;
	else
		return node.parentNode;
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
	if(!isPlainTextMatch)
		highlightTextAcrossTags(element, searchString);
}

export function highlightInElementTextNodes(element, searchString)
{
	const nodes = getTextNodesUnderElement(element);
	for(const node of nodes)
	{
		const index = node.data.indexOf(searchString);
		if(index !== -1)
		{
			const textBeforeMatch = node.data.substring(0, index);
			const textOfMatch = node.data.substring(index, index + searchString.length);
			const textAfterMatch = node.data.substring(index + searchString.length);
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


export function highlightInTextNode(textNode, searchString)
{
	if(textNode.data.length === searchString.length)
	{
		const replacement = document.createElement(Nimbus.highlightTagName);
		replacement.textContent = textNode.data;
		textNode.parentNode.replaceChild(replacement, textNode);
	}
	else
	{
		const replacement = document.createDocumentFragment();
		const highlightElement = document.createElement(Nimbus.highlightTagName);
		const startIndex = textNode.data.indexOf(searchString);
		const endIndex = startIndex + searchString.length;

		if(startIndex > 0)
			replacement.appendChild(document.createTextNode(textNode.data.substring(0, startIndex)));

		highlightElement.textContent = textNode.data.substring(startIndex, endIndex);
		replacement.appendChild(highlightElement);

		if(endIndex < textNode.data.length)
			replacement.appendChild(document.createTextNode(textNode.data.substring(endIndex)));

		textNode.parentNode.replaceChild(replacement, textNode);
	}
}

export function highlightInTextNodeRegex(textNode, regex, highlightTagName)
{
	const tagName = highlightTagName || Nimbus.highlightTagName;
	const nodeText = textNode.data;
	if(nodeText.search(regex) === -1)
		return;
	const parentNode = textNode.parentNode;
	if(!parentNode)
		return;
	const matches = regex.global ? nodeText.matchAll(regex) : nodeText.match(regex);
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

function normalizeText(s)
{
	return s.replace(/[\s\n]+/g, " ");
}

function createNodeData(elem)
{
	const nodes = elem.childNodes;
	const nodeData = [];
	let length = 0;
	const normTextArray = [];
	for(let i = 0; i < nodes.length; i++)
	{
		const node = nodes[i];
		let normText = node.nodeType === 3 ? normalizeText(node.data) : normalizeText(node.textContent);
		if(i > 0)
		{
			if(nodeData[i - 1].text.endsWith(" ") && normText.startsWith(" "))
				normText = normText.slice(1);
		}
		normTextArray.push(normText);
		const startIndex = length;
		length += normText.length;
		nodeData.push({ node, text: normText, length: normText.length, startIndex, endIndex: length });
	}

	const joinedText = normTextArray.join("");
	if(joinedText.includes("  "))
		console.error("Duplicate spaces found in joined text");

	return nodeData;
}

function getNodesSpanningString(nodeData, index1, index2)
{
	const startAndEndNodeIndices = [];
	const indicesOfNodesSpanningString = [];
	const nodesSpanningString = [];

	let i = 0;
	for(; i < nodeData.length; i++)
	{
		if(index1 < nodeData[i].endIndex)
		{
			startAndEndNodeIndices.push(i);
			break;
		}
	}
	for(; i < nodeData.length; i++)
	{
		if(index2 <= nodeData[i].endIndex)
		{
			startAndEndNodeIndices.push(i);
			break;
		}
	}

	for(let j = startAndEndNodeIndices[0]; j <= startAndEndNodeIndices[1]; j++)
		indicesOfNodesSpanningString.push(j);

	for(let j = 0; j < indicesOfNodesSpanningString.length; j++)
		nodesSpanningString.push(nodeData[indicesOfNodesSpanningString[j]]);

	return nodesSpanningString;
}

function logYellow(...args)
{
	const [ str, ...rest ] = args;
	console.log(`%c${str}`, Nimbus.logColors.yellow, ...rest);
}

function logNode(node, label)
{
	if(label)
	{
		if(node.nodeType === Node.TEXT_NODE)
			console.log(`%c ${label} %ctext node %c${node.data}`, yellow, black, gray);
		else
			console.log(`%c ${label} %c${node.tagName} %c${node.innerHTML}`, yellow, black, blue);
	}
	else
	{
		if(node.nodeType === Node.TEXT_NODE)
			console.log(`%ctext node %c${node.data}`, black, gray);
		else
			console.log(`%c${node.tagName} %c${node.innerHTML}`, black, blue);
	}
}

function logDocumentFragment(frag, label)
{
	if(label)
		logYellow("\t".repeat(5) + "begin " + label + "\t".repeat(5));
	for(const node of frag.childNodes)
		logNode(node);
	if(label)
		logYellow("\t".repeat(5) + "end " + label + "\t".repeat(5));
}

export function highlightTextAcrossTags(element, searchString)
{
	Nimbus.consoleLog(`%chighlightTextAcrossTags in %c${element.tagName}%c${searchString}`, styleHeading + black, styleHeading + blue, styleHeading + green);

	const indivisibleElementTypes = new Set(["A", "B", "I", "EM", "STRONG", "REFERENCE"]);
	const nodeData = createNodeData(element);
	const elemText = normalizeText(element.textContent);
	const index1 = elemText.indexOf(searchString);
	const index2 = index1 + searchString.length;

	if(index1 === -1)
	{
		showMessageError("Search string not found in element");
		return;
	}

	const nodesSpanningString = getNodesSpanningString(nodeData, index1, index2);
	const nodesSpanningStringLastIndex = nodesSpanningString.length - 1;

	Nimbus.consoleLog(`%cselection spans ${nodesSpanningString.length} nodes`, yellow);

	if(nodesSpanningString.length > 1)
	{
		const firstNodeParent = nodesSpanningString[0].node.parentNode;
		const lastNodeParent = nodesSpanningString[nodesSpanningStringLastIndex].node.parentNode;
		if(firstNodeParent !== lastNodeParent)
		{
			showMessageError("Invalid highlight attempted: selection needs to start and end within the same element");
			return;
		}
	}
	else
	{
		if(nodesSpanningString[0].node.nodeType === Node.ELEMENT_NODE)
		{
			logYellow("selection is contained in an element which is not the block parent");
			highlightTextAcrossTags(nodesSpanningString[0].node, searchString);
			return;
		}
		else
		{
			highlightInTextNode(nodesSpanningString[0].node, searchString);
			return;
		}
	}

	const replacement = document.createDocumentFragment();
	const highlightElement = document.createElement(Nimbus.highlightTagName);

	const nodeToReplace = nodesSpanningString[0].node;

	{
		const node = nodeToReplace;
		const nodeText = nodesSpanningString[0].text;
		const localStartIndex = index1 - nodesSpanningString[0].startIndex;
		const localSearchString = nodeText.substring(localStartIndex);

		logNode(node, "first node");

		logString(localSearchString, "first node localSearchString");

		if(node.nodeType === Node.ELEMENT_NODE)
		{
			logYellow("first node is element node, appending to highlight");
			highlightElement.appendChild(node.cloneNode(true));
		}
		else
		{
			if(localStartIndex === 0)
			{
				highlightElement.appendChild(document.createTextNode(nodeText));
			}
			else
			{
				const textBeforeMatch = nodeText.substring(0, localStartIndex);
				const textOfMatch = nodeText.substring(localStartIndex);
				replacement.appendChild(document.createTextNode(textBeforeMatch));
				highlightElement.appendChild(document.createTextNode(textOfMatch));
			}
		}
	}

	for(let i = 1; i < nodesSpanningStringLastIndex; i++)
	{
		highlightElement.appendChild(nodesSpanningString[i].node);
	}

	{
		const node = nodesSpanningString[nodesSpanningStringLastIndex].node;
		const nodeText = nodesSpanningString[nodesSpanningStringLastIndex].text;

		logNode(node, "last node");

		const localEndIndex = index2 - nodesSpanningString[nodesSpanningStringLastIndex].startIndex;
		const localSearchString = searchString.slice(-localEndIndex);
		logString(localSearchString, "last node localSearchString");

		if(node.nodeType === Node.ELEMENT_NODE)
		{
			if(indivisibleElementTypes.has(node.tagName))
			{
				highlightElement.appendChild(node);
				replacement.appendChild(highlightElement);
			}
			else if(containsOnlyPlainText(node))
			{
				if(localEndIndex === nodeText.length)
				{
					highlightElement.appendChild(node);
					replacement.appendChild(highlightElement);
				}
				else
				{
					const textOfMatch = nodeText.substring(0, localEndIndex);
					const textAfterMatch = nodeText.substring(localEndIndex);
					node.textContent = textOfMatch;
					highlightElement.appendChild(node);
					replacement.appendChild(highlightElement);
					if(textAfterMatch === " ")
						replacement.appendChild(document.createTextNode(" "));
					else
						replacement.appendChild(createElement(node.tagName, { textContent: textAfterMatch }));
				}
			}
			else
			{
				highlightTextAcrossTags(node, localSearchString);
				replacement.appendChild(highlightElement);
			}
		}
		else
		{
			const textOfMatch = nodeText.substring(0, localEndIndex);
			const textAfterMatch = nodeText.substring(localEndIndex);

			highlightElement.appendChild(document.createTextNode(textOfMatch));
			if(highlightElement.textContent.length)
				replacement.appendChild(highlightElement);
			replacement.appendChild(document.createTextNode(textAfterMatch));

			node.remove();
		}
	}

	logDocumentFragment(replacement, "replacement fragment");

	nodeToReplace.parentNode.replaceChild(replacement, nodeToReplace);
}
