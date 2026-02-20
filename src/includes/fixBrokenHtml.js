import { Nimbus } from "./Nimbus";
import { get, getOne, del, getFirstBlockParent } from "./selectors";
import { markElement, getMarkedElements } from "./mark";
import { getTextNodesUnderSelector } from "./xpath";
import { replaceElementsBySelector } from "./replaceElements";
import { getTextLength } from "./node";
import { makeClassSelector } from "./misc";
import { insertBefore } from "./dom";
import { replaceBrs } from "./text";
import { normalizeWhitespace } from "./string";
import { cleanupHeadings, removeRedundantHrs } from "./cleanup";
import { deleteEmptyTextNodes, deleteEmptyElements } from "./delete";
import { convertElement } from "./replaceElements";
import { isBlockElement, hasAdjacentBlockElement } from "./elementAndNodeTests";
import { INLINE_TAGS} from "./constants";

//	If any text nodes or inline elements have a block element as a sibling, they need to be wrapped in a block container.
export function rescueOrphanedInlineElements()
{
	deleteEmptyTextNodes();
	const WRAPPER_TAGNAME = "p";
	const nodes = get(INLINE_TAGS.join(", "));
	const numNodes = nodes.length;
	let count = 0;
	let node, nodeParent;
	for(let i = 0, ii = nodes.length; i < ii; i++)
	{
		node = nodes[i];

		if(hasAdjacentBlockElement(node))
		{
			nodeParent = node.parentNode;
			const orphanedNodes = [];
			orphanedNodes.push(node);
			while(node.nextSibling && count < numNodes)
			{
				count++;
				node = node.nextSibling;
				if(!isBlockElement(node))
				{
					orphanedNodes.push(node);
					i++;
				}
				else
				{
					break;
				}
			}

			if(orphanedNodes.length)
			{
				const wrapper = document.createElement(WRAPPER_TAGNAME);
				// wrapper.className = Nimbus.markerClass;
				for(const orphan of orphanedNodes)
					wrapper.appendChild(orphan.cloneNode(true));
				nodeParent.insertBefore(wrapper, orphanedNodes[0]);
				del(orphanedNodes);
			}
		}
	}
}

export function rescueOrphanedTextNodes()
{
	const WRAPPER_TAGNAME = "p";
	const textNodes = getTextNodesUnderSelector("body");
	const numNodes = textNodes.length;
	let count = 0;
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		let node = textNodes[i];
		if(!getTextLength(node)) continue;
		if(hasAdjacentBlockElement(node))
		{
			const nodeParent = node.parentNode;
			const orphanedNodes = [];
			const orphanedNodesLeft = [];
			orphanedNodes.push(node);
			let nodeLeft = node.previousSibling;
			while(nodeLeft)
			{
				if(!isBlockElement(nodeLeft))
				{
					orphanedNodesLeft.push(nodeLeft);
					nodeLeft = nodeLeft.previousSibling;
				}
				else
				{
					break;
				}
			}
			while(node.nextSibling)
			{
				node = node.nextSibling;
				if(!isBlockElement(node))
				{
					orphanedNodes.push(node);
					i++;
				}
				else
				{
					break;
				}
			}
			const allOrphanedNodes = orphanedNodesLeft.reverse().concat(orphanedNodes);

			if(allOrphanedNodes.length)
			{
				const wrapper = document.createElement(WRAPPER_TAGNAME);
				// wrapper.className = Nimbus.markerClass;
				for(const orphan of allOrphanedNodes)
					wrapper.appendChild(orphan.cloneNode(true));
				nodeParent.insertBefore(wrapper, orphanedNodes[0]);
				del(allOrphanedNodes);
			}
		}
	}
}

export function createListsFromBulletedParagraphs()
{
	const paras = get("p");
	let i = paras.length;
	while(i--)
	{
		const para = paras[i];
		if(/\u2022/.test(para.textContent))
		{
			markElement(para);
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
	replaceElementsBySelector(makeClassSelector(Nimbus.markerClass), "li");
}

export function replaceFontTags()
{
	const fontElements = get("font");
	function getTagName(fontSize)
	{
		if(!fontSize) return "p";
		const map = {
			"1": "p",
			"2": "h6",
			"3": "h5",
			"4": "h4",
			"5": "h3",
			"6": "h2",
			"7": "h1"
		};
		return map[fontSize] || "p";
	}
	for(let i = 0, ii = fontElements.length; i < ii; i++)
	{
		const fontElem = fontElements[i];
		const fontSize = fontElem.getAttribute("size");
		const replacementHeading = convertElement(fontElem, getTagName(fontSize));
		fontElem.replaceWith(replacementHeading);
	}
}

export function fixParagraphs()
{
	replaceBrs();
	deleteEmptyElements("p");
	rescueOrphanedTextNodes();
	rescueOrphanedInlineElements();
}

export function normaliseWhitespaceForParagraphs()
{
	const textNodes = getTextNodesUnderSelector("body");
	for(let i = 0, ii = textNodes.length; i < ii; i++)
	{
		const textNode = textNodes[i];
		const blockParent = getFirstBlockParent(textNode);
		if(blockParent && blockParent.tagName === "P")
			textNode.data = normalizeWhitespace(textNode.data);
	}
}

export function replaceEmptyParagraphsWithHr()
{
	const elems = get("p");
	let i = elems.length;
	while(i--)
	{
		if(getTextLength(elems[i]) === 0 || /^[_•\*—]+$/.test(elems[i].textContent.replace(/\s+/g, "")))
			elems[i].replaceWith(document.createElement("hr"));
	}
	removeRedundantHrs();
}
