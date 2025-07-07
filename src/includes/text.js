import { Nimbus } from "./Nimbus";
import { emptyElement, createElementWithChildren, createElement, wrapElement, unwrapElement, unwrapAll } from "./element";
import { hasDirectChildrenOfType } from "./elementAndNodeTests";
import { get, getOne, del, getFirstTextChild, getNonCodeTextNodes, getNodeContainingSelection } from "./selectors";
import { getMarkedElements, unmarkAll } from "./mark";
import { getTextNodesUnderSelector } from "./xpath";
import { replaceElementsBySelector } from "./replaceElements";
import { makeClassSelector } from "./misc";
import { showMessageBig } from "./ui";
import { replaceInTextNodes, replaceInTextNodesRegex } from "./textReplace";
import { normalizeHTML, removeLineBreaks } from "./string";

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
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		if(!hasDirectChildrenOfType(elem, "BR"))
			continue;
		const WRAPPER_TAGNAME = (wrapperTagName || elem.tagName).toUpperCase();
		const CHILD_TAGNAME = (childTagName || "P").toUpperCase();
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
	for(let i = 0, ii = brs.length; i < ii; i++)
	{
		const parent = brs[i].parentNode;
		if(parent) parent.classList.add("hasBrs");
	}
	const elems = get(".hasBrs");
	if(!elems) return;
	for(let i = 0, ii = elems.length; i < ii; i++)
		splitByBrs(elems[i]);
	replaceElementsBySelector("br", "brk");
	del("brk:first-child");
	del("brk:last-child");
}

export function replaceDiacritics(str)
{
	const diacriticRegexesByLetter = {
		A: /[\u0100\u0102\u0104\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5]/g,
		a: /[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u0105\u0101\u0103]/g,
		B: /[\u00df]/g,
		C: /[\u00c7\u0106\u0108\u010a\u010c]/g,
		c: /[\u00e7\u0107\u0109\u010b\u010d]/g,
		E: /[\u00c8\u00c9\u00ca\u00cb\u0112\u0114\u0116\u0118\u011a]/g,
		e: /[\u00e8\u00e9\u00ea\u00eb\u0113\u0115\u0117\u0119\u011b]/g,
		AE: /[\u00c6]/g,
		ae: /[\u00e6]/g,
		oe: /[\u0153]/g,
		I: /[\u00cc\u00cd\u00ce\u00cf]/g,
		i: /[\u00ec\u00ed\u00ee\u00ef]/g,
		O: /[\u00d2\u00d3\u00d4\u00d5\u00d6\u00d8\u014c\u014e\u0150]/g,
		o: /[\u00f0\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u014d\u014f\u0151]/g,
		U: /[\u00d9\u00da\u00db\u00dc]/g,
		u: /[\u00f9\u00fa\u00fb\u00fc]/g,
		N: /[\u00d1\u0143\u0145\u0147]/g,
		n: /[\u00f1\u0148\u0144\u0146]/g,
		Y: /[\u00dd\u0176\u0178]/g,
		y: /[\u00fd\u00ff\u0177]/g,
		Z: /[\u0179\u017b\u017d]/g,
		z: /[\u017a\u017c\u017e]/g,
	};
	const letters = Object.keys(diacriticRegexesByLetter);
	for(let i = 0, ii = letters.length; i < ii; i++)
	{
		const letter = letters[i];
		str = str.replace(diacriticRegexesByLetter[letter], letter);
	}
	return str;
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
		"\u2013": "-",
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
		for(let j = 0, jj = keys.length; j < jj; j++)
		{
			const key = keys[j];
			nodeText = nodeText.replace(regularExpressions[key], replacements[key]);
		}
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
			firstTextChild.textContent = firstTextChild.textContent.trim().replace(NUMERICBULLET_REGEX, "");
		}
	}
	const ulis = elems || get("ul > li");
	for(let i = 0, ii = ulis.length; i < ii; i++)
	{
		const firstTextChild = getFirstTextChild(ulis[i]);
		if(firstTextChild && BULLET_REGEX.test(firstTextChild.textContent))
		{
			ulCount++;
			firstTextChild.textContent = firstTextChild.textContent.trim().replace(BULLET_REGEX, "");
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

export function makeAllTextLowerCase()
{
	const textNodes = getTextNodesUnderSelector("body");
	for(const node of textNodes) node.data = node.data.toLowerCase();
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
		const para = paras[i];
		para.innerHTML = normalizeHTML(para.innerHTML);
		if(/^[\w\d\.\s\-,"]+:.+/.test(para.innerHTML))
			para.innerHTML = para.innerHTML.replace(/(^[\w\d\.\s\-,"]+:)/, "<b>$1</b>");
	}
	unmarkAll();
}

export function fixDashes()
{
	const ps = get("p, li, blockquote");
	for(const p of ps)
		p.innerHTML = removeLineBreaks(p.innerHTML);

	let replCount = 0;
	const regex = /(\s+[-–—]\s+|\s+[-–—]|[-–—]\s+|--)/g;
	const textNodes = getNonCodeTextNodes();
	for(const textNode of textNodes)
	{
		if(regex.test(textNode.data))
		{
			replCount++;
			textNode.data = textNode.data.replaceAll("--", "—").replace(regex, "—");
		}
	}
	if(replCount)
		showMessageBig(`${replCount} text nodes fixed`);
}

export function toggleDashes()
{
	const node = getNodeContainingSelection();
	if(node)
	{
		if(node.textContent.indexOf('-') !== -1)
			node.textContent = node.textContent.replace(/-/g, "\u2014");
		else
			node.textContent = node.textContent.replaceAll("\u2014", "-");
	}
}

export function removeAllEmphasis() { unwrapAll("b, strong, i, em, u"); }
