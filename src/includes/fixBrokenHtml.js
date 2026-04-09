import { Nimbus } from "./Nimbus";
import { get, getOne, del, getFirstBlockParent } from "./selectors";
import { markElement, getMarkedElements } from "./mark";
import { getTextNodesUnderSelector } from "./xpath";
import { replaceElementsBySelector } from "./replaceElements";
import { getTextLength } from "./node";
import { makeClassSelector } from "./misc";
import { insertBefore } from "./dom";
import { normalizeWhitespace } from "./string";
import { removeRedundantHrs, replaceBrs } from "./cleanup";
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
		if(getTextLength(node) === 0) continue;
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
				for(const orphan of allOrphanedNodes)
					wrapper.appendChild(orphan.cloneNode(true));
				nodeParent.insertBefore(wrapper, orphanedNodes[0]);
				del(allOrphanedNodes);
			}
		}
	}
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
	const pTextNodes = getTextNodesUnderSelector("p");
	for(const node of pTextNodes)
		node.data = normalizeWhitespace(node.data);
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
