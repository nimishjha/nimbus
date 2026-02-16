import { Nimbus } from "./Nimbus";
import { emptyElement, createElementWithChildren, createElement, wrapElement, unwrapElement, unwrapAll, getFirstTextNode } from "./element";
import { hasDirectChildrenOfType } from "./elementAndNodeTests";
import { get, getOne, del, getFirstTextChild, getNonCodeTextNodes, getNodeContainingSelection } from "./selectors";
import { getMarkedElements, unmarkAll } from "./mark";
import { getTextNodesUnderSelector, getTextNodesUnderElement } from "./xpath";
import { replaceElementsBySelector } from "./replaceElements";
import { makeClassSelector } from "./misc";
import { showMessageBig } from "./ui";
import { replaceInTextNodes, replaceInTextNodesRegex } from "./textReplace";
import { normalizeHTML, removeLineBreaks } from "./string";
import { DIACRITIC_REGEXES_BY_LETTER } from "./constants";

export function fixSpacesBetweenNestedQuotes()
{
	replaceInTextNodes("' \"", "'\"");
	replaceInTextNodes("\" '", "\"'");
}

export function fixLineBreaks()
{
	const spans = get("span");
	if(spans)
	{
		for(let i = 0, ii = spans.length; i < ii; i++)
		{
			const span = spans[i];
			if(span.textContent.endsWith('\n'))
				span.appendChild(document.createElement("br"));
		}
	}
	var marked = getOne(makeClassSelector(Nimbus.markerClass));
	if(marked)
	{
		marked.innerHTML = marked.innerHTML.replace(/\n+/g, "<br>");
		splitByBrs(makeClassSelector(Nimbus.markerClass));
	}
}

export function joinByBrs(selector)
{
	const brs = get(selector + " br");
	if(!brs) return;
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const br = brs[i];
		br.parentNode.replaceChild(document.createTextNode(" "), br);
	}
}

export function convertLineBreaksToBrs(selectorOrElement)
{
	const elems = typeof selectorOrElement === "string" ? get(selectorOrElement) : [selectorOrElement];
	if(!elems) return;
	for(const elem of elems)
		if(elem.innerHTML.includes("\n"))
			elem.innerHTML = elem.innerHTML.replaceAll("\n", "<br>");
}

export function makeParagraphsByLineBreaks(selector) {
	const elems = selector ? get(selector) : getMarkedElements();
	if(!elems) return;
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const splat = elem.textContent.split("\n");
		const tempWrapper = document.createElement("div");
		for(let i = 0, ii = splat.length; i < ii; i++)
		{
			const para = document.createElement("p");
			para.textContent = splat[i];
			tempWrapper.appendChild(para);
		}
		emptyElement(elem);
		while(tempWrapper.firstChild)
			elem.appendChild(tempWrapper.firstChild);
	}
}

export function splitByBrs(selectorOrElement, wrapperTagName, childTagName)
{
	const elems = typeof selectorOrElement === "string" ? get(selectorOrElement) : [selectorOrElement];

	let WRAPPER_TAGNAME;
	let CHILD_TAGNAME;

	if(["H1", "H2", "H3", "H4", "H5", "H6"].includes(elems[0].tagName))
	{
		WRAPPER_TAGNAME = "hgroup";
		CHILD_TAGNAME = elems[0].tagName;
	}
	else if(["I", "B"].includes(elems[0].tagName))
	{
		WRAPPER_TAGNAME = "section";
		CHILD_TAGNAME = "dt";
	}
	else
	{
		WRAPPER_TAGNAME = (wrapperTagName || elems[0].tagName).toUpperCase();
		CHILD_TAGNAME = (childTagName || "P").toUpperCase();
	}

	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];

		if(!hasDirectChildrenOfType(elem, "BR"))
			continue;

		const elemChildNodes = elem.childNodes;
		const groups = [];
		let nodeGroup = [];

		for(let i = 0, ii = elemChildNodes.length; i < ii; i++)
		{
			let node = elemChildNodes[i];
			if(node.nodeType === 1 && node.tagName === "BR")
			{
				if(nodeGroup.length)
				{
					groups.push(nodeGroup.slice());
					nodeGroup = [];
				}
			}
			else
			{
				nodeGroup.push(node);
			}
		}

		if(nodeGroup.length)
			groups.push(nodeGroup);

		if(groups.length > 1)
		{
			const replacementWrapper = WRAPPER_TAGNAME === "P" ? document.createDocumentFragment() : document.createElement(WRAPPER_TAGNAME);
			for(let i = 0, ii = groups.length; i < ii; i++)
				replacementWrapper.appendChild(createElementWithChildren(CHILD_TAGNAME, ...groups[i]));
			if(elem.id)
				replacementWrapper.id = elem.id;
			elem.parentNode.replaceChild(replacementWrapper, elem);
		}
	}
}

