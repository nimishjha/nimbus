import { Nimbus } from "./Nimbus";
import { emptyElement } from "./element";
import { showMessageBig, showMessageError } from "./ui";
import { get, getOne, del, selectBySelectorAndText } from "./selectors";

//	This function takes a selector and replaces the document's content with elements that match that selector.
//	Useful for marking content blocks and deleting everything else, for instance.
export function retrieve(selector)
{
	retrieveElements(get(selector));
}

//	Given an array of selectors, retrieve the corresponding elements, grouping them by index.
export function retrieveGrouped(selectors, wrapperTagName = "section", groupTagName = "hgroup")
{
	const numSelectors = selectors.length;
	const nodeLists = Array.from({ length: numSelectors });
	for(let i = 0, ii = selectors.length; i < ii; i++)
	{
		const selector = selectors[i];
		nodeLists[i] = get(selector);
	}
	const numGroups = nodeLists[0].length;
	for(let i = 1; i < numSelectors; i++)
	{
		if(nodeLists[i].length !== numGroups)
		{
			showMessageError("retrieveGrouped: number of elements doesn't match");
			return false;
		}
	}
	const wrapper = document.createElement(wrapperTagName);
	wrapper.className = Nimbus.markerClass;
	for(let i = 0, ii = numGroups; i < ii; i++)
	{
		const group = document.createElement(groupTagName);
		for(let j = 0, jj = nodeLists.length; j < jj; j++)
			group.appendChild(nodeLists[j][i]);
		wrapper.appendChild(group);
	}
	document.body.appendChild(wrapper);
	return true;
}

export function retrieveBySelectorAndText(selector, text)
{
	retrieveElements(selectBySelectorAndText(selector, text));
}

export function retrieveElements(elems)
{
	if(!elems) return;
	const docTitle = document.title;
	const elements = elems.nodeType ? [elems] : elems;
	if(!(elements && elements.length))
		return;
	const wrapper = document.createElement("div");
	for(let i = 0, ii = elements.length; i < ii; i++)
		wrapper.appendChild(elements[i]);
	emptyElement(document.body);
	del(["link", "script"]);
	document.body.appendChild(wrapper);
	document.title = docTitle;
	showMessageBig(`Retrieved ${elements.length} elements`);
}
