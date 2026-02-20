import { Nimbus } from "./Nimbus";
import { showMessageBig } from "./ui";
import { get, getOne, del } from "./selectors";
import { getMarkedElements } from "./mark";
import { makeClassSelector } from "./misc";
import { convertElement } from "./replaceElements";
import { deleteMessage } from "./ui";
import { insertBefore } from "./dom";


export function setGroupTagName(tagName)
{
	if(typeof tagName === "string" && tagName.length)
	{
		Nimbus.GROUP_TAGNAME = tagName;
	}
	else
	{
		showMessageBig("No tag provided, defaulting to blockquote");
		Nimbus.GROUP_TAGNAME = "blockquote";
	}
}

export function groupMarkedElements(tagName)
{
	const groupTagName = tagName || "ul";
	const elemsToJoin = getMarkedElements();
	if(!elemsToJoin.length)
		return;
	const wrapper = document.createElement(groupTagName);
	for(let i = 0, ii = elemsToJoin.length; i < ii; i++)
	{
		const elem = elemsToJoin[i];
		const child = convertElement(elem, elem.tagName);
		child.id = elem.id;
		wrapper.appendChild(child);
	}
	insertBefore(elemsToJoin[0], wrapper);
	del(makeClassSelector(Nimbus.markerClass));
	deleteMessage();
}

export function groupAdjacentElements(selector, parentTag, childTag)
{
	const elems = get(selector);
	const firstElemTagName = elems[0].tagName;
	let parentTagName = parentTag || "";
	let childTagName = childTag || "";
	if(!(parentTagName && childTagName))
	{
		switch(firstElemTagName)
		{
			case "BLOCKQUOTE":
			case "P":
				parentTagName = "blockquote";
				childTagName = "p";
				break;
			case "LI":
				parentTagName = "ul";
				childTagName = "li";
				break;
			default:
				parentTagName = "blockquote";
				childTagName = "same";
				break;
		}
	}
	const groups = [];
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		const group = document.createElement(parentTagName);
		groups.push(group);
		if(childTagName === "same")
			group.appendChild(elem.cloneNode(true));
		else
			group.appendChild(convertElement(elem, childTagName));
		let nextElem = elem.nextElementSibling;
		// while(nextElem && nextElem === elem.nextSibling && elems.includes(nextElem))
		while(nextElem && elems.includes(nextElem))
		{
			i++;
			const nextElemTemp = nextElem.nextElementSibling;
			if(childTagName === "same")
				group.appendChild(nextElem.cloneNode(true));
			else
				group.appendChild(convertElement(nextElem, childTagName));
			nextElem.remove();
			nextElem = nextElemTemp;
		}
		if(elem.parentNode)
			elem.replaceWith(group);
	}
	return groups;
}

export function makeDocumentHierarchical()
{
	const headingSelectors = ["h6", "h5", "h4", "h3", "h2", "h1"];
	for(let i = 0, ii = headingSelectors.length; i < ii; i++)
		groupUnderHeadings(headingSelectors[i]);
}

export function groupUnderHeadings(selector, selectorToBreakOn)
{
	const headings = get(selector);
	for(let i = 0, ii = headings.length; i < ii; i++)
		groupUnderHeading(headings[i], selectorToBreakOn);
}

export function groupUnderHeading(heading, selectorToBreakOn)
{
	const WRAPPER_ELEMENT_TAGNAME = "section";
	const headingTagName = heading.tagName;
	const wrapperElem = document.createElement(WRAPPER_ELEMENT_TAGNAME);
	const elemsToDelete = [];
	wrapperElem.appendChild(heading.cloneNode(true));
	let nextElem = heading.nextElementSibling;
	let count = 0;
	while(nextElem && nextElem.tagName !== headingTagName && !nextElem.matches(selectorToBreakOn) && count < 1000)
	{
		count++;
		wrapperElem.appendChild(nextElem.cloneNode(true));
		elemsToDelete.push(nextElem);
		nextElem = nextElem.nextElementSibling;
	}
	heading.replaceWith(wrapperElem);
	del(elemsToDelete);
}