export function replaceBrs()
{
	const brs = get("br");
	if(!brs) return;

	const inlineTags = new Set(["I", "EM", "B", "STRONG"]);

	const elementsWithBrs = new Set();
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const parent = brs[i].parentNode;
		if(parent)
		{
			if(inlineTags.has(parent.tagName))
			{
				elementsWithBrs.add(parent.parentNode);
				unwrapElement(parent);
			}
			else
			{
				elementsWithBrs.add(parent);
			}
		}
	}

	for(const elem of elementsWithBrs.entries())
	{
		splitByBrs(elem[0]);
	}

	del("br:first-child");
	del("br:last-child");

	replaceElementsBySelector("br", "brk");
}

export function replaceDiacritics(str)
{
	const letters = Object.keys(DIACRITIC_REGEXES_BY_LETTER);
	for(const letter of letters)
		if(DIACRITIC_REGEXES_BY_LETTER[letter].test(str))
			str = str.replace(DIACRITIC_REGEXES_BY_LETTER[letter], letter);
	return str;
}

export function replaceAllDiacritics()
{
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		let text = textNode.data;
		const letters = Object.keys(DIACRITIC_REGEXES_BY_LETTER);
		let hasChanged = false;
		for(let j = 0, jj = letters.length; j < jj; j++)
		{
			if(DIACRITIC_REGEXES_BY_LETTER[letters[j]].test(text))
			{
				text = text.replace(DIACRITIC_REGEXES_BY_LETTER[letters[j]], letters[j]);
				hasChanged = true;
			}
		}

		if(hasChanged)
			textNode.data = text;
	}
}

export function replaceSpecialCharacters()
{
	const replacements = {
		"\xa0": " ",
		// "\xa9": "(c)",
		// "\xae": "(r)",
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
		// "\u2013": "—",
		"\u2122": "(tm)"
	};

	const regularExpressions = {};
	const keys = Object.keys(replacements);
	for(let i = 0, ii = keys.length; i < ii; i++)
	{
		const key = keys[i];
		regularExpressions[key] = new RegExp(key, 'g');
	}

	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		let nodeText = textNode.data;
		let textHasChanged = false;
		for(let j = 0, jj = keys.length; j < jj; j++)
		{
			const key = keys[j];
			if(nodeText.includes(key))
			{
				nodeText = nodeText.replace(regularExpressions[key], replacements[key]);
				textHasChanged = true;
			}
		}
		if(textHasChanged)
			textNode.data = nodeText;
	}
}

