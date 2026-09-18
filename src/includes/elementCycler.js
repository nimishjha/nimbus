import { Nimbus } from "./Nimbus";
import { Cyclable } from "./Cyclable";
import { markElement, markElements } from "./mark";
import { showMessageBig } from "./ui";
import { select, selectElementsIdenticalTo } from "./selectors";

export function cycleThroughElementsContainingChildren(selector, childSelector)
{
	if(selector.length && childSelector.length)
	{
		Nimbus.elementCycler = new Cyclable(select(selector, "hasChildrenOfType", childSelector).reverse());
		const numElements = Nimbus.elementCycler.getLength();
		showMessageBig(`${numElements} elements found`);
		if(numElements)
			goToNextElement();
		else
			showMessageBig(`No ${selector} elements containing ${childSelector}`);
	}
	else
		showMessageBig("Usage: cycleThroughElementsContainingChildren selector, childSelector");
}

export function setElementsToCycleThrough(selector, str)
{
	if(typeof selector === "string" && selector.length)
	{
		if(typeof str === "string" && str.length)
			Nimbus.elementCycler = new Cyclable(select(selector, "text", "contains", str).reverse());
		else
			Nimbus.elementCycler = new Cyclable(Array.from(document.querySelectorAll(selector)));
	}
	else
	{
		showMessageBig("Usage: setElementsToCycleThrough <selector> [<str>]");
		return;
	}

	const numElements = Nimbus.elementCycler.getLength();
	showMessageBig(`${numElements} elements found`);
	if(numElements)
		goToNextElement();
}

export function deleteCurrentElement()
{
	const elem = Nimbus.elementCycler.getCurrentValue();
	if(elem)
	{
		Nimbus.elementCycler.delete();
		elem.remove();
		goToCurrentElement();
	}
}

export function markCurrentElement()
{
	const elem = Nimbus.elementCycler.getCurrentValue();
	if(elem)
		markElement(elem);
}

export function markElementsIdenticalToCurrentElement()
{
	const elem = Nimbus.elementCycler.getCurrentValue();
	if(elem)
	{
		const elems = selectElementsIdenticalTo(elem);
		if(elems)
			markElements(elems);
	}
}

export function goToPreviousOrNextElement(selector, boolPrevious)
{
	const PADDING = 50;
	if(selector)
	{
		Nimbus.elementCycler = new Cyclable(Array.from(document.querySelectorAll(selector)));
		if(Nimbus.elementCycler.getLength())
		{
			Nimbus.elementCycler.getCurrentValue().scrollIntoView();
			window.scrollBy(0, -PADDING);
		}
		else
		{
			showMessageBig(`No elements matching ${selector}`);
		}
	}
	else
	{
		const elementToScrollTo = boolPrevious ? Nimbus.elementCycler.previousWrappedValue() : Nimbus.elementCycler.nextWrappedValue();
		if(elementToScrollTo)
		{
			elementToScrollTo.scrollIntoView();
			window.scrollBy(0, -PADDING);
		}
		else
		{
			showMessageBig(`Could not find element to scroll to`);
		}
	}
}

export function goToPrevElement(selector)
{
	goToPreviousOrNextElement(selector, true);
}

export function goToNextElement(selector)
{
	goToPreviousOrNextElement(selector, false);
}

export function goToCurrentElement()
{
	const PADDING = 50;
	if(Nimbus.elementCycler.getLength())
	{
		Nimbus.elementCycler.getCurrentValue().scrollIntoView();
		window.scrollBy(0, -PADDING);
	}
}

export function goToLastElement(selector)
{
	if(selector)
	{
		Nimbus.elementCycler = new Cyclable(Array.from(document.querySelectorAll(selector)));
		if(Nimbus.elementCycler.getLength())
			Nimbus.elementCycler.lastValue().scrollIntoView();
	}
}
