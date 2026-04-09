import { Nimbus } from "./Nimbus";
import { annotateElement } from "./dom";
import { showMessageBig } from "./ui";

export function hasDuplicateIDs()
{
	const elementsWithIDs = document.querySelectorAll("body *[id]");
	const seen = new Set();
	for(const elem of elementsWithIDs)
	{
		if(elem.id === "")
		{
			elem.removeAttribute("id");
			continue;
		}
		if(seen.has(elem.id))
		{
			return true;
		}
		seen.add(elem.id);
	}
	return false;
}

export function checkSequence(elems)
{
	let step = 0;
	let numNonSequential = 0;
	for(let i = 0; i < elems.length; i++)
	{
		const elem = elems[i];
		const expectedIndex = i + 1 + step;
		const actualIndex = parseInt(elem.textContent, 10);
		if(isNaN(actualIndex))
		{
			elem.className = "statusWarning";
		}
		else if(actualIndex !== expectedIndex)
		{
			elem.className = "statusError";
			annotateElement(elem, "x", `expected ${expectedIndex}`);
			step += Math.abs(actualIndex - expectedIndex);
			numNonSequential++;
			if(numNonSequential > 10)
				return;
		}
	}
	if(numNonSequential)
	{
		showMessageBig("Non-sequential text found");
		const elem = document.querySelector(".statusError");
		if(elem)
			elem.scrollIntoView();
	}
	else
		showMessageBig("Everything is in order");
}

export function checkSequenceBySelector(selector)
{
	const elems = document.querySelectorAll(selector);
	if(elems)
		checkSequence(elems);
}