//	After converting numbered or bulleted paragraphs to lists, we need
//	to remove the redundant numbering or bullets from the list items.
export function fixBullets(elems)
{
	const BULLET_REGEX = /^\s*\u2022/;
	const NUMERICBULLET_REGEX = /^\s*\(?[0-9]+[\.\)]?/;
	let ulCount = 0;
	let olCount = 0;
	const lis = elems || get("ol > li");
	for(let i = 0, ii = lis.length; i < ii; i++)
	{
		const firstTextChild = getFirstTextChild(lis[i]);
		if(firstTextChild && NUMERICBULLET_REGEX.test(firstTextChild.textContent))
		{
			olCount++;
			firstTextChild.textContent = firstTextChild.textContent.replace(/^\s+/, "").replace(NUMERICBULLET_REGEX, "");
		}
	}
	const ulis = elems || get("ul > li");
	for(let i = 0, ii = ulis.length; i < ii; i++)
	{
		const firstTextChild = getFirstTextChild(ulis[i]);
		if(firstTextChild && BULLET_REGEX.test(firstTextChild.textContent))
		{
			ulCount++;
			firstTextChild.textContent = firstTextChild.textContent.replace(/^\s+/, "").replace(BULLET_REGEX, "");
		}
	}
	showMessageBig(`${olCount} ordered and ${ulCount} unordered list items fixed`);
}

