import { get, getOne, del, selectNodesContainingSelection } from "./selectors";
import { markElement, unmarkAll, getMarkedElements } from "./mark";
import { insertBefore } from "./dom";
import { deleteMessage } from "./ui";
import { deleteEmptyTextNodes } from "./delete";
import { saveIdsToElement } from "./element";

export function joinAdjacentElements(selector)
{
	const idsToSave = [];
	deleteEmptyTextNodes();
	const elems = get(selector);
	for(let i = 0, ii = elems.length; i < ii; i++)
	{
		const elem = elems[i];
		let nextElem = elem.nextElementSibling;
		while(nextElem && nextElem === elem.nextSibling && nextElem.matches(selector))
		{
			i++;
			while(nextElem.firstChild)
			{
				elem.appendChild(document.createTextNode(" "));
				elem.appendChild(nextElem.firstChild);
			}
			const appendedElem = nextElem;
			if(appendedElem.id)
				idsToSave.push(appendedElem.id);
			nextElem = nextElem.nextElementSibling;
			appendedElem.remove();
		}
		saveIdsToElement(elem, idsToSave);
	}
}

export function joinParagraphsByLastChar()
{
	const MINLENGTH = 20;
	const paras = get("p");
	const regexLowercaseOrComma = /[a-z,]/;
	let i = paras.length;
	while(i--)
	{
		const para = paras[i];
		const paraText = para.textContent.trim();
		if(!paraText || paraText.length < MINLENGTH)
			continue;
		const lastChar = paraText[paraText.length - 1];
		if(regexLowercaseOrComma.test(lastChar))
		{
			const nextPara = para.nextElementSibling;
			if(nextPara && nextPara.tagName === "P")
			{
				markElement(para);
				para.appendChild(document.createTextNode(" "));
				while(nextPara.firstChild)
					para.appendChild(nextPara.firstChild);
			}
		}
		else if(lastChar === "-")
		{
			const nextPara = para.nextElementSibling;
			if(nextPara && nextPara.tagName === "P")
			{
				markElement(para);
				while(nextPara.firstChild)
					para.appendChild(nextPara.firstChild);
			}
		}
	}
}

export function joinNodesContainingSelection()
{
	const elems = selectNodesContainingSelection();
	if(!elems) return;
	joinElements(elems);
}

export function joinMarkedElements()
{
	const marked = getMarkedElements();
	if(marked)
	{
		unmarkAll();
		joinElements(marked);
	}
}

export function joinElements(elemsToJoin)
{
	if(!elemsToJoin.length)
	{
		return;
	}
	const idsToSave = [];
	const wrapperTagName = elemsToJoin[0].tagName || "P";
	const wrapper = document.createElement(wrapperTagName);
	for(let i = 0, ii = elemsToJoin.length; i < ii; i++)
	{
		const originalElement = elemsToJoin[i];
		if(originalElement.id)
			idsToSave.push(originalElement.id);
		while(originalElement.firstChild)
		{
			wrapper.appendChild(originalElement.firstChild);
			wrapper.appendChild(document.createTextNode(" "));
		}
	}
	saveIdsToElement(wrapper, idsToSave);
	insertBefore(elemsToJoin[0], wrapper);
	del(elemsToJoin);
	deleteMessage();
}