export function removePeriodsFromAbbreviations()
{
	const nodes = getTextNodesUnderSelector("body");
	for(const node of nodes)
	{
		if(node.data.length < 4) continue;
		const matches = node.data.match(/([A-Z]\.){2,}(\s+[a-z]|[,'’-])/g);
		if(matches !== null)
		{
			for(const match of matches)
				node.data = node.data.replace(match, match.replace(/\./g, ""));
		}
		const matchesAtSentenceEnd = node.data.match(/([A-Z]\.){2,}/g);
		if(matchesAtSentenceEnd !== null)
		{
			for(const match of matchesAtSentenceEnd)
				node.data = node.data.replace(match, match.replace(/\./g, "") + ".");
		}
	}
}

export function singleQuotesToDoubleQuotes()
{
	replaceInTextNodes('"', "ρρ");
	replaceInTextNodes("'", '"');
	replaceInTextNodesRegex("body", /([a-zA-Z])"([a-zA-Z])/g, "$1'$2");
	replaceInTextNodes(' d" ', " d' ");
	replaceInTextNodes('s" ', "s' ");
	replaceInTextNodes('"s ', "'s ");
	replaceInTextNodes('n" ', "n' ");
	replaceInTextNodes("ρρ", "'");
}

export function invertItalics(elem)
{
	const nodes = elem.childNodes;
	for(let i = 0, ii = nodes.length; i < ii; i++)
	{
		const node = nodes[i];
		if(node.nodeType === 1 && (node.tagName === "I" || node.tagName === "EM"))
			unwrapElement(node);
		else
			wrapElement(node, "i");
	}
}

export function italicizeSelection()
{
	const selection = window.getSelection();
	const tagName = Nimbus.italicTag || "i";
	if(!selection.toString().length)
	{
		showMessageBig("Nothing selected");
		return;
	}
	const node = selection.anchorNode;
	let selectionText = removeLineBreaks(selection.toString());
	let index1 = Math.min(selection.anchorOffset, selection.focusOffset);
	let index2 = Math.max(selection.anchorOffset, selection.focusOffset);
	const precedingSpaces = selectionText.match(/^\s/);
	const trailingSpaces = selectionText.match(/\s$/);
	if(precedingSpaces) index1 += precedingSpaces.length;
	if(trailingSpaces) index2 -= trailingSpaces.length;
	selectionText = selectionText.trim();
	const frag = document.createDocumentFragment();
	if(index1 > 0)
	{
		let textBeforeSelection = node.textContent.substring(0, index1);
		// if(/[a-zA-Z]/.test(textBeforeSelection[textBeforeSelection.length - 1]))
		// 	textBeforeSelection += " ";
		frag.appendChild(document.createTextNode(textBeforeSelection));
	}
	frag.appendChild(createElement(tagName, { textContent: selectionText }));
	if(index2 < node.textContent.length)
	{
		let textAfterSelection = node.textContent.substring(index2);
		// if(/[a-zA-Z]/.test(textAfterSelection[0]))
		// 	textAfterSelection = " " + textAfterSelection;
		frag.appendChild(document.createTextNode(textAfterSelection));
	}
	node.parentNode.replaceChild(frag, node);
}

export function makeTextLowerCase()
{
	const textNodes = getOne(makeClassSelector(Nimbus.markerClass)) ? getTextNodesUnderSelector(null, Nimbus.markerClass) : getTextNodesUnderSelector("body");
	for(const node of textNodes)
		node.data = node.data.toLowerCase();
}

export function removeEmojis()
{
	const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		textNode.data = textNode.data.replace(regex, "");
	}
}

export function deleteNonEnglishText()
{
	replaceInTextNodesRegex("body", /[^A-Za-z0-9 :\-]/g, "");
}

export function normalizeAllWhitespace()
{
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		textNode.data = textNode.data.replace(/\s+/g, " ");
	}
}

export function boldInlineColonHeadings()
{
	const paras = getMarkedElements();
	if(!(paras && paras.length))
	{
		showMessageBig("Didn't find any marked elements");
		return;
	}
	for(let i = 0, ii = paras.length; i < ii; i++)
	{
		const elem = paras[i];
		const first = getFirstTextNode(elem);
		if(!first)
			continue;

		const index = first.data.indexOf(":");
		if(index !== -1)
		{
			const repl = document.createDocumentFragment();
			const bold = document.createElement("b");
			bold.textContent = first.data.substring(0, index);
			const plain = document.createTextNode(first.data.substring(index));
			repl.appendChild(bold);
			repl.appendChild(plain);
			first.parentNode.replaceChild(repl, first);
		}
	}
	unmarkAll();
}

export function fixDashes()
{
	const t1 = new Date();

	const ps = get("p, li, blockquote");
	for(const p of ps)
		p.innerHTML = removeLineBreaks(p.innerHTML);

	let replCount = 0;
	const regexBadDashes = /(\s+[-–—]\s+|\s+[-–—]|[-–—]\s+|--)/g;
	const regexHyphenBeforeEndQuote = /([A-Za-z])-"/g;
	const textNodes = getNonCodeTextNodes();
	for(const textNode of textNodes)
	{
		if(~textNode.data.indexOf("--"))
		{
			replCount++;
			textNode.data = textNode.data.replace(/-+/g, "—");
		}
		if(regexHyphenBeforeEndQuote.test(textNode.data))
		{
			replCount++;
			textNode.data = textNode.data.replace(regexHyphenBeforeEndQuote, '$1—"')
		}
		if(regexBadDashes.test(textNode.data))
		{
			replCount++;
			textNode.data = textNode.data.replace(regexBadDashes, "—");
		}
	}
	if(replCount)
		showMessageBig(`${replCount} replacements made`);

	const t2 = new Date();
	console.log(`fixDashes: ${t2 - t1} ms`);
}

export function toggleDashes()
{
	const node = getNodeContainingSelection();
	const EMDASH = "\u2014";
	const HYPHEN = "-";
	if(node)
	{
		if(node.textContent.indexOf(HYPHEN) !== -1)
			node.textContent = node.textContent.replace(/-/g, EMDASH);
		else if(node.textContent.indexOf(EMDASH) !== -1)
			node.textContent = node.textContent.replaceAll(EMDASH, HYPHEN);
	}
}

export function removeAllEmphasis() { unwrapAll("b, strong, i, em, u"); }

function replaceHyphensWithDashesInClickedElement(evt)
{
	const ctrlOrMeta = ~navigator.userAgent.indexOf("Macintosh") ? "metaKey" : "ctrlKey";
	if(!evt[ctrlOrMeta]) return;
	const clickedElement = getNodeContainingSelection();
	const textNodes = getTextNodesUnderElement(clickedElement);
	for(const node of textNodes)
	{
		if(node.data.includes("-"))
			node.data = node.data.replace(/-/g, "—");
	}
}

export function enableHyphensToDashesOnClick()
{
	document.addEventListener('click', replaceHyphensWithDashesInClickedElement, false);
}

export function disableHyphensToDashesOnClick()
{
	document.removeEventListener('click', replaceHyphensWithDashesInClickedElement);
}
